import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export type Filter = {
  ids: string[]
  authors: string[]
  kinds: string[]
  "#e": string[]
  "#p": string[]
  "#t": string[]
  since?: number
  until?: number
  limit?: number
}

export type Request = {
  id: string
  name: string
  filter: Filter
  createdAt: number
}

type RequestStore = {
  requests: { [id: string]: Request }
  currentRequestId: string | null
  createRequest: (name: string) => void
  updateRequest: (id: string, updates: Partial<Request>) => void
  deleteRequest: (id: string) => void
  setCurrentRequest: (id: string) => void
}

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      requests: {},
      currentRequestId: null,
      createRequest: (name) => {
        const id = uuidv4()
        set((state) => ({
          requests: {
            ...state.requests,
            [id]: {
              id,
              name,
              filter: { ids: [], authors: [], kinds: [], "#e": [], "#p": [], "#t": [] },
              createdAt: Date.now(),
            },
          },
          currentRequestId: id,
        }))
      },
      updateRequest: (id, updates) => {
        set((state) => ({
          requests: {
            ...state.requests,
            [id]: { ...state.requests[id], ...updates },
          },
        }))
      },
      deleteRequest: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.requests
          return { requests: rest, currentRequestId: null }
        })
      },
      setCurrentRequest: (id) => {
        set({ currentRequestId: id })
      },
    }),
    {
      name: 'sniffa-requests',
    }
  )
)