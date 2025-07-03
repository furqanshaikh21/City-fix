// src/components/Footer.jsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">About CityFix</h3>
            <p className="mt-2 text-sm text-gray-600">
              Making our communities better through citizen-powered issue reporting and resolution.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-blue-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-blue-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Legal</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-blue-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} CityFix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
