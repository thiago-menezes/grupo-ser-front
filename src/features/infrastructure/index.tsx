import { clsx } from 'clsx';
import Image from 'next/image';
import { Button, Text } from 'reshaped';
import { Icon } from '@/components';
import { useCityContext } from '@/contexts/city';
import { getMediaUrl } from '@/packages/utils';
import { useInfrastructure } from './hooks';
import { ImageModal } from './image-modal';
import styles from './styles.module.scss';

export type InfrastructureSectionProps = {
  preselectedUnitId?: number;
};

export const InfrastructureSection = ({
  preselectedUnitId,
}: InfrastructureSectionProps = {}) => {
  const { focusCityField } = useCityContext();
  const {
    city,
    state,
    permissionDenied,
    requestPermission,
    isLoading,
    sortedUnits,
    handleUnitClick,
    mainImage,
    sideImages,
    handleImageClick,
    handleCloseModal,
    selectedImageId,
    selectedUnitId,
    selectedImage,
    isError,
  } = useInfrastructure(preselectedUnitId);

  const hasCity = Boolean(city && state);

  // Don't render if no units are available and no error
  if (!isLoading && !isError && sortedUnits.length === 0) {
    return null;
  }

  // Don't render main image section if no unit is selected yet
  const showGallery = Boolean(mainImage);

  return (
    <section
      id="infrastructure-section"
      className={styles.section}
      aria-labelledby="infrastructure-section-title"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Text
              as="h2"
              variant="featured-1"
              weight="bold"
              className={styles.title}
            >
              Conheça nossa infraestrutura
            </Text>
            <div className={styles.locationInfo}>
              <Text as="span" variant="body-2">
                Unidades próximas a você
              </Text>
              <div className={styles.location}>
                {!hasCity && permissionDenied ? (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={requestPermission}
                    disabled={isLoading}
                    className={styles.locationButton}
                  >
                    <Icon name="current-location" size={16} />
                    Permitir localização
                  </Button>
                ) : hasCity ? (
                  <button
                    type="button"
                    onClick={focusCityField}
                    className={styles.locationButton}
                    disabled={isLoading}
                  >
                    <Text
                      as="span"
                      variant="body-2"
                      weight="medium"
                      className={styles.locationText}
                    >
                      {city} - {state}
                    </Text>
                    <Icon
                      name="current-location"
                      size={16}
                      className={styles.locationIcon}
                    />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tags}>
          {sortedUnits.map((unit) => {
            const isActive =
              selectedUnitId === unit.id || (!selectedUnitId && unit.isActive);
            return (
              <button
                key={unit.id}
                className={clsx(styles.tag, isActive && styles.tagActive)}
                onClick={() => handleUnitClick(unit.id)}
                type="button"
              >
                {unit.name}
              </button>
            );
          })}
        </div>

        {showGallery && (
          <div className={styles.gallery}>
            <button
              className={styles.mainImage}
              onClick={() => handleImageClick(mainImage.id)}
              type="button"
              aria-label={mainImage.alt}
            >
              <Image
                src={mainImage.src}
                alt={mainImage.alt}
                width={604}
                height={424}
                className={styles.image}
              />
            </button>
            <div className={styles.sideImages}>
              {sideImages.map((image) => (
                <button
                  key={image.id}
                  className={styles.sideImage}
                  onClick={() => handleImageClick(image.id)}
                  type="button"
                  aria-label={image.alt}
                >
                  <Image
                    src={getMediaUrl(image.src)}
                    alt={image.alt}
                    width={290}
                    height={200}
                    className={styles.image}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {!showGallery && !isLoading && sortedUnits.length > 0 && (
          <div className={styles.emptyState}>
            <Text variant="body-2" color="neutral-faded">
              Selecione uma unidade acima para visualizar as fotos da
              infraestrutura
            </Text>
          </div>
        )}

        {isError && !isLoading && hasCity && (
          <div className={styles.emptyState}>
            <Text variant="body-2" color="neutral-faded">
              Não foi possível carregar as informações das unidades no momento.
              Por favor, tente novamente mais tarde.
            </Text>
          </div>
        )}
      </div>

      <ImageModal
        active={selectedImageId !== null}
        image={selectedImage || null}
        onClose={handleCloseModal}
      />
    </section>
  );
};
