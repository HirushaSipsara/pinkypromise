import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UIProduct, CreateProductRequest } from "@/types/product";
import { apiClient } from "@/lib/api";

interface ProductManagementTableProps {
  className?: string;
}

export function ProductManagementTable({
  className,
}: ProductManagementTableProps) {
  const { products, categories, fetchProducts, fetchCategories } = useStore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for adding new product
  const [newProduct, setNewProduct] = useState<CreateProductRequest>({
    categoryId: 0,
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    stockQuantity: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load products and categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(
    (product) => product.stock <= 5 && product.stock > 0
  );

  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.description ||
      newProduct.price <= 0 ||
      newProduct.stockQuantity < 0
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("🔄 Creating new product:", newProduct);

      const createdProduct = await apiClient.createProduct(newProduct);
      console.log("✅ Product created successfully:", createdProduct);

      toast({
        title: "Success",
        description: "Product created successfully!",
      });

      // Reset form
      setNewProduct({
        categoryId: 0,
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        stockQuantity: 0,
      });
      setIsAddDialogOpen(false);

      // Refresh products list
      await fetchProducts();
    } catch (error) {
      console.error("Failed to create product:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= 5) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Management
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newProduct.categoryId.toString()}
                      onValueChange={(value) =>
                        setNewProduct({
                          ...newProduct,
                          categoryId: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.categoryId}
                            value={category.categoryId.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newProduct.stockQuantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stockQuantity: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.imageUrl}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          imageUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.categoryId} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Package className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold">{lowStockProducts.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Package className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">In Stock</p>
              <p className="text-2xl font-bold">
                {products.filter((p) => p.stock > 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No products found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="flex items-center space-x-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.description.substring(0, 50)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{getStockStatus(product.stock)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
