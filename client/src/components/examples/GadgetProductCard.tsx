import GadgetProductCard from '../GadgetProductCard';
import productImage from '@assets/generated_images/smartphone_product_image.png';

export default function GadgetProductCardExample() {
  return (
    <div className="max-w-sm">
      <GadgetProductCard
        image={productImage}
        name="iPhone 14 Pro"
        price={899}
        condition="Like New"
        specs={["256GB Storage", "Space Black", "98% Battery Health"]}
        onBuyClick={() => console.log("Buy clicked")}
      />
    </div>
  );
}
