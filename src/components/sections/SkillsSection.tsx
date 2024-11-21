'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Section } from '@/components/ui/section';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  CodeBracketIcon, 
  ServerIcon, 
  WrenchScrewdriverIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { SectionHeader } from '../ui/section-header';
import { useAnimation as useGlobalAnimation } from '@/contexts/AnimationContext';
import { AnimatedCard } from '@/components/ui/animated-card';
import { MessageSquare, X } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Development",
    skills: [
      { name: "HTML", level: "Advanced" },
      { name: "CSS & Tailwind", level: "Intermediate" },
      { name: "JavaScript", level: "Intermediate" },
      { name: "React.js", level: "Intermediate" },
      { name: "Next.js", level: "Intermediate" },
    ],
    icon: CodeBracketIcon,
    gradient: "from-[#FF6B6B] to-[#4ECDC4]",
    hoverGradient: "hover:from-[#4ECDC4] hover:to-[#FF6B6B]",
    glowColor: "rgba(255, 107, 107, 0.2)",
    description: "Modern web interfaces",
  },
  {
    title: "Backend Development",
    skills: [
      { name: "Node.js", level: "Intermediate" },
      { name: "Express.js", level: "Intermediate" },
      { name: "EJS", level: "Intermediate" },
      { name: "RESTful APIs", level: "Intermediate" },
    ],
    icon: ServerIcon,
    gradient: "from-[#A8E6CF] to-[#FFD3B6]",
    hoverGradient: "hover:from-[#FFD3B6] hover:to-[#A8E6CF]",
    glowColor: "rgba(168, 230, 207, 0.2)",
    description: "Server-side solutions",
  },
  {
    title: "Tools & Skills",
    skills: [
      { name: "Git & GitHub", level: "Intermediate" },
      { name: "Vercel", level: "Intermediate" },
      { name: "Excel & VBA", level: "Intermediate" },
      { name: "BlotAI", level: "Intermediate" },
      { name: "AI Integration", level: "Intermediate" },
    ],
    icon: WrenchScrewdriverIcon,
    gradient: "from-[#FF9A9E] to-[#FAD0C4]",
    hoverGradient: "hover:from-[#FAD0C4] hover:to-[#FF9A9E]",
    glowColor: "rgba(255, 154, 158, 0.2)",
    description: "Development tools",
  },
  {
    title: "Specialized Areas",
    skills: [
      { name: "Full-Stack Development", level: "Intermediate" },
      { name: "AI Voice Agent Development", level: "Intermediate" },
      { name: "Responsive Design", level: "Intermediate" },
      { name: "Business Website Design", level: "Intermediate" },
      { name: "Process Optimization", level: "Intermediate" },
    ],
    icon: SparklesIcon,
    gradient: "from-[#A8C0FF] to-[#3F2B96]",
    hoverGradient: "hover:from-[#3F2B96] hover:to-[#A8C0FF]",
    glowColor: "rgba(168, 192, 255, 0.2)",
    description: "Core expertise areas",
  },
] as const;

const SkillCard = ({ category, index }: { category: typeof skillCategories[number]; index: number }) => {
  const Icon = category.icon;
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.215, 0.61, 0.355, 1]
      }}
      className="relative w-full h-full group perspective-[1000px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <motion.div 
        style={{
          rotateX,
          rotateY,
        }}
        className={`
          relative h-full 
          rounded-2xl overflow-hidden
          transform-gpu transition-all duration-300
          border border-white/20
          backdrop-blur-[12px]
          bg-gradient-to-br from-white/10 to-white/5
          dark:from-black/10 dark:to-black/5
          ${isHovered ? 'scale-[1.02]' : 'scale-100'}
        `}
      >
        {/* Gradient overlay */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20`}
          animate={{
            opacity: isHovered ? 0.3 : 0.2,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="flex items-start gap-4 mb-8">
            <motion.div 
              className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: `0 0 20px ${category.glowColor}`,
              }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            
            <div>
              <motion.h3 
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
              >
                {category.title}
              </motion.h3>
              <p className="text-sm text-gray-400 mt-1">
                {category.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {category.skills.map((skill, skillIndex) => (
                <motion.div 
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: skillIndex * 0.1
                  }}
                  className="group/skill relative"
                >
                  <div className="flex items-center justify-between">
                    <motion.span 
                      className="text-sm font-medium text-white/90"
                      whileHover={{ scale: 1.05 }}
                    >
                      {skill.name}
                    </motion.span>
                    <motion.span 
                      className="text-xs font-medium text-white/70 opacity-0 group-hover/skill:opacity-100"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ 
                        x: isHovered ? 0 : -10,
                        opacity: isHovered ? 1 : 0
                      }}
                    >
                      {skill.level}
                    </motion.span>
                  </div>
                  
                  {/* Animated skill bar */}
                  <motion.div 
                    className="h-[2px] mt-1 rounded-full overflow-hidden bg-white/20"
                    initial={{ width: "0%" }}
                    animate={{ width: isHovered ? "100%" : "0%" }}
                    transition={{ duration: 0.5, delay: skillIndex * 0.1 }}
                  >
                    <motion.div 
                      className={`h-full w-full bg-gradient-to-r ${category.gradient}`}
                      initial={{ x: "-100%" }}
                      animate={{ x: isHovered ? "0%" : "-100%" }}
                      transition={{ duration: 0.5, delay: skillIndex * 0.1 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Shine effect */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ 
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            left: "-100%",
          }}
          animate={{ 
            left: isHovered ? "100%" : "-100%",
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={{
            width: "50%",
            transform: "skewX(-20deg)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const { isPaused } = useGlobalAnimation();
  const [showChatPrompt, setShowChatPrompt] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!sectionRef.current || hasTriggered.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setTimeout(() => {
            setShowChatPrompt(true);
          }, 2000);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      <Section 
        id="skills" 
        className="relative overflow-hidden py-20"
      >
        <div className="absolute rounded-xl inset-0 bg-gradient-to-b from-black/0 via-gray-900 to-black/0 bg-clip-border backdrop-blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <SectionHeader 
            title="Skills & Expertise" 
          />
        </motion.div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 px-4">
          <AnimatePresence>
            {skillCategories.map((category, index) => (
              <SkillCard key={category.title} category={category} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Floating Chat Prompt */}
        <AnimatePresence>
          {showChatPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-24 right-8 flex items-center gap-3 bg-[#3d348b] dark:bg-[#e6af2e] text-white dark:text-[#191716] px-4 py-3 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform z-50"
              onClick={() => {
                setShowChatPrompt(false);
                window.dispatchEvent(new CustomEvent('openChat'));
              }}
            >
              <MessageSquare className="w-6 h-6 animate-bounce" />
              <span className="text-sm font-medium">
                Ask my AI to know about me more?
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChatPrompt(false);
                }}
                className="ml-2 hover:bg-black/10 rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </Section>
      {/* Bottom decorative line */}
      <motion.div 
            className=" mx-auto w-32 h-1 bg-gradient-to-r from-[#3d348b]/20 via-[#e6af2e]/40 to-[#3d348b]/20 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
    </div>
  );
};

export default SkillsSection;