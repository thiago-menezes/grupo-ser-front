export type CarouselControlsProps = {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToSlide?: (index: number) => void;
  isAutoAdvancing?: boolean;
  onToggleAutoAdvance?: (enabled: boolean) => void;
  showArrows?: boolean;
};
