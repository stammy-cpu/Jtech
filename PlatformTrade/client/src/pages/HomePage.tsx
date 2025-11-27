import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/hero_workspace_background.png";
import { Shield, Clock, Users, Gift, Bitcoin, Smartphone, CheckCircle, ArrowRight, Sparkles, TrendingUp, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import ExchangeRates from "@/components/ExchangeRates";
import { useQuery } from "@tanstack/react-query";
import type { Gadget } from "@shared/schema";

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/75" />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ scale: 1, rotate: 0 }}
          whileInView={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 0],
          }}
          viewport={{ once: false }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/30 to-blue-500/30 rounded-full blur-3xl" 
        />
        <motion.div 
          initial={{ scale: 1, rotate: 0 }}
          whileInView={{ 
            scale: [1, 1.4, 1],
            rotate: [0, -180, 0],
          }}
          viewport={{ once: false }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-500/25 to-emerald-500/25 rounded-full blur-3xl" 
        />
        <motion.div 
          initial={{ y: 0, x: 0 }}
          whileInView={{ 
            y: [0, 100, 0],
            x: [0, -50, 0],
          }}
          viewport={{ once: false }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" 
        />
      </div>
      
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 py-24 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <motion.div
            animate={floatingAnimation}
            className="inline-block mb-6"
          >
            <div className="p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full backdrop-blur-sm inline-block">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </motion.div>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" 
          variants={itemVariants}
          data-testid="text-hero-title"
        >
          <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent block mb-2">
            Trade Smarter
          </span>
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Earn Faster
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed" 
          variants={itemVariants}
          data-testid="text-hero-subtitle"
        >
          Nigeria's most trusted platform for trading gift cards, cryptocurrency, and gadgets.
          <span className="block mt-2 text-primary font-semibold">
            Fast • Secure • Reliable
          </span>
        </motion.p>
        
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-12" variants={itemVariants}>
          <Link href="/gift-cards">
            <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary to-blue-600 border-blue-700" data-testid="button-hero-get-started" asChild>
              <span className="flex items-center gap-2">
                Start Trading Now
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </Link>
          <Link href="/gadgets">
            <Button size="lg" variant="outline" className="text-lg px-8 border-2 backdrop-blur-sm bg-background/50" data-testid="button-hero-browse-gadgets" asChild>
              <span>Browse Gadgets</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div className="flex flex-wrap gap-6 justify-center items-center" variants={itemVariants}>
          {[
            { icon: Users, text: "5,000+ Happy Traders", gradient: "from-blue-500 to-cyan-600" },
            { icon: Clock, text: "15 Min Response", gradient: "from-green-500 to-emerald-600" },
            { icon: Shield, text: "100% Secure Platform", gradient: "from-purple-500 to-pink-600" },
          ].map((badge, index) => (
            <motion.div
              key={badge.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              className="flex items-center gap-2 px-5 py-3 bg-background/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-lg"
              data-testid={`trust-indicator-${badge.text.toLowerCase().split(' ')[0]}`}
            >
              <div className={`p-2 rounded-full bg-gradient-to-br ${badge.gradient}`}>
                <badge.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, description, features, href, index, gradient }: any) {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: index * 0.15 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={itemVariants}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover-elevate border-primary/20 overflow-hidden group" data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        
        <div className="p-8 space-y-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-3" data-testid={`text-service-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </h3>
            <p className="text-muted-foreground leading-relaxed" data-testid={`text-service-desc-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {description}
            </p>
          </div>

          <ul className="space-y-3">
            {features.map((feature: string) => (
              <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Link href={href} className="block pt-2">
            <Button className="w-full" variant="outline" data-testid={`button-service-start-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              <span className="flex items-center justify-center gap-2">
                Start Trading
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

export default function HomePage() {
  const { data: featuredGadgets = [] } = useQuery<Gadget[]>({
    queryKey: ["/api/gadgets"],
    select: (data) => data
      .filter(g => g.available)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4),
  });

  const services = [
    {
      icon: Gift,
      title: "Gift Cards",
      description: "Trade your gift cards at premium rates with instant payment processing and unbeatable customer service.",
      features: ["iTunes & Amazon Cards", "Instant Payment", "Best Market Rates", "24/7 Support"],
      href: "/gift-cards",
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: Bitcoin,
      title: "Crypto Trading",
      description: "Buy and sell cryptocurrency with ease. Fast transactions, competitive rates, and complete security.",
      features: ["Bitcoin & Ethereum", "USDT Support", "Low Transaction Fees", "Instant Settlement"],
      href: "/crypto",
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: Smartphone,
      title: "Gadget Trading",
      description: "Sell your devices or buy quality pre-owned gadgets at fair prices with guaranteed authenticity.",
      features: ["iPhones & Laptops", "Quality Guaranteed", "Fair Valuations", "Quick Processing"],
      href: "/gadgets",
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      <Hero />

      {/* Services Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 to-muted/10 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-8 h-8 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold" data-testid="text-services-title">
                Our <span className="text-primary">Services</span>
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-services-subtitle">
              Choose from our range of trading options designed to give you the best value
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                href={service.href}
                gradient={service.gradient}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Exchange Rates */}
      <ExchangeRates />

      {/* Featured Gadgets */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-7 h-7 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-featured-title">
                  Featured <span className="text-primary">Gadgets</span>
                </h2>
              </div>
              <p className="text-lg text-muted-foreground" data-testid="text-featured-subtitle">
                Premium devices at unbeatable prices
              </p>
            </div>
            <Link href="/gadgets">
              <Button variant="outline" size="lg" className="border-2" data-testid="button-view-all-gadgets" asChild>
                <span className="flex items-center gap-2">
                  View All Gadgets
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredGadgets.length > 0 ? (
              featuredGadgets.map((gadget, index) => (
                <motion.div
                  key={gadget.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, delay: index * 0.1 },
                    },
                  }}
                >
                  <Link href={`/gadgets/${gadget.id}`}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="h-full cursor-pointer"
                    >
                      <Card className="hover-elevate h-full flex flex-col overflow-hidden group border-primary/20" data-testid={`card-gadget-${gadget.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="relative h-56 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                          <img 
                            src={gadget.imageUrls[0]} 
                            alt={gadget.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-lg">
                              Available
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="font-bold text-xl mb-2" data-testid={`text-gadget-name-${gadget.name.toLowerCase().replace(/\s+/g, '-')}`}>
                              {gadget.name}
                            </p>
                            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white" data-testid={`text-gadget-condition-${gadget.name.toLowerCase().replace(/\s+/g, '-')}`}>
                              {gadget.condition}
                            </span>
                          </div>
                          <div className="pt-4 border-t border-border/50">
                            <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" data-testid={`text-gadget-price-${gadget.name.toLowerCase().replace(/\s+/g, '-')}`}>
                              ₦{gadget.price.toLocaleString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Smartphone className="w-20 h-20 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg text-muted-foreground">No featured gadgets available at the moment</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon for amazing deals!</p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 border-t border-border/50">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6 mb-10">
            <h2 className="text-4xl md:text-5xl font-bold" data-testid="text-cta-title">
              Ready to <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Start Trading</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-cta-description">
              Join thousands of satisfied customers who trust JTECH Trading World. 
              Fast transactions, best rates, and 24/7 support guaranteed!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/gift-cards">
              <Button size="lg" className="text-lg px-10 bg-gradient-to-r from-primary to-blue-600 border-blue-700" data-testid="button-cta-start" asChild>
                <span className="flex items-center gap-2">
                  Start Trading Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-10 border-2 bg-background/50 backdrop-blur-sm" data-testid="button-cta-contact" asChild>
                <span>Contact Support</span>
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            No fees to get started • Secure payments • Trusted by 5,000+ traders
          </p>
        </motion.div>
      </section>
    </div>
  );
}
