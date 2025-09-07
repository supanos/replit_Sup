import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Trash2, Save } from "lucide-react";
import { insertMenuItemSchema, type MenuItem, type MenuCategory, type InsertMenuItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item?: MenuItem | null;
  categories: MenuCategory[];
  onSave: (data: InsertMenuItem & { badges?: string; allergens?: string }) => void;
  isLoading?: boolean;
}

const AVAILABLE_BADGES = ["popular", "spicy", "vegetarian", "gluten-free", "new"];
const AVAILABLE_ALLERGENS = ["nuts", "dairy", "gluten", "soy", "eggs"];

export default function EditItemDrawer({
  isOpen,
  onClose,
  item,
  categories,
  onSave,
  isLoading = false,
}: EditItemDrawerProps) {
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertMenuItem>({
    resolver: zodResolver(insertMenuItemSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      description: "",
      price: 1,
      image: ""
    }
  });

  useEffect(() => {
    if (item) {
      form.reset({
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image
      });
      setSelectedBadges(item.badges || []);
      setSelectedAllergens(item.allergens || []);
      setImagePreview(item.image || "");
    } else {
      form.reset({
        categoryId: "",
        name: "",
        description: "",
        price: 1,
        image: ""
      });
      setSelectedBadges([]);
      setSelectedAllergens([]);
      setImagePreview("");
    }
    setIsDirty(false);
  }, [item, form]);

  // Watch for form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleClose = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  };

  const forceClose = () => {
    setShowUnsavedDialog(false);
    setIsDirty(false);
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB");
        return;
      }

      // Validate file type
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("image", result);
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBadgeToggle = (badge: string) => {
    // If "None" was selected, clear it when selecting any badge
    const newBadges = selectedBadges.includes(badge)
      ? selectedBadges.filter(b => b !== badge)
      : [...selectedBadges, badge];
    setSelectedBadges(newBadges);
    setIsDirty(true);
  };

  const handleAllergenToggle = (allergen: string) => {
    // If "None" was selected, clear it when selecting any allergen
    const newAllergens = selectedAllergens.includes(allergen)
      ? selectedAllergens.filter(a => a !== allergen)
      : [...selectedAllergens, allergen];
    setSelectedAllergens(newAllergens);
    setIsDirty(true);
  };

  const onSubmit = (data: InsertMenuItem) => {
    const submitData = {
      ...data,
      badges: selectedBadges.join(","),
      allergens: selectedAllergens.join(",")
    } as InsertMenuItem & { badges?: string; allergens?: string };
    onSave(submitData);
    setIsDirty(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className="fixed right-0 top-0 h-full w-[560px] bg-white shadow-xl z-50 flex flex-col"
        style={{ background: 'var(--surface)' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
            {item ? 'Edit Menu Item' : 'Create Menu Item'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter item name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe this menu item"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
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
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  Image
                </label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                      style={{ borderColor: 'var(--border)' }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview("");
                        form.setValue("image", "");
                        setIsDirty(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      JPEG, PNG, WebP up to 2MB
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
              </div>

              {/* Badges */}
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  Badges
                </label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedBadges.length === 0}
                      onCheckedChange={() => setSelectedBadges([])}
                    />
                    <Badge
                      variant={selectedBadges.length === 0 ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedBadges([])}
                    >
                      None
                    </Badge>
                  </div>
                  {AVAILABLE_BADGES.map((badge) => (
                    <div key={badge} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedBadges.includes(badge)}
                        onCheckedChange={() => handleBadgeToggle(badge)}
                      />
                      <Badge
                        variant={selectedBadges.includes(badge) ? "default" : "outline"}
                        className="capitalize cursor-pointer"
                        onClick={() => handleBadgeToggle(badge)}
                      >
                        {badge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div className="space-y-3">
                <label className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  Allergens
                </label>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedAllergens.length === 0}
                      onCheckedChange={() => setSelectedAllergens([])}
                    />
                    <Badge
                      variant={selectedAllergens.length === 0 ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedAllergens([])}
                    >
                      None
                    </Badge>
                  </div>
                  {AVAILABLE_ALLERGENS.map((allergen) => (
                    <div key={allergen} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedAllergens.includes(allergen)}
                        onCheckedChange={() => handleAllergenToggle(allergen)}
                      />
                      <Badge
                        variant={selectedAllergens.includes(allergen) ? "destructive" : "outline"}
                        className="capitalize cursor-pointer"
                        onClick={() => handleAllergenToggle(allergen)}
                      >
                        {allergen}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between p-4 border-t bg-gray-50"
          style={{ borderColor: 'var(--border)' }}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
            style={{ 
              background: 'var(--wp-primary)', 
              color: 'var(--wp-primary-contrast)',
              border: 'none'
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Item'}
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={forceClose}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}