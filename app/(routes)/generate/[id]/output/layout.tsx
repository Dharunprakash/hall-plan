import React from "react"

import SideBar from "../_components/side-bar"
import GeneratePlanButton from "./_components/generate-plan-button"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-full w-full">
      <SideBar />
      <div className="max-h-[82vh] w-full overflow-y-auto">
        <div className="flex w-full justify-end">
          <GeneratePlanButton />
        </div>
        <div className="h-full w-full">{children}</div>
      </div>
    </main>
  )
}

export default layout
