import type { RecommendLunchOutput } from "@/ai/flows/recommend-lunch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, MapPin, Phone, Clock, FileText, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";

export function RecommendationCard({ recommendation }: { recommendation: RecommendLunchOutput }) {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{recommendation.restaurantName}</CardTitle>
                <CardDescription className="pt-1">{recommendation.menuItem}</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">{recommendation.cuisine}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 text-sm">
        <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-md">
          <FileText className="w-5 h-5 mt-1 text-primary shrink-0" />
          <div>
            <h4 className="font-semibold font-headline">Sensei's Reasoning</h4>
            <p className="text-muted-foreground">{recommendation.reasoning}</p>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-muted-foreground shrink-0" /> <span>{recommendation.address}</span></p>
          <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-muted-foreground shrink-0" /> <span>{recommendation.contactNumber}</span></p>
          <p className="flex items-center gap-3"><Clock className="w-4 h-4 text-muted-foreground shrink-0" /> <span>{recommendation.operationHour}</span></p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-3">
        <Button asChild className="w-full">
          <a href={recommendation.naverMapLink} target="_blank" rel="noopener noreferrer">
            View on Naver Map
            <ExternalLink className="ml-2 w-4 h-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
