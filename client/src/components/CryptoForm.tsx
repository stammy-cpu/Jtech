import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const CRYPTO_COINS = ["Bitcoin", "USDT", "Ethereum", "USDC"];

export default function CryptoForm() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("sell");
  const [formData, setFormData] = useState({
    coin: "",
    amount: "",
    transactionHash: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    customerEmail: ""
  });
  const { toast } = useToast();

  const walletAddress = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/crypto-trades", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: `${tradeType === "buy" ? "Buy" : "Sell"} Request Submitted`,
        description: "We'll process your request shortly. Please check your email for updates.",
      });
      setFormData({
        coin: "",
        amount: "",
        transactionHash: "",
        bankName: "",
        accountNumber: "",
        accountName: "",
        customerEmail: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleSubmit = () => {
    submitMutation.mutate({
      tradeType,
      coin: formData.coin,
      amount: formData.amount,
      transactionHash: formData.transactionHash || null,
      bankName: formData.bankName || null,
      accountNumber: formData.accountNumber || null,
      accountName: formData.accountName || null,
      customerEmail: formData.customerEmail || null,
      status: "pending",
    });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold" data-testid="text-crypto-form-title">Crypto Trading</h2>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as "buy" | "sell")}>
          <TabsList className="grid w-full grid-cols-2" data-testid="tabs-trade-type">
            <TabsTrigger value="sell" data-testid="tab-sell">Sell to JTECH</TabsTrigger>
            <TabsTrigger value="buy" data-testid="tab-buy">Buy from JTECH</TabsTrigger>
          </TabsList>

          <TabsContent value="sell" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="coin-sell">Cryptocurrency</Label>
              <Select value={formData.coin} onValueChange={(value) => setFormData(prev => ({ ...prev, coin: value }))}>
                <SelectTrigger id="coin-sell" data-testid="select-coin-sell">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTO_COINS.map(coin => (
                    <SelectItem key={coin} value={coin}>{coin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted rounded-md space-y-2">
              <Label>Send to this address:</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm p-2 bg-background rounded border break-all" data-testid="text-wallet-address">{walletAddress}</code>
                <Button size="icon" variant="outline" onClick={copyToClipboard} data-testid="button-copy-address">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="amount-sell">Amount Sent</Label>
              <Input
                id="amount-sell"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                data-testid="input-amount-sell"
              />
            </div>

            <div>
              <Label htmlFor="transactionHash">Transaction Hash</Label>
              <Input
                id="transactionHash"
                placeholder="Enter transaction hash"
                value={formData.transactionHash}
                onChange={(e) => setFormData(prev => ({ ...prev, transactionHash: e.target.value }))}
                data-testid="input-transaction-hash"
              />
            </div>

            <div>
              <Label htmlFor="customerEmail-sell">Email (Optional)</Label>
              <Input
                id="customerEmail-sell"
                type="email"
                placeholder="your@email.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                data-testid="input-customer-email-sell"
              />
            </div>

            <div>
              <Label htmlFor="bankName-sell">Bank Name</Label>
              <Input
                id="bankName-sell"
                placeholder="Enter bank name for payout"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                data-testid="input-bank-name-sell"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber-sell">Account Number</Label>
              <Input
                id="accountNumber-sell"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                data-testid="input-account-number-sell"
              />
            </div>
          </TabsContent>

          <TabsContent value="buy" className="space-y-4 mt-6">
            <div>
              <Label htmlFor="coin-buy">Cryptocurrency</Label>
              <Select value={formData.coin} onValueChange={(value) => setFormData(prev => ({ ...prev, coin: value }))}>
                <SelectTrigger id="coin-buy" data-testid="select-coin-buy">
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTO_COINS.map(coin => (
                    <SelectItem key={coin} value={coin}>{coin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount-buy">Amount to Buy</Label>
              <Input
                id="amount-buy"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                data-testid="input-amount-buy"
              />
            </div>

            <div>
              <Label htmlFor="customerEmail-buy">Email (Optional)</Label>
              <Input
                id="customerEmail-buy"
                type="email"
                placeholder="your@email.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                data-testid="input-customer-email-buy"
              />
            </div>

            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                After submitting, we'll send you our bank details for payment. 
                We'll transfer the crypto to your wallet once payment is confirmed.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="w-full" data-testid="button-submit-crypto">
          {submitMutation.isPending ? "Submitting..." : "Submit Request"}
        </Button>
      </CardFooter>
    </Card>
  );
}
