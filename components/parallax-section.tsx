"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface ParallaxSectionProps {
  children: React.ReactNode
  backgroundImage?: string
  speed?: number
  className?: string
}

export default function ParallaxSection({
  children,
  backgroundImage,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return

      const scrolled = window.pageYOffset
      const parallax = parallaxRef.current
      const yPos = -(scrolled * speed)

      parallax.style.transform = `translate3d(0, ${yPos}px, 0)`
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [speed])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          <Image src={backgroundImage || "/placeholder.svg"} alt="" fill className="object-cover scale-110" priority />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
