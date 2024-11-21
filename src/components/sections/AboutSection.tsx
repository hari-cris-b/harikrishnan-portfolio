import React, { forwardRef, useRef, useEffect } from 'react';
import { Section } from '@/components/ui/section';
import { SectionHeader } from '@/components/ui/section-header';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface AboutSectionProps {
  id: string;
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>((props, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const targetRef = (ref as React.RefObject<HTMLDivElement>) || localRef;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  const handleScroll = (sectionId: string) => {
    console.log('Attempting to scroll to:', sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      console.log('Element found, scrolling...');
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('Element not found!');
    }
  };

  return (
    <Section 
      id="about"
      ref={targetRef}
      className="scroll-mt-16 relative z-10 pointer-events-auto"
    >
      <motion.div 
        style={{ opacity, y }} 
        className="relative z-20 pointer-events-auto"
      >
        <SectionHeader 
          title={["About Me", "My Story", "Who I Am", "About Me"]}
          repeat={1}
        />
        <motion.div 
          className="max-w-2xl mx-auto mt-10 relative z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glass Card */}
          <div 
            className="relative group cursor-pointer transform-gpu"
            onClick={() => window.open('/HarikrishnanResume.pdf', '_blank')}
          >
            {/* Background blur and gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#3d348b] to-[#e6af2e] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:duration-200 animate-tilt" />
            
            {/* Main card */}
            <motion.div 
              className="relative p-8 bg-white/90 dark:bg-[#191716]/90 rounded-2xl ring-1 ring-gray-200/50 dark:ring-gray-800/50 shadow-xl transform-gpu transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:bg-white/95 dark:group-hover:bg-[#191716]/95"
              whileHover={{ rotateY: 5, rotateX: 5 }}
            >
              {/* Content container */}
              <div className="relative z-30 space-y-8 text-center">
                {/* First paragraph with highlight */}
                <motion.div 
                  className="relative transform-gpu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#3d348b]/5 to-[#e6af2e]/5 rounded-lg blur-sm group-hover:from-[#3d348b]/10 group-hover:to-[#e6af2e]/10 transition-colors duration-500" />
                  <p className="relative text-lg font-medium text-[#3d348b] dark:text-[#e6af2e] leading-relaxed group-hover:text-[#2a2461] dark:group-hover:text-[#ffc234] transition-colors duration-300">
                    I'm a passionate full-stack developer with a keen eye for design
                    and a love for creating seamless user experiences.
                  </p>
                </motion.div>

                {/* Second paragraph */}
                <motion.p 
                  className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  My journey in tech has led me to work on diverse projects, from
                  e-commerce platforms to data visualization tools.
                </motion.p>

                {/* Resume Button */}
                <div className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#3d348b] to-[#e6af2e] rounded-xl shadow-md group-hover:shadow-xl group-hover:from-[#2a2461] group-hover:to-[#ffc234] transition-all duration-300 transform-gpu group-hover:scale-105">
                  <DocumentTextIcon className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  <span className="group-hover:tracking-wide transition-all duration-300">View Resume</span>
                </div>
              </div>
                    
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-[#e6af2e]/10 rounded-full blur-xl animate-pulse group-hover:bg-[#ffc234]/20 transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-[#3d348b]/10 rounded-full blur-xl animate-pulse group-hover:bg-[#2a2461]/20 transition-colors duration-500 pointer-events-none" style={{ animationDelay: '1s' }} />
            </motion.div>
          </div>

          {/* Bottom decorative line */}
          <motion.div 
            className="mt-12 mx-auto w-32 h-1 bg-gradient-to-r from-[#3d348b]/20 via-[#e6af2e]/40 to-[#3d348b]/20 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      </motion.div>
    </Section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;