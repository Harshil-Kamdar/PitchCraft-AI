"use client"

import { motion } from "framer-motion"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function Logo({ size = "md", animated = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  }

  const LogoContent = () => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1"
        animate={animated ? { rotate: 360 } : {}}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
          {/* Inner elements */}
          <div className="relative w-3/4 h-3/4">
            {/* Central diamond */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 transform rotate-45"
              animate={animated ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            {/* Orbiting dots */}
            {[0, 120, 240].map((rotation, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transformOrigin: "0 0",
                }}
                animate={
                  animated
                    ? {
                        rotate: [rotation, rotation + 360],
                        x: size === "lg" ? -16 : size === "md" ? -12 : -8,
                        y: size === "lg" ? -16 : size === "md" ? -12 : -8,
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: index * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )

  return <LogoContent />
}
