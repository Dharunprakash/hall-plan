import React from "react"

import TabsBar from "./_components/tabs-bar"

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-full w-full flex-col">
      <div>
        <TabsBar className="" />
      </div>
      <div className="">{children}</div>
    </main>
  )
}

export default layout
