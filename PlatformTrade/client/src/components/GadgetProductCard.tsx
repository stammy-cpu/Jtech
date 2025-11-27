import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface GadgetProductCardProps {
  image: string;
  name: string;
  price: string | number;
  condition: string;
  specs: string[];
  onBuyClick: (e: React.MouseEvent) => void;
}

export default function GadgetProductCard({
  image,
  name,
  price,
  condition,
  specs,
  onBuyClick
}: GadgetProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate h-full flex flex-col" data-testid={`card-product-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2" data-testid={`badge-condition-${condition.toLowerCase()}`}>
          {condition}
        </Badge>
      </div>

      <CardContent className="flex-1 p-4 space-y-2">
        <h3 className="text-lg font-semibold" data-testid={`text-product-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>{name}</h3>
        <p className="text-2xl font-bold text-green-600" data-testid={`text-product-price-${name.toLowerCase().replace(/\s+/g, '-')}`}>{typeof price === 'number' ? `$${price.toLocaleString()}` : price}</p>
        <ul className="space-y-1">
          {specs.map((spec, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2" data-testid={`text-product-spec-${index}`}>
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              {spec}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={onBuyClick} className="w-full" data-testid={`button-buy-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
