import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAnimation as useGlobalAnimation } from '@/contexts/AnimationContext';
import { AnimatedCard } from '@/components/ui/animated-card';
import { CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Github, Calendar } from "lucide-react";
import { SectionHeader } from '../ui/section-header';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management, secure payment processing, and an intuitive admin dashboard.",
    image: "/projects/ecommerce.png",
    tech: ["Next.js", "Node.js", "MongoDB", "Stripe", "Redux"],
    demoLink: "https://ecommerce-demo.com",
    githubLink: "https://github.com/username/ecommerce",
    date: "2024",
    category: "Full Stack",
  },
  {
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard featuring real-time data visualization, customizable charts, and advanced filtering capabilities.",
    image: "/projects/dashboard.png",
    tech: ["React", "D3.js", "Express", "PostgreSQL", "WebSocket"],
    demoLink: "https://dashboard-demo.com",
    githubLink: "https://github.com/username/dashboard",
    date: "2024",
    category: "Frontend",
  },
  {
    title: "AI-powered Chatbot",
    description: "Intelligent chatbot utilizing natural language processing for automated customer support with multi-language support.",
    image: "/projects/chatbot.png",
    tech: ["Python", "TensorFlow", "Flask", "Docker", "Redis"],
    demoLink: "https://echoline-ai.vercel.app/",
    githubLink: "https://github.com/hari-cris-b/echoline-ai",
    date: "2024",
    category: "AI/ML",
  },
] as const;

// Memoized Project Button Component
const ProjectButton = React.memo(({ 
  children, 
  icon, 
  href 
}: { 
  children: React.ReactNode;
  icon: React.ReactNode;
  href: string;
}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={(e) => {
      e.stopPropagation();
      window.open(href, '_blank', 'noopener,noreferrer');
    }}
    onMouseDown={(e) => {
      e.stopPropagation();
    }}
    onTouchStart={(e) => {
      e.stopPropagation();
    }}
  >
    {icon}
    <span className="ml-2">{children}</span>
  </motion.a>
));

ProjectButton.displayName = 'ProjectButton';

const ProjectsSection = () => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { isPaused } = useGlobalAnimation();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isProjectPaused, setIsProjectPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStartX, setDragStartX] = React.useState(0);
  const [scrollStartX, setScrollStartX] = React.useState(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const touchStartRef = React.useRef<number | null>(null);
  const [dragDistance, setDragDistance] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  const DRAG_THRESHOLD = 5;
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Memoize handlers
  const checkScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    const cardWidth = 400;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(newIndex % projects.length);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const newIndex = Math.round(scrollLeft / containerWidth);
    
    setActiveIndex(newIndex);
    
    // Check scroll position for navigation buttons
    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScroll);

    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set new timeout for chat prompt
    scrollTimeout.current = setTimeout(() => {
      // Removed code here
    }, 1000);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 400;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  }, []);

  // Memoize navigation buttons
  const navigationButtons = useMemo(() => ({
    left: canScrollLeft && (
      <motion.button
        onClick={() => scroll('left')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-[#191716]/90 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-800"
        whileHover={{ scale: 1.1, y: '-50%' }}
        whileTap={{ scale: 0.95, y: '-50%' }}
        initial={{ y: '-50%' }}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </motion.button>
    ),
    right: canScrollRight && (
      <motion.button
        onClick={() => scroll('right')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-[#191716]/90 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-800"
        whileHover={{ scale: 1.1, y: '-50%' }}
        whileTap={{ scale: 0.95, y: '-50%' }}
        initial={{ y: '-50%' }}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </motion.button>
    )
  }), [canScrollLeft, canScrollRight, scroll]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Don't initiate drag if clicking on a button or link
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a') || 
        target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    setIsProjectPaused(true);
    setIsDragging(true);
    setDragDistance(0);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    if (scrollContainerRef.current) {
      setScrollStartX(scrollContainerRef.current.scrollLeft);
    }
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const distance = Math.abs(dragStartX - clientX);
    setDragDistance(distance);
    
    if (distance > DRAG_THRESHOLD) {
      e.preventDefault();
      const drag = dragStartX - clientX;
      scrollContainerRef.current.scrollLeft = scrollStartX + drag;
    }
  }, [isDragging, dragStartX, scrollStartX]);

  const handleDragEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (dragDistance <= DRAG_THRESHOLD) {
      // If the movement was small, treat it as a click
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        // Don't interfere with link clicks
        return;
      }
    }
    setIsDragging(false);
    setTimeout(() => setIsProjectPaused(false), 1000);
  }, [dragDistance]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    setIsProjectPaused(true);
    setIsDragging(true);
    if (scrollContainerRef.current) {
      setScrollStartX(scrollContainerRef.current.scrollLeft);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current || touchStartRef.current === null) return;
    
    const touch = e.touches[0];
    const drag = touchStartRef.current - touch.clientX;
    scrollContainerRef.current.scrollLeft = scrollStartX + drag;
  }, [isDragging, scrollStartX]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setIsProjectPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setIsProjectPaused(false);
  }, []);

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [checkScrollPosition]);

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <section id="projects" className="py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isPaused ? 0 : 0.5 }}
      >
        <SectionHeader 
          title={['Projects', 'My Work', 'Portfolio', 'Projects']}
        />
        
        <div className="relative mt-10">
          {/* Navigation arrows with improved visibility */}
          {navigationButtons.left}
          {navigationButtons.right}
          
          {/* Project cards container */}
          <div 
            ref={scrollContainerRef}
            className="relative flex gap-6 py-10 px-4 overflow-x-auto scrollbar-hide"
            onScroll={handleScroll}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={(e) => {
              handleDragEnd(e);
              handleMouseLeave();
            }}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
            style={{ 
              pointerEvents: 'auto',
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y pinch-zoom',
              WebkitOverflowScrolling: 'touch',
              position: 'relative'
            }}
          >
            <motion.div
              className="flex gap-6 min-w-max relative"
              animate={!isProjectPaused && !isHovering ? { 
                x: [0, '-100%']
              } : {}}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2
                }
              }}
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
            >
              {[...projects, ...projects].map((project, index) => (
                <AnimatedCard
                  key={`${project.title}-${index}`}
                  index={index}
                  className="w-[300px] md:w-[400px] flex-shrink-0 group hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Project Image */}
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 300px, 400px"
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardHeader className="relative">
                    {/* Category Badge */}
                    <div className="absolute -top-4 left-4">
                      <Badge variant="secondary" className="bg-[#3d348b] text-white dark:bg-[#e6af2e] dark:text-[#191716]">
                        {project.category}
                      </Badge>
                    </div>

                    <CardTitle className="text-xl font-semibold text-[#3d348b] dark:text-[#e6af2e] mt-2">
                      {project.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{project.date}</span>
                    </div>

                    <CardDescription className="mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter 
                    className="mt-auto space-x-2" 
                    style={{ cursor: 'default' }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <ProjectButton
                      href={project.demoLink}
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      Live Demo
                    </ProjectButton>
                    <ProjectButton
                      href={project.githubLink}
                      icon={<Github className="w-4 h-4" />}
                    >
                      Source
                    </ProjectButton>
                  </CardFooter>
                </AnimatedCard>
              ))}
            </motion.div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex
                    ? 'bg-[#3d348b] dark:bg-[#e6af2e]'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;