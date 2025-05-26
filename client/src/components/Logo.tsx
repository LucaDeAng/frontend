import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'auto';
  showFullName?: boolean;
  className?: string;
}

export default function Logo({ 
  size = 'md', 
  variant = 'auto', 
  showFullName = true,
  className = '' 
}: LogoProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'text-sm',
      icon: 'text-xs',
      spacing: 'space-x-2'
    },
    md: {
      container: 'text-lg',
      icon: 'text-sm',
      spacing: 'space-x-3'
    },
    lg: {
      container: 'text-xl',
      icon: 'text-lg',
      spacing: 'space-x-4'
    }
  };

  // Color configurations
  const getColorClasses = () => {
    if (variant === 'light') {
      return {
        text: 'text-black',
        accent: 'text-gray-700',
        icon: 'text-gray-600',
        border: 'border-gray-300'
      };
    } else if (variant === 'dark') {
      return {
        text: 'text-white',
        accent: 'text-gray-300',
        icon: 'text-gray-400',
        border: 'border-gray-600'
      };
    } else {
      // Auto - works on both light and dark backgrounds
      return {
        text: 'text-gray-900 dark:text-white',
        accent: 'text-gray-600 dark:text-gray-300',
        icon: 'text-gray-500 dark:text-gray-400',
        border: 'border-gray-400 dark:border-gray-500'
      };
    }
  };

  const colors = getColorClasses();
  const config = sizeConfig[size];

  return (
    <motion.div 
      className={`flex items-center ${config.spacing} font-mono ${config.container} ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <motion.div 
        className={`flex items-center justify-center w-8 h-8 ${colors.icon} ${colors.border} border rounded-md ${config.icon} font-bold`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Terminal/Code Icon */}
        <span className="font-mono leading-none">{'>'}_</span>
      </motion.div>

      {/* Name */}
      <div className="flex items-baseline">
        {showFullName ? (
          <div className="flex items-baseline space-x-1">
            {/* Luca - emphasized */}
            <motion.span 
              className={`font-bold tracking-wider ${colors.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Luca
            </motion.span>
            
            {/* De Angelis - softer */}
            <motion.span 
              className={`font-medium tracking-wide ${colors.accent}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              De Angelis
            </motion.span>
          </div>
        ) : (
          /* Abbreviated version LdA */
          <div className="flex items-center">
            <motion.span 
              className={`font-bold tracking-widest ${colors.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              L
            </motion.span>
            <motion.span 
              className={`font-light tracking-wider ${colors.accent} mx-0.5`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              d
            </motion.span>
            <motion.span 
              className={`font-bold tracking-widest ${colors.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A
            </motion.span>
          </div>
        )}
      </div>

      {/* Subtle underline animation */}
      <motion.div
        className={`absolute bottom-0 left-0 w-full h-px ${colors.accent} origin-left`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </motion.div>
  );
}

// Alternative version with circuit-style icon
export function LogoWithCircuit({ 
  size = 'md', 
  variant = 'auto', 
  showFullName = true,
  className = '' 
}: LogoProps) {
  const sizeConfig = {
    sm: { container: 'text-sm', spacing: 'space-x-2' },
    md: { container: 'text-lg', spacing: 'space-x-3' },
    lg: { container: 'text-xl', spacing: 'space-x-4' }
  };

  const getColorClasses = () => {
    if (variant === 'light') {
      return { text: 'text-black', accent: 'text-gray-700', icon: 'text-gray-600' };
    } else if (variant === 'dark') {
      return { text: 'text-white', accent: 'text-gray-300', icon: 'text-gray-400' };
    } else {
      return { text: 'text-gray-900 dark:text-white', accent: 'text-gray-600 dark:text-gray-300', icon: 'text-gray-500 dark:text-gray-400' };
    }
  };

  const colors = getColorClasses();
  const config = sizeConfig[size];

  return (
    <motion.div 
      className={`flex items-center ${config.spacing} font-mono ${config.container} ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Circuit Icon */}
      <motion.div 
        className={`${colors.icon}`}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="6" cy="18" r="1.5" fill="currentColor"/>
          <circle cx="18" cy="18" r="1.5" fill="currentColor"/>
          <path d="M7.5 6h9M6 7.5v9M7.5 18h9M18 7.5v9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </motion.div>

      {/* Name */}
      <div className="flex items-baseline">
        {showFullName ? (
          <div className="flex items-baseline space-x-1">
            <motion.span 
              className={`font-bold tracking-wider ${colors.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Luca
            </motion.span>
            <motion.span 
              className={`font-medium tracking-wide ${colors.accent}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              De Angelis
            </motion.span>
          </div>
        ) : (
          <div className="flex items-center">
            <motion.span className={`font-bold tracking-widest ${colors.text}`}>L</motion.span>
            <motion.span className={`font-light tracking-wider ${colors.accent} mx-0.5`}>d</motion.span>
            <motion.span className={`font-bold tracking-widest ${colors.text}`}>A</motion.span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Spark version
export function LogoWithSpark({ 
  size = 'md', 
  variant = 'auto', 
  showFullName = true,
  className = '' 
}: LogoProps) {
  const sizeConfig = {
    sm: { container: 'text-sm', spacing: 'space-x-2' },
    md: { container: 'text-lg', spacing: 'space-x-3' },
    lg: { container: 'text-xl', spacing: 'space-x-4' }
  };

  const getColorClasses = () => {
    if (variant === 'light') {
      return { text: 'text-black', accent: 'text-gray-700', icon: 'text-gray-600' };
    } else if (variant === 'dark') {
      return { text: 'text-white', accent: 'text-gray-300', icon: 'text-gray-400' };
    } else {
      return { text: 'text-gray-900 dark:text-white', accent: 'text-gray-600 dark:text-gray-300', icon: 'text-gray-500 dark:text-gray-400' };
    }
  };

  const colors = getColorClasses();
  const config = sizeConfig[size];

  return (
    <motion.div 
      className={`flex items-center ${config.spacing} font-mono ${config.container} ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Spark Icon */}
      <motion.div 
        className={`${colors.icon} font-mono text-lg`}
        whileHover={{ scale: 1.1, rotate: 12 }}
        transition={{ duration: 0.2 }}
      >
        ✦
      </motion.div>

      {/* Name */}
      <div className="flex items-baseline">
        {showFullName ? (
          <div className="flex items-baseline space-x-1">
            <motion.span 
              className={`font-bold tracking-wider ${colors.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Luca
            </motion.span>
            <motion.span 
              className={`font-medium tracking-wide ${colors.accent}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              De Angelis
            </motion.span>
          </div>
        ) : (
          <div className="flex items-center">
            <motion.span className={`font-bold tracking-widest ${colors.text}`}>L</motion.span>
            <motion.span className={`font-light tracking-wider ${colors.accent} mx-0.5`}>d</motion.span>
            <motion.span className={`font-bold tracking-widest ${colors.text}`}>A</motion.span>
          </div>
        )}
      </div>
    </motion.div>
  );
}