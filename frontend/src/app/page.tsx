import BackgroundGradients from '@/components/landing/BackgroundGradients';
import HeroSection from '@/components/landing/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden text-slate-100 font-sans selection:bg-[#6366F1] selection:text-white relative flex flex-col">
      <BackgroundGradients />
      <div className="px-6 sm:px-8 lg:px-12 flex-1 flex flex-col">
        <HeroSection />
      </div>
    </div>
  );
}
