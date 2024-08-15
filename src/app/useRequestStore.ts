import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { NDKEvent } from '@nostr-dev-kit/ndk'

export type Filter = {
  ids: string[]
  authors: string[]
  kinds: number[]
  [key: string]: string[] | number[] | number | undefined
  since?: number
  until?: number
  limit?: number
}

export type RawEvent = {
  id: string
  pubkey: string
  created_at: number
  kind: number
  tags: string[][]
  content: string
  sig: string
}

export type Request = {
  id: string
  name: string
  filter: Filter
  relays: string[]
  results: RawEvent[]
  created_at: number // this is just when we created the request, not related to nostr events created_at.
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
              filter: { ids: [], authors: [], kinds: [], limit: 20 },
              relays: ['wss://relay.primal.net'],  // Default relay
              results: [] as RawEvent[],
              created_at: Date.now(),
            },
          },
          currentRequestId: id,
        }))
      },
      updateRequest: (id, updates) => {
        set((state) => {
          const currentRequest = state.requests[id]
          let updatedFilter = updates.filter ? { ...currentRequest.filter, ...updates.filter } : currentRequest.filter

          if (updates.filter && 'kinds' in updates.filter) {
            updatedFilter.kinds = (updates.filter.kinds as (string | number)[]).map(kind => 
              typeof kind === 'string' ? parseInt(kind, 10) : kind
            ).filter(kind => !isNaN(kind))
          }

          return {
            requests: {
              ...state.requests,
              [id]: { 
                ...currentRequest,
                ...updates,
                filter: updatedFilter,
                relays: updates.relays || currentRequest.relays,
                results: updates.results || currentRequest.results,
              },
            },
          }
        })
      },
      deleteRequest: (id) => {
        set((state) => {
          const { [id]: _, ...rest } = state.requests
          return {
            requests: rest,
            currentRequestId: state.currentRequestId === id ? null : state.currentRequestId
          }
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