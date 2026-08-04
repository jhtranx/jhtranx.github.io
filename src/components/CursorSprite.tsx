import React, { useState, useEffect, useRef } from 'react';

// Import all sprite images
import down from '../assets/pikachu cursor/down.png';
import down1 from '../assets/pikachu cursor/down1.png';
import down2 from '../assets/pikachu cursor/down2.png';
import up from '../assets/pikachu cursor/up.png';
import up1 from '../assets/pikachu cursor/up1.png';
import up2 from '../assets/pikachu cursor/up2.png';
import left from '../assets/pikachu cursor/left.png';
import left1 from '../assets/pikachu cursor/left1.png';
import left2 from '../assets/pikachu cursor/left2.png';
import right from '../assets/pikachu cursor/right.png';
import right1 from '../assets/pikachu cursor/right1.png';
import right2 from '../assets/pikachu cursor/right2.png';

type Direction = 'up' | 'down' | 'left' | 'right';

const CursorSprite: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [shouldMove, setShouldMove] = useState(false);
  const [isTogether, setIsTogether] = useState(false);
  const animationRef = useRef<number | null>(null);
  const delayRef = useRef<number | null>(null);
  const togetherTimeRef = useRef(0);

  // Sprite mapping for each direction
  const spriteFrames = {
    up: [up, up1, up2],
    down: [down, down1, down2],
    left: [left, left1, left2],
    right: [right, right1, right2],
  };

  // Calculate direction based on movement
  const calculateDirection = (deltaX: number, deltaY: number): Direction => {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Prioritize horizontal movement over vertical
    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  };

  // Handle mouse movement - only track cursor position
  const handleMouseMove = (e: MouseEvent) => {
    const newPosition = { x: e.clientX, y: e.clientY };
    setPosition(newPosition);
    
    // Clear any existing delay
    if (delayRef.current) {
      clearTimeout(delayRef.current);
    }
    
    // Set a delay before sprite starts moving
    delayRef.current = window.setTimeout(() => {
      setShouldMove(true);
    }, 2000); // 2 second delay
  };

  // Smooth trailing movement using requestAnimationFrame
  useEffect(() => {
    let rafId: number;
    const speed = 150; // pixels per second
    let lastTime = Date.now();
    
    const updatePosition = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      
      // Only move if shouldMove is true
      if (shouldMove) {
        // Calculate distance and direction from sprite to cursor
        const dx = position.x - spritePosition.x;
        const dy = position.y - spritePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          // Move toward cursor at constant speed
          const moveDistance = Math.min(speed * deltaTime, distance);
          const ratio = moveDistance / distance;
          
          setSpritePosition(prev => ({
            x: prev.x + dx * ratio,
            y: prev.y + dy * ratio
          }));
          
          setDirection(calculateDirection(dx, dy));
          setIsMoving(true);
          
          // Reset together time and state when moving
          togetherTimeRef.current = 0;
          setIsTogether(false);
        } else {
          // Sprite and cursor are together
          setIsMoving(false);
          togetherTimeRef.current += deltaTime;
          
          // Set to down direction when together for 0.5 seconds
          if (togetherTimeRef.current >= 0.5) {
            setIsTogether(true);
            setDirection('down');
          }
          
          // If together for 1+ seconds, reset the delay
          if (togetherTimeRef.current >= 1) {
            setShouldMove(false);
            setIsTogether(false);
            togetherTimeRef.current = 0;
          }
        }
      }
      
      rafId = requestAnimationFrame(updatePosition);
    };
    
    rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, [position, spritePosition, shouldMove]);

  // Animation loop for sprite frames
  useEffect(() => {
    if (isMoving) {
      animationRef.current = window.setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % 3);
      }, 50);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      // When together for 0.5+ seconds, show down.png (frame 0)
      // Otherwise show idle frame
      setCurrentFrame(isTogether ? 0 : 0);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isMoving, isTogether]);

  // Set up mouse event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (delayRef.current) {
        clearTimeout(delayRef.current);
      }
    };
  }, []);

  return (
    <div
      className="cursor-sprite"
      style={{
        position: 'fixed',
        left: spritePosition.x - 16, // Center the sprite on its position
        top: spritePosition.y - 16,
        width: '32px',
        height: '32px',
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundImage: `url(${spriteFrames[direction][currentFrame]})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    />
  );
};

export default CursorSprite;
