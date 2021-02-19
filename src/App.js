import React from 'react'
import { Root, Routes } from 'react-static'
import './app.css'

function App() {
  return (
    <Root>
      <nav>
        <a href="/">Home</a>
        <a href="/commodities">Commodities</a>
      </nav>
      <div className="content">
        <React.Suspense fallback={<em>Loading...</em>}>
          <Routes path="*" />
        </React.Suspense>
      </div>
    </Root>
  )
}

export default App
