import React from 'react'
import Image from "next/image";
import { useRequestStore } from './useRequestStore'

function Sidebar() {
  const { requests, currentRequestId, setCurrentRequest, deleteRequest } = useRequestStore()

  const sortedRequests = Object.values(requests).sort((a, b) => b.created_at - a.created_at)

  return (
    <>
      <Image className="pt-6" src="/nose.png" alt="nose" width={64} height={64} />
      <h2 className="text-stone-600 text-2xl font-bold mb-4 mt-4">Filters</h2>
      <ul>
        {sortedRequests.map((request) => (
          <li
            key={request.id}
            className={`mb-2 p-2 rounded cursor-pointer ${
              request.id === currentRequestId ? 'bg-stone-800 text-white' : 'hover:bg-stone-400'
            }`}
            onClick={() => setCurrentRequest(request.id)}
          >
            <span className="text-stone-300">{request.name}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                deleteRequest(request.id)
              }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Sidebar