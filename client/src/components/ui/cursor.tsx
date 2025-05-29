import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over a clickable element
      const target = e.target as HTMLElement;
      const isHoverable = target.tagName === 'BUTTON' || 
                         target.tagName === 'A' || 
                         !!target.closest('button') ||
                         !!target.closest('a') ||
                         target.classList.contains('hoverable');
      
      setHovered(isHoverable);
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);
    
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    
    // Reset cursor style
    document.body.style.cursor = 'none';
    
    // Apply hoverable class to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
    interactiveElements.forEach(el => {
      el.classList.add('hoverable');
    });
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      
      document.body.style.cursor = '';
    };
  }, []);
  
  const variants = {
    default: {
      x: position.x,
      y: position.y,
      backgroundColor: 'rgba(34, 139, 230, 0.6)',
      mixBlendMode: 'difference' as 'difference',
      height: 20,
      width: 20,
      borderRadius: '50%',
    },
    hovered: {
      x: position.x,
      y: position.y,
      height: 36,
      width: 36,
      backgroundColor: 'rgba(56, 189, 248, 0.9)',
      mixBlendMode: 'difference' as 'difference',
      border: '2px solid rgba(255, 255, 255, 0.8)',
    },
    clicked: {
      x: position.x,
      y: position.y,
      height: 14,
      width: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      mixBlendMode: 'difference' as 'difference',
    },
    hidden: {
      x: position.x,
      y: position.y,
      opacity: 0,
    },
  };
  
  const cursorVariant = hidden ? 'hidden' : hovered ? 'hovered' : clicked ? 'clicked' : 'default';

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 400,
        mass: 0.2,
      }}
    />
  );
}