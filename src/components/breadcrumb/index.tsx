import Link from 'next/link';
import { Breadcrumbs } from 'reshaped';
import { Icon } from '..';
import styles from './styles.module.scss';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumbs className={styles.breadcrumb}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const content = (
          <span className={styles.item}>
            {index === 0 && <Icon name="home" size={16} aria-hidden="true" />}
            <span>{item.label}</span>
          </span>
        );

        if (isLast || !item.href) {
          return <Breadcrumbs.Item key={index}>{content}</Breadcrumbs.Item>;
        }

        return (
          <Breadcrumbs.Item key={index}>
            <Link href={item.href} className={styles.link}>
              {content}
            </Link>
          </Breadcrumbs.Item>
        );
      })}
    </Breadcrumbs>
  );
}
