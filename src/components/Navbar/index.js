import React from 'react'
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light">
        <Link className="navbar-brand" to="/">ASIN SCRAPER by vaot</Link>
      </nav>
    )
  }
}

export default Navbar
