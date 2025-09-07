import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Calendar, Megaphone, Clock, Plus, Trash2, Timer, Star } from "lucide-react";
import EmojiPicker from "@/components/ui/EmojiPicker";
import React, { useState } from "react";
import { promotionsSchema, type Promotions } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AdminPromotionsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promotions, isLoading } = useQuery<Promotions>({
    queryKey: ['/api/promotions']
  });

  const form = useForm<Promotions>({
    resolver: zodResolver(promotionsSchema),
    defaultValues: {
      sideBanner: {
        enabled: false,
        start: null,
        end: null,
        message: "",
        link: "",
        placement: "right"
      },
      happyHour: {
        enabled: true,
        title: "WEEKDAY SPECIALS",
        subtitle: "HAPPY HOUR",
        description: "Monday through Friday, 3PM - 6PM. Half-price appetizers, $2 off craft beers, and $5 select cocktails.",
        days: "Monday through Friday",
        timeRange: "3PM - 6PM",
        offers: [
          {
            icon: "🍽️",
            title: "50% OFF",
            description: "All Appetizers",
            discount: "50%"
          },
          {
            icon: "🍺",
            title: "$2 OFF",
            description: "Craft Beers",
            discount: "$2"
          },
          {
            icon: "🍸",
            title: "$5",
            description: "Select Cocktails",
            discount: "$5"
          }
        ]
      }
    }
  });

  // Update form when promotions load
  React.useEffect(() => {
    if (promotions) {
      form.reset(promotions);
    }
  }, [promotions, form]);

  const updatePromotions = useMutation({
    mutationFn: async (data: Promotions) => {
      const response = await apiRequest('PUT', '/api/promotions', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotions'] });
      toast({
        title: "Promotions Updated",
        description: "Your promotional settings have been saved successfully."
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

  const onSubmit = (data: Promotions) => {
    updatePromotions.mutate(data);
  };

  const isSideBannerActive = () => {
    if (!promotions?.sideBanner.enabled) return false;
    
    const now = new Date().toISOString();
    const start = promotions.sideBanner.start;
    const end = promotions.sideBanner.end;
    
    const afterStart = !start || now >= start;
    const beforeEnd = !end || now <= end;
    
    return afterStart && beforeEnd;
  };

  const addOffer = () => {
    const currentOffers = form.getValues("happyHour.offers");
    form.setValue("happyHour.offers", [...currentOffers, {
      icon: "🎯",
      title: "NEW OFFER",
      description: "Description",
      discount: "10%"
    }]);
  };

  const removeOffer = (index: number) => {
    const currentOffers = form.getValues("happyHour.offers");
    form.setValue("happyHour.offers", currentOffers.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading promotions...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Promotions Manager</h1>
              <p className="text-slate-300 mt-1">Manage happy hour specials and promotional banners</p>
            </div>
            <Button 
              type="submit" 
              form="promotions-form"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={updatePromotions.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updatePromotions.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Happy Hour
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {promotions?.happyHour.enabled 
                    ? `${promotions.happyHour.days}, ${promotions.happyHour.timeRange}`
                    : "Happy hour specials are disabled"
                  }
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                promotions?.happyHour.enabled 
                  ? "bg-green-600 text-white" 
                  : "bg-slate-600 text-slate-300"
              }`}>
                {promotions?.happyHour.enabled ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  Side Banner
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  {promotions?.sideBanner.enabled 
                    ? `Banner on ${promotions.sideBanner.placement} side`
                    : "Side banner is disabled"
                  }
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isSideBannerActive() 
                  ? "bg-green-600 text-white" 
                  : "bg-slate-600 text-slate-300"
              }`}>
                {isSideBannerActive() ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form id="promotions-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Happy Hour Settings */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Happy Hour Specials
              </h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="happyHour.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                      <FormLabel className="text-white text-sm">Enable Happy Hour</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="happyhour-enabled-switch"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="happyHour.subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Badge Text</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="HAPPY HOUR"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="happyhour-subtitle-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="happyHour.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Main Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="WEEKDAY SPECIALS"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="happyhour-title-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="happyHour.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Monday through Friday, 3PM - 6PM. Half-price appetizers, $2 off craft beers, and $5 select cocktails."
                          rows={3}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          data-testid="happyhour-description-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="happyHour.days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Days</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Monday through Friday"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="happyhour-days-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="happyHour.timeRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm flex items-center gap-2">
                          <Timer className="w-4 h-4" />
                          Time Range
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="3PM - 6PM"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="happyhour-time-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Special Offers */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Special Offers
                    </h4>
                    <Button
                      type="button"
                      onClick={addOffer}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                      data-testid="add-offer-button"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Offer
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {form.watch("happyHour.offers").map((offer, index) => (
                      <div key={index} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white text-sm font-medium">Offer {index + 1}</span>
                          <Button
                            type="button"
                            onClick={() => removeOffer(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                            data-testid={`remove-offer-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <FormField
                            control={form.control}
                            name={`happyHour.offers.${index}.icon`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm">Icon</FormLabel>
                                <FormControl>
                                  <EmojiPicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="🍽️"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`happyHour.offers.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm">Title</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="50% OFF" 
                                    className="bg-slate-600 border-slate-500 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`happyHour.offers.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm">Description</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="All Appetizers" 
                                    className="bg-slate-600 border-slate-500 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`happyHour.offers.${index}.discount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white text-sm">Discount</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    placeholder="50%" 
                                    className="bg-slate-600 border-slate-500 text-white"
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
              </div>
            </div>

            {/* Side Banner Settings */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Side Banner
              </h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="sideBanner.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between bg-slate-700 rounded p-3">
                      <FormLabel className="text-white text-sm">Enable Side Banner</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="banner-enabled-switch"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sideBanner.message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Banner Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="NFL Kickoff Week! Reserve your table."
                          rows={2}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          data-testid="banner-message-input"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sideBanner.link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Banner Link</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="/reserve"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="banner-link-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sideBanner.placement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Placement</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                              <SelectValue placeholder="Select placement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="left">Left Side</SelectItem>
                            <SelectItem value="right">Right Side</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sideBanner.start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Start Date (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="datetime-local"
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="banner-start-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sideBanner.end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="datetime-local"
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="banner-end-input"
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