import React, { useState } from 'react'
import StringField from './StringField'
import NumberField from './NumberField'
import TimestampField from './TimestampField'
import { Request, useRequestStore } from './useRequestStore'
import { PlusCircle } from 'lucide-react'
import { NDKEvent, NDKFilter, NDKUser } from "@nostr-dev-kit/ndk"
import useNDKStore from './useNDKStore'

interface RequestFormProps {
  request: Request
}

function capitalizeEachWord(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function RequestForm({ request }: RequestFormProps) {
  console.log(request)
  const updateRequest = useRequestStore((state) => state.updateRequest)
  const { initNDK, fetchEvents } = useNDKStore()
  const [newTag, setNewTag] = useState('')
  const [requestInProgress, setRequestInProgress] = useState(false)

  const handleChange = (field: keyof Request['filter'] | 'relays', value: string[] | number[] | number | undefined) => {
    if (field !== 'relays') {
      updateRequest(request.id, { filter: { ...request.filter, [field]: value } })
    }
  }

  const handleRelay = (values: string[]) => {
    const relayRegex = /^wss:\/\/[\w.-]+\.[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/
    const validRelays = values.filter(relay => relayRegex.test(relay))
    
    // Ensure there's always at least one valid relay
    const updatedRelays = validRelays.length > 0 ? validRelays : ['wss://relay.damus.io']
    
    updateRequest(request.id, { relays: updatedRelays })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterName = capitalizeEachWord(e.target.value)
    updateRequest(request.id, { name: filterName })
  }

  const handleAddTag = () => {
    if (newTag && newTag.length === 1 && /^[a-zA-Z]$/.test(newTag)) {
      updateRequest(request.id, { filter: { ...request.filter, [`#${newTag}`]: [] } })
      setNewTag('') // clear the input
    }
  }

  async function runRequest() {
    setRequestInProgress(true)
    await initNDK(request.relays, false)
    const filter = request.filter as NDKFilter
    const results = await fetchEvents(filter)
    updateRequest(request.id, { /* ??? */ }) // need to update useRequestStore to handle results
    setRequestInProgress(false)
  }

  const customTags = Object.entries(request.filter).filter(
    ([key]) => key.length === 2 && /^\#[a-zA-Z]$/.test(key)
  )


  return (
    <div className="bg-stone-700 p-4 rounded-lg">
      <label className="block text-sm font-medium text-stone-400 mb-1">Filter Name</label>
      <input
        className="bg-stone-800 text-stone-400 rounded px-2 py-1 w-full mb-4 placeholder-stone-700 text-[1.5em] font-black font-grandstander"
        type="text"
        value={request.name}
        onChange={handleNameChange}
        placeholder="Looking for memes"
      />
      <StringField 
        label="Relays" 
        values={request.relays} 
        onChange={handleRelay}
      />
      <StringField label="IDs" values={request.filter.ids as string[]} onChange={(values) => handleChange('ids', values)} />
      <StringField label="Authors" values={request.filter.authors as string[]} onChange={(values) => handleChange('authors', values)} />
      <StringField label="Kinds" values={request.filter.kinds.map(String)} onChange={(values) => handleChange('kinds', values.map(v => parseInt(v, 10)))} />
      
      {customTags.map(([tag, values]) => (
        <StringField
          key={tag}
          label={`${tag}`}
          values={values as string[]}
          onChange={(values) => handleChange(tag as keyof Request['filter'], values)}
        />
      ))}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-400 mb-1">Tags</label>
        <div className="flex items-center mb-2">
          <input
            className="bg-stone-800 text-stone-400 rounded px-2 py-1 w-full mr-2 placeholder-stone-700"
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add custom tag (single letter)"
            maxLength={1}
          />
          <PlusCircle
            className="ml-2 cursor-pointer text-indigo-400"
            size={24}
            onClick={handleAddTag}
          />
        </div>
      </div>

      <TimestampField
        label="Since"
        value={request.filter.since as number | undefined}
        onChange={(value) => handleChange('since', value)}
      />
      <TimestampField
        label="Until"
        value={request.filter.until as number | undefined}
        onChange={(value) => handleChange('until', value)}
      />
      <NumberField
        label="Limit"
        value={request.filter.limit as number | undefined}
        onChange={(value) => handleChange('limit', value)}
        min={1}
      />

      { requestInProgress ? null :
        <button className="bg-stone-500 text-white px-4 py-2 rounded hover:bg-stone-600" onClick={runRequest}>
          Run
        </button>
      }
      {request.results.size > 0 ? 
        <div className="results">
          { Array.from(request.results).map((event: NDKEvent, i) => (
            <div key={i} className="result">
              <pre className="">
                {JSON.stringify(event)}
              </pre>
            </div>
          ))}
        </div>
      : null }
    </div>
  )
}

export default RequestForm