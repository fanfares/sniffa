import React from 'react'
import StringField from './StringField'
import { Request, useRequestStore } from './useRequestStore'

interface RequestFormProps {
  request: Request
}

function RequestForm({ request }: RequestFormProps) {
  const updateRequest = useRequestStore((state) => state.updateRequest)

  const handleChange = (field: keyof Request['filter'], values: string[]) => {
    updateRequest(request.id, { filter: { ...request.filter, [field]: values } })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRequest(request.id, { name: e.target.value })
  }

  return (
    <div className="bg-stone-700 p-4 rounded-lg">
      <label className="block text-sm font-medium text-stone-400 mb-1">Filter Name</label>
      <input
        className="bg-stone-800 text-stone-400 rounded px-2 py-1 w-full mb-4 placeholder-stone-700"
        type="text"
        value={request.name}
        onChange={handleNameChange}
        placeholder="Looking for memes"
      />
      <StringField label="IDs" values={request.filter.ids} onChange={(values) => handleChange('ids', values)} />
      <StringField label="Authors" values={request.filter.authors} onChange={(values) => handleChange('authors', values)} />
      <StringField label="Kinds" values={request.filter.kinds} onChange={(values) => handleChange('kinds', values)} />
      <StringField label="#e" values={request.filter['#e']} onChange={(values) => handleChange('#e', values)} />
      <StringField label="#p" values={request.filter['#p']} onChange={(values) => handleChange('#p', values)} />
      <StringField label="#t" values={request.filter['#t']} onChange={(values) => handleChange('#t', values)} />
      <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
        Run
      </button>
    </div>
  )
}

export default RequestForm