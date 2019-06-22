import React from 'react'
import Navbar from './components/Navbar'
import Products from './components/Products'
import Product from './components/Product'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

import './App.css'

function App() {
  return (
    <Router>
      <Navbar name="Hello"></Navbar>
      <Route exact path="/" component={Products}/>
      <Route path="/products/:asin" component={Product}/>
    </Router>
  )
}

export default App
