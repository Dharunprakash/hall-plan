import React, { memo } from "react"
import { CheckIcon, EditIcon, XIcon } from "lucide-react"

interface HallMetaDataProps {
  departmentCode: string
  hallno: number
  isEditing: boolean
  cancelEditing: () => void
  toggleEditing: () => void
  handleSubmit: () => void
}

const HallMetaData: React.FC<HallMetaDataProps> = ({
  departmentCode,
  hallno,
  isEditing,
  cancelEditing,
  toggleEditing,
  handleSubmit,
}) => {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <h1 className="text-xl font-semibold">
        {departmentCode.substring(0, 2)}
        {hallno}
      </h1>
      <button
        className="flex cursor-pointer rounded-md p-1 transition-all hover:bg-slate-500 hover:text-white"
        onClick={isEditing ? cancelEditing : toggleEditing}
      >
        {isEditing ? (
          <XIcon className="h-4 w-4 text-red-500" />
        ) : (
          <EditIcon className="h-4 w-4" />
        )}
      </button>
      {isEditing && (
        <button
          className="flex cursor-pointer rounded-md p-1 transition-all hover:bg-slate-500 hover:text-white"
          onClick={handleSubmit}
        >
          <CheckIcon className="h-4 w-4 text-green-500" />
        </button>
      )}
    </div>
  )
}

export default memo(HallMetaData)
