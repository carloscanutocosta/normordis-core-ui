import ImageGallery from './ImageGallery';

export default {
  title: 'UI Extra/ImageGallery',
  component: ImageGallery,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: { type: 'range', min: 1, max: 5, step: 1 } },
  },
};

const IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300', alt: 'Montanha' },
  { id: 2, src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300', alt: 'Floresta' },
  { id: 3, src: 'https://images.unsplash.com/photo-1439853949212-36589f962381?w=800', thumb: 'https://images.unsplash.com/photo-1439853949212-36589f962381?w=300', alt: 'Lago' },
  { id: 4, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800', thumb: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300', alt: 'Pôr do sol' },
  { id: 5, src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', thumb: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300', alt: 'Cascata' },
  { id: 6, src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300', alt: 'Colinas' },
];

export const Default = { args: { images: IMAGES, columns: 3 } };
export const TwoColumns = { args: { images: IMAGES.slice(0, 4), columns: 2 } };
export const FourColumns = { args: { images: IMAGES, columns: 4 } };
export const Single = { args: { images: IMAGES.slice(0, 1), columns: 1 } };
