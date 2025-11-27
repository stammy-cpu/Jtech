import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { MessageCircle, Phone, ArrowLeft, Loader2, Smartphone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserMessageModal from "@/components/UserMessageModal";
import type { Gadget } from "@shared/schema";

export default function GadgetDetailPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const gadgetId = location.split("/")[2];

  const { data: gadget, isLoading, error} = useQuery<Gadget>({
    queryKey: ["/api/gadgets", gadgetId],
  });

  const handleImageError = (index: number) => {
    setImageLoadErrors(prev => new Set(prev).add(index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !gadget) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="text-error-title">Gadget not found</h1>
          <Link href="/gadgets">
            <Button data-testid="button-back-gadgets">Back to Gadgets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = `₦${gadget.price.toLocaleString()}`;

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate("/gadgets")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          data-testid="button-back-detail"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gadgets
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            {gadget.imageUrls && gadget.imageUrls.length > 0 ? (
              <Carousel className="w-full" data-testid="carousel-images">
                <CarouselContent>
                  {gadget.imageUrls.map((imageUrl, index) => (
                    <CarouselItem key={index}>
                      <Card className="overflow-hidden">
                        <div 
                          className="aspect-square bg-muted flex items-center justify-center cursor-pointer hover-elevate"
                          onClick={() => {
                            if (!imageLoadErrors.has(index) && imageUrl) {
                              setSelectedImageIndex(index);
                              setLightboxOpen(true);
                            }
                          }}
                        >
                          {imageLoadErrors.has(index) || !imageUrl ? (
                            <Smartphone className="w-24 h-24 text-muted-foreground/30" />
                          ) : (
                            <img
                              src={imageUrl}
                              alt={`${gadget.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              data-testid={`img-gadget-${index}`}
                              onError={() => handleImageError(index)}
                            />
                          )}
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {gadget.imageUrls.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" data-testid="button-prev-image" />
                    <CarouselNext className="right-4" data-testid="button-next-image" />
                  </>
                )}
              </Carousel>
            ) : (
              <Card className="overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Smartphone className="w-24 h-24 text-muted-foreground/30" />
                </div>
              </Card>
            )}

            {/* Image indicators */}
            {gadget.imageUrls && gadget.imageUrls.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {gadget.imageUrls.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-primary/30"
                    data-testid={`indicator-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2" data-testid="text-detail-name">{gadget.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary" data-testid="text-detail-condition">
                  {gadget.condition}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Price</p>
              <p className="text-4xl font-bold text-green-600" data-testid="text-detail-price">{formattedPrice}</p>
            </div>

            {gadget.specs && gadget.specs.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Key Specifications</h3>
                <ul className="space-y-2">
                  {gadget.specs.map((spec, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm" data-testid={`spec-${index}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {gadget.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground" data-testid="text-detail-description">{gadget.description}</p>
              </div>
            )}

            <div className="border-t pt-6 space-y-3">
              {user && !user.isAdmin ? (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    data-testid="button-contact-whatsapp"
                    onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact on WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    data-testid="button-open-chat-modal"
                    onClick={() => {
                      const floatingButton = document.querySelector('[data-testid="button-message-float"]') as HTMLButtonElement;
                      floatingButton?.click();
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Admin
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="w-full" data-testid="button-login-to-contact">
                    Login to Contact Seller
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {user && !user.isAdmin && <UserMessageModal />}

      {/* Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95">
          <DialogClose className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors" data-testid="button-close-lightbox">
            <X className="w-6 h-6 text-white" />
          </DialogClose>
          
          <div className="relative w-full h-[80vh] flex items-center justify-center">
            {gadget?.imageUrls && gadget.imageUrls.length > 0 && (
              <>
                <img
                  src={gadget.imageUrls[selectedImageIndex]}
                  alt={`${gadget.name} - Image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  data-testid="img-lightbox"
                />
                
                {gadget.imageUrls.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => setSelectedImageIndex((prev) => 
                        prev === 0 ? gadget.imageUrls.length - 1 : prev - 1
                      )}
                      data-testid="button-lightbox-prev"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => setSelectedImageIndex((prev) => 
                        prev === gadget.imageUrls.length - 1 ? 0 : prev + 1
                      )}
                      data-testid="button-lightbox-next"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full">
                      <p className="text-white text-sm" data-testid="text-lightbox-counter">
                        {selectedImageIndex + 1} / {gadget.imageUrls.length}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
