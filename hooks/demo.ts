import { StateCreator, create } from "zustand"
import { createWithEqualityFn } from "zustand/traditional"

// type FishState = {
//   fishes: number,
//   addFish: () => void
// }

// type BearState = {
//   bears: number,
//   addBear: () => void,
//   eatFish: () => void
// }

// type StoreState = FishState & {bear: BearState};

// export const createFishSlice: StateCreator<FishState,[]> = (set) => ({
//   fishes: 0,
//   addFish: () => set((state: FishState) => ({ fishes: state.fishes + 1 })),
// })

// export const createBearSlice: StateCreator<FishState,[]> = (set) => ({
//   bears: 0,
//   addBear: () => set((state: BearState) => ({ bears: state.bears + 1 })),
//   eatFish: () => set((state: StoreState) => ({ fishes: state.fishes - 1 })),
// })

// export const useBoundStore = create<StoreState>((...a) => ({
//   ...createFishSlice(...a),
//   bear: createBearSlice(...a),
// }))
