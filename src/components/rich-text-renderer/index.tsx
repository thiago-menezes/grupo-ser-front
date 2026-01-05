import { View, Text } from 'reshaped';
import { StrapiBlock, StrapiChild } from '@/bff/handlers/courses/types-strapi';
import { MarkdownContent } from '../markdown-content';
import styles from './styles.module.scss';

export type RichTextRendererProps = {
  content: string | StrapiBlock[] | unknown;
  className?: string;
};

export function RichTextRenderer({
  content,
  className,
}: RichTextRendererProps) {
  if (!content) return null;

  // Fallback for string (Markdown)
  if (typeof content === 'string') {
    return <MarkdownContent content={content} className={className} />;
  }

  // Handle Strapi Blocks
  if (Array.isArray(content)) {
    return (
      <View className={className}>
        {content.map((block: StrapiBlock, index: number) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </View>
    );
  }

  return null;
}

function BlockRenderer({ block }: { block: StrapiBlock }) {
  const { type, children, level } = block;

  if (!children) return null;

  switch (type) {
    case 'paragraph':
      return (
        <Text
          as="p"
          variant="body-2"
          color="neutral-faded"
          className={styles.paragraph}
        >
          <ChildrenRenderer data={children} />
        </Text>
      );

    case 'heading': {
      const headingLevel =
        level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';
      const variant =
        level === 1
          ? 'featured-1'
          : level === 2
            ? 'featured-2'
            : level === 3
              ? 'featured-3'
              : 'body-1';
      return (
        <Text
          as={headingLevel}
          variant={variant}
          weight="bold"
          className={styles.heading}
        >
          <ChildrenRenderer data={children} />
        </Text>
      );
    }

    case 'list': {
      const Tag = block.format === 'ordered' ? 'ol' : 'ul';
      return (
        <View as={Tag} className={styles.list}>
          <ChildrenRenderer data={children} />
        </View>
      );
    }

    case 'list-item':
      return (
        <View as="li" className={styles.item}>
          <ChildrenRenderer data={children} />
        </View>
      );

    default:
      return (
        <View className={styles.paragraph}>
          <ChildrenRenderer data={children} />
        </View>
      );
  }
}

function ChildrenRenderer({ data }: { data: StrapiChild[] }) {
  return (
    <>
      {data.map((child, index) => {
        if (child.type === 'text') {
          let element = <>{child.text}</>;
          if (child.bold) element = <strong>{element}</strong>;
          if (child.italic) element = <em>{element}</em>;
          return <span key={index}>{element}</span>;
        }

        if (child.children) {
          return <ChildrenRenderer key={index} data={child.children} />;
        }

        return null;
      })}
    </>
  );
}
