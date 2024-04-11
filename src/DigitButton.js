import React from 'react'

import { ACTION } from './App'

function DigitButton({dispatch,digit}) {
  return (
    <>
    <button onClick={()=>dispatch({type:ACTION.ADD_DIGIT, payload:{digit}})}>{digit}</button>
    </>
  )
}

export default DigitButton
