import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = "" }: CardProps) {
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 100], [15, -15])
  const rotateY = useTransform(x, [-100, 100], [15, -15])
  
  const lightingX = useTransform(x, [-100, 0, 100], [0, 1, 0])
  const lightingY = useTransform(y, [-100, 0, 100], [0, 1, 0])

  

  const background = useMotionTemplate`
    linear-gradient(135deg, 
      rgba(255, 255, 255, ${lightingX}) 0%, 
      rgba(255, 255, 255, ${lightingY}) 100%
    )
  `

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY
    
    x.set(mouseX)
    y.set(mouseY)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 2.0,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={{ 
        scale: 1.05,
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        backgroundImage: background,
        borderRadius: '12px',
        maxWidth: '800px'
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  )
} 