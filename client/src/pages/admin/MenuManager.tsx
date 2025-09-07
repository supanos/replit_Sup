import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Save, X, ChefHat, DollarSign, Search, Filter, Tag, Eye, EyeOff } from "lucide-react";
import { insertMenuCategorySchema, insertMenuItemSchema, type MenuCategory, type MenuItem, type InsertMenuCategory, type InsertMenuItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminMenuManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Data fetching
  const { data: categories = [] } = useQuery<MenuCategory[]>({
    queryKey: ['/api/menu/categories']
  });

  const { data: allItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu/items']
  });

  // Category form
  const categoryForm = useForm<InsertMenuCategory>({
    resolver: zodResolver(insertMenuCategorySchema),
    defaultValues: { name: "", published: true }
  });

  // Item form
  const itemForm = useForm<InsertMenuItem & { badges?: string; allergens?: string }>({
    resolver: zodResolver(insertMenuItemSchema.extend({
      badges: insertMenuItemSchema.shape.badges.optional(),
      allergens: insertMenuItemSchema.shape.allergens.optional()
    })),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      badges: "",
      allergens: "",
      published: true
    }
  });

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = allItems;

    if (selectedCategoryId) {
      filtered = filtered.filter(item => item.categoryId === selectedCategoryId);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
    }

    if (selectedBadges.length > 0) {
      filtered = filtered.filter(item => 
        item.badges && selectedBadges.some(badge => item.badges?.includes(badge))
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [allItems, selectedCategoryId, searchTerm, selectedBadges]);

  // Category mutations
  const createCategory = useMutation({
    mutationFn: async (data: InsertMenuCategory) => {
      const response = await apiRequest('POST', '/api/menu/categories', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/categories'] });
      toast({ title: "Category created successfully" });
      setShowCategoryDialog(false);
      categoryForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create category", description: error.message, variant: "destructive" });
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/menu/categories/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/categories'] });
      toast({ title: "Category deleted successfully" });
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
      }
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete category", description: error.message, variant: "destructive" });
    }
  });

  // Item mutations
  const createItem = useMutation({
    mutationFn: async (data: InsertMenuItem & { badges?: string; allergens?: string }) => {
      const processedData = {
        ...data,
        badges: data.badges ? data.badges.split(',').map(b => b.trim()).filter(Boolean) : [],
        allergens: data.allergens ? data.allergens.split(',').map(a => a.trim()).filter(Boolean) : []
      };
      const response = await apiRequest('POST', '/api/menu/items', processedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/items'] });
      toast({ title: "Item created successfully" });
      setShowItemDialog(false);
      itemForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create item", description: error.message, variant: "destructive" });
    }
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: InsertMenuItem & { badges?: string; allergens?: string } }) => {
      const processedData = {
        ...data,
        badges: data.badges ? data.badges.split(',').map(b => b.trim()).filter(Boolean) : [],
        allergens: data.allergens ? data.allergens.split(',').map(a => a.trim()).filter(Boolean) : []
      };
      const response = await apiRequest('PUT', `/api/menu/items/${id}`, processedData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/items'] });
      toast({ title: "Item updated successfully" });
      setShowItemDialog(false);
      setEditingItem(null);
      itemForm.reset();
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update item", description: error.message, variant: "destructive" });
    }
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/menu/items/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu/items'] });
      toast({ title: "Item deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete item", description: error.message, variant: "destructive" });
    }
  });

  const openCategoryDialog = (category?: MenuCategory) => {
    if (category) {
      setEditingCategory(category);
      categoryForm.reset(category);
    } else {
      setEditingCategory(null);
      categoryForm.reset({ name: "", published: true });
    }
    setShowCategoryDialog(true);
  };

  const openItemDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      itemForm.reset({
        ...item,
        badges: item.badges?.join(', ') || "",
        allergens: item.allergens?.join(', ') || ""
      });
    } else {
      setEditingItem(null);
      itemForm.reset({
        name: "",
        description: "",
        price: 0,
        categoryId: selectedCategoryId || "",
        badges: "",
        allergens: "",
        published: true
      });
    }
    setShowItemDialog(true);
  };

  const getItemCount = (categoryId: string) => {
    return allItems.filter(item => item.categoryId === categoryId).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Menu Manager</h1>
              <p className="text-slate-300 mt-1">Manage your restaurant categories and menu items</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => openCategoryDialog()}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="add-category-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
              <Button
                onClick={() => openItemDialog()}
                className="bg-green-600 hover:bg-green-700"
                data-testid="add-item-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-slate-700 border-slate-600 text-white"
                  data-testid="search-items-input"
                />
              </div>
            </div>
            <Select value={selectedCategoryId || ""} onValueChange={(value) => setSelectedCategoryId(value || null)}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({getItemCount(category.id)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{category.name}</h4>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openCategoryDialog(category)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-600"
                      data-testid={`edit-category-${category.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteCategory.mutate(category.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                      data-testid={`delete-category-${category.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{getItemCount(category.id)} items</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    category.published ? "bg-green-600 text-white" : "bg-slate-600 text-slate-300"
                  }`}>
                    {category.published ? "Published" : "Draft"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Menu Items {selectedCategoryId && categories.find(c => c.id === selectedCategoryId) && 
              `- ${categories.find(c => c.id === selectedCategoryId)?.name}`}
          </h3>
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white">{item.name}</h4>
                        <span className="text-orange-400 font-semibold">${item.price}</span>
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-2">{item.description}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-slate-500 text-xs">
                          {categories.find(c => c.id === item.categoryId)?.name}
                        </span>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          (item as any).published ? "bg-green-600 text-white" : "bg-slate-600 text-slate-300"
                        }`}>
                          {(item as any).published ? "Published" : "Draft"}
                        </div>
                      </div>

                      {item.badges && item.badges.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {item.badges.map((badge, index) => (
                            <span key={index} className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => openItemDialog(item)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-600"
                        data-testid={`edit-item-${item.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => deleteItem.mutate(item.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                        data-testid={`delete-item-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <ChefHat className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-semibold mb-2">No Menu Items</h3>
              <p>Start by creating your first menu item.</p>
            </div>
          )}
        </div>

        {/* Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...categoryForm}>
              <form onSubmit={categoryForm.handleSubmit((data) => {
                if (editingCategory) {
                  // Update logic would go here
                } else {
                  createCategory.mutate(data);
                }
              })} className="space-y-4">
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Category Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="APPETIZERS"
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="category-name-input" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={categoryForm.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                      <FormLabel className="text-white text-sm">Published</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="category-published-switch"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCategoryDialog(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={createCategory.isPending}
                    data-testid="save-category-button"
                  >
                    {createCategory.isPending ? 'Saving...' : 'Save Category'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Item Dialog */}
        <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingItem ? 'Edit Menu Item' : 'Create Menu Item'}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...itemForm}>
              <form onSubmit={itemForm.handleSubmit((data) => {
                if (editingItem) {
                  updateItem.mutate({ id: editingItem.id, data });
                } else {
                  createItem.mutate(data);
                }
              })} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={itemForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Item Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Buffalo Wings"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="item-name-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={itemForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="12.99"
                            className="bg-slate-700 border-slate-600 text-white"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            data-testid="item-price-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={itemForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={itemForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Crispy chicken wings served with celery and blue cheese..."
                          rows={3}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          data-testid="item-description-input" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={itemForm.control}
                    name="badges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Badges (comma-separated)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="popular, spicy, new"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="item-badges-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={itemForm.control}
                    name="allergens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Allergens (comma-separated)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="dairy, gluten"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="item-allergens-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={itemForm.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                      <FormLabel className="text-white text-sm">Published</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="item-published-switch"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowItemDialog(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={createItem.isPending || updateItem.isPending}
                    data-testid="save-item-button"
                  >
                    {(createItem.isPending || updateItem.isPending) ? 'Saving...' : 'Save Item'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}