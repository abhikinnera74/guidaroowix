import { motion } from 'framer-motion';
import { MapPin, Compass, Users } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl p-8 md:p-10 border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavenderaccent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 bg-gradient-to-br from-lavenderaccent/20 to-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:from-lavenderaccent/30 group-hover:to-primary/20 transition-colors duration-300"
        >
          <div className="text-primary text-2xl">
            {icon}
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="font-heading text-2xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="font-paragraph text-base text-foreground/70 leading-relaxed">
          {description}
        </p>

        {/* Accent line */}
        <div className="mt-6 h-1 w-12 bg-gradient-to-r from-lavenderaccent to-secondary rounded-full group-hover:w-20 transition-all duration-300" />
      </div>
    </motion.div>
  );
};

export function CuratedAdventuresSection() {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Local Expertise',
      description: 'Discover hidden gems and secret spots with guides who know every corner of their city intimately.',
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: 'Curated Experiences',
      description: 'From culinary walks to historical deep-dives, find the perfect experience tailored to your interests.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Verified Guides',
      description: 'Safety and quality are paramount. All our guides are carefully vetted professionals with proven track records.',
    },
  ];

  return (
    <section className="w-full py-24 px-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lavenderaccent/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-[120rem] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">
            Curated Global Adventures
          </h2>
          <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
            Experience travel like never before with our carefully selected guides and authentic experiences
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
