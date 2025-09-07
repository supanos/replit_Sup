import { useState } from "react";
import { MoreHorizontal, Edit2, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { MenuItem, MenuCategory } from "@shared/schema";
import { formatDistance } from "date-fns";

interface ItemsTableProps {
  items: MenuItem[];
  categories: MenuCategory[];
  selectedItems: string[];
  onSelectItem: (itemId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEditItem: (item: MenuItem) => void;
  onDuplicateItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onTogglePublish: (itemId: string, published: boolean) => void;
}

export default function ItemsTable({
  items,
  categories,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
  onTogglePublish,
}: ItemsTableProps) {
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  const formatUpdatedDate = (dateString?: string) => {
    if (!dateString) return "Never";
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatBadges = (badges?: string[]) => {
    if (!badges || badges.length === 0) return null;
    return badges.slice(0, 3).map(badge => (
      <Badge key={badge} variant="secondary" className="mr-1 text-xs">
        {badge}
      </Badge>
    ));
  };

  const formatAllergens = (allergens?: string[]) => {
    if (!allergens || allergens.length === 0) return "-";
    return allergens.slice(0, 2).join(", ") + (allergens.length > 2 ? "..." : "");
  };

  return (
    <div 
      className="bg-white border rounded-lg overflow-hidden"
      style={{ 
        background: 'var(--surface)', 
        borderColor: 'var(--border)'
      }}
    >
      {/* Table Header Controls */}
      <div 
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {items.length} items
          </span>
          {selectedItems.length > 0 && (
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {selectedItems.length} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
          >
            {density === "comfortable" ? "Compact" : "Comfortable"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: 'var(--border)' }}>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                ref={(ref) => {
                  if (ref && 'indeterminate' in ref) {
                    (ref as any).indeterminate = someSelected;
                  }
                }}
              />
            </TableHead>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Badges</TableHead>
            <TableHead>Allergens</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-12">
                <div style={{ color: 'var(--text-muted)' }}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h3 className="font-semibold mb-2">No Menu Items</h3>
                  <p>Start by creating your first menu item.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow 
                key={item.id} 
                className={`${density === "compact" ? "h-12" : "h-16"} hover:bg-gray-50 transition-colors cursor-pointer`}
                style={{ borderColor: 'var(--border)' }}
                onClick={() => onEditItem(item)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => onSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className={`${density === "compact" ? "w-8 h-8" : "w-12 h-12"} rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden`}>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">🍽️</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--text)' }}>
                      {item.name}
                    </div>
                    {density === "comfortable" && item.description && (
                      <div className="text-sm truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {getCategoryName(item.categoryId)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium" style={{ color: 'var(--text)' }}>
                    {formatPrice(item.price)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {formatBadges(item.badges)}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {formatAllergens(item.allergens)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {(item as any).published ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Draft
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {formatUpdatedDate((item as any).updatedAt)}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditItem(item)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicateItem(item)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onTogglePublish(item.id, !(item as any).published)}
                      >
                        {(item as any).published ? (
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
                        onClick={() => onDeleteItem(item.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {items.length > 50 && (
        <div 
          className="px-4 py-3 border-t flex items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Showing {items.length} items
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}