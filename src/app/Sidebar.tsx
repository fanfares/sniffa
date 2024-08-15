import React from 'react'
import Image from "next/image";
import { useRequestStore } from './useRequestStore'

function Sidebar() {
  const { requests, currentRequestId, setCurrentRequest, deleteRequest } = useRequestStore()

  const sortedRequests = Object.values(requests).sort((a, b) => b.created_at - a.created_at)

  return (
    <>
      <Image className="pt-6" src="/nose.png" alt="nose" width={64} height={64} />
      <h2 className="text-stone-600 text-2xl font-bold mb-4 mt-4 text-center">&nbsp;&nbsp;&nbsp;&#xFE34;&#xFE34;&#xFE34;<br/>Sniffs</h2>
      <ul>
        {sortedRequests.map((request) => (
          <li
            key={request.id}
            className={`group relative mb-2 p-2 rounded cursor-pointer ${
              request.id === currentRequestId ? 'bg-stone-800 text-white' : 'hover:bg-stone-400 hover:text-stone-800 bg-stone-600'
            }`}
            onClick={() => setCurrentRequest(request.id)}
          >
            <span className="">{request.name}</span>
            <button
              className="absolute left-0 transform -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500 hover:text-red-700"
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