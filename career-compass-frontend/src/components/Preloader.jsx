import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

const Preloader = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a short delay to ensure the animation is seen
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const preloaderVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const compassVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-white z-50 overflow-hidden"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={preloaderVariants}
    >
      <div className="flex flex-col items-center">
        {/* Animated Compass Icon */}
        <motion.div
          variants={compassVariants}
          animate="animate"
          className="relative"
        >
          <Compass
            size={150}
            className="text-teal-400 drop-shadow-lg"
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 1.8,
              ease: "easeInOut",
            }}
          >
            <Compass size={80} className="text-teal-400 opacity-20" />
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
          className="mt-8 text-xl md:text-2xl font-semibold text-gray-300 tracking-wider text-center"
        >
          Charting your <span className="text-teal-400">future</span>...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Preloader;