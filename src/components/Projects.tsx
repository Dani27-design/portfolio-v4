import { Reveal } from "./Reveal";
import { ServiceClusterGimmick } from "./ServiceClusterGimmick";
import { motion } from "motion/react";
import { CodeText } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../i18n";
import { useLocalizedPath } from "../i18n/useLocalizedPath";

export const Projects = () => {
  const { t, tArray } = useLanguage();
  const localizedPath = useLocalizedPath();
  const projectItems = tArray('projectItems') as readonly { name: string; desc: string }[];

  return (
    <section id="projects" className="section-padding bg-surface relative overflow-hidden">
      <ServiceClusterGimmick />

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-24 gap-8 items-center md:items-end">
          <Reveal>
            <div className="relative flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tighter text-text-main md:text-5xl lg:text-6xl">
                <CodeText tag="h2" type="html">{t('projects.title')}</CodeText>
              </h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-6 shadow-[0_0_20px_rgba(6,182,212,0.5)] mx-auto md:mx-0"></div>

            </div>
          </Reveal>
          <Reveal delay={0.2} width="100%">
            <div className="flex justify-center md:justify-end w-full">
              <Link
                to={localizedPath('/projects')}
                className="group flex items-center gap-4 px-8 py-4 bg-surface/50 border border-indigo-500/30 hover:border-indigo-500 transition-all duration-500 relative overflow-hidden w-full md:w-auto justify-center shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              >
                <div className="absolute inset-0 bg-indigo-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <span className="font-mono text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] relative z-10">
                  {t('projects.cta')}
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projectItems.slice(0, 3).map((project, idx) => (
            <Reveal key={project.name} delay={idx * 0.1} width="100%">
              <motion.div
                whileHover={{ y: -10, rotateX: 2, rotateY: 5 }}
                className="bg-background/90 backdrop-blur-xl border border-border/40 p-10 hover:border-cyan-500/60 transition-all duration-500 group h-full flex flex-col shadow-2xl relative overflow-hidden group/project cursor-pointer [perspective:1000px]"
              >
                {/* Background Grid Pattern for Card */}
                <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:25px_25px] pointer-events-none" />

                {/* High-Impact Corner Accents */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-indigo-500/20 group-hover:border-indigo-500 group-hover:w-16 group-hover:h-16 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500/20 group-hover:border-cyan-500 group-hover:w-16 group-hover:h-16 transition-all duration-500" />

                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-4 py-1.5 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                      [{String(idx + 1).padStart(2, '0')}] PRODUCTION
                    </span>
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-tighter group-hover:text-cyan-500/60 transition-colors">REF_BRANCH: STABLE/V4</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
                  />
                </div>

                <h3 className="text-2xl md:text-3xl font-black mb-6 tracking-tighter text-text-main group-hover:text-cyan-400 transition-colors">
                  <CodeText tag="h3">{project.name}</CodeText>
                </h3>

                <p className="text-text-muted text-base mb-14 leading-relaxed flex-grow italic border-l-2 border-border/20 pl-6 group-hover:border-cyan-500/60 group-hover:text-text-main transition-all duration-500">
                  <CodeText type="js">{project.desc}</CodeText>
                </p>

                <div className="flex justify-between items-center pt-10 border-t border-border/20 mt-auto relative z-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-mono text-text-muted/80 uppercase tracking-[0.25em] font-black group-hover:text-indigo-400 transition-colors">
                      {t('projects.metadata.access')}
                    </span>
                    <motion.div
                      initial={{ width: "20px" }}
                      whileHover={{ width: "100%" }}
                      className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"
                    />
                  </div>
                  <a href="#" className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-500 group-hover:text-cyan-300 group-hover:translate-x-3 transition-all duration-300">
                    {t('projects.viewDetail')}
                    <div className="w-6 h-[2px] bg-cyan-500 group-hover:w-10 transition-all" />
                  </a>
                </div>

                {/* Hover Reveal Scanline - Intensified */}
                <div className="absolute top-0 left-0 w-[300%] h-full bg-gradient-to-r from-transparent via-cyan-400/[0.08] to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none skew-x-20" />

                {/* Micro-Metadata Overlay */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                   <div className="font-mono text-[6px] text-white/10 uppercase text-right leading-tight">
                     {t('projects.metadata.access')}<br />
                     {t('projects.metadata.checksum')}<br />
                     {t('projects.metadata.target')}
                   </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
