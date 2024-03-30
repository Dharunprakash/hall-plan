"use client"

import React, { useMemo } from "react"
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react"
import { ChevronDownIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react"
import toast from "react-hot-toast"

import { StudentWithDept, StudentWithDeptWithActions } from "@/types/student"
import { capitalize, intToRoman } from "@/lib/utils"
import DialogModal from "@/components/modal/dialog-modal"
import { trpc } from "@/app/_trpc/client"

import {
  columns,
  departments,
  years,
} from "../../app/(routes)/students/_components/data"
import ExcelForm from "../../app/(routes)/students/_components/excel-form"
import StudentForm from "../../app/(routes)/students/_components/student-form"

const INITIAL_VISIBLE_COLUMNS = [
  "rollno",
  "regno",
  "name",
  "department",
  "year",
  "section",
  "vertical",
  "actions",
]

export default function StudentTable({ data }: { data: StudentWithDept[] }) {
  const utils = trpc.useUtils()
  const deleteUser = trpc.student.delete.useMutation({
    onSuccess: () => {
      utils.student.getAll.invalidate()
      toast.success(" deleted successfully")
    },
    onError: (error) => {
      toast.error("Error: " + error.message)
    },
  })

  const [rowsPerPage, setRowsPerPage] = React.useState(70)
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  )
  const [deptFilter, setDeptFilter] = React.useState<Selection>("all")
  const [filterValue, setFilterValue] = React.useState("")

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]))

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  })
  const [page, setPage] = React.useState(1)

  const handleClick = async (id: string) => {
    await deleteUser.mutateAsync(id)
  }
  console.log(data)
  const students: StudentWithDept[] = useMemo(() => data || [], [data])

  const pages = Math.ceil(students?.length || 0 / rowsPerPage)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredUsers: StudentWithDept[] = students ? [...students] : []

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user?.name?.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    if (
      deptFilter !== "all" &&
      Array.from(deptFilter).length !== years.length
    ) {
      // filteredUsers = filteredUsers.filter((user) =>
      //   Array.from(deptFilter).includes(user?.userRole!)
      // )
    }

    if (
      deptFilter !== "all" &&
      Array.from(deptFilter).length !== departments.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(deptFilter).includes(user?.department.code!)
      )
    }

    return filteredUsers
  }, [students, filterValue, deptFilter, hasSearchFilter])

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo((): StudentWithDept[] => {
    return [...items].sort((a: StudentWithDept, b: StudentWithDept) => {
      const first =
        (a![
          sortDescriptor.column as keyof StudentWithDept
        ] as unknown as number) || 0
      const second =
        (b![
          sortDescriptor.column as keyof StudentWithDept
        ] as unknown as number) || 0
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === "descending" ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const renderCell = React.useCallback(
    (
      user: StudentWithDept,
      columnKey: keyof StudentWithDeptWithActions
    ): JSX.Element => {
      switch (columnKey) {
        case "department":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny text-default-400 capitalize">
                {user.department.code}
              </p>
            </div>
          )
        case "year":
        case "semester":
          console.log(columnKey)
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny text-default-400 capitalize">
                {intToRoman(user[columnKey])}
              </p>
            </div>
          )
        case "actions":
          console.log(user)
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit fleet">
                <span className="text-default-400 cursor-pointer text-lg active:opacity-50">
                  <DialogModal
                    title="Edit StudentWithDept"
                    description="Edit the student details"
                  >
                    <StudentForm />
                  </DialogModal>
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete fleet">
                <span className="text-danger cursor-pointer text-lg active:opacity-50">
                  <Trash2Icon
                    width={15}
                    height={15}
                    onClick={() => handleClick(user?.id)}
                  />
                </span>
              </Tooltip>
            </div>
          )
        default:
          return (
            <div className="flex flex-col">
              <p className="text-bold text-tiny text-default-400 capitalize">
                {user[columnKey]?.toString()}
              </p>
            </div>
          )
      }
    },
    []
  )

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
    },
    []
  )

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue("")
    }
  }, [])

  const topContent = React.useMemo(() => {
    return (
      <div className="ml-6 flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Year
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={deptFilter}
                selectionMode="multiple"
                onSelectionChange={setDeptFilter}
              >
                {years.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Dept
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={deptFilter}
                selectionMode="multiple"
                onSelectionChange={setDeptFilter}
              >
                {departments.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <div className="">
              <DialogModal
                title="Add StudentWithDept"
                description="Upload a student details excel file per year to update or create records"
                trigger={
                  <button className="h-8 rounded-md bg-gray-300 p-1 px-3 text-xs hover:bg-gray-200">
                    Upload a file
                  </button>
                }
              >
                <ExcelForm />
              </DialogModal>
            </div>
            <div className="flex items-center justify-center rounded-full bg-slate-100 px-1">
              <DialogModal
                title="Add StudentWithDept"
                description="Add a new student to the college."
                trigger={<PlusIcon />}
              >
                <StudentForm />
              </DialogModal>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {students?.length} students
          </span>
          <label className="text-small text-default-400 flex items-center">
            Rows per page:
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  {rowsPerPage}
                </Button>
              </DropdownTrigger>
              <DropdownMenu onChange={() => onRowsPerPageChange}>
                <DropdownItem onClick={() => setRowsPerPage(35)}>
                  35
                </DropdownItem>
                <DropdownItem onClick={() => setRowsPerPage(50)}>
                  50
                </DropdownItem>
                <DropdownItem onClick={() => setRowsPerPage(70)}>
                  70
                </DropdownItem>
                <DropdownItem onClick={() => setRowsPerPage(100)}>
                  100
                </DropdownItem>
                <DropdownItem onClick={() => setRowsPerPage(400)}>
                  400
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </label>
        </div>
      </div>
    )
  }, [
    filterValue,
    deptFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    rowsPerPage,
    setRowsPerPage,
    students?.length,
  ])

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex flex-row">
        <div className="flex w-full items-center justify-center p-2">
          <Pagination
            showControls
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="default"
            isDisabled={hasSearchFilter}
            page={page}
            total={Math.ceil(pages / rowsPerPage)}
            variant="light"
            onChange={setPage}
          />
        </div>
        <div className="w-1/4 ">
          <div className="ml-auto">
            <span className="text-small text-default-400 relative right-0">
              {selectedKeys === "all"
                ? "All items selected"
                : `${selectedKeys.size} of ${items.length} selected`}
            </span>
          </div>
        </div>
      </div>
    )
  }, [hasSearchFilter, page, pages, rowsPerPage, selectedKeys, items.length])

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        "group-data-[middle=true]:before:rounded-none",
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    []
  )

  return (
    <div className="overflow-y-hidden p-2">
      <h2 className="mb-2 ml-4 text-2xl font-semibold">Students</h2>
      <Table
        isCompact
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background ml-4",
          },
        }}
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No students found"} items={sortedItems}>
          {(item: StudentWithDept) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(
                    item,
                    columnKey as keyof StudentWithDeptWithActions
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
