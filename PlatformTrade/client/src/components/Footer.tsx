import { Link } from "wouter";
import { Shield, Mail, Phone } from "lucide-react";
import { SiVisa, SiMastercard, SiStripe } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-muted border-t mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4" data-testid="text-footer-brand">JTECH Trading World</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted partner for trading gift cards, cryptocurrency, and gadgets.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>100% Secure Transactions</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-services">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/gift-cards">
                  <span className="text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md inline-block cursor-pointer" data-testid="link-footer-gift-cards">
                    Gift Cards
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/crypto">
                  <span className="text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md inline-block cursor-pointer" data-testid="link-footer-crypto">
                    Cryptocurrency
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/gadgets">
                  <span className="text-muted-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md inline-block cursor-pointer" data-testid="link-footer-gadgets">
                    Gadgets
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-support">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2" data-testid="text-footer-email">
                <Mail className="w-4 h-4" />
                <span>support@jtech.com</span>
              </li>
              <li className="flex items-center gap-2" data-testid="text-footer-phone">
                <Phone className="w-4 h-4" />
                <span>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-payment">Payment Methods</h4>
            <div className="flex flex-wrap gap-4 text-3xl text-muted-foreground">
              <SiVisa data-testid="icon-visa" />
              <SiMastercard data-testid="icon-mastercard" />
              <SiStripe data-testid="icon-stripe" />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Secured by Stripe SSL Encryption
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground" data-testid="text-footer-copyright">
          <p>© 2024 JTECH Trading World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
