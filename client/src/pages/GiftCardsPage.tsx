import GiftCardForm from "@/components/GiftCardForm";
import { CreditCard } from "lucide-react";

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen py-8 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-md bg-chart-2/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-chart-2" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4" data-testid="text-giftcards-title">
            Trade Gift Cards
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4" data-testid="text-giftcards-subtitle">
            Get instant cash for your gift cards. We support Amazon, iTunes, Google Play, Steam, and many more.
          </p>
        </div>

        <GiftCardForm />

        <div className="mt-8 md:mt-12 p-4 md:p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">How It Works</h3>
          <ol className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
            <li>1. Select your gift card type and region</li>
            <li>2. Enter the card amount and upload images</li>
            <li>3. Provide your payment details</li>
            <li>4. Submit and wait for verification (usually 15-30 minutes)</li>
            <li>5. Receive payment once verified</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
