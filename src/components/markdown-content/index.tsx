import Link from 'next/link';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Text } from 'reshaped';
import styles from './styles.module.scss';
import { MarkdownContentProps } from './types';

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const components: Components = {
    ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
    ol: ({ children }) => <ol className={styles.list}>{children}</ol>,

    p: ({ children }) => (
      <Text
        as="p"
        variant="body-2"
        color="neutral-faded"
        className={styles.paragraph}
      >
        {children}
      </Text>
    ),

    h1: ({ children }) => (
      <Text
        as="h1"
        variant="featured-1"
        weight="bold"
        className={styles.heading}
      >
        {children}
      </Text>
    ),
    h2: ({ children }) => (
      <Text
        as="h2"
        variant="featured-2"
        weight="bold"
        className={styles.heading}
      >
        {children}
      </Text>
    ),
    h3: ({ children }) => (
      <Text
        as="h3"
        variant="featured-3"
        weight="bold"
        className={styles.heading}
      >
        {children}
      </Text>
    ),
    h4: ({ children }) => (
      <Text as="h4" variant="body-1" weight="bold" className={styles.heading}>
        {children}
      </Text>
    ),

    strong: ({ children }) => (
      <Text as="strong" weight="bold" className={styles.strong}>
        {children}
      </Text>
    ),
    em: ({ children }) => (
      <Text as="em" className={styles.em}>
        {children}
      </Text>
    ),

    a: ({ children, href }) => {
      if (!href) return <>{children}</>;

      const isInternal = href.startsWith('/') || href.startsWith('#');

      if (isInternal) {
        return (
          <Link href={href} className={styles.link}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },

    table: ({ children }) => <table className={styles.table}>{children}</table>,
    thead: ({ children }) => <thead className={styles.thead}>{children}</thead>,
    tbody: ({ children }) => <tbody className={styles.tbody}>{children}</tbody>,
    tr: ({ children }) => <tr className={styles.tr}>{children}</tr>,
    th: ({ children }) => <th className={styles.th}>{children}</th>,
    td: ({ children }) => <td className={styles.td}>{children}</td>,
  };

  return (
    <div className={className}>
      <Markdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </Markdown>
    </div>
  );
}
