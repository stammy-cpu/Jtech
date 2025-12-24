import ServiceCard from '../ServiceCard';
import { CreditCard } from 'lucide-react';

export default function ServiceCardExample() {
  return (
    <div className="max-w-sm">
      <ServiceCard
        icon={CreditCard}
        title="Gift Cards"
        description="Trade your gift cards for cash instantly"
        features={[
          "Support for 20+ card types",
          "Instant verification",
          "Best market rates"
        ]}
        href="/gift-cards"
      />
    </div>
  );
}
