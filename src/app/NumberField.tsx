import React from 'react'

interface NumberFieldProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  min?: number
  max?: number
}

function NumberField({ label, value, onChange, min, max }: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
    onChange(newValue)
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-stone-400 mb-1">{label}</label>
      <input
        className="bg-stone-800 text-stone-400 rounded px-2 py-1 w-full"
        type="number"
        value={value ?? ''}
        onChange={handleChange}
        min={min}
        max={max}
      />
    </div>
  )
}

export default NumberField