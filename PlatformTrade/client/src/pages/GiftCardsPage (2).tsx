import GiftCardForm from "@/components/GiftCardForm";
import { CreditCard } from "lucide-react";

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-md bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-chart-2" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-giftcards-title">
            Trade Gift Cards
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-giftcards-subtitle">
            Get instant cash for your gift cards. We support Amazon, iTunes, Google Play, Steam, and many more.
          </p>
        </div>

        <GiftCardForm />

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-4">How It Works</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
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
