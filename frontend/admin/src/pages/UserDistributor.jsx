import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CreateDistributor from '../components/CreateDistributor'

const UserDistributor = () => {
  return (
    <div>
      <Navbar />
      <div className='my-5 mt-20'>
      <CreateDistributor />
      </div>
      <Footer />
    </div>
  )
}

export default UserDistributor
