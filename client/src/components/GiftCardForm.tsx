import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const CARD_TYPES = ["Amazon", "iTunes", "Google Play", "Steam", "eBay", "Walmart", "Target"];
const REGIONS = ["US", "UK", "Canada", "Australia", "Europe"];

export default function GiftCardForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cardType: "",
    region: "",
    amount: "",
    cardCode: "",
    images: [] as File[],
    bankName: "",
    accountNumber: "",
    accountName: "",
    customerEmail: ""
  });
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/gift-cards", data);
    },
    onSuccess: () => {
      toast({
        title: "Gift Card Submitted",
        description: "Your gift card has been submitted. Please wait for verification.",
      });
      setFormData({
        cardType: "",
        region: "",
        amount: "",
        cardCode: "",
        images: [],
        bankName: "",
        accountNumber: "",
        accountName: "",
        customerEmail: ""
      });
      setStep(1);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit gift card. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = () => {
    const submitData = new FormData();
    submitData.append("cardType", formData.cardType);
    submitData.append("region", formData.region);
    submitData.append("amount", formData.amount);
    submitData.append("cardCode", formData.cardCode);
    submitData.append("bankName", formData.bankName);
    submitData.append("accountNumber", formData.accountNumber);
    submitData.append("accountName", formData.accountName);
    submitData.append("customerEmail", formData.customerEmail);
    submitData.append("status", "pending");
    
    formData.images.forEach((file) => {
      submitData.append("images", file);
    });

    submitMutation.mutate(submitData);
  };

  const progress = (step / 4) * 100;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold" data-testid="text-form-title">Trade Gift Card</h2>
          <Progress value={progress} className="h-2" data-testid="progress-form" />
          <p className="text-sm text-muted-foreground" data-testid="text-form-step">Step {step} of 4</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardType">Card Type</Label>
              <Select value={formData.cardType} onValueChange={(value) => setFormData(prev => ({ ...prev, cardType: value }))}>
                <SelectTrigger id="cardType" data-testid="select-card-type">
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  {CARD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
                <SelectTrigger id="region" data-testid="select-region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Card Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                data-testid="input-amount"
              />
            </div>

            <div>
              <Label htmlFor="cardCode">Card Code (Optional)</Label>
              <Textarea
                id="cardCode"
                placeholder="Enter card code if available"
                value={formData.cardCode}
                onChange={(e) => setFormData(prev => ({ ...prev, cardCode: e.target.value }))}
                data-testid="input-card-code"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="images">Upload Card Images</Label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover-elevate">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm">
                    <label htmlFor="images" className="relative cursor-pointer rounded-md font-medium text-primary">
                      <span>Upload files</span>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                        data-testid="input-images"
                      />
                    </label>
                    <p className="pl-1 text-muted-foreground">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  {formData.images.length > 0 && (
                    <p className="text-sm font-medium" data-testid="text-images-count">{formData.images.length} file(s) selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerEmail">Email (Optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="your@email.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                data-testid="input-customer-email"
              />
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                data-testid="input-bank-name"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                data-testid="input-account-number"
              />
            </div>

            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="Enter account name"
                value={formData.accountName}
                onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                data-testid="input-account-name"
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between gap-4">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} data-testid="button-previous">
            Previous
          </Button>
        )}
        <div className="flex-1" />
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} data-testid="button-next">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitMutation.isPending} data-testid="button-submit">
            {submitMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
