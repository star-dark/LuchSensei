"use client";

import { useState } from "react";
import type { RecommendLunchOutput } from "@/ai/flows/recommend-lunch";
import { LunchForm } from "@/components/lunch-form";
import { RecommendationCarousel } from "@/components/recommendation-carousel";
import { UtensilsCrossed, Loader2 } from "lucide-react";

export default function Home() {
  const [recommendations, setRecommendations] = useState<RecommendLunchOutput[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNewRecommendation = (recommendation: RecommendLunchOutput) => {
    setRecommendations((prev) => [recommendation, ...prev]);
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center gap-12 min-h-screen">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
          <UtensilsCrossed className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
          LunchSensei
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          오늘 뭐 먹지? AI가 당신의 완벽한 점심을 찾아드립니다.
        </p>
      </header>

      <LunchForm
        onNewRecommendation={handleNewRecommendation}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />

      {isProcessing && recommendations.length === 0 && (
        <div className="text-center p-8 space-y-3 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
            <p className="font-semibold">Analyzing your tastes...</p>
            <p className="text-sm text-muted-foreground/80">
                Our AI chef is cooking up the perfect recommendation!
            </p>
        </div>
      )}

      {recommendations.length > 0 && (
        <section className="w-full max-w-4xl pt-8">
          <h2 className="text-2xl font-headline font-bold text-center mb-6">
            Your Recommendations
          </h2>
          <RecommendationCarousel recommendations={recommendations} />
        </section>
      )}

      {!isProcessing && recommendations.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg mt-8 max-w-2xl w-full bg-card">
          <h3 className="text-lg font-semibold">Ready for a recommendation?</h3>
          <p className="text-muted-foreground">
            Fill out the form above and let LunchSensei work its magic.
          </p>
        </div>
      )}
    </main>
  );
}
