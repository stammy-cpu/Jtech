import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFloatingMessages from "@/components/AdminFloatingMessages";
import { TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

type ExchangeRates = {
  id: string;
  usdToNaira: number;
  giftCardRate: number;
  btcToNaira: number;
  updatedAt: string;
};

export default function AdminUpdateRatesPage() {
  const { toast } = useToast();
  const [rates, setRates] = useState({
    usdToNaira: "1650",
    giftCardRate: "85",
    btcToNaira: "95000000",
  });

  const { data: currentRates, isLoading } = useQuery<ExchangeRates | null>({
    queryKey: ["/api/exchange-rates"],
  });

  useEffect(() => {
    if (currentRates) {
      setRates({
        usdToNaira: currentRates.usdToNaira.toString(),
        giftCardRate: currentRates.giftCardRate.toString(),
        btcToNaira: currentRates.btcToNaira.toString(),
      });
    }
  }, [currentRates]);

  const updateRatesMutation = useMutation({
    mutationFn: async (data: { usdToNaira: number; giftCardRate: number; btcToNaira: number }) => {
      return await apiRequest("/api/exchange-rates", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exchange-rates"] });
      toast({ title: "Success", description: "Exchange rates updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSave = () => {
    const usdToNaira = parseInt(rates.usdToNaira, 10);
    const giftCardRate = parseInt(rates.giftCardRate, 10);
    const btcToNaira = parseInt(rates.btcToNaira, 10);

    if (isNaN(usdToNaira) || isNaN(giftCardRate) || isNaN(btcToNaira)) {
      toast({ title: "Error", description: "All rates must be valid numbers", variant: "destructive" });
      return;
    }

    updateRatesMutation.mutate({ usdToNaira, giftCardRate, btcToNaira });
  };

  return (
    <>
      <AdminNavbar />
      <AdminFloatingMessages />
      <div className="min-h-screen pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold" data-testid="text-rates-title">Update Exchange Rates</h1>
            </div>
            <p className="text-muted-foreground" data-testid="text-rates-subtitle">
              Manage currency exchange rates for all transactions
            </p>
          </div>

          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">USD to Naira (₦)</label>
                <Input
                  type="number"
                  placeholder="1650"
                  value={rates.usdToNaira}
                  onChange={(e) => setRates({ ...rates, usdToNaira: e.target.value })}
                  data-testid="input-usd-rate"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Gift Card Rate (%)</label>
                <Input
                  type="number"
                  placeholder="85"
                  value={rates.giftCardRate}
                  onChange={(e) => setRates({ ...rates, giftCardRate: e.target.value })}
                  data-testid="input-giftcard-rate"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Bitcoin to Naira (₦)</label>
                <Input
                  type="number"
                  placeholder="95000000"
                  value={rates.btcToNaira}
                  onChange={(e) => setRates({ ...rates, btcToNaira: e.target.value })}
                  data-testid="input-btc-rate"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={updateRatesMutation.isPending || isLoading}
                className="w-full bg-gradient-to-r from-primary to-chart-1"
                data-testid="button-save-rates"
              >
                {updateRatesMutation.isPending ? "Saving..." : "Save Exchange Rates"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
