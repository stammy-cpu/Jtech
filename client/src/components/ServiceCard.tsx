import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  href: string;
  accentColor?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
  href,
  accentColor = "border-primary"
}: ServiceCardProps) {
  return (
    <Card className={`hover-elevate border-l-4 ${accentColor} h-full flex flex-col`} data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="space-y-4">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2" data-testid={`text-service-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>{title}</h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-service-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>{description}</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm" data-testid={`text-service-feature-${index}`}>
              <span className="text-primary mt-0.5">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full" data-testid={`button-service-start-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            Get Started
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
