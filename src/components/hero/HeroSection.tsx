import { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere } from '@react-three/drei';
import { Search, ChevronDown, Star, Award, Users, MessageCircle } from 'lucide-react';

function FloatingShape() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 32, 32]} position={[-3, 1, 0]}>
        <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} emissive="#0ea5e9" emissiveIntensity={0.3} />
      </Sphere>
    </Float>
  );
}

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Business', 'Photography'];

  const stats = [
    { value: '50K+', label: 'Active Students', icon: <Users className="w-5 h-5" /> },
    { value: '500+', label: 'Expert Instructors', icon: <Award className="w-5 h-5" /> },
    { value: '4.8', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
  ];

  const companies = ['Google', 'Microsoft', 'Amazon', 'Netflix', 'Adobe'];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FloatingShape />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="heading-1 mb-6"
          >
            Learn Digital Skills & 
            <span className="text-gradient"> Purchase Premium Ebooks</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="body-large mb-8"
          >
            Join thousands of students learning from industry experts. Access world-class courses and ebooks anytime, anywhere.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-2 max-w-2xl mx-auto mb-8"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for courses or ebooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-white/20 rounded-lg cursor-pointer focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
              </div>
              <button className="btn-primary">
                Search
              </button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 justify-center mb-12"
          >
            <button className="btn-primary">Explore Courses</button>
            <button className="btn-outline">Browse Ebooks</button>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center gap-8 mb-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <span className="caption">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="caption mb-4">Trusted by students from top companies</p>
            <div className="flex flex-wrap justify-center gap-8">
              {companies.map((company, index) => (
                <div key={index} className="text-gray-500 font-semibold text-lg">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute right-10 top-1/3 glass-card p-3 hidden lg:block"
        >
          <MessageCircle className="w-6 h-6 text-primary-600" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute left-10 bottom-1/4 glass-card p-4 hidden lg:block"
        >
          <code className="text-sm">&lt;div&gt;Learn&lt;/div&gt;</code>
        </motion.div>
      </div>
    </section>
  );
}