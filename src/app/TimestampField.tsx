import React from 'react'

interface TimestampFieldProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
}

function TimestampField({ label, value, onChange }: TimestampFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value ? new Date(e.target.value) : undefined
    const timestamp = inputDate ? Math.floor(inputDate.getTime() / 1000) : undefined
    onChange(timestamp)
  }

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
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