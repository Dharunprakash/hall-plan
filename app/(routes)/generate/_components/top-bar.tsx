"use client"

import React from "react"
import { PlusIcon } from "lucide-react"

import GenerateDialogModal from "@/components/modal/generate-dialog-modal"

import Filters from "./filter"

const TopBar = () => {
  return (
    <section className="flex justify-between">
      <Filters />
      <GenerateDialogModal Icon={PlusIcon} />
    </section>
  )
}

export default TopBar
