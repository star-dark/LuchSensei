import type { RecommendLunchOutput } from "@/ai/flows/recommend-lunch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RecommendationCard } from "./recommendation-card";

export function RecommendationCarousel({ recommendations }: { recommendations: RecommendLunchOutput[] }) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm md:max-w-md mx-auto"
    >
      <CarouselContent>
        {recommendations.map((rec, index) => (
          <CarouselItem key={index} className="md:basis-1/1">
            <div className="p-1">
              <RecommendationCard recommendation={rec} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:inline-flex" />
      <CarouselNext className="hidden sm:inline-flex" />
    </Carousel>
  );
}
