import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Bitcoin, Smartphone, Shield, Zap, TrendingUp, CheckCircle, Clock, Users } from "lucide-react";
import ExchangeRates from "@/components/ExchangeRates";
import TestimonialsSlider from "@/components/TestimonialsSlider";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const features = [
    { 
      icon: Zap, 
      title: "Lightning Fast", 
      description: "Transactions completed in minutes, not days. Experience the speed of instant payments.",
      gradient: "from-yellow-500 to-orange-600",
    },
    { 
      icon: Shield, 
      title: "100% Secure", 
      description: "Military-grade encryption protects your data. Trade with complete peace of mind.",
      gradient: "from-blue-500 to-cyan-600",
    },
    { 
      icon: TrendingUp, 
      title: "Best Rates", 
      description: "Get competitive rates guaranteed. We always give you the best value for your assets.",
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  const services = [
    { 
      icon: Gift, 
      title: "Gift Cards", 
      desc: "Trade at premium rates with instant payment",
      gradient: "from-pink-500 to-rose-600",
      features: ["iTunes", "Amazon", "Steam", "Google Play"]
    },
    { 
      icon: Bitcoin, 
      title: "Crypto Trading", 
      desc: "Buy and sell cryptocurrency instantly",
      gradient: "from-orange-500 to-amber-600",
      features: ["Bitcoin", "Ethereum", "USDT", "More coins"]
    },
    { 
      icon: Smartphone, 
      title: "Gadgets", 
      desc: "Sell your devices for cash quickly",
      gradient: "from-blue-500 to-indigo-600",
      features: ["iPhones", "Laptops", "Tablets", "Smartwatches"]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-16 md:pb-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center space-y-6 md:space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Trade Smarter,
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Get Paid Faster
                </span>
              </h1>
              
              <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Nigeria's #1 platform for trading gift cards, cryptocurrency, and gadgets.
                <span className="block mt-2 text-primary font-semibold text-sm md:text-base">Fast • Secure • Trusted by Thousands</span>
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" data-testid="button-landing-explore" asChild>
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 border-2" data-testid="button-landing-login" asChild>
                  <span>Sign In</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 md:gap-6 mt-6 md:mt-8 text-xs md:text-sm px-4"
            >
              {[
                { icon: Users, text: "5,000+ Customers" },
                { icon: Clock, text: "15 Min Response" },
                { icon: CheckCircle, text: "100% Secure" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.15, duration: 0.4 }}
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-background/50 backdrop-blur-sm rounded-full border border-primary/20"
                >
                  <badge.icon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <span className="text-muted-foreground font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-3 gap-2 md:gap-4 mt-12 md:mt-20 max-w-4xl mx-auto px-4"
          >
            {[
              { number: "5K+", label: "Active Users", gradient: "from-green-500 to-emerald-600" },
              { number: "50K+", label: "Transactions", gradient: "from-blue-500 to-cyan-600" },
              { number: "₦2B+", label: "Volume Traded", gradient: "from-purple-500 to-pink-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              >
                <Card className="text-center hover-elevate border-primary/20">
                  <CardContent className="p-3 md:p-6">
                    <p className={`text-xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.number}
                    </p>
                    <p className="text-[10px] md:text-sm text-muted-foreground mt-1 md:mt-2 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="bg-gradient-to-br from-muted/30 to-muted/10 py-12 md:py-20 border-y border-border/50">
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                Why Choose <span className="text-primary">JTECH</span>?
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Experience the difference with our cutting-edge platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={feature.title} 
                    variants={itemVariants}
                  >
                    <Card className="h-full hover-elevate border-primary/20 overflow-hidden group">
                      <div className={`h-1 bg-gradient-to-r ${feature.gradient}`} />
                      <CardContent className="p-5 md:p-8 space-y-3 md:space-y-4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-lg md:text-2xl font-bold">{feature.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <ExchangeRates />

        <div className="py-12 md:py-20">
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Our Services</h2>
              <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Everything you need for seamless trading, all in one place
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.div 
                    key={service.title} 
                    variants={itemVariants}
                  >
                    <Card className="h-full hover-elevate border-primary/20 overflow-hidden group">
                      <div className={`h-32 md:h-40 bg-gradient-to-br ${service.gradient} flex items-center justify-center relative overflow-hidden`}>
                        <Icon className="w-14 h-14 md:w-20 md:h-20 text-white opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                      </div>
                      <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
                        <h3 className="text-xl md:text-2xl font-bold">{service.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground">{service.desc}</p>
                        <ul className="space-y-1.5 md:space-y-2">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-xs md:text-sm">
                              <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant="outline" 
                          className="w-full border-2 group-hover:bg-primary group-hover:text-white transition-colors text-sm md:text-base" 
                          asChild 
                          data-testid={`button-service-${service.title.toLowerCase()}`}
                        >
                          <Link href="/home">
                            <span className="flex items-center justify-center gap-2">
                              Explore {service.title}
                              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </span>
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <TestimonialsSlider />

        <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 py-16 md:py-24 border-t border-border/50">
          <motion.div 
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 md:space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                Ready to Start <span className="text-primary">Trading</span>?
              </h2>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                Join thousands of Nigerians who trust JTECH for secure, fast, and profitable trading. 
                Start earning today!
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" data-testid="button-landing-start" asChild>
                  <span className="flex items-center gap-2">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </span>
                </Button>
              </Link>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 border-2 bg-background/50 backdrop-blur-sm" data-testid="button-landing-contact" asChild>
                  <span>Contact Support</span>
                </Button>
              </a>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-xs md:text-sm text-muted-foreground"
            >
              No credit card required • Free forever • Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
