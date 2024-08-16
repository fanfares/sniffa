import React, { useCallback, useMemo, useState } from 'react'
import StringField from './StringField'
import NumberField from './NumberField'
import TimestampField from './TimestampField'
import { RawEvent, Request, useRequestStore } from './useRequestStore'
import { ChevronRight, PlusCircle } from 'lucide-react'
import { NDKEvent, NDKFilter, NDKUser } from "@nostr-dev-kit/ndk"
import useNDKStore from './useNDKStore'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { duotoneEarth } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
  const [noResults, setNoResults] = useState(false)

  const handleChange = (field: keyof Request['filter'] | 'relays', value: string[] | number[] | number | undefined) => {
    if (field !== 'relays') {
      updateRequest(request.id, { filter: { ...request.filter, [field]: value } })
    }
  }

  const handleRelay = (values: string[]) => {
    const relayRegex = /^wss:\/\/[\w.-]+\.[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/
    const validRelays = values.filter(relay => relayRegex.test(relay))
    
    // Ensure there's always at least one valid relay
    const updatedRelays = validRelays.length > 0 ? validRelays : ['wss://relay.primal.net']
    
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
    console.log('relays', request.relays)
    await initNDK(request.relays, false)
    const filter = cleanFilter(request.filter as NDKFilter)
    
    console.log('using filter', filter, 'relays', request.relays)
    const results = await fetchEvents(filter)
    console.log('got result', results)
    if (results.size === 0) {
      setNoResults(true)
    } else {
      setNoResults(false)
    }
    updateRequest(request.id, { results: Array.from(results).map( event => event.rawEvent() as RawEvent) }) // need to update useRequestStore to handle results
    setRequestInProgress(false)
  }

  const cleanFilter = (filter: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(filter).filter(
        ([key, value]) => value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)
      )
    )
  }

  const customTags = Object.entries(request.filter).filter(
    ([key]) => key.length === 2 && /^\#[a-zA-Z]$/.test(key)
  )

  const displayResults = useMemo(() => {
    return Array.from(request.results).map((event: RawEvent, i) => (
      <div key={i} className="result text-xs mb-4 p-4 bg-stone-800 overflow-x-auto">
        <SyntaxHighlighter 
          language="json" 
          style={duotoneEarth}
          customStyle={{
            margin: 0,
            borderRadius: '0.25rem',
            background: 'transparent',
          }}
        >
          {JSON.stringify(event, null, 2)}
        </SyntaxHighlighter>
      </div>
    ))
  }, [request.results])

  return (
    <div key={request.id} className="bg-stone-700 p-4 rounded-lg">
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
        placeholder="wss://relay.example.com"
        values={request.relays} 
        onChange={handleRelay}
      />
      <StringField 
        label="IDs" 
        placeholder="hex only"
        values={request.filter.ids as string[]} 
        onChange={(values) => handleChange('ids', values)} 
      />
      <StringField 
        label="Authors" 
        placeholder="hex only"
        values={request.filter.authors as string[]} 
        onChange={(values) => handleChange('authors', values)} 
      />
      <StringField 
        label="Kinds" 
        placeholder="one integer per field"
        values={request.filter.kinds.map(String)} 
        onChange={(values) => handleChange('kinds', values.map(v => parseInt(v, 10)))} 
      />
      
      {customTags.map(([tag, values]) => (
        <StringField
          key={tag}
          label={`${tag}`}
          placeholder="search string"
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
      {request.results.length > 0 ? 
        <details className="mt-4">
          <summary className="cursor-pointer text-stone-400 text-lg flex items-center">
            <ChevronRight className="inline-block mr-2 transform transition-transform duration-200" />
            Results ({request.results.length})
          </summary>
          <div className="results mt-2">
            { displayResults }
          </div>
        </details>
      : <div className="mt-4 text-lg text-stone-400">No Results</div> }
    </div>
  )
}

export default RequestForm