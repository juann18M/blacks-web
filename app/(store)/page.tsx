import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import EditorialSection from "../components/EditorialSection";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <EditorialSection />
      <Footer />
    </main>
  );
}