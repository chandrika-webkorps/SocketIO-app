import React from 'react'

function Input(props) {
    
  return (
    <div>
      <input name={props.name} type={props.type} placeholder={props.placeholder}
      className='border mt-3 pl-2 h-[2rem]' onChange={props.handleInput} value={props.value}/>
      
    </div>
  )
}

export default Input
