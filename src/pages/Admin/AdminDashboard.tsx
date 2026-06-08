import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  
  LogOut,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, Order } from '../../types';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products
      const productsSnap = await getDocs(collection(db, 'products'));
      const productsData = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(productsData);

      // Fetch orders
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      setOrders(ordersData);

      // Fetch customers (unique from orders)
      const uniqueCustomers = [...new Map(ordersData.map(order => [order.customerEmail, order])).values()];
      setCustomers(uniqueCustomers);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Analytics calculations
  const totalRevenue = orders
    .filter(order => order.paymentStatus === 'successful')
    .reduce((sum, order) => sum + order.amount, 0);
  
  const totalSales = orders.filter(order => order.paymentStatus === 'successful').length;
  const totalProducts = products.length;
  const conversionRate = orders.length > 0 ? (totalSales / orders.length * 100).toFixed(1) : '0';

  // Chart data
  const salesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const sales = orders.filter(order => 
      order.createdAt && 
      new Date(order.createdAt).toDateString() === date.toDateString() &&
      order.paymentStatus === 'successful'
    ).length;
    return { date: date.toLocaleDateString(), sales };
  }).reverse();

  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const revenue = orders
      .filter(order => 
        order.createdAt && 
        new Date(order.createdAt).getMonth() === month.getMonth() &&
        order.paymentStatus === 'successful'
      )
      .reduce((sum, order) => sum + order.amount, 0);
    return { month: month.toLocaleString('default', { month: 'short' }), revenue };
  }).reverse();

  const productSales = products.map(product => ({
    name: product.title,
    value: orders.filter(order => order.productId === product.id && order.paymentStatus === 'successful').length
  })).filter(item => item.value > 0);

  const COLORS = ['#0ea5e9', '#d946ef', '#f97316', '#10b981', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg"></div>
            <span className="text-xl font-display font-bold">ZaiLearn</span>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'analytics' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'products' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
              }`}
            >
              <BookOpen size={20} />
              <span>Products</span>
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'orders' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Orders</span>
            </button>
            
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'customers' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              <span>Customers</span>
            </button>
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h1 className="heading-3">Analytics Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="card-premium p-6">
                    <p className="text-gray-500 mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-primary-600">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="card-premium p-6">
                    <p className="text-gray-500 mb-2">Total Sales</p>
                    <p className="text-3xl font-bold text-secondary-600">{totalSales}</p>
                  </div>
                  <div className="card-premium p-6">
                    <p className="text-gray-500 mb-2">Products</p>
                    <p className="text-3xl font-bold text-accent-600">{totalProducts}</p>
                  </div>
                  <div className="card-premium p-6">
                    <p className="text-gray-500 mb-2">Conversion Rate</p>
                    <p className="text-3xl font-bold text-green-600">{conversionRate}%</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-premium p-6">
                    <h3 className="font-semibold mb-4">Daily Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="card-premium p-6">
                    <h3 className="font-semibold mb-4">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#d946ef" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="card-premium p-6">
                    <h3 className="font-semibold mb-4">Product Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={productSales}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productSales.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="heading-3">Product Management</h1>
                  <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Product
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="card-premium p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={product.coverImage} alt={product.title} className="w-16 h-16 object-cover rounded-lg" />
                        <div>
                          <h3 className="font-semibold">{product.title}</h3>
                          <p className="text-sm text-gray-500">{product.type} • ${product.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit size={20} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h1 className="heading-3">Order Management</h1>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{order.customerName}</td>
                          <td className="px-6 py-4">{order.customerEmail}</td>
                          <td className="px-6 py-4">{order.productTitle}</td>
                          <td className="px-6 py-4">${order.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.paymentStatus === 'successful' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <h1 className="heading-3">Customer Management</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map((customer, index) => (
                    <div key={index} className="card-premium p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                          {customer.customerName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{customer.customerName}</h3>
                          <p className="text-sm text-gray-500">{customer.customerEmail}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Total Spent:</span> ${orders.filter(o => o.customerEmail === customer.customerEmail).reduce((sum, o) => sum + o.amount, 0)}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Orders:</span> {orders.filter(o => o.customerEmail === customer.customerEmail).length}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}