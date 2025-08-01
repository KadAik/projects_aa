import { useReducer, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from "react"
import Card from './components/Card.jsx'
import MainContent from './components/MainContent.jsx'
import Footer from './components/Footer.jsx'

import NavBar from "./components/NavBar.jsx"

import { CurrentPageContext, CurrentPageSetterContext } from './components/Contexts/currentPageContext.js'

function App(){

  const [currentPage, setCurrentPage] = useState("home");

  return(
    <CurrentPageContext.Provider value={currentPage}>
      <CurrentPageSetterContext.Provider value={setCurrentPage}>
        <>
          <header>
            <NavBar />
          </header>

          <MainContent />

          <Footer />
      </>
      </CurrentPageSetterContext.Provider>
    </CurrentPageContext.Provider>
    
  );

}


export default App
