import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const DEVICE_TYPES = ["Phone", "Laptop", "Tablet", "Gaming Console", "Smartwatch"];
const CONDITIONS = ["Like New", "Excellent", "Good", "Fair", "Poor"];

export default function GadgetTradeInForm() {
  const [formData, setFormData] = useState({
    deviceType: "",
    brand: "",
    model: "",
    condition: "",
    description: "",
    images: [] as File[],
    bankName: "",
    accountNumber: "",
    accountName: "",
    customerEmail: ""
  });
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/gadget-submissions", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trade-in Submitted",
        description: "We'll review your device and send you a quote within 24 hours.",
      });
      setFormData({
        deviceType: "",
        brand: "",
        model: "",
        condition: "",
        description: "",
        images: [],
        bankName: "",
        accountNumber: "",
        accountName: "",
        customerEmail: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit trade-in. Please try again.",
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
    submitData.append("submissionType", "trade-in");
    submitData.append("deviceType", formData.deviceType);
    submitData.append("brand", formData.brand);
    submitData.append("model", formData.model);
    submitData.append("condition", formData.condition);
    submitData.append("description", formData.description);
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

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-semibold" data-testid="text-tradein-form-title">Sell Your Gadget</h2>
        <p className="text-sm text-muted-foreground">Tell us about your device and get a quote</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="deviceType">Device Type</Label>
            <Select value={formData.deviceType} onValueChange={(value) => setFormData(prev => ({ ...prev, deviceType: value }))}>
              <SelectTrigger id="deviceType" data-testid="select-device-type">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
              <SelectTrigger id="condition" data-testid="select-condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              placeholder="e.g., Apple, Samsung"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              data-testid="input-brand"
            />
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              placeholder="e.g., iPhone 14 Pro"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              data-testid="input-model"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the device condition, any issues, accessories included, etc."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            data-testid="input-description"
          />
        </div>

        <div>
          <Label htmlFor="images">Upload Device Images</Label>
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
                    data-testid="input-device-images"
                  />
                </label>
                <p className="pl-1 text-muted-foreground">or drag and drop</p>
              </div>
              <p className="text-xs text-muted-foreground">Front, back, sides - up to 10MB each</p>
              {formData.images.length > 0 && (
                <p className="text-sm font-medium" data-testid="text-device-images-count">{formData.images.length} file(s) selected</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Payment Details</h3>
          
          <div>
            <Label htmlFor="customerEmail">Email (Optional)</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="your@email.com"
              value={formData.customerEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              data-testid="input-tradein-customer-email"
            />
          </div>

          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="Enter bank name"
              value={formData.bankName}
              onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              data-testid="input-tradein-bank-name"
            />
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
              data-testid="input-tradein-account-number"
            />
          </div>

          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              placeholder="Enter account name"
              value={formData.accountName}
              onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
              data-testid="input-tradein-account-name"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} disabled={submitMutation.isPending} className="w-full" data-testid="button-submit-tradein">
          {submitMutation.isPending ? "Submitting..." : "Submit for Quote"}
        </Button>
      </CardFooter>
    </Card>
  );
}
