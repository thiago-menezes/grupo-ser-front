export type InfrastructureImage = {
  id: string;
  src: string;
  alt: string;
};

export type InfrastructureUnit = {
  id: string;
  name: string;
  isActive?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  imageIds?: string[];
};

export type InfrastructureContent = {
  location: string;
  locationState: string;
  units: InfrastructureUnit[];
  images: InfrastructureImage[];
};

export type InfrastructureSectionProps = {
  content?: InfrastructureContent;
};

export type ImageModalProps = {
  active: boolean;
  image: InfrastructureImage | null;
  onClose: () => void;
};
