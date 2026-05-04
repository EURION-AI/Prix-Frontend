'use client'

import React, { useEffect, useRef } from 'react'

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Characters to use (mix of binary and technical symbols)
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\|+=_-'
    const charArray = chars.split('')

    const fontSize = 14
    const columns = Math.floor(width / fontSize)
    const drops: number[] = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100 // Start at different heights
    }

    let animationFrameId: number

    const draw = () => {
      // Very subtle background fade for the trail
      ctx.fillStyle = 'rgba(5, 5, 8, 0.1)'
      ctx.fillRect(0, 0, width, height)

      // Set the character style - using primary pink color with variations
      ctx.font = `${fontSize}px JetBrains Mono, monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        
        // Varying opacity for depth
        const opacity = Math.random() * 0.15 + 0.05
        ctx.fillStyle = `rgba(236, 72, 153, ${opacity})` // Pink (primary)

        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Reset drop to top if it goes off screen
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Increment drop position
        drops[i] += 0.5 // Slow and steady
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      // Re-initialize drops if columns change significantly
      const newColumns = Math.floor(width / fontSize)
      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100
        }
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {/* Global Gradient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none z-[-2]" />
      
      {/* Matrix Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[-1]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none opacity-[0.4] z-[-1]"
        style={{ mixBlendMode: 'screen' }}
      />
    </>
  )
}
