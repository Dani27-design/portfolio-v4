import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Skills } from "../components/Skills";
import { SkyForceGame } from "../components/SkyForceGame";
import { Experience } from "../components/Experience";
import { Projects } from "../components/Projects";
import { Blog } from "../components/Blog";
import { Contact } from "../components/Contact";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <SkyForceGame />
      <Experience />
      <Projects />
      <Blog />
      <Contact />
    </>
  );
};
