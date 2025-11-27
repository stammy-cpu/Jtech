import CryptoForm from "@/components/CryptoForm";
import { Bitcoin } from "lucide-react";

export default function CryptoPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-md bg-chart-1/10 flex items-center justify-center mx-auto mb-4">
            <Bitcoin className="w-8 h-8 text-chart-1" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-crypto-title">
            Cryptocurrency Trading
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-crypto-subtitle">
            Buy and sell Bitcoin, USDT, Ethereum, and more. Fast, secure, and competitive rates.
          </p>
        </div>

        <CryptoForm />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-4">Selling Crypto</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Select the cryptocurrency you want to sell</li>
              <li>2. Send to our wallet address</li>
              <li>3. Submit transaction hash and payment details</li>
              <li>4. Receive payment once confirmed</li>
            </ol>
          </div>

          <div className="p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-4">Buying Crypto</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Select the cryptocurrency you want to buy</li>
              <li>2. Enter the amount</li>
              <li>3. We'll send you payment instructions</li>
              <li>4. Receive crypto once payment is confirmed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
