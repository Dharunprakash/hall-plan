import React from "react"

import Navbar from "@/components/navigation/nav-bar"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <div className="h-full w-full pt-16">{children}</div>
    </div>
  )
}

export default layout
