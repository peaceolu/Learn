import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import type { Product } from '../../types';

interface CourseCardProps {
  course: Product;
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-premium cursor-pointer"
      onClick={() => navigate(`/product/${course.id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={course.coverImage || 'https://via.placeholder.com/400x250'}
          alt={course.title}
          className="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-300"
        />
        {course.isBestseller && (
          <div className="absolute top-2 right-2 bg-accent-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            Bestseller
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-primary-600 uppercase">
            {course.category}
          </span>
          <span className="text-xs text-gray-500">
            {course.difficulty}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold">{course.rating}</span>
            <span className="text-xs text-gray-500">({course.reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{course.instructor}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary-600">${course.price}</span>
          </div>
        </div>
        
        <button className="btn-primary w-full mt-4 text-sm">
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}