'use client';

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import type { Project, Blog as BlogType, ExperienceItem, SkillGroup } from "@/types";

const SkyForceGame = dynamic(() => import("@/components/game/SkyForceGame").then(mod => ({ default: mod.SkyForceGame })), {
  ssr: false,
  loading: () => <div className="min-h-[600px] bg-background" />,
});

interface HomePageProps {
  projects: Project[];
  blogs: BlogType[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
  locale: string;
}

export const HomePage = ({ projects, blogs, experience, skills, locale }: HomePageProps) => {
  return (
    <>
      <Hero />
      <About />
      <Skills skills={skills} locale={locale} />
      <SkyForceGame />
      <Experience experience={experience} locale={locale} />
      <Projects projects={projects} locale={locale} />
      <Blog blogs={blogs} locale={locale} />
      <Contact />
    </>
  );
};
