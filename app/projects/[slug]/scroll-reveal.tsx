"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ProjectScrollReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start 1.1", "start 0.3"] 
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.4], [5, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
    >
      <motion.div style={{ filter: blur }}>
        {children}
      </motion.div>
    </motion.div>
  );
};
