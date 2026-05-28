import {
  Users, Building2, Clock, Receipt, Package, BarChart3,
  Shield, Layers, Bell, Lock, Hotel, UtensilsCrossed,
  Briefcase, Building, GraduationCap, Heart,
  ShieldCheck, Zap, TrendingUp, Headphones, Puzzle, Cpu,
  type LucideIcon,
} from 'lucide-react';

export const SITE = {
  name: 'KSWMS',
  fullName: 'KSW Management System',
  tagline: 'Modern Cloud Management System',
  description: 'Enterprise-grade cloud-based SaaS management platform with modular architecture for hospitality, hotels, restaurants, businesses, and enterprises.',
  url: 'https://kswms.kswtechzone.com',
  parentCompany: 'KSW TechZone',
  parentUrl: 'https://kswtechzone.com',
  founderUrl: 'https://sanjaykumarsingh.com.np/',
  email: 'contact@kswtechzone.com',
  phone: '+977-XXXXXXXXX',
  address: 'Nepal',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/kswtechzone', icon: 'Facebook' },
  { label: 'Twitter', href: 'https://twitter.com/kswtechzone', icon: 'Twitter' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/kswtechzone', icon: 'Linkedin' },
  { label: 'GitHub', href: 'https://github.com/kswtechzone', icon: 'Github' },
];

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  { icon: Users, title: 'Staff Management', description: 'Comprehensive employee lifecycle management from onboarding to payroll, with role-based access and performance tracking.' },
  { icon: Building2, title: 'Tenant Management', description: 'Centralized multi-tenant architecture allowing seamless management of multiple business units from a single dashboard.' },
  { icon: Clock, title: 'Attendance System', description: 'Real-time attendance tracking with biometric integration, geo-fencing, and automated shift scheduling.' },
  { icon: Receipt, title: 'Billing & Invoicing', description: 'Automated invoice generation with support for consolidated billing across multiple departments and services.' },
  { icon: Package, title: 'Inventory Management', description: 'Real-time stock tracking across multiple locations with threshold alerts, purchase orders, and supplier management.' },
  { icon: BarChart3, title: 'Reports & Analytics', description: 'Actionable insights with customizable dashboards, revenue reports, occupancy analytics, and performance metrics.' },
  { icon: Shield, title: 'Role-Based Access Control', description: 'Granular permission system with customizable roles ensuring data security and operational accountability.' },
  { icon: Layers, title: 'Multi-Tenant Architecture', description: 'Isolated data spaces for each organization with shared infrastructure, ensuring security and scalability.' },
  { icon: Bell, title: 'Real-time Notifications', description: 'Instant alerts for bookings, payments, staff updates, and system events via email, SMS, and in-app notifications.' },
  { icon: Lock, title: 'Cloud Data Security', description: 'Enterprise-grade encryption, automated backups, and SOC2-compliant infrastructure to protect your business data.' },
];

export const INDUSTRIES = [
  { icon: Hotel, name: 'Hospitality', description: 'Streamline hotel, resort, and guesthouse operations with integrated booking and management tools.' },
  { icon: Hotel, name: 'Hotels', description: 'Complete hotel management suite with room booking, housekeeping, and guest relationship management.' },
  { icon: UtensilsCrossed, name: 'Restaurants', description: 'POS-integrated restaurant management with menu management, table booking, and kitchen order tickets.' },
  { icon: Briefcase, name: 'Businesses', description: 'End-to-end business management solutions for small to medium enterprises across all sectors.' },
  { icon: Building, name: 'Enterprises', description: 'Scalable enterprise resource planning with multi-branch support and advanced analytics.' },
  { icon: GraduationCap, name: 'Schools', description: 'Educational institution management with student records, attendance, and fee management.' },
  { icon: Heart, name: 'Clinics', description: 'Healthcare facility management with patient records, appointment scheduling, and billing.' },
];

export const WHY_CHOOSE_US = [
  { icon: ShieldCheck, title: 'Secure Architecture', description: 'Bank-grade encryption, regular security audits, and compliance with international data protection standards.' },
  { icon: Zap, title: 'Modern Technology', description: 'Built with cutting-edge tech stack ensuring fast performance, reliability, and future-ready capabilities.' },
  { icon: TrendingUp, title: 'Scalable Infrastructure', description: 'Cloud-native architecture that grows with your business, handling everything from startups to enterprises.' },
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock technical support with dedicated account managers for enterprise clients.' },
  { icon: Puzzle, title: 'Customizable Modules', description: 'Flexible modular architecture allowing you to choose and pay only for the features you need.' },
  { icon: Cpu, title: 'AI-ready Platform', description: 'Built-in artificial intelligence capabilities for predictive analytics, smart recommendations, and automation.' },
];

export const TESTIMONIALS = [
  {
    name: 'Rajesh Sharma',
    title: 'CEO',
    company: 'Hotel Grand Everest',
    quote: 'KSWMS transformed our hotel operations. The integrated booking system and real-time analytics have increased our revenue by 35%. Truly a game-changer for Nepali hospitality.',
    rating: 5,
    avatar: 'RS',
  },
  {
    name: 'Anita Poudel',
    title: 'Operations Director',
    company: 'Mountain View Restaurants',
    quote: 'The multi-tenant architecture allows us to manage all our restaurant branches from one dashboard. Inventory tracking alone saved us 20% in operational costs.',
    rating: 5,
    avatar: 'AP',
  },
  {
    name: 'Sagar Thapa',
    title: 'IT Manager',
    company: 'Nepal Business Group',
    quote: 'We evaluated dozens of ERP solutions before choosing KSWMS. The customization options and 24/7 support are unmatched. Its the backbone of our digital transformation.',
    rating: 5,
    avatar: 'ST',
  },
  {
    name: 'Priya KC',
    title: 'Administrator',
    company: 'Sunrise Schools',
    quote: 'Managing a school with 2000+ students was challenging until we adopted KSWMS. Attendance tracking, fee management, and parent communication are now seamless.',
    rating: 5,
    avatar: 'PK',
  },
];

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: PricingFeature[];
  cta: string;
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    price: 19,
    yearlyPrice: 190,
    description: 'Perfect for small businesses getting started with digital management.',
    features: [
      { text: 'Up to 10 staff accounts', included: true },
      { text: 'Basic attendance tracking', included: true },
      { text: 'Single branch management', included: true },
      { text: 'Email support', included: true },
      { text: 'Basic reports', included: true },
      { text: 'Inventory management', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Get Started',
  },
  {
    name: 'Professional',
    price: 49,
    yearlyPrice: 490,
    description: 'Ideal for growing businesses with multiple departments.',
    popular: true,
    features: [
      { text: 'Up to 100 staff accounts', included: true },
      { text: 'Advanced attendance with biometrics', included: true },
      { text: 'Multi-branch management', included: true },
      { text: 'Priority email & chat support', included: true },
      { text: 'Advanced reports & analytics', included: true },
      { text: 'Inventory management', included: true },
      { text: 'API access', included: true },
      { text: 'Custom integrations', included: false },
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 99,
    yearlyPrice: 990,
    description: 'For large organizations requiring full customization and dedicated support.',
    features: [
      { text: 'Unlimited staff accounts', included: true },
      { text: 'Full feature access', included: true },
      { text: 'Unlimited branches', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom reports & dashboards', included: true },
      { text: 'Advanced inventory & supply chain', included: true },
      { text: 'Full API & custom integrations', included: true },
      { text: 'SLA guarantee', included: true },
    ],
    cta: 'Contact Sales',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What is KSWMS and who is it for?',
    answer: 'KSWMS (KSW Management System) is a cloud-based SaaS management platform designed for businesses of all sizes. It serves hospitality, hotels, restaurants, retail businesses, enterprises, schools, and clinics with modular management tools.',
  },
  {
    question: 'How does the multi-tenant architecture work?',
    answer: 'Each organization gets an isolated data environment within our shared infrastructure. This ensures complete data privacy while benefiting from our robust cloud infrastructure. You can manage multiple branches or business units under one account.',
  },
  {
    question: 'Can I customize KSWMS for my specific business needs?',
    answer: 'Yes. Our modular architecture lets you enable only the features you need. Enterprise clients can request custom modules, integrations, and workflows tailored to their operations.',
  },
  {
    question: 'Is my data secure on KSWMS?',
    answer: 'Absolutely. We employ bank-grade AES-256 encryption, regular security audits, automated daily backups, and SOC2-compliant data centers. Your data is protected with the highest industry standards.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We provide 24/7 technical support via email and chat. Professional and Enterprise plans include priority support with dedicated account managers and guaranteed response times.',
  },
  {
    question: 'Can I integrate KSWMS with my existing tools?',
    answer: 'Yes, our API-first architecture allows seamless integration with popular accounting software, payment gateways, CRM systems, and third-party applications. Enterprise plans include custom integration development.',
  },
  {
    question: 'How does billing work?',
    answer: 'We offer monthly and annual billing options. Annual plans save you 2 months of subscription cost. All plans include a 14-day free trial with no credit card required.',
  },
  {
    question: 'Is KSWMS suitable for Nepali businesses?',
    answer: 'Yes, KSWMS is built by KSW TechZone, a Nepali technology company. We understand the local business landscape and our platform supports Nepali currency, local tax systems, and bilingual capabilities.',
  },
];

export const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'KSW TechZone', href: 'https://kswtechzone.com' },
      { label: 'Founder', href: 'https://sanjaykumarsingh.com.np/' },
      { label: 'About', href: '#' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' },
    ],
  },
];
