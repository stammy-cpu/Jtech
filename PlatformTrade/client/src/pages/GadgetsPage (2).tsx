import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import GadgetProductCard from "@/components/GadgetProductCard";
import GadgetTradeInForm from "@/components/GadgetTradeInForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Loader2 } from "lucide-react";
import phoneImage from "@assets/generated_images/smartphone_product_image.png";
import laptopImage from "@assets/generated_images/laptop_product_image.png";
import consoleImage from "@assets/generated_images/gaming_console_image.png";
import { useToast } from "@/hooks/use-toast";

interface Gadget {
  id: string;
  name: string;
  price: number;
  condition: string;
  description?: string;
  specs: string[];
  imageUrl: string;
  available: boolean;
  createdAt: string;
}

const getPlaceholderImage = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('phone') || lowerName.includes('iphone') || lowerName.includes('samsung') || lowerName.includes('galaxy')) {
    return phoneImage;
  } else if (lowerName.includes('laptop') || lowerName.includes('macbook') || lowerName.includes('dell') || lowerName.includes('hp')) {
    return laptopImage;
  } else if (lowerName.includes('console') || lowerName.includes('ps5') || lowerName.includes('xbox') || lowerName.includes('playstation')) {
    return consoleImage;
  }
  return phoneImage;
};

export default function GadgetsPage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: gadgets = [], isLoading } = useQuery<Gadget[]>({
    queryKey: ["/api/gadgets"],
  });

  const handleGadgetClick = (gadgetId: string) => {
    navigate(`/gadgets/${gadgetId}`);
  };

  const handleBuyClick = (gadgetName: string) => {
    console.log(`Buy ${gadgetName}`);
    toast({
      title: "Purchase Request",
      description: `We'll contact you shortly about ${gadgetName}. Check your WhatsApp!`,
    });
  };

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-md bg-chart-3/10 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-chart-3" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-gadgets-title">
            Gadgets Marketplace
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-gadgets-subtitle">
            Buy quality electronics or trade in your devices for cash
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2" data-testid="tabs-gadgets">
            <TabsTrigger value="browse" data-testid="tab-browse-gadgets">Browse Gadgets</TabsTrigger>
            <TabsTrigger value="trade-in" data-testid="tab-tradein-gadgets">Trade In</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : gadgets.length === 0 ? (
              <div className="text-center py-20">
                <Smartphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-lg mb-2">No Gadgets Available</h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon for new arrivals, or contact us for specific items
                </p>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                  <Button data-testid="button-request-gadget">
                    Request a Gadget
                  </Button>
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gadgets.filter(g => g.available).map((gadget) => (
                    <div
                      key={gadget.id}
                      onClick={() => handleGadgetClick(gadget.id)}
                      className="cursor-pointer"
                      data-testid={`button-gadget-${gadget.id}`}
                    >
                      <GadgetProductCard
                        image={gadget.imageUrl || getPlaceholderImage(gadget.name)}
                        name={gadget.name}
                        price={`₦${gadget.price.toLocaleString()}`}
                        condition={gadget.condition}
                        specs={gadget.specs || []}
                        onBuyClick={(e) => {
                          e.stopPropagation();
                          handleBuyClick(gadget.name);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-muted rounded-lg text-center">
                  <h3 className="font-semibold mb-2">Can't find what you're looking for?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact us on WhatsApp and we'll help you find the perfect device
                  </p>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                    <Button data-testid="button-request-gadget" asChild>
                      <span>Request a Gadget</span>
                    </Button>
                  </a>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="trade-in">
            <GadgetTradeInForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
