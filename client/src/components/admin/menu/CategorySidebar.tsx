import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit2, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { MenuCategory, MenuItem } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onEditCategory: (category: MenuCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onTogglePublishCategory: (categoryId: string, published: boolean) => void;
  onCreateCategory: () => void;
}

export default function CategorySidebar({
  categories,
  menuItems,
  selectedCategoryId,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  onTogglePublishCategory,
  onCreateCategory,
}: CategorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getItemCount = (categoryId: string) => {
    return menuItems.filter(item => item.categoryId === categoryId).length;
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allItemsCount = menuItems.length;

  return (
    <div 
      className="w-80 h-full border-r bg-white flex flex-col shrink-0"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Categories</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border)',
              color: 'var(--text)'
            }}
          />
        </div>
        
        {/* Add Category Button */}
        <Button
          onClick={onCreateCategory}
          size="default"
          className="w-full"
          style={{ 
            background: 'var(--wp-primary)', 
            color: 'var(--wp-primary-contrast)',
            border: 'none'
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        {/* All Items */}
        <div
          className={cn(
            "flex items-center justify-between p-3 cursor-pointer border-b transition-colors",
            selectedCategoryId === null 
              ? "bg-blue-50" 
              : "hover:bg-gray-50"
          )}
          style={{ 
            borderColor: 'var(--border)',
            backgroundColor: selectedCategoryId === null ? 'rgba(34, 113, 177, 0.1)' : undefined
          }}
          onClick={() => onSelectCategory(null)}
        >
          <div className="flex items-center">
            <span className="font-medium" style={{ color: 'var(--text)' }}>All Items</span>
          </div>
          <Badge variant="secondary" className="ml-2">
            {allItemsCount}
          </Badge>
        </div>

        {/* Category List */}
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className={cn(
              "flex items-center justify-between p-3 cursor-pointer border-b transition-colors group",
              selectedCategoryId === category.id 
                ? "bg-blue-50" 
                : "hover:bg-gray-50"
            )}
            style={{ 
              borderColor: 'var(--border)',
              backgroundColor: selectedCategoryId === category.id ? 'rgba(34, 113, 177, 0.1)' : undefined
            }}
            onClick={() => onSelectCategory(category.id)}
          >
            <div className="flex items-center min-w-0 flex-1">
              <span className="font-medium truncate" style={{ color: 'var(--text)' }}>
                {category.name}
              </span>
              <Badge variant="secondary" className="ml-2">
                {getItemCount(category.id)}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditCategory(category)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onTogglePublishCategory(category.id, !category.published)}
                >
                  {category.published ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Publish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {filteredCategories.length === 0 && searchTerm && (
          <div className="p-4 text-center" style={{ color: 'var(--text-muted)' }}>
            <p>No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}