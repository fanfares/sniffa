import React from 'react'

interface TimestampFieldProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
}

function TimestampField({ label, value, onChange }: TimestampFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined
    const timestamp = date ? Math.floor(date.getTime() / 1000) : undefined
    onChange(timestamp)
  }

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-stone-400 mb-1">{label}</label>
      <input
        className="bg-stone-800 text-stone-400 rounded px-2 py-1 w-full"
        type="datetime-local"
        value={formatDate(value)}
        onChange={handleChange}
      />
    </div>
  )
}

export default TimestampField