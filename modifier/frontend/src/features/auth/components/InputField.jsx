import { Icon } from 'lucide-react'
import React from 'react'

const InputField = ({ Icon, type, placeholder, value, onChange, rightElement,required=true }) => {
  return (
    <div className='input-group'>
      {Icon && <Icon className="icon" size={20} />}
      <input 
      type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        />
        {rightElement && 
        (<div className='right-element'>
            {rightElement}
            </div>)}
    </div>
  )
}

export default InputField
