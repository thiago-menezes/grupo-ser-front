import styles from './styles.module.scss';
import type { PaginationProps } from './types';

export function Pagination({
  currentPage,
  totalPages,
  onPageChangeAction,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`${styles.pagination} ${className}`}>
      {Array.from({ length: totalPages }).map((_, pageIndex) => (
        <button
          key={`pagination-${pageIndex}`}
          type="button"
          className={`${styles.paginationDot} ${
            pageIndex === currentPage ? styles.active : ''
          }`}
          aria-label={`Go to page ${pageIndex + 1}`}
          aria-current={pageIndex === currentPage ? 'true' : 'false'}
          onClick={() => onPageChangeAction(pageIndex)}
        />
      ))}
    </div>
  );
}

export type { PaginationProps } from './types';
