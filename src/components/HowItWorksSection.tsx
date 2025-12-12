import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Globe, Users, Compass } from 'lucide-react';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  imageAlt: string;
  isReversed?: boolean;
  index: number;
}

const HowItWorksStep: React.FC<StepProps> = ({
  number,
  title,
  description,
  icon,
  image,
  imageAlt,
  isReversed = false,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
    >
      {/* Image */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
        className="w-full lg:w-1/2 relative"
      >
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-lavenderaccent/10 to-primary/10 z-0" />

          <Image
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover relative z-10"
            width={800}
          />

          {/* Step number badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
            viewport={{ once: true }}
            className={`absolute top-6 ${isReversed ? 'right-6' : 'left-6'} w-16 h-16 bg-white rounded-full flex items-center justify-center font-heading font-bold text-2xl text-primary shadow-lg`}
          >
            {number}
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="w-full lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: isReversed ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.1 }}
          viewport={{ once: true }}
        >
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-14 h-14 bg-gradient-to-br from-lavenderaccent/20 to-primary/10 rounded-xl flex items-center justify-center mb-6"
          >
            <div className="text-primary text-2xl">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
            {title}
          </h3>

          {/* Description */}
          <p className="font-paragraph text-lg text-foreground/70 leading-relaxed mb-8">
            {description}
          </p>

          {/* Accent line */}
          <div className="h-1 w-20 bg-gradient-to-r from-lavenderaccent to-secondary rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Browse Curated Tours',
      description:
        'Explore our extensive collection of tours across various destinations. Filter by interest, duration, or activity level to find your perfect match.',
      icon: <Globe className="w-8 h-8" />,
      image: 'https://static.wixstatic.com/media/70fb72_2321d810c7e34ee393cd0729488d7b3a~mv2.png?originWidth=768&originHeight=576',
      imageAlt: 'Browsing tours on tablet',
    },
    {
      number: 2,
      title: 'Choose Your Guide',
      description:
        'Read reviews, check credentials, and select a guide that resonates with you. Connect directly to customize your itinerary.',
      icon: <Users className="w-8 h-8" />,
      image: 'https://static.wixstatic.com/media/70fb72_29a8b7f08d4a417e9055be9fd11c855d~mv2.png?originWidth=768&originHeight=576',
      imageAlt: 'Guide profile',
      isReversed: true,
    },
    {
      number: 3,
      title: 'Book & Explore',
      description:
        'Secure your spot with our easy booking system. Pack your bags and get ready for an unforgettable journey led by a local expert.',
      icon: <Compass className="w-8 h-8" />,
      image: 'https://static.wixstatic.com/media/70fb72_b2bb50a24e9d43ba9ca52f308ca033a2~mv2.png?originWidth=768&originHeight=576',
      imageAlt: 'Happy tourists',
    },
  ];

  return (
    <section className="w-full py-32 px-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-lavenderaccent/5 rounded-full blur-3xl -z-10 transform translate-y-1/2" />

      <div className="max-w-[120rem] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-6">
            How It Works
          </h2>
          <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
            Three simple steps to your next unforgettable adventure
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <HowItWorksStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              image={step.image}
              imageAlt={step.imageAlt}
              isReversed={step.isReversed}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
