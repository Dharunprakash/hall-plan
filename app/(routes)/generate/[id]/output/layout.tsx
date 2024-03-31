import React from "react"

import GeneratePlanButton from "./_components/generate-plan-button"
import SideBar from "./_components/side-bar"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-full w-full">
      <SideBar />
      <div className="md:border-l-1 h-[82vh] w-full overflow-y-auto ">
        <div className="flex w-full justify-end">
          <GeneratePlanButton />
        </div>
        <div className="h-full w-full">{children}</div>
      </div>
    </main>
  )
}

export default layout
