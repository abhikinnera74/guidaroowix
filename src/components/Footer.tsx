import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">Guidaroo</h3>
            <p className="font-paragraph text-base opacity-90">
              Connecting travelers with expert local guides for unforgettable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tours" className="font-paragraph text-base opacity-90 hover:opacity-100 transition-opacity">
                  Explore Tours
                </Link>
              </li>
              <li>
                <Link to="/find-guide" className="font-paragraph text-base opacity-90 hover:opacity-100 transition-opacity">
                  Find a Guide
                </Link>
              </li>
              <li>
                <Link to="/login" className="font-paragraph text-base opacity-90 hover:opacity-100 transition-opacity">
                  Tourist Login
                </Link>
              </li>
              <li>
                <Link to="/guide-login" className="font-paragraph text-base opacity-90 hover:opacity-100 transition-opacity">
                  Guide Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Get in Touch</h4>
            <p className="font-paragraph text-base opacity-90 mb-2">
              Have questions? We're here to help.
            </p>
            <p className="font-paragraph text-base opacity-90">
              support@guidaroo.com
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <p className="font-paragraph text-sm text-center opacity-80">
            © {new Date().getFullYear()} Guidaroo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
