import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HeroSection } from "@/components/sections/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { SystemsSection } from "@/components/sections/systems";
import { PlaygroundSection } from "@/components/sections/playground";
import { ExperienceSection } from "@/components/sections/experience";
import { PrinciplesSection } from "@/components/sections/principles";
import { StackMatrixSection } from "@/components/sections/stack-matrix";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060809] font-sans text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-50">
      <Navbar />
      <main>
        <HeroSection />
        <ProofStrip />
        <SystemsSection />
        <PlaygroundSection />
        <ExperienceSection />
        <PrinciplesSection />
        <StackMatrixSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
