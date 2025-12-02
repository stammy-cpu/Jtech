import CryptoForm from "@/components/CryptoForm";
import { Bitcoin } from "lucide-react";

export default function CryptoPage() {
  return (
    <div className="min-h-screen py-8 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-md bg-chart-1/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Bitcoin className="w-6 h-6 md:w-8 md:h-8 text-chart-1" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4" data-testid="text-crypto-title">
            Cryptocurrency Trading
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4" data-testid="text-crypto-subtitle">
            Buy and sell Bitcoin, USDT, Ethereum, and more. Fast, secure, and competitive rates.
          </p>
        </div>

        <CryptoForm />

        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="p-4 md:p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Selling Crypto</h3>
            <ol className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
              <li>1. Select the cryptocurrency you want to sell</li>
              <li>2. Send to our wallet address</li>
              <li>3. Submit transaction hash and payment details</li>
              <li>4. Receive payment once confirmed</li>
            </ol>
          </div>

          <div className="p-4 md:p-6 bg-muted rounded-lg">
            <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Buying Crypto</h3>
            <ol className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
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
