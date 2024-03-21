import { z } from "zod"
import { create } from "zustand"

export type DurationDetails = {
  date: string
  timings: { fn: boolean; an: boolean }
}

interface DurationDetailsState {
  dates: string[]
  details: DurationDetails[]
  addDate: (date: string) => void
  removeDate: (date: string) => void
  setTimingsForDate: (
    date: string,
    timings: { fn: boolean; an: boolean }
  ) => void
}

export const useDurationDetails = create<DurationDetailsState>((set, get) => ({
  dates: [],
  details: [],
  addDate: (date) => {
    set((state) => {
      if (!state.dates.includes(date)) {
        return {
          dates: [...state.dates, date],
          details: [
            ...state.details,
            { date, timings: { fn: false, an: false } },
          ],
        }
      }
      return state
    })
  },
  removeDate: (date) => {
    set((state) => {
      return {
        dates: state.dates.filter((d) => d !== date),
        details: state.details.filter((d) => d.date !== date),
      }
    })
  },
  setTimingsForDate: (date, timings) => {
    set((state) => {
      return {
        ...state,
        details: state.details.map((d) => {
          if (d.date === date) {
            return { ...d, timings }
          }
          return d
        }),
      }
    })
  },
}))
