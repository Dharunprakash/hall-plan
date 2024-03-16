import { Hall, Seat } from "@prisma/client"

export type HallWithSeats = Hall & {
  seats: Seat[]
}
