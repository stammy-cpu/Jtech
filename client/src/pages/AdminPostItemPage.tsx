import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminNavbar from "@/components/AdminNavbar";
import AdminFloatingMessages from "@/components/AdminFloatingMessages";
import { Package, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function AdminPostItemPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    condition: "new",
    description: "",
    specs: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(files);
      setImagePreviews(files.map(file => URL.createObjectURL(file)));
    }
  };

  const postGadgetMutation = useMutation({
    mutationFn: async (data: { name: string; price: string; condition: string; description: string; specs: string; images: File[] }) => {
      const formDataObj = new FormData();
      formDataObj.append("name", data.name);
      formDataObj.append("price", data.price);
      formDataObj.append("condition", data.condition);
      formDataObj.append("description", data.description);
      formDataObj.append("specs", data.specs.trim());
      
      data.images.forEach((image) => {
        formDataObj.append("images", image);
      });

      const response = await fetch("/api/gadgets", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post gadget");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gadgets"] });
      toast({ title: "Success", description: "Gadget posted successfully!" });
      setFormData({
        name: "",
        price: "",
        condition: "new",
        description: "",
        specs: "",
      });
      setImages([]);
      setImagePreviews([]);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast({ title: "Error", description: "Please upload at least one image", variant: "destructive" });
      return;
    }

    postGadgetMutation.mutate({
      name: formData.name,
      price: formData.price,
      condition: formData.condition,
      description: formData.description || "",
      specs: formData.specs.trim(),
      images,
    });
  };

  return (
    <>
      <AdminNavbar />
      <AdminFloatingMessages />
      <div className="min-h-screen pt-24 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold" data-testid="text-post-title">Post New Item</h1>
            </div>
            <p className="text-muted-foreground" data-testid="text-post-subtitle">
              Add a gadget to your marketplace
            </p>
          </div>

          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Item Name</label>
                    <Input
                      placeholder="e.g., iPhone 14 Pro"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="input-item-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Price (₦)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 650000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      data-testid="input-item-price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    data-testid="select-condition"
                  >
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    placeholder="Describe the item condition and key features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background resize-none"
                    rows={4}
                    data-testid="textarea-description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Specifications (comma separated)</label>
                  <Input
                    placeholder="e.g., 256GB Storage, Space Black, 98% Battery"
                    value={formData.specs}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    data-testid="input-specs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Images * (Select multiple)</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    data-testid="input-images"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-primary/20"
                            data-testid={`image-preview-${index}`}
                          />
                          <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">You can select up to 10 images</p>
                </div>

                <Button
                  type="submit"
                  disabled={postGadgetMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-chart-1"
                  data-testid="button-post-item"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {postGadgetMutation.isPending ? "Posting..." : "Post Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
