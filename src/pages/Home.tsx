import HeroSection from '../components/hero/HeroSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <>
      <HeroSection />
      
      {/* Featured Categories */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Explore Popular Categories</h2>
          <p className="body-large">Find the perfect course or ebook for your goals</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['Development', 'Design', 'Marketing', 'Business', 'Photography'].map((cat) => (
            <Link
              key={cat}
              to={`/courses?category=${cat.toLowerCase()}`}
              className="glass-card p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold">{cat}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">4.8 Average Rating</h3>
              <p className="text-gray-600">From 10,000+ reviews</p>
            </div>
            <div>
              <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">50,000+ Students</h3>
              <p className="text-gray-600">Worldwide community</p>
            </div>
            <div>
              <Award className="w-12 h-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Industry Certificates</h3>
              <p className="text-gray-600">Recognized by employers</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}