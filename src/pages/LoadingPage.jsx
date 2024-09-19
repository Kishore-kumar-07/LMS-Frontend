import React from 'react'
import { FourSquare } from 'react-loading-indicators'

function LoadingPage() {
  return (
    <div className='w-screen h-screen bg-white relative flex justify-center items-center'>
<FourSquare color="#4169E1" size="large" text="Loading" textColor="" />    </div>
  )
}

export default LoadingPage
