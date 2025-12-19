export type UsePaginationOptions = {
  totalItems: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  cardWidth?: number;
  gap?: number;
};

export type PaginationState = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  isScrollable: boolean;
  goToPage: (page: number) => void;
};
