import { useState } from "react";
import { ExternalLink, Instagram } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1574391884720-bfb65e72b3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Sports bar interior with multiple TV screens",
    category: "interior"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    alt: "Loaded nachos with cheese and jalapeños",
    category: "food"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Bar counter with craft beer taps",
    category: "bar"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Friends watching sports and cheering",
    category: "atmosphere"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1503481766315-7a586b20f66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Bartender pouring draft beer",
    category: "bar"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1572448862527-d3c904757de6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    alt: "Outdoor patio seating with umbrellas",
    category: "interior"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Colorful cocktails with garnishes",
    category: "drinks"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Live music performance on stage",
    category: "atmosphere"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Gourmet burger with fries",
    category: "food"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1608039755401-742074f0548d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Buffalo wings with celery and blue cheese",
    category: "food"
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Craft beer flight with different varieties",
    category: "drinks"
  }
];

const categories = [
  { id: 'all', name: 'All Photos' },
  { id: 'interior', name: 'Interior' },
  { id: 'food', name: 'Food' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'bar', name: 'Bar' },
  { id: 'atmosphere', name: 'Atmosphere' }
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const selectedImageData = selectedImage ? galleryImages.find(img => img.id === selectedImage) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-anton text-4xl sm:text-5xl mb-4">GALLERY</h1>
          <p className="text-xl text-gray-300">See what makes Supono's special</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                selectedCategory === category.id
                  ? 'bg-brand-gold text-brand-navy'
                  : 'bg-brand-navy text-white border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy'
              }`}
              data-testid={`filter-${category.id}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl bg-brand-navy shadow-xl"
              onClick={() => openLightbox(image.id)}
              data-testid={`gallery-image-${image.id}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Section */}
        <div className="mt-16 text-center">
          <div className="bg-brand-navy rounded-2xl p-8 max-w-2xl mx-auto">
            <Instagram className="w-12 h-12 text-brand-gold mx-auto mb-4" />
            <h3 className="font-anton text-2xl mb-4">FOLLOW US ON INSTAGRAM</h3>
            <p className="text-gray-300 mb-6">
              Tag us @suponos_bar for a chance to be featured in our gallery!
            </p>
            <a
              href="https://instagram.com/suponos_bar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-gold text-brand-navy px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
              data-testid="instagram-link"
            >
              Follow Us
            </a>
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImageData && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            data-testid="lightbox-overlay"
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImageData.src}
                alt={selectedImageData.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-brand-gold text-2xl font-bold"
                data-testid="lightbox-close"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
