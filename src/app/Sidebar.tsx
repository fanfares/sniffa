import React from 'react'
import { useRequestStore } from './useRequestStore'

function Sidebar() {
  const { requests, currentRequestId, setCurrentRequest, deleteRequest } = useRequestStore()

  const sortedRequests = Object.values(requests).sort((a, b) => b.createdAt - a.createdAt)

  return (
    <>
      <h2 className="text-stone-600 text-xl font-bold mb-4 mt-8">Requests</h2>
      <ul>
        {sortedRequests.map((request) => (
          <li
            key={request.id}
            className={`mb-2 p-2 rounded cursor-pointer ${
              request.id === currentRequestId ? 'bg-indigo-500 text-white' : 'hover:bg-stone-400'
            }`}
            onClick={() => setCurrentRequest(request.id)}
          >
            <span>{request.name}</span>
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