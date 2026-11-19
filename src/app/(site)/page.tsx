import type { Metadata } from "next";
import { getContent } from "@/server/content";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import MenuSection from "@/components/sections/MenuSection";
import FindTruck from "@/components/sections/FindTruck";
import Story from "@/components/sections/Story";
import Gallery from "@/components/sections/Gallery";
import Events from "@/components/sections/Events";
import Footer from "@/components/sections/Footer";
import Marquee from "@/components/ui/Marquee";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description, type: "website" },
  };
}

/* All text, lists and settings come from the CMS (edit at /admin). Cached until an admin saves. */
export default async function Home() {
  const c = await getContent();
  // Sort stops Monday → Sunday for the schedule and the map route.
  const stops = [...c.findTruck.stops].sort((a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7));

  return (
    <>
      <Nav brand={c.brand} stops={stops} />
      <main className="relative z-10">
        <Hero content={c.hero} />
        <Marquee
          words={c.marquee.words.map((w) => w.text).filter(Boolean)}
          className="bg-cobalt-deep py-6 font-display text-4xl font-semibold uppercase tracking-tight text-cream sm:py-8 sm:text-6xl"
        />
        <Manifesto content={c.manifesto} />
        <MenuSection content={c.menu} />
        <FindTruck content={{ ...c.findTruck, stops }} />
        <Story content={c.story} />
        <Gallery content={c.gallery} instagram={c.brand.instagram} />
        <Events content={c.events} />
      </main>
      <Footer content={c.footer} brand={c.brand} />
    </>
  );
}
