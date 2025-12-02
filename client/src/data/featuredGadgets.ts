export interface StaticGadget {
  id: string;
  name: string;
  price: number;
  condition: string;
  description: string;
  specs: string[];
  imageUrls: string[];
  available: boolean;
  createdAt: string;
}

export const featuredGadgets: StaticGadget[] = [
  {
    id: "macbook-pro-m3",
    name: "MacBook Pro M3 14-inch",
    price: 1850000,
    condition: "Brand New",
    description: "The all-new MacBook Pro 14-inch with M3 chip delivers exceptional performance for professionals. Featuring the stunning Liquid Retina XDR display, all-day battery life, and a sleek Space Gray finish. Perfect for creative professionals, developers, and power users who demand the best.",
    specs: [
      "Apple M3 Pro Chip (12-core CPU, 18-core GPU)",
      "18GB Unified Memory",
      "512GB SSD Storage",
      "14.2-inch Liquid Retina XDR Display",
      "Up to 18 hours battery life",
      "MagSafe 3, Thunderbolt 4 ports",
      "1080p FaceTime HD camera",
      "Six-speaker sound system with Spatial Audio"
    ],
    imageUrls: ["/uploads/macbook_pro_m3.jpg"],
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max 256GB",
    price: 1650000,
    condition: "Brand New",
    description: "Experience the most advanced iPhone ever. The iPhone 16 Pro Max features the powerful A18 Pro chip, a stunning 6.9-inch Super Retina XDR display with ProMotion, and the most advanced camera system. Capture life's moments in incredible detail with the 48MP main camera and 5x optical zoom.",
    specs: [
      "A18 Pro Chip with 6-core GPU",
      "6.9-inch Super Retina XDR display",
      "256GB Storage",
      "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      "Action Button & Camera Control",
      "Titanium Design - Natural Titanium",
      "All-day battery life",
      "Face ID, USB-C, 5G capable"
    ],
    imageUrls: ["/uploads/iphone_16_pro_max.jpg"],
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "ps5-console",
    name: "PlayStation 5 Digital Edition",
    price: 520000,
    condition: "Brand New",
    description: "Step into a new era of gaming with the PlayStation 5 Digital Edition. Experience lightning-fast loading, deeper immersion with haptic feedback and adaptive triggers, and stunning games with ray tracing. The all-digital design means you can enjoy your favorite games without the need for discs.",
    specs: [
      "Custom AMD Ryzen Zen 2 CPU",
      "Custom AMD RDNA 2 GPU (10.28 TFLOPS)",
      "16GB GDDR6 RAM",
      "825GB Custom SSD",
      "4K Gaming at up to 120fps",
      "Ray Tracing support",
      "Tempest 3D AudioTech",
      "DualSense Wireless Controller included"
    ],
    imageUrls: ["/uploads/ps5_console.jpg"],
    available: true,
    createdAt: new Date().toISOString()
  }
];
