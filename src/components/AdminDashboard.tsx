import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Edit,
  Trash2,
  ArrowLeft,
  Home,
  ShoppingCart,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminDashboard() {
  const {
    products,
    orders,
    updateProduct,
    setCurrentUser,
    fetchProducts,
    fetchCategories,
    logout,
    // Dashboard data
    dashboardStats,
    recentOrders,
    topProducts,
    allOrders,
    ordersTotalPages,
    ordersCurrentPage,
    // Dashboard methods
    fetchDashboardStats,
    fetchRecentOrders,
    fetchTopProducts,
    fetchAllOrders,
    updateOrderStatusAPI,
  } = useStore();
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "products" | "orders"
  >("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchDashboardStats(),
          fetchRecentOrders(10),
          fetchTopProducts(10),
          fetchAllOrders(0, 10),
        ]);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [
    fetchProducts,
    fetchCategories,
    fetchDashboardStats,
    fetchRecentOrders,
    fetchTopProducts,
    fetchAllOrders,
  ]);

  const handleLogout = () => {
    logout(); // clear store / token
    navigate("/auth"); // redirect after logout
  };

  // Calculate stats from dashboard data or fallback to local calculation
  const totalRevenue =
    dashboardStats?.totalRevenue ||
    orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = dashboardStats?.totalProducts || products.length;
  const lowStockItems = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-2xl py-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Log out</span>
            </Button>
            {/* <div className="h-6 w-px bg-border" />
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentUser("customer")}
                className="flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Customer View</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentUser("cashier")}
                className="flex items-center space-x-1"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>POS System</span>
              </Button>
            </div> */}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your TeddyLove store</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/admin/products">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={selectedTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTab(tab.id as any)}
                className="data-[state=active]:bg-background"
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {dashboardStats
                      ? dashboardStats.totalRevenue.toFixed(2)
                      : totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats
                      ? `Today: $${dashboardStats.todayRevenue.toFixed(2)}`
                      : "+12% from last month"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats
                      ? dashboardStats.totalProducts
                      : totalProducts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats
                      ? `Active: ${dashboardStats.activeProducts}`
                      : "Active inventory"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Low Stock Alert
                  </CardTitle>
                  <Package className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {dashboardStats
                      ? dashboardStats.lowStockProducts
                      : lowStockItems.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats
                      ? `${dashboardStats.outOfStockProducts} out of stock`
                      : `${outOfStockItems.length} out of stock`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardStats
                      ? dashboardStats.totalOrders
                      : orders.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats
                      ? `Pending: ${dashboardStats.pendingOrders}`
                      : "All time orders"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Items */}
            {lowStockItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowStockItems.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                        </div>
                        <Badge variant="destructive">
                          {product.stock} left
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Orders */}
            {recentOrders && recentOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.orderId}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">
                              Order #{order.orderId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.customerName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${order.totalPrice.toFixed(2)}
                          </p>
                          <Badge
                            variant={
                              order.status === "Delivered"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Products Tab */}
        {selectedTab === "products" && (
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.size}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock === 0
                              ? "destructive"
                              : product.stock <= 5
                              ? "secondary"
                              : "default"
                          }
                        >
                          {product.stock === 0
                            ? "Out of Stock"
                            : product.stock <= 5
                            ? "Low Stock"
                            : "In Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Orders Tab */}
        {selectedTab === "orders" && (
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allOrders && allOrders.length > 0 ? (
                    allOrders.map((order) => (
                      <>
                        <TableRow
                          key={order.orderId}
                          className="cursor-pointer"
                          onClick={() =>
                            setExpandedOrderId(
                              expandedOrderId === order.orderId
                                ? null
                                : order.orderId
                            )
                          }
                        >
                          <TableCell className="font-mono">
                            #{order.orderId}
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>
                            {order.orderItems ? order.orderItems.length : 0}{" "}
                            items
                          </TableCell>
                          <TableCell>
                            $
                            {order.totalPrice
                              ? order.totalPrice.toFixed(2)
                              : "0.00"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "Delivered"
                                  ? "default"
                                  : order.status === "Shipped"
                                  ? "secondary"
                                  : order.status === "Confirmed"
                                  ? "outline"
                                  : "destructive"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                        {expandedOrderId === order.orderId && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <p className="font-semibold">
                                    Customer details
                                  </p>
                                  <div className="text-sm text-muted-foreground">
                                    <div>Name: {order.customerName}</div>
                                    {order.customerEmail && (
                                      <div>Email: {order.customerEmail}</div>
                                    )}
                                    {order.contactNumber && (
                                      <div>Contact: {order.contactNumber}</div>
                                    )}
                                    {order.deliveryAddress && (
                                      <div>
                                        Address: {order.deliveryAddress}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p className="font-semibold">
                                    Purchased items
                                  </p>
                                  <div className="space-y-1">
                                    {order.orderItems &&
                                    order.orderItems.length > 0 ? (
                                      order.orderItems.map((item: any) => (
                                        <div
                                          key={item.itemId}
                                          className="flex items-center justify-between text-sm border rounded-md p-2"
                                        >
                                          <div className="mr-4">
                                            <div className="font-medium">
                                              {item.productName}
                                            </div>
                                            {item.personalizationDetails && (
                                              <div className="text-xs text-muted-foreground">
                                                Personalized
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-4">
                                            <span>x{item.quantity}</span>
                                            <span>
                                              $
                                              {(
                                                item.itemTotal ||
                                                item.price * item.quantity
                                              ).toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-sm text-muted-foreground">
                                        No items found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
