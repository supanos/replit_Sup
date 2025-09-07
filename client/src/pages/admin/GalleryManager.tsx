import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Upload, Edit2, Trash2, Search, Filter, Download, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  uploadedAt: string;
  fileSize?: number;
  dimensions?: string;
}

const categories = [
  { id: 'all', name: 'All Photos' },
  { id: 'interior', name: 'Interior' },
  { id: 'food', name: 'Food' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'bar', name: 'Bar' },
  { id: 'atmosphere', name: 'Atmosphere' },
  { id: 'events', name: 'Events' }
];

// Mock data for now - in real app would come from API
const mockGalleryData: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1574391884720-bfb65e72b3e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Sports bar interior with multiple TV screens",
    category: "interior",
    uploadedAt: "2024-08-20T14:30:00Z",
    fileSize: 245000,
    dimensions: "800x600"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
    alt: "Loaded nachos with cheese and jalapeños",
    category: "food",
    uploadedAt: "2024-08-19T16:45:00Z",
    fileSize: 189000,
    dimensions: "600x800"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Bar counter with craft beer taps",
    category: "bar",
    uploadedAt: "2024-08-18T12:15:00Z",
    fileSize: 312000,
    dimensions: "800x600"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Friends watching sports and cheering",
    category: "atmosphere",
    uploadedAt: "2024-08-17T19:20:00Z",
    fileSize: 278000,
    dimensions: "800x600"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1503481766315-7a586b20f66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    alt: "Bartender pouring draft beer",
    category: "bar",
    uploadedAt: "2024-08-16T15:10:00Z",
    fileSize: 256000,
    dimensions: "800x600"
  }
];

export default function AdminGalleryManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showPreview, setShowPreview] = useState<GalleryImage | null>(null);

  // Mock query - in real app would fetch from API
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['/api/gallery/images'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockGalleryData;
    }
  });

  const filteredImages = images.filter(image => {
    const matchesSearch = image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageSelect = (id: number) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setShowEditDialog(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu resmi silmek istediğinizden emin misiniz?")) {
      toast({ title: "Resim silindi" });
    }
  };

  const handleBulkDelete = () => {
    if (selectedImages.length === 0) return;
    if (confirm(`${selectedImages.length} resmi silmek istediğinizden emin misiniz?`)) {
      setSelectedImages([]);
      toast({ title: `${selectedImages.length} resim silindi` });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${Math.round(kb / 1024 * 10) / 10} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div 
          className="border-b bg-white"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          {/* Top Row */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                  Gallery Manager
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  Manage gallery images and categories
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowUploadDialog(true)}
                  size="default"
                  className="px-6"
                  style={{ 
                    background: 'var(--wp-primary)', 
                    color: 'var(--wp-primary-contrast)',
                    border: 'none'
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
                {selectedImages.length > 0 && (
                  <Button variant="destructive" onClick={handleBulkDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedImages.length})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Row */}
          <div className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  <Input
                    placeholder="Search images..."
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
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectedImages.length === filteredImages.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredImages.map((image) => (
                <Card 
                  key={image.id} 
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ 
                    background: 'var(--surface)', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  <div className="relative aspect-video group">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPreview(image);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/90 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(image);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(image.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => handleImageSelect(image.id)}
                        className="w-4 h-4 accent-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 
                        className="font-medium text-sm line-clamp-2" 
                        style={{ color: 'var(--text)' }}
                      >
                        {image.alt}
                      </h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryName(image.category)}
                        </Badge>
                      </div>
                      <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                        <div>{formatDate(image.uploadedAt)}</div>
                        <div className="flex items-center justify-between">
                          <span>{formatFileSize(image.fileSize)}</span>
                          <span>{image.dimensions}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Images</DialogTitle>
              <DialogDescription>
                Add new images to your gallery. Supported formats: JPEG, PNG, WebP
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Drag and drop images here, or click to browse
                </p>
                <input type="file" multiple accept="image/*" className="hidden" />
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  style={{ 
                    background: 'var(--wp-primary)', 
                    color: 'var(--wp-primary-contrast)',
                    border: 'none'
                  }}
                >
                  Upload
                </Button>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        {showPreview && (
          <Dialog open={!!showPreview} onOpenChange={() => setShowPreview(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Image Preview
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(showPreview.src, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={showPreview.src}
                  alt={showPreview.alt}
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Alt Text:</span>
                    <p style={{ color: 'var(--text-muted)' }}>{showPreview.alt}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p style={{ color: 'var(--text-muted)' }}>{getCategoryName(showPreview.category)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Upload Date:</span>
                    <p style={{ color: 'var(--text-muted)' }}>{formatDate(showPreview.uploadedAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium">File Size:</span>
                    <p style={{ color: 'var(--text-muted)' }}>{formatFileSize(showPreview.fileSize)}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}