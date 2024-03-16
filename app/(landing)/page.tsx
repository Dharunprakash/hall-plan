import Link from "next/link"

import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
        <Link href="/auth/login">
          <Button>Sign in</Button>
        </Link>
      </p>
    </div>
  )
}
