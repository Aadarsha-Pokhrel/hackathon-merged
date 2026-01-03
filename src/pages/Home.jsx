import React from 'react'
import Hero from '../components/Hero'

const Home = ({ user }) => {  // Accept user prop from App.jsx
  return (
    <div>
      <Hero user={user} />  {/* Pass the user object to Hero */}
    </div>
  )
}

export default Home

