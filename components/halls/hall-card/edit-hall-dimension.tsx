import { memo } from "react"

import { Input } from "@/components/ui/input"

const EditHallDimension = ({
  name,
  isEditing,
  setDimension,
  dimension,
}: {
  name: string
  isEditing: boolean
  setDimension: (value: number) => void
  dimension: number
}) => {
  return (
    <div>
      <div className="flex items-center gap-1">
        <p>{name}:</p>
        {isEditing ? (
          <Input
            className="!-mt-[0.05rem] !h-5"
            value={dimension}
            onChange={(e) =>
              setDimension(
                e.target.valueAsNumber <= 0 ? NaN : e.target.valueAsNumber
              )
            }
            placeholder={name}
            type="number"
          />
        ) : (
          <span>{dimension}</span>
        )}
      </div>
      <div>
        {isEditing && !dimension && (
          <p className="text-xs text-red-600">
            {name} can&apos;t be less than 1
          </p>
        )}
      </div>
    </div>
  )
}

export default memo(EditHallDimension)
