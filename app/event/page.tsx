import NavBar from '@/components/layouts/NavBar';
import React from 'react'
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Categories from './components/Categories';

const Event = () => {
  return (
    <div>
        <NavBar/>
        <Hero/>
        <EventDetails/>
        <Categories/>
    </div>
  )
}

export default Event;