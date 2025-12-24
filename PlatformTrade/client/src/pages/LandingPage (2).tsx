import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Bitcoin, Smartphone, Shield, Zap, TrendingUp, CheckCircle, Clock, Users, Sparkles } from "lucide-react";
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
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            y: [0, 100, 0],
            x: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl" 
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                animate={floatingAnimation}
                className="inline-block"
              >
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              </motion.div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Trade Smarter,
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Get Paid Faster
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Nigeria's #1 platform for trading gift cards, cryptocurrency, and gadgets.
                <span className="block mt-2 text-primary font-semibold">Fast • Secure • Trusted by Thousands</span>
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" data-testid="button-landing-explore" asChild>
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2" data-testid="button-landing-login" asChild>
                  <span>Sign In</span>
                </Button>
              </Link>
            </motion.div>

            {/* Animated trust badges */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6 mt-8 text-sm"
            >
              {[
                { icon: Users, text: "5,000+ Happy Customers" },
                { icon: Clock, text: "15 Min Response Time" },
                { icon: CheckCircle, text: "100% Secure Payments" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
                  className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm rounded-full border border-primary/20"
                >
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Animated stats */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-3 gap-4 mt-20 max-w-4xl mx-auto"
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
                transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
              >
                <Card className="text-center hover-elevate border-primary/20">
                  <CardContent className="p-6">
                    <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.number}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-muted/30 to-muted/10 py-20 border-y border-border/50">
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="text-primary">JTECH</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the difference with our cutting-edge platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={feature.title} 
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover-elevate border-primary/20 overflow-hidden group">
                      <div className={`h-1 bg-gradient-to-r ${feature.gradient}`} />
                      <CardContent className="p-8 space-y-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Exchange Rates */}
        <ExchangeRates />

        {/* Services Section */}
        <div className="py-20">
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need for seamless trading, all in one place
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div 
                    key={service.title} 
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover-elevate border-primary/20 overflow-hidden group">
                      <div className={`h-40 bg-gradient-to-br ${service.gradient} flex items-center justify-center relative overflow-hidden`}>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Icon className="w-20 h-20 text-white opacity-90" />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                        <p className="text-muted-foreground">{service.desc}</p>
                        <ul className="space-y-2">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          variant="outline" 
                          className="w-full border-2 group-hover:bg-primary group-hover:text-white transition-colors" 
                          asChild 
                          data-testid={`button-service-${service.title.toLowerCase()}`}
                        >
                          <Link href="/home">
                            <span className="flex items-center justify-center gap-2">
                              Explore {service.title}
                              <ArrowRight className="w-4 h-4" />
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

        {/* Testimonials */}
        <TestimonialsSlider />

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 py-24 border-t border-border/50">
          <motion.div 
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Start <span className="text-primary">Trading</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join thousands of Nigerians who trust JTECH for secure, fast, and profitable trading. 
                Start earning today!
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" data-testid="button-landing-start" asChild>
                  <span className="flex items-center gap-2">
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-lg px-10 border-2 bg-background/50 backdrop-blur-sm" data-testid="button-landing-contact" asChild>
                  <span>Contact Support</span>
                </Button>
              </a>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-sm text-muted-foreground"
            >
              No credit card required • Free forever • Cancel anytime
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
