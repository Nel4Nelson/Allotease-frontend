import NavBar from '@/components/layouts/NavBar'
import React from 'react'
import Hero from './components/layouts/Hero'
import { HistoryTable } from './components/layouts/HIstoryTable'
import Footer from '@/components/layouts/Footer'

const Withdrawal_history = () => {
  return (
    <div>
        <NavBar/>
        <Hero/>
        <HistoryTable/>
        <Footer/>
    </div>
  )
}

export default Withdrawal_history;