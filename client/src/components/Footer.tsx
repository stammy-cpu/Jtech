import { Link } from "wouter";
import { Shield, Mail, Phone } from "lucide-react";
import { SiVisa, SiMastercard, SiStripe } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-muted border-t mt-12 md:mt-24 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" data-testid="text-footer-brand">JTECH Trading World</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
              Your trusted partner for trading gift cards, cryptocurrency, and gadgets.
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>100% Secure Transactions</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base" data-testid="text-footer-services">Services</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/gift-cards">
                  <span className="text-muted-foreground hover-elevate active-elevate-2 px-1.5 md:px-2 py-1 rounded-md inline-block cursor-pointer" data-testid="link-footer-gift-cards">
                    Gift Cards
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/crypto">
                  <span className="text-muted-foreground hover-elevate active-elevate-2 px-1.5 md:px-2 py-1 rounded-md inline-block cursor-pointer" data-testid="link-footer-crypto">
                    Cryptocurrency
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/gadgets">
                  <span className="text-muted-foreground hover-elevate active-elevate-2 px-1.5 md:px-2 py-1 rounded-md inline-block cursor-pointer" data-testid="link-footer-gadgets">
                    Gadgets
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base" data-testid="text-footer-support">Support</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-center gap-1.5 md:gap-2" data-testid="text-footer-email">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span className="break-all">support@jtech.com</span>
              </li>
              <li className="flex items-center gap-1.5 md:gap-2" data-testid="text-footer-phone">
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base" data-testid="text-footer-payment">Payment Methods</h4>
            <div className="flex flex-wrap gap-3 md:gap-4 text-2xl md:text-3xl text-muted-foreground">
              <SiVisa data-testid="icon-visa" />
              <SiMastercard data-testid="icon-mastercard" />
              <SiStripe data-testid="icon-stripe" />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4">
              Secured by Stripe SSL Encryption
            </p>
          </div>
        </div>

        <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground" data-testid="text-footer-copyright">
          <p>© 2024 JTECH Trading World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
