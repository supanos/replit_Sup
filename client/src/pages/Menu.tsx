import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Utensils, Beer, Coffee, Drumstick } from "lucide-react";
import type { MenuCategory, MenuItem } from "@shared/schema";
import Badge from "@/components/Badge";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('');


  const { data: categories } = useQuery<MenuCategory[]>({
    queryKey: ['/api/menu/categories']
  });

  const { data: allItems } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu/items']
  });

  // Filter items by active category
  const filteredItems = activeCategory 
    ? allItems?.filter(item => item.categoryId === activeCategory) || []
    : allItems || [];

  // Set default active category when categories load
  if (categories?.length && !activeCategory) {
    setActiveCategory(categories[0].id);
  }

  useEffect(() => {
    const hideZeroElements = () => {
      const menuCards = document.querySelectorAll('[data-testid^="menu-item-"]');
      menuCards.forEach(card => {
        const walker = document.createTreeWalker(
          card,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
          if (node.textContent?.trim() === '0') {
            textNodes.push(node);
          }
        }
        
        textNodes.forEach(textNode => {
          const parent = textNode.parentElement;
          if (parent && !parent.hasAttribute('data-testid')) {
            parent.style.display = 'none';
          }
        });
      });
    };

    const timer = setTimeout(hideZeroElements, 100);
    return () => clearTimeout(timer);
  }, [filteredItems]);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'burgers': return Utensils;
      case 'wings': return Drumstick;
      case 'beers': return Beer;
      case 'cocktails': return Coffee;
      default: return Utensils;
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray text-brand-navy py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-anton text-4xl sm:text-5xl mb-4">OUR MENU</h1>
          <p className="text-xl text-gray-600">Game day favorites and crowd pleasers</p>
        </div>

        {/* Category Tabs */}
        {categories?.length && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-colors flex items-center ${
                    isActive 
                      ? 'bg-brand-navy text-white' 
                      : 'bg-white text-brand-navy border border-brand-navy hover:bg-gray-100'
                  }`}
                  data-testid={`category-tab-${category.slug}`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Menu Items */}
        {filteredItems.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-xl relative" data-testid={`menu-item-${item.id}`} style={{isolation: 'isolate'}}>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-anton text-xl flex-1 pr-2" data-testid={`menu-item-name-${item.id}`}>{item.name}</h3>
                    {item.badges?.length && (
                      <div className="flex flex-col gap-1">
                        {item.badges
                          .filter(badge => badge && badge !== '0' && badge !== '')
                          .map((badge, index) => (
                            <Badge key={index} variant={badge as any}>{badge}</Badge>
                          ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4" data-testid={`menu-item-description-${item.id}`}>{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-anton text-2xl text-brand-gold" data-testid={`menu-item-price-${item.id}`}>${item.price}</span>
                    {item.allergens?.length && (
                      <span className="text-sm text-gray-500" data-testid={`menu-item-allergens-${item.id}`}>
                        Contains: {item.allergens.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p>No items available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
