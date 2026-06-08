import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Home } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Track conversion if needed
    console.log('Payment success for order:', orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-glass p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="heading-3 mb-4">Payment Successful! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. You will receive an email shortly with access to your product.
        </p>
        
        <div className="bg-primary-50 rounded-lg p-4 mb-6">
          <Mail className="w-5 h-5 text-primary-600 inline mr-2" />
          <span className="text-sm">Check your inbox for delivery details</span>
        </div>
        
        <div className="flex gap-4">
          <Link to="/" className="btn-outline flex-1 flex items-center justify-center gap-2">
            <Home size={18} />
            Home
          </Link>
          <Link to="/courses" className="btn-primary flex-1">
            Browse More
          </Link>
        </div>
      </motion.div>
    </div>
  );
}