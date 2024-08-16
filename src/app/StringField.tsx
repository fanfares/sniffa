import React, { useState } from 'react'
import { PlusCircle } from 'lucide-react'

interface StringFieldProps {
  label: string
  placeholder?: string
  values: string[]
  onChange: (values: string[]) => void
}

function StringField({ label, placeholder, values, onChange }: StringFieldProps) {
  const [inputValues, setInputValues] = useState(values.length > 0 ? values : [''])

  const handleChange = (index: number, value: string) => {
    const newValues = [...inputValues]
    newValues[index] = value
    setInputValues(newValues)
    onChange(newValues.filter(Boolean))
  }

  const addField = () => {
    setInputValues([...inputValues, ''])
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-stone-400 mb-1">{label}</label>
      {inputValues.map((value, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            className="bg-stone-800 text-stone-400 placeholder-stone-700 rounded px-2 py-1 w-full mr-2"
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => handleChange(index, e.target.value)}
          />
          {index === inputValues.length - 1 && value !== '' && (
            <PlusCircle
              className="ml-2 cursor-pointer text-indigo-400"
              size={24}
              onClick={addField}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default StringField