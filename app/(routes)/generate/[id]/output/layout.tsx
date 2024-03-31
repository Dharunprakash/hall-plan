import React from "react"

import SideBar from "../_components/side-bar"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-full w-full">
      <SideBar />
      <div className="max-h-[82vh] w-full overflow-y-auto">{children}</div>
    </main>
  )
}

export default layout
