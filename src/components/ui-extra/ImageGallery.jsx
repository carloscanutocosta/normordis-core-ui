import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const SAMPLE = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    alt: 'Montanha',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300',
    alt: 'Floresta',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1439853949212-36589f962381?w=800',
    thumb: 'https://images.unsplash.com/photo-1439853949212-36589f962381?w=300',
    alt: 'Lago',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    thumb: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300',
    alt: 'Pôr do sol',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
    thumb: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300',
    alt: 'Cascata',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
    thumb: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300',
    alt: 'Colinas',
  },
];

export default function ImageGallery({ images = SAMPLE, columns = 3, className }) {
  const [lightbox, setLightbox] = useState(null); // index

  const prev = () => setLightbox((i) => (i - 1 + images.length) % images.length);
  const next = () => setLightbox((i) => (i + 1) % images.length);

  return (
    <>
      <div
        className={cn(`grid gap-2`, className)}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightbox(i)}
            className="group relative aspect-square rounded-lg overflow-hidden border border-border"
          >
            <img
              src={img.thumb}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 text-white/70 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white/70 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
