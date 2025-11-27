import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFloatingMessages from "@/components/AdminFloatingMessages";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const SAMPLE_TRADES = [
  {
    id: 1,
    type: "gift-card",
    user: "john_doe",
    amount: "₦50,000",
    status: "pending",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    type: "crypto",
    user: "jane_smith",
    amount: "$500 BTC",
    status: "approved",
    timestamp: "1 hour ago"
  },
  {
    id: 3,
    type: "gadget",
    user: "mike_tech",
    amount: "iPhone 14 Pro",
    status: "pending",
    timestamp: "30 mins ago"
  },
];

export default function AdminTradesPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "approved":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <>
      <AdminNavbar />
      <AdminFloatingMessages />
      <div className="min-h-screen pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold" data-testid="text-trades-title">Trades Dashboard</h1>
            </div>
            <p className="text-muted-foreground" data-testid="text-trades-subtitle">
              Manage all user trades and transactions
            </p>
          </div>

          <div className="grid gap-6">
            {SAMPLE_TRADES.map((trade) => (
              <Card key={trade.id} className="border-primary/20 hover-elevate" data-testid={`card-trade-${trade.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg" data-testid={`text-trade-user-${trade.id}`}>{trade.user}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{trade.timestamp}</p>
                    </div>
                    <Badge className={getStatusColor(trade.status)} data-testid={`badge-status-${trade.id}`}>
                      {trade.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize">{trade.type.replace("-", " ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold text-green-600">{trade.amount}</p>
                    </div>
                  </div>
                  
                  {trade.status === "pending" && (
                    <div className="flex gap-3 pt-3 border-t">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" data-testid={`button-approve-${trade.id}`}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" data-testid={`button-reject-${trade.id}`}>
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
