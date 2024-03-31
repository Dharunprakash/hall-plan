import { $Enums, Seat } from "@prisma/client"

import { HallWithSeats } from "@/types/hall"

// Alternate                     Staggered
// 1 0 1 0 1                     1 0 1 0 1
// 1 0 1 0 1                     0 1 0 1 0
// 1 0 1 0 1                     1 0 1 0 1
// 1 0 1 0 1                     0 1 0 1 0
// 1 0 1 0 1                     1 0 1 0 1

// export const separateSeatsInto2groups = (
//   seats: Seat[],
//   type: "STAGGERED" | "ALTERNATE",
//   segregationType: "Maximal" | "Random" | "Minimal"
// ): [number, number] => {
//   const totalSeats = seats.length
//   const group1 = []
//   const group2 = []
//   if (segregationType === "Maximal") {
//     for (let i = 0; i < totalSeats; i++) {
//       if (seats[i].isBlocked) continue
//       if (i % 2 === 0) {
//         group1.push(seats[i])
//       } else {
//         group2.push(seats[i])
//       }
//     }
//   } else if (segregationType === "Random") {
//     for (let i = 0; i < totalSeats; i++) {
//       if (seats[i].isBlocked) continue
//       if (Math.random() < 0.5) {
//         group1.push(seats[i])
//       } else {
//         group2.push(seats[i])
//       }
//     }
//   } else {
//     for (let i = 0; i < totalSeats; i++) {
//       if (seats[i].isBlocked) continue
//       if (i % 2 === 0) {
//         group1.push(seats[i])
//       } else {
//         group2.push(seats[i])
//       }
//     }
//   }
//   return [group1.length, group2.length]
// }

export const separateSeatsInto2groups = (
  seats: Seat[],
  type: "STAGGERED" | "ALTERNATE"
): [number, number] => {
  const totalSeats = seats.length
  const group1 = []
  const group2 = []
  for (let i = 0; i < totalSeats; i++) {
    if (seats[i].isBlocked) continue
    if (type === "STAGGERED") {
      if (i % 2 === 0) {
        group1.push(seats[i])
      } else {
        group2.push(seats[i])
      }
    } else {
      if (seats[i].col % 2 === 0) {
        group1.push(seats[i])
      } else {
        group2.push(seats[i])
      }
    }
  }
  return [group1.length, group2.length]
}

export const separateSeatsInto2groupsForHalls = (
  halls: HallWithSeats[],
  type: $Enums.HallArrangementType,
  segregationType: "Maximal" | "Random" | "Minimal"
): {
  group1Cnt: number
  group2Cnt: number
  seatsTypeForHalls: (1 | 2)[]
} => {
  if (type === "NORMAL") {
    return {
      group1Cnt: halls.reduce(
        (acc, hall) =>
          acc +
          hall.seats.reduce((ac, seat) => ac + (seat.isBlocked ? 0 : 1), 0),
        0
      ),
      group2Cnt: 0,
      seatsTypeForHalls: Array(halls.length).fill(1),
    }
  }
  let [group1Cnt, group2Cnt] = [0, 0]
  let group1IsNotGreater = true
  const seatsTypeForHalls: (1 | 2)[] = []
  for (let hall of halls) {
    let [group1, group2] = separateSeatsInto2groups(hall.seats, type)
    switch (segregationType) {
      case "Maximal":
        group1Cnt += Math.max(group1, group2)
        group2Cnt += Math.min(group1, group2)
        seatsTypeForHalls.push(group1 >= group2 ? 1 : 2)
        break
      case "Random":
        if (Math.random() < 0.5) {
          group1Cnt += group1
          group2Cnt += group2
          seatsTypeForHalls.push(1)
        } else {
          group1Cnt += group2
          group2Cnt += group1
          seatsTypeForHalls.push(2)
        }
        break
      case "Minimal":
        if (group1IsNotGreater) {
          group1Cnt += Math.min(group1, group2)
          group2Cnt += Math.max(group1, group2)
          seatsTypeForHalls.push(group1 <= group2 ? 1 : 2)
        } else {
          group1Cnt += Math.max(group1, group2)
          group2Cnt += Math.min(group1, group2)
          seatsTypeForHalls.push(group1 >= group2 ? 1 : 2)
        }
        group1IsNotGreater = !group1IsNotGreater
        break
    }
  }
  return {
    group1Cnt,
    group2Cnt,
    seatsTypeForHalls,
  }
}
