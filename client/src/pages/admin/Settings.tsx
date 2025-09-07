import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Plus, Trash2, Upload, Building, Clock, Users, Globe } from "lucide-react";
import { siteSettingsSchema, type SiteSettings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import React from "react";

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newHourDay, setNewHourDay] = useState("");
  const [newHourOpen, setNewHourOpen] = useState("");
  const [newHourClose, setNewHourClose] = useState("");

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ['/api/settings']
  });

  const form = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      name: "",
      logoText: "",
      address: "",
      phone: "",
      email: "",
      hours: [],
      socials: {},
      hero: {
        backgroundImage: "",
        title: "",
        subtitle: ""
      },
      footer: {
        description: "",
        links: [],
        copyright: ""
      }
    }
  });

  // Update form when settings load
  React.useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const updateSettings = useMutation({
    mutationFn: async (data: SiteSettings) => {
      const response = await apiRequest('PUT', '/api/settings', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings Updated",
        description: "Your site settings have been saved successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SiteSettings) => {
    updateSettings.mutate(data);
  };

  const addHour = () => {
    if (newHourDay && newHourOpen && newHourClose) {
      const currentHours = form.getValues("hours") || [];
      form.setValue("hours", [
        ...currentHours,
        { day: newHourDay, open: newHourOpen, close: newHourClose }
      ]);
      setNewHourDay("");
      setNewHourOpen("");
      setNewHourClose("");
    }
  };

  const removeHour = (index: number) => {
    const currentHours = form.getValues("hours") || [];
    form.setValue("hours", currentHours.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-slate-300 mt-1">Manage your restaurant's basic information and configuration</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Basic Information */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Restaurant Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Supanos Sports Bar" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-name" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logoText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Logo Text</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="SUPANO'S" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-logo-text" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="(555) SPORT-BAR" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-phone" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="info@suponos.com" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-email" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="123 Stadium Drive, Downtown, State 12345" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-address" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Operating Hours
              </h3>
              
              {/* Current Hours */}
              <div className="space-y-3 mb-4">
                {form.watch("hours")?.map((hour, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-slate-700 rounded-lg" data-testid={`hour-row-${index}`}>
                    <span className="font-medium min-w-[150px] text-white">{hour.day}</span>
                    <span className="text-slate-300">{hour.open} - {hour.close}</span>
                    <button
                      type="button"
                      onClick={() => removeHour(index)}
                      className="text-red-400 hover:text-red-300 ml-auto"
                      data-testid={`remove-hour-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Hour */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Day(s)</label>
                  <Input
                    value={newHourDay}
                    onChange={(e) => setNewHourDay(e.target.value)}
                    placeholder="Monday - Friday"
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="input-new-hour-day"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Open Time</label>
                  <Input
                    value={newHourOpen}
                    onChange={(e) => setNewHourOpen(e.target.value)}
                    placeholder="11:00 AM"
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="input-new-hour-open"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Close Time</label>
                  <Input
                    value={newHourClose}
                    onChange={(e) => setNewHourClose(e.target.value)}
                    placeholder="11:00 PM"
                    className="bg-slate-700 border-slate-600 text-white"
                    data-testid="input-new-hour-close"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addHour}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="add-hour-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social Media
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="socials.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Facebook URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://facebook.com/suponos" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-facebook" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socials.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Instagram URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://instagram.com/suponos" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-instagram" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socials.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Twitter URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://twitter.com/suponos" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-twitter" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="socials.yelp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Yelp URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://yelp.com/biz/suponos" 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-yelp" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Hero Settings */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Hero Section
              </h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hero.backgroundImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Background Image</FormLabel>
                      <div className="space-y-3">
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg or upload file" 
                            {...field} 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="input-hero-background" 
                          />
                        </FormControl>
                        
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('hero-image-upload')?.click()}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </Button>
                          <input
                            id="hero-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  // Get upload URL
                                  const uploadResponse = await fetch('/api/objects/upload', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' }
                                  });
                                  const { uploadURL } = await uploadResponse.json();
                                  
                                  // Upload file
                                  await fetch(uploadURL, {
                                    method: 'PUT',
                                    body: file,
                                    headers: { 'Content-Type': file.type }
                                  });
                                  
                                  // Update form with the uploaded image path
                                  const objectPath = `/objects/uploads/${uploadURL.split('/uploads/')[1].split('?')[0]}`;
                                  form.setValue('hero.backgroundImage', objectPath);
                                } catch (error) {
                                  console.error('Upload failed:', error);
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hero.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Hero Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="TONIGHT'S GAMES AT SUPANO'S" 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-hero-title" 
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
                      <FormLabel className="text-white text-sm">Hero Subtitle</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[60px] w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          placeholder="Experience every touchdown, every goal, every victory..."
                          {...field}
                          data-testid="input-hero-subtitle"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('hero.backgroundImage') && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Preview</label>
                    <div className="relative h-32 rounded-lg overflow-hidden border border-slate-600">
                      <img 
                        src={form.watch('hero.backgroundImage')} 
                        alt="Hero background preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-600 flex items-center justify-center text-slate-400 hidden">
                        Invalid image URL
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Footer Settings</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="footer.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Footer Description</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          placeholder="Enter footer description"
                          {...field}
                          data-testid="input-footer-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white">Footer Links</label>
                  {form.watch('footer.links')?.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`footer.links.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Link title" 
                                {...field} 
                                className="bg-slate-700 border-slate-600 text-white"
                                data-testid={`input-footer-link-title-${index}`} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`footer.links.${index}.url`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input 
                                placeholder="Link URL" 
                                {...field} 
                                className="bg-slate-700 border-slate-600 text-white"
                                data-testid={`input-footer-link-url-${index}`} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const currentLinks = form.getValues('footer.links') || [];
                          form.setValue('footer.links', currentLinks.filter((_, i) => i !== index));
                        }}
                        className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                        data-testid={`button-remove-footer-link-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const currentLinks = form.getValues('footer.links') || [];
                      form.setValue('footer.links', [...currentLinks, { title: '', url: '' }]);
                    }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    data-testid="button-add-footer-link"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="footer.copyright"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Copyright Text</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="© 2025 Your Business. All rights reserved." 
                          {...field} 
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="input-footer-copyright" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 px-8"
                disabled={updateSettings.isPending}
                data-testid="save-settings-button"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}