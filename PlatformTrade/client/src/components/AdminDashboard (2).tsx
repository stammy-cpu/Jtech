import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Bitcoin, Smartphone, CheckCircle, Clock, XCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const getStatusBadge = (status: string, rejectionReason?: string) => {
  const variants = {
    pending: { variant: "secondary" as const, icon: Clock },
    verified: { variant: "default" as const, icon: CheckCircle },
    paid: { variant: "default" as const, icon: CheckCircle },
    completed: { variant: "default" as const, icon: CheckCircle },
    rejected: { variant: "destructive" as const, icon: XCircle },
  };
  const config = variants[status as keyof typeof variants] || variants.pending;
  const Icon = config.icon;
  
  return (
    <div className="space-y-1">
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
      {status === "rejected" && rejectionReason && (
        <p className="text-xs text-destructive font-medium">
          REJECTED: {rejectionReason}
        </p>
      )}
    </div>
  );
};

interface StatsData {
  pendingGiftCards?: number;
  cryptoTrades?: number;
  gadgetRequests?: number;
  completedToday?: number;
}

interface GiftCard {
  id: string;
  cardType: string;
  region: string;
  amount: number;
  status: string;
  rejectionReason?: string;
  createdAt: string;
}

interface CryptoTrade {
  id: string;
  coin: string;
  amount: number;
  tradeType: string;
  status: string;
  rejectionReason?: string;
}

interface GadgetSubmission {
  id: string;
  brand: string;
  model: string;
  submissionType: string;
  status: string;
  rejectionReason?: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionData, setRejectionData] = useState<{ endpoint: string; id: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: stats = {}, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/admin/stats"],
    staleTime: 30000,
  });

  const { data: giftCards = [], isLoading: giftCardsLoading } = useQuery<GiftCard[]>({
    queryKey: ["/api/gift-cards"],
  });

  const { data: cryptoTrades = [], isLoading: cryptoLoading } = useQuery<CryptoTrade[]>({
    queryKey: ["/api/crypto-trades"],
  });

  const { data: gadgetSubmissions = [], isLoading: gadgetsLoading } = useQuery<GadgetSubmission[]>({
    queryKey: ["/api/gadget-submissions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ endpoint, id, status, rejectionReason }: { endpoint: string; id: string; status: string; rejectionReason?: string }) => {
      const response = await apiRequest("PATCH", `${endpoint}/${id}/status`, { status, rejectionReason });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Status Updated", description: "The submission status has been updated." });
      queryClient.invalidateQueries({ queryKey: ["/api/gift-cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crypto-trades"] });
      queryClient.invalidateQueries({ queryKey: ["/api/gadget-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setRejectDialogOpen(false);
      setRejectionReason("");
      setRejectionData(null);
    },
    onError: () => {
      toast({ title: "Update Failed", description: "Failed to update status.", variant: "destructive" });
    },
  });

  const handleReject = (endpoint: string, id: string) => {
    setRejectionData({ endpoint, id });
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (!rejectionData) return;
    if (!rejectionReason.trim()) {
      toast({ title: "Error", description: "Please provide a rejection reason", variant: "destructive" });
      return;
    }
    updateStatusMutation.mutate({
      ...rejectionData,
      status: "rejected",
      rejectionReason: rejectionReason.trim(),
    });
  };

  const STATS = [
    { title: "Pending Gift Cards", count: stats.pendingGiftCards || 0, icon: CreditCard, color: "text-chart-2" },
    { title: "Crypto Trades", count: stats.cryptoTrades || 0, icon: Bitcoin, color: "text-chart-1" },
    { title: "Gadget Requests", count: stats.gadgetRequests || 0, icon: Smartphone, color: "text-chart-3" },
    { title: "Completed Today", count: stats.completedToday || 0, icon: CheckCircle, color: "text-chart-5" },
  ];

  if (statsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, index) => (
          <Card key={index} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2" data-testid={`text-stat-count-${index}`}>{stat.count}</p>
                </div>
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="gift-cards" data-testid="tabs-admin">
        <TabsList>
          <TabsTrigger value="gift-cards" data-testid="tab-gift-cards-admin">Gift Cards</TabsTrigger>
          <TabsTrigger value="crypto" data-testid="tab-crypto-admin">Crypto</TabsTrigger>
          <TabsTrigger value="gadgets" data-testid="tab-gadgets-admin">Gadgets</TabsTrigger>
        </TabsList>

        <TabsContent value="gift-cards" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Gift Card Submissions</h3>
            </CardHeader>
            <CardContent>
              {giftCardsLoading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(giftCards as GiftCard[]).map((card) => (
                      <TableRow key={card.id} data-testid={`row-gift-card-${card.id}`}>
                        <TableCell className="font-medium">{card.id.substring(0, 8)}...</TableCell>
                        <TableCell>{card.cardType} {card.region}</TableCell>
                        <TableCell>${card.amount}</TableCell>
                        <TableCell>{getStatusBadge(card.status, card.rejectionReason)}</TableCell>
                        <TableCell>{new Date(card.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {card.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={() => updateStatusMutation.mutate({ endpoint: "/api/gift-cards", id: card.id, status: "verified" })}
                                  data-testid={`button-approve-${card.id}`}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject("/api/gift-cards", card.id)}
                                  data-testid={`button-reject-${card.id}`}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Crypto Trades</h3>
            </CardHeader>
            <CardContent>
              {cryptoLoading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Coin</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(cryptoTrades as CryptoTrade[]).map((trade) => (
                      <TableRow key={trade.id} data-testid={`row-crypto-${trade.id}`}>
                        <TableCell className="font-medium">{trade.id.substring(0, 8)}...</TableCell>
                        <TableCell>{trade.coin}</TableCell>
                        <TableCell>{trade.amount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{trade.tradeType}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(trade.status, trade.rejectionReason)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {trade.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => updateStatusMutation.mutate({ endpoint: "/api/crypto-trades", id: trade.id, status: "completed" })}
                                  data-testid={`button-complete-${trade.id}`}
                                >
                                  Complete
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject("/api/crypto-trades", trade.id)}
                                  data-testid={`button-reject-${trade.id}`}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gadgets" className="mt-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Gadget Requests</h3>
            </CardHeader>
            <CardContent>
              {gadgetsLoading ? (
                <div>Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(gadgetSubmissions as GadgetSubmission[]).map((gadget) => (
                      <TableRow key={gadget.id} data-testid={`row-gadget-${gadget.id}`}>
                        <TableCell className="font-medium">{gadget.id.substring(0, 8)}...</TableCell>
                        <TableCell>{gadget.brand} {gadget.model}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{gadget.submissionType}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(gadget.status, gadget.rejectionReason)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {gadget.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="default"
                                  onClick={() => updateStatusMutation.mutate({ endpoint: "/api/gadget-submissions", id: gadget.id, status: "completed" })}
                                  data-testid={`button-complete-gadget-${gadget.id}`}
                                >
                                  Complete
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject("/api/gadget-submissions", gadget.id)}
                                  data-testid={`button-reject-gadget-${gadget.id}`}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent data-testid="dialog-rejection">
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reason for Rejection <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="E.g., Card is invalid, Incorrect transaction hash, Poor device condition..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                data-testid="input-rejection-reason"
              />
              <p className="text-xs text-muted-foreground">
                This reason will be visible to the user as: REJECTED: {rejectionReason || "[your reason]"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason("");
                setRejectionData(null);
              }}
              data-testid="button-cancel-reject"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionReason.trim() || updateStatusMutation.isPending}
              data-testid="button-confirm-reject"
            >
              {updateStatusMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
