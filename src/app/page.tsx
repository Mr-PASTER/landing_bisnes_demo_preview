import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

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
