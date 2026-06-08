import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Product, CurriculumItem } from '../types';
import { Star, Clock, Users, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handlePurchase = () => {
    navigate(`/checkout?productId=${product?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {product.type === 'course' ? 'Course' : 'Ebook'}
                </span>
                {product.isBestseller && (
                  <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                    Bestseller
                  </span>
                )}
              </div>
              <h1 className="heading-2 mb-4">{product.title}</h1>
              <p className="body-large mb-6">{product.description}</p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>1,234 students</span>
                </div>
                {product.type === 'course' && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>{product.duration}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Created by {product.instructor}</p>
                  <p className="text-sm text-gray-500">Expert Instructor</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sticky Purchase Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24"
          >
            <div className="card-glass p-6">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-primary-600">${product.price}</span>
                <p className="text-gray-500 mt-2">One-time payment</p>
              </div>
              
              <button onClick={handlePurchase} className="btn-primary w-full mb-4">
                Buy Now
              </button>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Instant access after purchase</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Learning Outcomes */}
        {product.learningOutcomes && (
          <div className="mb-12">
            <h2 className="heading-3 mb-6">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Curriculum (for courses) */}
        {product.type === 'course' && product.curriculum && (
          <div className="mb-12">
            <h2 className="heading-3 mb-6">Course Curriculum</h2>
            <div className="space-y-4">
              {(product.curriculum as CurriculumItem[]).map((section, index) => (
                <div key={index} className="card-glass overflow-hidden">
                  <button
                    onClick={() => toggleSection(`section-${index}`)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/20 transition-colors"
                  >
                    <div className="text-left">
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.lessons.length} lessons • {section.duration}</p>
                    </div>
                    {expandedSections.includes(`section-${index}`) ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedSections.includes(`section-${index}`) && (
                    <div className="p-4 pt-0 border-t border-white/20">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs">
                              {lessonIndex + 1}
                            </div>
                            <span>{lesson.title}</span>
                          </div>
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}