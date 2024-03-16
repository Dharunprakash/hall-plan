import React from "react"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark:bg-grid-medium-white/[0.2] bg-grid-small-black/[0.2] relative h-screen w-screen bg-white dark:bg-black">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      {children}
    </div>
  )
}

export default layout
