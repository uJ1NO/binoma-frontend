import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  MapPin, 
  Globe, 
  Shield, 
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Wallet', href: '/wallet' },
      { name: 'Transactions', href: '/transactions' },
      { name: 'Purchase BiUSD', href: '/purchase' },
      { name: 'Withdraw', href: '/withdraw' },
              // { name: 'System Stats', href: '/stats' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Compliance', href: '/compliance' },
      { name: 'Security', href: '/security' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'API Documentation', href: '/docs' },
      { name: 'Status Page', href: '/status' },
      { name: 'System Health', href: '/health' },
      { name: 'Contact Support', href: '/support' },
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/binomena', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/binomena', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/binomena', icon: Github },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="hero-gradient w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">BINOMENA</h3>
                <p className="text-slate-400 text-sm">Digital Infrastructure System</p>
              </div>
            </div>
            
            <p className="text-slate-300 mb-6 max-w-md">
              The next-generation digital currency infrastructure platform, powered by BiUSD stablecoin. 
              Secure, fast, and reliable financial transactions for the modern world.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">contact@binomen.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">www.binomen.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Tirana, Albania & Global</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BiUSD Information */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-lg font-semibold text-biusd-green mb-2">BiUSD Stablecoin Information</h4>
                <p className="text-slate-300 text-sm">
                  BiUSD is the native stablecoin of the BINOMENA ecosystem, pegged 1:1 to the US Dollar.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Decimals: 18</p>
                <p className="text-sm text-slate-400">Founded: 2024</p>
                <p className="text-sm text-slate-400">Founder: JUXHINO KAPLLANAJ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-slate-400 text-sm">
                © {currentYear} BINOMENA. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                {footerLinks.legal.slice(0, 3).map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200 text-xs"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-biusd-green" />
                <span className="text-xs text-slate-400">Secured & Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
            <span>🔒 Bank-grade security</span>
            <span>⚡ 300K+ TPS capacity</span>
            <span>🌍 Global infrastructure</span>
            <span>📞 24/7 support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}; 