import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Users, Phone, Info } from "lucide-react";
import { insertReservationSchema, type InsertReservation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Reserve() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      partySize: "",
      datetime: "",
      notes: "",
      isGroupEvent: false
    }
  });

  const createReservation = useMutation({
    mutationFn: async (data: InsertReservation) => {
      // Convert date and time to datetime string
      const [date, time] = data.datetime.split(' ');
      const datetimeString = `${date}T${time}:00.000Z`;
      
      const reservationData = {
        ...data,
        datetime: datetimeString
      };

      const response = await apiRequest('POST', '/api/reservations', reservationData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      toast({
        title: "Reservation Confirmed!",
        description: "We'll contact you shortly to confirm your booking details."
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Reservation Failed",
        description: error.message.includes('429') 
          ? "Too many reservation attempts. Please try again later."
          : "Unable to process your reservation. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertReservation) => {
    createReservation.mutate(data);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-brand-gray py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-anton text-4xl sm:text-5xl text-brand-navy mb-4">RESERVE YOUR TABLE</h1>
          <p className="text-xl text-gray-600">Book your spot for the big game</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Form Side */}
            <div className="p-8 lg:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-brand-navy">Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Your name"
                              className="border-gray-300 focus:ring-brand-gold focus:border-transparent"
                              data-testid="input-name"
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
                          <FormLabel className="text-sm font-semibold text-brand-navy">Email *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              placeholder="your@email.com"
                              className="border-gray-300 focus:ring-brand-gold focus:border-transparent"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-brand-navy">Phone Number *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel"
                              placeholder="(555) 123-4567"
                              className="border-gray-300 focus:ring-brand-gold focus:border-transparent"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="partySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-brand-navy">Party Size *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-brand-gold focus:border-transparent" data-testid="select-party-size">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 person</SelectItem>
                              <SelectItem value="2">2 people</SelectItem>
                              <SelectItem value="3">3 people</SelectItem>
                              <SelectItem value="4">4 people</SelectItem>
                              <SelectItem value="5">5 people</SelectItem>
                              <SelectItem value="6">6 people</SelectItem>
                              <SelectItem value="7">7 people</SelectItem>
                              <SelectItem value="8">8 people</SelectItem>
                              <SelectItem value="9+">9+ people</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="datetime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-brand-navy">Preferred Date *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date"
                              min={today}
                              onChange={(e) => {
                                const date = e.target.value;
                                const currentTime = field.value.split(' ')[1] || '18:00';
                                field.onChange(`${date} ${currentTime}`);
                              }}
                              value={field.value.split(' ')[0] || ''}
                              className="border-gray-300 focus:ring-brand-gold focus:border-transparent"
                              data-testid="input-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="datetime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-brand-navy">Preferred Time *</FormLabel>
                          <Select 
                            onValueChange={(time) => {
                              const date = field.value.split(' ')[0] || today;
                              field.onChange(`${date} ${time}`);
                            }} 
                            defaultValue={field.value.split(' ')[1] || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:ring-brand-gold focus:border-transparent" data-testid="select-time">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="11:30">11:30 AM</SelectItem>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="12:30">12:30 PM</SelectItem>
                              <SelectItem value="13:00">1:00 PM</SelectItem>
                              <SelectItem value="13:30">1:30 PM</SelectItem>
                              <SelectItem value="14:00">2:00 PM</SelectItem>
                              <SelectItem value="14:30">2:30 PM</SelectItem>
                              <SelectItem value="15:00">3:00 PM</SelectItem>
                              <SelectItem value="15:30">3:30 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                              <SelectItem value="16:30">4:30 PM</SelectItem>
                              <SelectItem value="17:00">5:00 PM</SelectItem>
                              <SelectItem value="17:30">5:30 PM</SelectItem>
                              <SelectItem value="18:00">6:00 PM</SelectItem>
                              <SelectItem value="18:30">6:30 PM</SelectItem>
                              <SelectItem value="19:00">7:00 PM</SelectItem>
                              <SelectItem value="19:30">7:30 PM</SelectItem>
                              <SelectItem value="20:00">8:00 PM</SelectItem>
                              <SelectItem value="20:30">8:30 PM</SelectItem>
                              <SelectItem value="21:00">9:00 PM</SelectItem>
                              <SelectItem value="21:30">9:30 PM</SelectItem>
                              <SelectItem value="22:00">10:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="isGroupEvent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-group-event"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-semibold text-brand-navy">
                            This is a group event (10+ people)
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-brand-navy">Special Requests</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Any special requests or dietary restrictions..."
                            className="border-gray-300 focus:ring-brand-gold focus:border-transparent"
                            rows={4}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-gold text-brand-navy py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
                    disabled={createReservation.isPending}
                    data-testid="submit-reservation"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {createReservation.isPending ? 'Processing...' : 'Reserve Table'}
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* Info Side */}
            <div className="bg-brand-navy p-8 lg:p-12 text-white">
              <h3 className="font-anton text-2xl mb-6">RESERVATION INFO</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-brand-gold text-xl mr-4 mt-1">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reservation Hours</h4>
                    <p className="text-gray-300">
                      Monday - Thursday: 11:00 AM - 11:00 PM<br />
                      Friday - Saturday: 11:00 AM - 1:00 AM<br />
                      Sunday: 11:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-brand-gold text-xl mr-4 mt-1">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Group Events</h4>
                    <p className="text-gray-300">
                      Planning a party for 10+ people? Check the group event box and we'll contact you to discuss special arrangements and pricing.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-brand-gold text-xl mr-4 mt-1">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Need Help?</h4>
                    <p className="text-gray-300">
                      Call us at <a href="tel:+15555767872" className="text-brand-gold hover:text-yellow-400">(555) SPORT-BAR</a> for immediate assistance or special requests.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-brand-gold text-xl mr-4 mt-1">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Game Day Reservations</h4>
                    <p className="text-gray-300">
                      Big game coming up? Reserve early! Tables fill up fast during playoff season and major sporting events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
