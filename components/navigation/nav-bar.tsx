import React from "react"
import Image from "next/image"
import Link from "next/link"

import { routes } from "@/lib/constants"

import { LogoutButton } from "../auth/logout-button"
import { Button } from "../ui/button"
import Routes from "./routes"

const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex !h-16 items-center justify-between gap-3 border-b border-b-slate-100 bg-white p-4">
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <Link href="/" className="mx-2">
          <Image src="/next.svg" alt="logo" width={40} height={40} />
        </Link>
        <Routes />
      </div>
      <div>
        <Link href="/auth/login">
          <Button className="rounded-lg p-1 px-3 transition">
            <LogoutButton>Logout</LogoutButton>
          </Button>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
