import HeroSection from '../components/sections/HeroSection';
import AboutPreview from '../components/sections/AboutPreview';
import ServicesGrid from '../components/sections/ServicesGrid';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import PortfolioSection from '../components/sections/PortfolioSection';
import ProcessSection from '../components/sections/ProcessSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import QuoteCTASection from '../components/sections/QuoteCTASection';
import usePageMeta from '../hooks/usePageMeta';

const HomePage = () => {
  usePageMeta({
    title: 'Home',
    description: 'ArloTechX delivers software, web, and AI solutions for modern businesses worldwide.',
  });

  return (
    <>
      <HeroSection />
      <AboutPreview />
      <ServicesGrid />
      <WhyChooseUs />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <QuoteCTASection />
    </>
  );
};

export default HomePage;
