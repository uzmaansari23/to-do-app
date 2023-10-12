// User.js
import React, { useState } from 'react'

import './User.css'

export default function User({ onUserSubmit }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (name && age) {
      onUserSubmit({ name, age })
      setName('')
      setAge('')
    }
  }

  return (
    <div className="user-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={e => setAge(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
