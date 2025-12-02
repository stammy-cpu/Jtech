import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import GadgetProductCard from "@/components/GadgetProductCard";
import GadgetTradeInForm from "@/components/GadgetTradeInForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { featuredGadgets } from "@/data/featuredGadgets";

interface Gadget {
  id: string;
  name: string;
  price: number;
  condition: string;
  description?: string;
  specs: string[];
  imageUrls?: string[];
  available: boolean;
  createdAt: string;
}

export default function GadgetsPage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: apiGadgets = [], isLoading } = useQuery<Gadget[]>({
    queryKey: ["/api/gadgets"],
  });

  const gadgets = apiGadgets.length > 0 ? apiGadgets : featuredGadgets;

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
    <div className="min-h-screen py-8 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-md bg-chart-3/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-chart-3" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4" data-testid="text-gadgets-title">
            Gadgets Marketplace
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4" data-testid="text-gadgets-subtitle">
            Buy quality electronics or trade in your devices for cash
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2" data-testid="tabs-gadgets">
            <TabsTrigger value="browse" className="text-xs md:text-sm" data-testid="tab-browse-gadgets">Browse Gadgets</TabsTrigger>
            <TabsTrigger value="trade-in" className="text-xs md:text-sm" data-testid="tab-tradein-gadgets">Trade In</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 md:py-20">
                <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-primary" />
              </div>
            ) : gadgets.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <Smartphone className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold text-base md:text-lg mb-2">No Gadgets Available</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 px-4">
                  Check back soon for new arrivals, or contact us for specific items
                </p>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                  <Button size="default" className="text-sm md:text-base" data-testid="button-request-gadget">
                    Request a Gadget
                  </Button>
                </a>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {gadgets.filter(g => g.available).map((gadget) => (
                    <div
                      key={gadget.id}
                      onClick={() => handleGadgetClick(gadget.id)}
                      className="cursor-pointer"
                      data-testid={`button-gadget-${gadget.id}`}
                    >
                      <GadgetProductCard
                        image={gadget.imageUrls?.[0] || "/uploads/placeholder.jpg"}
                        name={gadget.name}
                        price={`₦${gadget.price.toLocaleString()}`}
                        condition={gadget.condition}
                        specs={gadget.specs?.slice(0, 3) || []}
                        onBuyClick={(e) => {
                          e.stopPropagation();
                          handleBuyClick(gadget.name);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 md:mt-12 p-4 md:p-6 bg-muted rounded-lg text-center">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Can't find what you're looking for?</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                    Contact us on WhatsApp and we'll help you find the perfect device
                  </p>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                    <Button size="default" className="text-sm md:text-base" data-testid="button-request-gadget" asChild>
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
