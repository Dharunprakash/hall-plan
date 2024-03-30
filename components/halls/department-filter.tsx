"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from "@nextui-org/react"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import { trpc } from "@/app/_trpc/client"

const DepartmentFilter = () => {
  const departments = trpc.department.getAll.useQuery()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const newSearchParams = new URLSearchParams(searchParams.toString())

  useEffect(() => {
    if (departments.data && departments.data.length > 0) {
      if (!newSearchParams.get("dept")) {
        newSearchParams.set(
          "dept",
          departments.data
            .slice(0, 2)
            .map((d) => d.code)
            .join("-")
        )
        router.push(pathname + "?" + newSearchParams.toString())
      }
    }
  })
  if (!departments.data) return <Skeleton className="h-8 w-32" />

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            endContent={<ChevronDownIcon className="text-small" />}
            size="sm"
            variant="flat"
          >
            Dept
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Multiple selection example"
          variant="flat"
          closeOnSelect={false}
          disallowEmptySelection
          selectionMode="multiple"
          selectedKeys={
            newSearchParams.get("dept")
              ? new Set(newSearchParams.get("dept")?.split("-"))
              : "all"
          }
          onSelectionChange={(val) => {
            if (
              val === "all" ||
              Array.from(val).length === departments.data.length
            )
              newSearchParams.delete("dept")
            else newSearchParams.set("dept", Array.from(val).join("-"))
            router.push(pathname + "?" + newSearchParams.toString())
          }}
        >
          {departments.data.map((department) => (
            <DropdownItem key={department.code}>{department.code}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default DepartmentFilter
