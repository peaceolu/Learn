import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'; // ✅ correct package
import { doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Product, Order } from '../types'; // ✅ type-only import
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// ✅ type for Flutterwave payment response
interface FlutterwaveResponse {
  status: string;
  transaction_id: number;
  tx_ref: string;
  flw_ref: string;
  amount: number;
  currency?: string;
  customer: {
    name: string;
    email: string;
  };
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('productId');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!productId) {
      navigate('/');
      return;
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, 'products', productId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        toast.error('Product not found');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now().toString(),
    amount: product?.price || 0,
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: formData.email,
      name: formData.fullName,
      phone_number: '',
    },
    customizations: {
      title: `Purchase: ${product?.title}`,
      description: `Payment for ${product?.title}`,
      logo: 'https://your-logo-url.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData: Partial<Order> = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        productId: product!.id,
        productTitle: product!.title,
        productType: product!.type,
        amount: product!.price,
        transactionRef: config.tx_ref,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      handleFlutterPayment({
        callback: async (response: FlutterwaveResponse) => { // ✅ typed response
          console.log('Payment response:', response);
          closePaymentModal();

          if (response.status === 'successful') {
            await updateDoc(doc(db, 'orders', orderRef.id), {
              paymentStatus: 'successful',
              status: 'completed',
              updatedAt: new Date(),
            });

            toast.success('Payment successful! Check your email for the product.');
            navigate('/success', { state: { orderId: orderRef.id } });
          } else {
            await updateDoc(doc(db, 'orders', orderRef.id), {
              paymentStatus: 'failed',
              status: 'failed',
              updatedAt: new Date(),
            });
            toast.error('Payment failed. Please try again.');
            navigate('/failure');
          }
          setIsProcessing(false);
        },
        onClose: () => {
          console.log('Payment modal closed');
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to process order');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Checkout Form */}
          <div className="card-glass p-6">
            <h2 className="heading-3 mb-6">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-primary"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-primary"
                  placeholder="john@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary w-full"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                ) : (
                  `Pay $${product.price}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="card-glass p-6">
            <h2 className="heading-3 mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                  {product.type === 'course' ? '📚' : '📖'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-gray-500">{product.type}</p>
                  <p className="text-sm text-gray-500">by {product.instructor}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">${product.price}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-2xl text-primary-600">${product.price}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}