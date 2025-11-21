import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";

// Lazy load heavy sections
const About = dynamic(() => import("@/components/sections/About"), {
  loading: () => <div className="min-h-[50vh] bg-white" />,
});
const Services = dynamic(() => import("@/components/sections/Services"), {
  loading: () => <div className="min-h-[50vh] bg-neutral-dark" />,
});
const Projects = dynamic(() => import("@/components/sections/Projects"), {
  loading: () => <div className="min-h-[50vh] bg-gray-50" />,
});
const Contact = dynamic(() => import("@/components/sections/Contact"), {
  loading: () => <div className="min-h-[50vh] bg-white" />,
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <About />
        <Services />
        <Projects />
        
        {/* Other Sections Placeholders */}
        {/* Process, Testimonials, Features, Calculator, FAQ to be implemented */}
        
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
