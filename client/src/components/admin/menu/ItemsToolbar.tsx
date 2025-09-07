import { useState } from "react";
import { Search, Filter, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { MenuCategory } from "@shared/schema";

interface ItemsToolbarProps {
  categories: MenuCategory[];
  selectedCategoryId: string | null;
  searchTerm: string;
  onSearchChange: (search: string) => void;
  onCategoryFilter: (categoryId: string | null) => void;
  onBadgeFilter: (badges: string[]) => void;
  onStatusFilter: (status: string | null) => void;
  onAllergenFilter: (allergens: string[]) => void;
  onSortChange: (sortBy: string) => void;
  onCreateItem: () => void;
  onExportCSV: () => void;
  selectedBadges: string[];
  selectedStatus: string | null;
  selectedAllergens: string[];
  sortBy: string;
}

const AVAILABLE_BADGES = ["popular", "spicy", "vegetarian", "gluten-free", "new"];
const AVAILABLE_ALLERGENS = ["nuts", "dairy", "gluten", "soy", "eggs"];

export default function ItemsToolbar({
  categories,
  selectedCategoryId,
  searchTerm,
  onSearchChange,
  onCategoryFilter,
  onBadgeFilter,
  onStatusFilter,
  onAllergenFilter,
  onSortChange,
  onCreateItem,
  onExportCSV,
  selectedBadges,
  selectedStatus,
  selectedAllergens,
  sortBy,
}: ItemsToolbarProps) {
  const [badgeFilterOpen, setBadgeFilterOpen] = useState(false);
  const [allergenFilterOpen, setAllergenFilterOpen] = useState(false);

  const handleBadgeToggle = (badge: string) => {
    const newBadges = selectedBadges.includes(badge)
      ? selectedBadges.filter(b => b !== badge)
      : [...selectedBadges, badge];
    onBadgeFilter(newBadges);
  };

  const handleAllergenToggle = (allergen: string) => {
    const newAllergens = selectedAllergens.includes(allergen)
      ? selectedAllergens.filter(a => a !== allergen)
      : [...selectedAllergens, allergen];
    onAllergenFilter(newAllergens);
  };

  return (
    <div 
      className="border-b bg-white"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      {/* Top Row: Main Actions */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Menu Items
          </h2>
          <div className="flex items-center gap-3">
            <Button
              onClick={onCreateItem}
              size="default"
              className="px-6"
              style={{ 
                background: 'var(--wp-primary)', 
                color: 'var(--wp-primary-contrast)',
                border: 'none'
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button variant="outline" size="default" onClick={onExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Second Row: Search and Filters */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Global Search */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
                style={{ 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}
              />
            </div>
          </div>

          {/* Right: Filters and Sort */}
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <Select value={selectedCategoryId || "all"} onValueChange={(value) => onCategoryFilter(value === "all" ? null : value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated-desc">Recently Updated</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Third Row: Advanced Filters */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3">
          {/* Badges Filter */}
          <Popover open={badgeFilterOpen} onOpenChange={setBadgeFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Badges
                {selectedBadges.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {selectedBadges.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <h4 className="font-medium" style={{ color: 'var(--text)' }}>Badge Filters</h4>
                {AVAILABLE_BADGES.map((badge) => (
                  <div key={badge} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedBadges.includes(badge)}
                      onCheckedChange={() => handleBadgeToggle(badge)}
                    />
                    <label className="capitalize cursor-pointer" style={{ color: 'var(--text)' }}>
                      {badge}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select value={selectedStatus || "all"} onValueChange={(value) => onStatusFilter(value === "all" ? null : value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Allergens Filter */}
          <Popover open={allergenFilterOpen} onOpenChange={setAllergenFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Allergens
                {selectedAllergens.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {selectedAllergens.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <h4 className="font-medium" style={{ color: 'var(--text)' }}>Allergen Filters</h4>
                {AVAILABLE_ALLERGENS.map((allergen) => (
                  <div key={allergen} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedAllergens.includes(allergen)}
                      onCheckedChange={() => handleAllergenToggle(allergen)}
                    />
                    <label className="capitalize cursor-pointer" style={{ color: 'var(--text)' }}>
                      {allergen}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Active Filters Summary */}
          {(selectedBadges.length > 0 || selectedStatus || selectedAllergens.length > 0) && (
            <div className="flex items-center gap-2 flex-wrap ml-4">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Active:</span>
              {selectedBadges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                  <button
                    onClick={() => handleBadgeToggle(badge)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {selectedStatus && (
                <Badge variant="secondary" className="text-xs">
                  {selectedStatus}
                  <button
                    onClick={() => onStatusFilter(null)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedAllergens.map((allergen) => (
                <Badge key={allergen} variant="secondary" className="text-xs">
                  {allergen}
                  <button
                    onClick={() => handleAllergenToggle(allergen)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}