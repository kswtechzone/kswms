import BackgroundGradients from '@/components/landing/BackgroundGradients';
import NavHeader from '@/components/landing/NavHeader';
import HeroSection from '@/components/landing/HeroSection';
import DashboardPlayground from '@/components/landing/DashboardPlayground';
import FeatureGrid from '@/components/landing/FeatureGrid';
import EngineeringCore from '@/components/landing/EngineeringCore';
import MetricsSection from '@/components/landing/MetricsSection';
import ContactForm from '@/components/landing/ContactForm';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden text-slate-100 font-sans selection:bg-[#6366F1] selection:text-white relative flex flex-col">
      <BackgroundGradients />
      <NavHeader />
      <main className="flex-1 flex flex-col w-full">
        <HeroSection />
        <DashboardPlayground />
        <FeatureGrid />
        <EngineeringCore />
        <MetricsSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

