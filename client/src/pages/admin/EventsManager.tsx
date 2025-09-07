import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit, Trash2, Save, X, Calendar, Upload, Clock, Tag } from "lucide-react";
import { insertEventSchema, type Event, type InsertEvent } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Badge from "@/components/Badge";

export default function AdminEventsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/events']
  });

  const eventForm = useForm<InsertEvent & { tags?: string }>({
    resolver: zodResolver(insertEventSchema.extend({
      tags: insertEventSchema.shape.tags.optional()
    })),
    defaultValues: {
      title: "",
      slug: "",
      start: "",
      end: "",
      description: "",
      tags: ""
    }
  });

  const createEvent = useMutation({
    mutationFn: async (data: InsertEvent & { tags?: string }) => {
      const formData = new FormData();
      
      const eventData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      
      formData.append('data', JSON.stringify(eventData));
      
      // Add image file if selected
      if (fileInputRef.current?.files?.[0]) {
        formData.append('image', fileInputRef.current.files[0]);
      }
      
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: "Event created successfully" });
      eventForm.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowEventForm(false);
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create event", description: error.message, variant: "destructive" });
    }
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/events/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({ title: "Event deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete event", description: error.message, variant: "destructive" });
    }
  });

  const onEventSubmit = (data: InsertEvent & { tags?: string }) => {
    createEvent.mutate(data);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    eventForm.setValue('title', title);
    if (!eventForm.getValues('slug')) {
      eventForm.setValue('slug', generateSlug(title));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Events Manager</h1>
              <p className="text-slate-300 mt-1">Create and manage events for your sports bar</p>
            </div>
            {!showEventForm && (
              <Button
                onClick={() => setShowEventForm(true)}
                className="bg-green-600 hover:bg-green-700"
                data-testid="add-event-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            )}
          </div>
        </div>

        {/* Add Event Form */}
        {showEventForm && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Create New Event
            </h3>
            
            <Form {...eventForm}>
              <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">Event Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="NFL Playoff Party"
                            className="bg-slate-700 border-slate-600 text-white"
                            onChange={(e) => {
                              field.onChange(e);
                              handleTitleChange(e.target.value);
                            }}
                            data-testid="event-title-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">URL Slug</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="nfl-playoff-party" 
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="event-slug-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={eventForm.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Start Date & Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="datetime-local"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="event-start-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-sm">End Date & Time (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="datetime-local"
                            className="bg-slate-700 border-slate-600 text-white"
                            data-testid="event-end-input" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={eventForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm">Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Join us for the biggest game of the season..."
                          rows={3}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                          data-testid="event-description-input" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={eventForm.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags (comma-separated)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="playoff game, live music, trivia night"
                          className="bg-slate-700 border-slate-600 text-white"
                          data-testid="event-tags-input" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Event Image</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      data-testid="event-image-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="upload-event-image-button"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    <span className="text-sm text-slate-400">
                      {fileInputRef.current?.files?.[0]?.name || "No file chosen"}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={createEvent.isPending}
                    data-testid="save-event-button"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createEvent.isPending ? 'Creating...' : 'Create Event'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowEventForm(false);
                      eventForm.reset();
                    }}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    data-testid="cancel-event-button"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {/* Events List */}
        {!showEventForm && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Current Events</h3>
            
            {events?.length ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-slate-700 rounded-lg p-4" data-testid={`event-item-${event.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                          {event.tags?.map((tag, index) => (
                            <span key={index} className="bg-orange-600 text-white text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-300 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {event.end && ` - ${new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            </span>
                          </div>
                          <span className="text-slate-500">•</span>
                          <span>/{event.slug}</span>
                        </div>
                        
                        <p className="text-slate-400 mb-3">{event.description}</p>
                        
                        {event.image && (
                          <div className="mb-3">
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className="w-32 h-20 object-cover rounded-lg border border-slate-600"
                            />
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => deleteEvent.mutate(event.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white"
                        data-testid={`delete-event-${event.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-lg font-semibold mb-2">No Events Created</h3>
                <p>Start by creating your first event.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}