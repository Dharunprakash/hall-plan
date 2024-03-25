import { StateCreator, create } from "zustand"

export type DurationDetails = {
  date: string
  timings: { fn: boolean; an: boolean }
}

type UseDurationDetails = {
  isAnSelected: boolean
  isFnSelected: boolean
  details: DurationDetails[]
  getDates: () => string[]
  addDate: (date: string) => void
  removeDate: (date: string) => void
  setDates: (dates: string[]) => void
  setTimingsForDate: (
    date: string,
    timings: { fn: boolean; an: boolean }
  ) => void
}

type MyStateCreator = StateCreator<UseDurationDetails, []>

const durationDetailsStore: MyStateCreator = (set, get) => ({
  isAnSelected: false,
  isFnSelected: false,
  details: [],
  getDates: () => get().details.map((d) => d.date),
  addDate: (date) => {
    if (get().details.find((d) => d.date === date)) return
    set((state) => {
      return {
        details: [
          ...state.details,
          { date: date, timings: { fn: false, an: false } },
        ],
      }
    })
  },
  removeDate: (date) => {
    set((state) => {
      return {
        details: state.details.filter((d) => d.date !== date),
      }
    })
  },
  setDates: (dates) => {
    set((state) => {
      return {
        details: dates.map((date) => {
          const existing = state.details.find((d) => d.date === date)
          if (existing) return existing
          return { date: date, timings: { fn: false, an: false } }
        }),
      }
    })
  },
  setTimingsForDate: (date, timings) => {
    set((state) => {
      let isAn = false
      let isFn = false
      const res = {
        details: state.details.map((d) => {
          isAn = isAn || (d.date === date ? timings.an : d.timings.an)
          isFn = isFn || (d.date === date ? timings.fn : d.timings.fn)
          if (d.date === date) {
            return { ...d, timings }
          }
          return d
        }),
        isAnSelected: isAn,
        isFnSelected: isFn,
      }
      return res
    })
  },
})

export const useDurationDetails = create(durationDetailsStore)
