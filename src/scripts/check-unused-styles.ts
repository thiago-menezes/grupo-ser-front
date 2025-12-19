/* eslint-disable no-console */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join, relative, dirname } from 'node:path';
import { parse } from '@typescript-eslint/parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ASTNode = unknown | any;

type CssModuleInfo = {
  classes: Set<string>;
  usedClasses: Set<string>;
  referenced: boolean;
};

const projectRoot = resolve(__dirname, '..');
const sourceDir = join(projectRoot, '.');

const cssModulePattern = /\.module\.scss$/;
const classNamePattern = /\.([_a-zA-Z][\w-]*)/g;

const cssModules = new Map<string, CssModuleInfo>();
const unresolvedImports = new Map<string, { from: string; request: string }>();

const walk = (dir: string, fileHandler: (filePath: string) => void) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath, fileHandler);
    } else {
      fileHandler(entryPath);
    }
  }
};

const removeGlobalBlocks = (content: string): string => {
  let result = '';
  let i = 0;
  let depth = 0;
  let inGlobal = false;

  while (i < content.length) {
    // Check if we're starting a :global block
    if (!inGlobal && content.slice(i).match(/^:global\s*[({]/)) {
      inGlobal = true;
      // Find the opening bracket/brace
      const match = content.slice(i).match(/^:global\s*([({])/);
      if (match) {
        depth = 1;
        i += match[0].length;
        continue;
      }
    }

    if (inGlobal) {
      // Track depth for nested blocks
      if (content[i] === '(' || content[i] === '{') {
        depth++;
      } else if (content[i] === ')' || content[i] === '}') {
        depth--;
        if (depth === 0) {
          // End of global block, skip it
          inGlobal = false;
          i++;
          continue;
        }
      }
      // Skip content inside global blocks
      i++;
      continue;
    }

    // Add non-global content to result
    result += content[i];
    i++;
  }

  return result;
};

const collectCssClasses = () => {
  walk(sourceDir, (filePath) => {
    if (!cssModulePattern.test(filePath)) {
      return;
    }

    const content = readFileSync(filePath, 'utf8');
    const classNames = new Set<string>();

    // Remove all :global() blocks before parsing classes
    const contentWithoutGlobals = removeGlobalBlocks(content);

    // Now collect classes from the cleaned content
    let match: RegExpExecArray | null;

    while ((match = classNamePattern.exec(contentWithoutGlobals))) {
      const [, className] = match;
      if (!className || className.startsWith(':')) {
        continue;
      }
      classNames.add(className);
    }

    cssModules.set(filePath, {
      classes: classNames,
      usedClasses: new Set<string>(),
      referenced: false,
    });
  });
};

type ImportBinding = {
  identifier: string;
  modulePath: string;
};

const collectUsage = () => {
  const codeFilePattern = /\.(t|j)sx?$/;

  walk(sourceDir, (filePath) => {
    if (!codeFilePattern.test(filePath)) {
      return;
    }

    const content = readFileSync(filePath, 'utf8');
    let ast: ASTNode;

    try {
      ast = parse(content, {
        loc: false,
        range: false,
        comment: false,
        jsx: true,
        sourceType: 'module',
        ecmaVersion: 'latest',
        filePath,
      });
    } catch (error) {
      const relativePath = relative(projectRoot, filePath);
      console.warn(
        `[css-modules] Skipping ${relativePath}: ${(error as Error).message}`,
      );
      return;
    }

    const bindings: ImportBinding[] = [];

    const visit = (node: ASTNode | undefined) => {
      if (!node) {
        return;
      }

      switch (node.type) {
        case 'ImportDeclaration': {
          if (!node.source?.value || typeof node.source.value !== 'string') {
            break;
          }

          const importPath = node.source.value;
          if (!cssModulePattern.test(importPath)) {
            break;
          }

          const resolvedModulePath = resolveModulePath(filePath, importPath);
          if (!resolvedModulePath) {
            trackUnresolvedImport(filePath, importPath);
            break;
          }

          for (const specifier of node.specifiers) {
            if (
              specifier.type === 'ImportDefaultSpecifier' ||
              specifier.type === 'ImportNamespaceSpecifier'
            ) {
              bindings.push({
                identifier: specifier.local.name,
                modulePath: resolvedModulePath,
              });
              markReferenced(resolvedModulePath);
            }
          }
          break;
        }
        case 'MemberExpression':
        case 'OptionalMemberExpression': {
          const binding = getCssModuleBinding(bindings, node.object);
          if (!binding) {
            break;
          }
          const className = extractPropertyName(node.property, node.computed);
          if (className) {
            recordUsage(binding.modulePath, className);
          }
          break;
        }
        case 'VariableDeclarator': {
          if (
            node.id?.type === 'ObjectPattern' &&
            node.init &&
            getCssModuleBinding(bindings, node.init)
          ) {
            const binding = getCssModuleBinding(bindings, node.init)!;
            for (const property of node.id.properties) {
              if (
                property.type === 'Property' &&
                property.key.type === 'Identifier'
              ) {
                const finalName =
                  property.value.type === 'Identifier'
                    ? property.value.name
                    : property.key.name;
                recordUsage(binding.modulePath, finalName);
              }
            }
          }
          break;
        }
      }

      for (const key of Object.keys(node)) {
        const child = (node as Record<string, unknown>)[key];
        if (Array.isArray(child)) {
          child.forEach((item) => {
            if (isNode(item)) {
              visit(item);
            }
          });
        } else if (isNode(child)) {
          visit(child);
        }
      }
    };

    visit(ast);
  });
};

const resolveModulePath = (fromFile: string, importPath: string) => {
  const resolved = resolve(dirname(fromFile), importPath);
  if (cssModules.has(resolved)) {
    return resolved;
  }
  const withExtension = `${resolved}.scss`;
  if (cssModules.has(withExtension)) {
    return withExtension;
  }
  return undefined;
};

const trackUnresolvedImport = (from: string, request: string) => {
  const key = `${from}::${request}`;
  if (!unresolvedImports.has(key)) {
    unresolvedImports.set(key, {
      from: relative(projectRoot, from),
      request,
    });
  }
};

const markReferenced = (modulePath: string) => {
  const info = cssModules.get(modulePath);
  if (info) {
    info.referenced = true;
  }
};

const getCssModuleBinding = (
  bindings: ImportBinding[],
  node: ASTNode | undefined,
): ImportBinding | undefined => {
  if (!node) {
    return undefined;
  }

  if (node.type === 'Identifier') {
    return bindings.find((binding) => binding.identifier === node.name);
  }

  if (node.type === 'TSNonNullExpression' || node.type === 'TSAsExpression') {
    return getCssModuleBinding(bindings, node.expression);
  }

  return undefined;
};

const extractPropertyName = (
  property: ASTNode | undefined,
  computed: boolean,
) => {
  if (!property) {
    return undefined;
  }

  if (!computed && property.type === 'Identifier') {
    return property.name;
  }

  if (
    computed &&
    property.type === 'Literal' &&
    typeof property.value === 'string'
  ) {
    return property.value;
  }

  return undefined;
};

const isNode = (value: unknown): value is ASTNode =>
  Boolean(
    value &&
    typeof value === 'object' &&
    'type' in (value as Record<string, unknown>),
  );

const recordUsage = (modulePath: string, className: string) => {
  const cssModule = cssModules.get(modulePath);
  if (!cssModule) {
    return;
  }
  cssModule.usedClasses.add(className);
};

const report = () => {
  const unusedEntries = Array.from(cssModules.entries())
    .map(([filePath, info]) => {
      const unused = Array.from(info.classes).filter(
        (className) => !info.usedClasses.has(className),
      );
      return {
        filePath,
        unused,
        referenced: info.referenced,
      };
    })
    .filter((entry) => entry.unused.length > 0);

  if (unusedEntries.length === 0) {
    console.log(
      `[css-modules] No unused CSS module classes found (${cssModules.size} module(s) scanned).`,
    );
    if (unresolvedImports.size > 0) {
      printUnresolvedImports();
      process.exitCode = 1;
    }
    return;
  }

  const totalUnused = unusedEntries.reduce(
    (total, entry) => total + entry.unused.length,
    0,
  );

  console.log(
    `[css-modules] Found ${totalUnused} unused class(es) in ${unusedEntries.length} module(s):`,
  );

  for (const entry of unusedEntries) {
    const relativePath = relative(projectRoot, entry.filePath);
    const suffix = entry.referenced ? '' : ' (module not imported anywhere)';
    console.log(`\n${relativePath}${suffix}`);
    entry.unused.forEach((className) => {
      console.log(`  • ${className}`);
    });
  }

  if (unresolvedImports.size > 0) {
    printUnresolvedImports();
  }

  process.exitCode = 1;
};

const printUnresolvedImports = () => {
  console.log('\n[css-modules] Missing CSS module files:');
  for (const { from, request } of Array.from(unresolvedImports.values())) {
    console.log(`  • ${from} -> ${request}`);
  }
};

collectCssClasses();
collectUsage();
report();
