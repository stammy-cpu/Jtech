import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, CreditCard, Bitcoin } from "lucide-react";
import { motion } from "framer-motion";
import type { ExchangeRate } from "@shared/schema";

export default function ExchangeRates() {
  const { data: rates } = useQuery<ExchangeRate>({
    queryKey: ["/api/exchange-rates"],
  });

  if (!rates) return null;

  const rateItems = [
    {
      icon: DollarSign,
      label: "USD to Naira",
      value: `₦${rates.usdToNaira.toLocaleString()}`,
      bgGradient: "from-green-500 to-emerald-600",
      iconColor: "text-green-100",
    },
    {
      icon: CreditCard,
      label: "Gift Card Rate",
      value: `₦${rates.giftCardRate.toLocaleString()}/USD`,
      bgGradient: "from-blue-500 to-cyan-600",
      iconColor: "text-blue-100",
    },
    {
      icon: Bitcoin,
      label: "BTC to Naira",
      value: `₦${rates.btcToNaira.toLocaleString()}`,
      bgGradient: "from-orange-500 to-amber-600",
      iconColor: "text-orange-100",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-rates-title">
                Live Exchange Rates
              </h2>
            </div>
            <p className="text-lg text-muted-foreground" data-testid="text-rates-subtitle">
              Updated in real-time for the best trading experience
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rateItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Card className="hover-elevate active-elevate-2 overflow-hidden group h-full" data-testid={`card-rate-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className={`h-2 bg-gradient-to-r ${item.bgGradient}`} />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${item.bgGradient} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground mb-1" data-testid={`text-rate-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.label}
                      </p>
                      <p className="text-2xl font-bold text-green-600" data-testid={`text-rate-value-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-6"
          data-testid="text-rates-updated"
        >
          Last updated: {new Date(rates.updatedAt).toLocaleString('en-NG', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
          })}
        </motion.p>
      </div>
    </section>
  );
}
