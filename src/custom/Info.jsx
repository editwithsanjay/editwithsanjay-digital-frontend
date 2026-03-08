import React from 'react'
import { Outlet } from 'react-router-dom'

function Info() {
  return (
    <div>
        <h3>Info</h3>
        <Outlet/>
    </div>
  )
}

export default Info