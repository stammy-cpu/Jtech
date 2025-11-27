import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Adebayo Olamide",
    role: "Crypto Trader",
    image: "AO",
    rating: 5,
    text: "JTECH Trading World has been my go-to platform for crypto trading. Fast, reliable, and the rates are always competitive. I've never had any issues with withdrawals!",
  },
  {
    name: "Chioma Nwosu",
    role: "Gift Card Seller",
    image: "CN",
    rating: 5,
    text: "Best platform for selling gift cards in Nigeria! The process is smooth, payments are instant, and customer support is top-notch. Highly recommended!",
  },
  {
    name: "Ibrahim Hassan",
    role: "Gadget Seller",
    image: "IH",
    rating: 5,
    text: "Sold my old iPhone here and got a great price. The entire process from listing to payment took less than 24 hours. Very professional service!",
  },
  {
    name: "Funmilayo Adeleke",
    role: "Regular Trader",
    image: "FA",
    rating: 5,
    text: "I've been trading here for over 6 months. The exchange rates are fair, transactions are secure, and I've never had a single problem. JTECH is trustworthy!",
  },
  {
    name: "David Okoro",
    role: "Bitcoin Trader",
    image: "DO",
    rating: 5,
    text: "Amazing platform for Bitcoin trading! Quick verification, instant payments, and excellent customer service. I've recommended it to all my friends.",
  },
];

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-testimonials-subtitle">
            Join thousands of satisfied traders across Nigeria
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <Card className="border-primary/20 overflow-hidden" data-testid="card-testimonial">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col items-center text-center">
                    <Quote className="w-12 h-12 text-primary/30 mb-6" />
                    
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" data-testid={`star-${i}`} />
                      ))}
                    </div>

                    <p className="text-lg md:text-xl text-foreground mb-8 max-w-3xl leading-relaxed" data-testid="text-testimonial-content">
                      "{testimonials[currentIndex].text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <span className="text-lg font-bold text-white" data-testid="text-testimonial-initials">
                          {testimonials[currentIndex].image}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg" data-testid="text-testimonial-name">
                          {testimonials[currentIndex].name}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid="text-testimonial-role">
                          {testimonials[currentIndex].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border"
            data-testid="button-testimonial-prev"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border"
            data-testid="button-testimonial-next"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
              }`}
              data-testid={`button-testimonial-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
