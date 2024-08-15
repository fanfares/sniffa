import React, { useEffect } from 'react'
import { useRequestStore } from './useRequestStore'
import RequestForm from './RequestForm'
import CreateRequestButton from './CreateRequestButton'

function RequestBuilder() {
  const { requests, currentRequestId, createRequest } = useRequestStore()

  const currentRequest = currentRequestId ? requests[currentRequestId] : null

  const handleNewRequest = () => {
    createRequest('New Sniff ✨👃')
  }

  return (
    <section className="request-builder">
      <h2 className="text-2xl font-bold mb-2 text-stone-700">Nostr Filter Builder</h2>
      <CreateRequestButton handleNewRequest={handleNewRequest} />
      {currentRequest ? (
        <RequestForm request={currentRequest} />
      ) : null }
    </section>
  )
}

export default RequestBuilder