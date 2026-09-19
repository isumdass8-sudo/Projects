import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import GalleryGrid from '../components/GalleryGrid';
import { fetchWithFallback } from '../utils/api';
import { fallbackGallery } from '../data/fallbackData';
import heroImage from '../assets/gallery/event-duo.jpg';

export default function Gallery() {
  const [images, setImages] = useState(fallbackGallery);

  useEffect(() => {
    fetchWithFallback('/gallery', fallbackGallery).then((gallery) => {
      const existingImages = new Set(gallery.map((image) => image.image_url));
      const localImages = fallbackGallery.filter((image) => !existingImages.has(image.image_url));
      setImages([...gallery, ...localImages]);
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Kandy tourism, in pictures"
        description="Moments from KTMA events, campaigns, and the community that makes Kandy's tourism industry thrive."
        image={heroImage}
      />
      <section className="container-ktma py-20">
        <GalleryGrid images={images} />
      </section>
    </>
  );
}
