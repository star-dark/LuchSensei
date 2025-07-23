"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getLunchRecommendation } from "@/app/actions";
import type { RecommendLunchOutput } from "@/ai/flows/recommend-lunch";
import { Loader2 } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  tastePreference: z.string().min(2, {
    message: "Tell us what you're craving!",
  }),
  recentMeals: z.string().min(2, {
    message: "What have you eaten lately? (e.g., pizza, pasta)",
  }),
  restaurantRatings: z.string().min(10, {
    message: "Paste some info about nearby places.",
  }),
  userLocation: z.string().min(2, {
    message: "Where are you right now?",
  }),
});

interface LunchFormProps {
  onNewRecommendation: (recommendation: RecommendLunchOutput) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

export function LunchForm({ onNewRecommendation, isProcessing, setIsProcessing }: LunchFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tastePreference: "spicy and savory",
      recentMeals: "Kimchi Jjigae",
      restaurantRatings:
        "Gopchang Story - 4.7 stars, very popular for grilled intestines. Kyochon Chicken - 4.5 stars, famous for soy garlic fried chicken. Bonjuk - 4.3 stars, specializes in rice porridge.",
      userLocation: "Gangnam, Seoul",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);
    const { data, error } = await getLunchRecommendation(values);
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
      });
    } else if (data) {
      onNewRecommendation(data);
      // Cleverly add the new recommendation to the history for the next search
      form.setValue("recentMeals", values.recentMeals + ", " + data.menuItem);
      form.setValue("tastePreference", "");
    }
    setIsProcessing(false);
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Find Your Perfect Lunch</CardTitle>
        <CardDescription>Fill in your preferences and let our AI do the rest.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tastePreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taste Preference</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., spicy, savory, something light" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Myeongdong, Seoul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="recentMeals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recent Meals</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pasta, Sandwich, Bibimbap" {...field} />
                    </FormControl>
                    <FormDescription>Help us avoid repeats! List things you've eaten recently.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="restaurantRatings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nearby Restaurant Info</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste some info about nearby restaurants..."
                      {...field}
                      className="h-24"
                    />
                  </FormControl>
                  <FormDescription>
                    For best results, paste info about local spots (e.g., from a map app).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isProcessing} className="w-full !mt-8" size="lg">
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isProcessing ? "Thinking..." : "Find My Lunch!"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
