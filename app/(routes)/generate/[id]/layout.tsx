import React from "react"

import TabsBar from "./_components/tabs-bar"

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-full max-h-full w-full flex-col gap-1 overflow-y-auto">
      <div>
        <TabsBar className="" />
      </div>
      <div className="w-full">{children}</div>
    </main>
  )
}

export default layout
