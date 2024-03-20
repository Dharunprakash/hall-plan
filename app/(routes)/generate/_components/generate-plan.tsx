"use client"

import React from "react"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import { ChevronDownIcon } from "lucide-react"

import { capitalize } from "@/lib/utils"
import NextuiModal from "@/components/modal/nextui-modal"
import { trpc } from "@/app/_trpc/client"

import { years } from "../../students/_components/data"
import HallHistory from "./hall-history-table"

export default function GeneratePlan() {
  return (
    <>
      <HallHistory />
    </>
  )
}
