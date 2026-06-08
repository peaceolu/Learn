import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Failure() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-glass p-8 max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="heading-3 mb-4">Payment Failed 😞</h1>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-yellow-600 inline mr-2" />
          <span className="text-sm">No charges have been made to your account</span>
        </div>
        
        <div className="flex gap-4">
          <Link to="/" className="btn-outline flex-1 flex items-center justify-center gap-2">
            <ArrowLeft size={18} />
            Go Back
          </Link>
          <button onClick={() => window.history.back()} className="btn-primary flex-1">
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}