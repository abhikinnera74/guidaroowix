import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
  ];

  const quickLinks = [
    { label: 'Explore Tours', href: '/tours' },
    { label: 'Find a Guide', href: '/find-guide' },
    { label: 'Tourist Login', href: '/login' },
    { label: 'Guide Login', href: '/guide-login' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-2xl font-bold mb-4">Guidaroo</h3>
            <p className="font-paragraph text-base opacity-90 leading-relaxed">
              Connecting travelers with expert local guides for unforgettable experiences around the world.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading text-lg font-semibold mb-6">Explore</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-paragraph text-base opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Information Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading text-lg font-semibold mb-6">Information</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-paragraph text-base opacity-80 hover:opacity-100 transition-opacity duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading text-lg font-semibold mb-6">Get in Touch</h4>
            <p className="font-paragraph text-base opacity-90 mb-4">
              Have questions? We're here to help.
            </p>
            <a
              href="mailto:support@guidaroo.com"
              className="font-paragraph text-base opacity-80 hover:opacity-100 transition-opacity duration-300 break-all"
            >
              support@guidaroo.com
            </a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent mb-8" />

        {/* Copyright & Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-paragraph text-sm opacity-70">
            © {new Date().getFullYear()} Guidaroo. All rights reserved. | Connecting the world through authentic local experiences.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
