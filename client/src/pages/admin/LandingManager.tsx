import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Upload, Plus, Trash2, Eye, Timer, Settings2, Calendar, Monitor, Star } from "lucide-react";
import EmojiPicker from "@/components/ui/EmojiPicker";
import { landingContentSchema, type LandingContent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminLandingManager() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: landingContent, isLoading } = useQuery<LandingContent>({
    queryKey: ['/api/landing']
  });

  const form = useForm<LandingContent>({
    resolver: zodResolver(landingContentSchema),
    defaultValues: {
      popup: {
        enabled: false,
        duration: 5,
        autoRedirect: true
      },
      redirect: {
        enabled: false,
        start: null,
        end: null,
        redirectAllRoutes: true
      },
      hero: {
        title: "",
        subtitle: "",
        description: "",
        backgroundImage: "",
        ctaText: "",
        ctaLink: ""
      },
      features: [],
      specialOffer: {
        enabled: false,
        title: "",
        description: "",
        badge: ""
      }
    }
  });

  const { fields: featureFields, append: addFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features"
  });

  // Update form when content loads
  React.useEffect(() => {
    if (landingContent) {
      form.reset(landingContent);
    }
  }, [landingContent, form]);

  const updateLandingContent = useMutation({
    mutationFn: async (data: LandingContent) => {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      
      // Add background image file if selected
      if (fileInputRef.current?.files?.[0]) {
        formData.append('backgroundImage', fileInputRef.current.files[0]);
      }

      const response = await fetch('/api/landing', {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to update landing content');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/landing'] });
      toast.success("Landing page content has been saved successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });

  const onSubmit = (data: LandingContent) => {
    updateLandingContent.mutate(data);
  };

  const previewLanding = () => {
    window.open('/landing', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading landing page content...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between bg-slate-800 p-6 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-white">Landing Page Manager</h1>
            <p className="text-slate-300 mt-1">
              Manage your landing page content and settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={previewLanding}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              data-testid="preview-landing-button"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              type="submit" 
              form="landing-form" 
              disabled={updateLandingContent.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateLandingContent.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form id="landing-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Settings Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pop-up Settings */}
              <div className="bg-slate-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  Pop-up Settings
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="popup.enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                        <FormLabel className="text-white text-sm">Enable Pop-up</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-popup-enabled"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="popup.duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm flex items-center gap-2">
                          <Timer className="w-4 h-4" />
                          Duration (seconds)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={30}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-popup-duration"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="popup.autoRedirect"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                        <FormLabel className="text-white text-sm">Auto Redirect</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-auto-redirect"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Redirect Settings */}
              <div className="bg-slate-800 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Page Redirect
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="redirect.enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                        <FormLabel className="text-white text-sm">Enable Redirect</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="redirect-enabled-switch"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="redirect.start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm">Start Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="datetime-local"
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                              className="bg-slate-700 border-slate-600 text-white"
                              data-testid="redirect-start-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="redirect.end"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-sm">End Date</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="datetime-local"
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                              className="bg-slate-700 border-slate-600 text-white"
                              data-testid="redirect-end-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="redirect.redirectAllRoutes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                        <FormLabel className="text-white text-sm">All Routes</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="redirect-all-routes-switch"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Hero Section
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hero.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Main Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="SUPANO'S" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="hero-title-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hero.subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Subtitle</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="NFL KICKOFF WEEK PARTY" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="hero-subtitle-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="hero.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Join us for the biggest sports celebration of the year!"
                          rows={2}
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="hero-description-input" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hero.ctaText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Button Text</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Reserve Your Table" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="hero-cta-text-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hero.ctaLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Button Link</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="/reserve" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="hero-cta-link-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Background Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Background Image</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      data-testid="hero-background-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="upload-background-button"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    <span className="text-sm text-slate-400">
                      {fileInputRef.current?.files?.[0]?.name || form.watch("hero.backgroundImage") || "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Features
                </h3>
                <Button
                  type="button"
                  onClick={() => addFeature({ icon: "", title: "", description: "" })}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="add-feature-button"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              
              <div className="space-y-4">
                {featureFields.map((field, index) => (
                  <div key={field.id} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white text-sm font-medium">Feature {index + 1}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                        data-testid={`remove-feature-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name={`features.${index}.icon`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Icon</FormLabel>
                            <FormControl>
                              <EmojiPicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="🍻"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`features.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="DRINK SPECIALS" 
                                className="bg-slate-600 border-slate-500 text-white"
                                data-testid={`feature-title-${index}`} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`features.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Description</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="$3 beers & $8 cocktails" 
                                className="bg-slate-600 border-slate-500 text-white"
                                data-testid={`feature-description-${index}`} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offer Section */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Special Offer
              </h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="specialOffer.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                      <FormLabel className="text-white text-sm">Enable Special Offer</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="special-offer-enabled-switch"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="specialOffer.badge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Badge</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="⭐" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="special-offer-badge-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialOffer.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="SPECIAL EVENT" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="special-offer-title-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialOffer.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Description</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Join us for the biggest game!" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="special-offer-description-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}