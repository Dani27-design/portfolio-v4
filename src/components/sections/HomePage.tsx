'use client';

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import type { Project, Blog as BlogType, ExperienceItem, SkillGroup, HeroContent, AboutContent, ContactContent } from "@/types";

const SkyForceGame = dynamic(() => import("@/components/game/SkyForceGame").then(mod => ({ default: mod.SkyForceGame })), {
  ssr: false,
  loading: () => <div className="min-h-[360px] md:min-h-[540px] bg-background" />,
});

interface HomePageProps {
  projects: Project[];
  blogs: BlogType[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  heroContent: HeroContent | null;
  aboutContent: AboutContent | null;
  contactContent: ContactContent | null;
  locale: string;
}

export const HomePage = ({ projects, blogs, experience, skills, heroContent, aboutContent, contactContent, locale }: HomePageProps) => {
  return (
    <>
      <Hero heroContent={heroContent} locale={locale} />
      <About aboutContent={aboutContent} locale={locale} />
      <Skills skills={skills} locale={locale} />
      <a href="#work" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-cyan-500 focus:font-mono focus:text-sm focus:font-bold">Skip game section</a>
      <SkyForceGame />
      <Experience experience={experience} locale={locale} />
      <Projects projects={projects} locale={locale} />
      <Blog blogs={blogs} locale={locale} />
      <Contact contactContent={contactContent} locale={locale} />
    </>
  );
};
