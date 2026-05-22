'use client'

import React from 'react'

export function MatrixBackground() {
  return (
    <>
      {/* Global Gradient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none z-[-1]" />
      
      {/* Matrix Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>
    </>
  )
}
