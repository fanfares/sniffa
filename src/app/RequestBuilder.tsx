import React from 'react'
import { useRequestStore } from './useRequestStore'
import RequestForm from './RequestForm'

function RequestBuilder() {
  const { requests, currentRequestId, createRequest } = useRequestStore()

  const currentRequest = currentRequestId ? requests[currentRequestId] : null

  const handleNewRequest = () => {
    createRequest('name this request')
  }

  return (
    <section className="request-builder">
      <h2 className="text-2xl font-bold mb-4 text-stone-700">Nostr Filter Builder</h2>
      {currentRequest ? (
        <RequestForm request={currentRequest} />
      ) : (
        <button
          className="bg-stone-500 text-white px-4 py-2 rounded hover:bg-stone-600"
          onClick={handleNewRequest}
        >
          Create New Request
        </button>
      )}
    </section>
  )
}

export default RequestBuilder