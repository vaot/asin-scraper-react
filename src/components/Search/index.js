import React from 'react'

const ASIN_REGEX = /^[0-9a-zA-Z]{10}$/

class Search extends React.Component {

  constructor(props) {
    super(props)

    this.fetch = this.fetch.bind(this)
    this.onChange = this.onChange.bind(this)

    this.state = {
      query: '',
      valid: false,
      changed: false
    }
  }

  onChange(event) {
    let validInput = !!event.target.value && event.target.value.match(ASIN_REGEX)

    this.setState({
      query: event.target.value,
      valid: validInput,
      changed: true
    })
  }

  fetch() {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${this.state.query}/fetch`)
      .then((res) => res.json())
      .then((result) => {
        if (!this.props.products.filter((obj) => {  return obj.asin == result.asin })[0]) {
          this.props.products.push(result)
        }
        this.setState({ query: '', valid: false })
      })
  }

  render() {
    return (
      <div className="search-component">
        <div className="search-component__input">
          <input type="text" value={this.state.value} onChange={this.onChange} name="search" />
          <div className='error'>
            {this._showError() ? "" : <span>ASIN number is not valid</span>}
          </div>
        </div>

        <div className="search-component__submit">
          <a className={"btn btn-primary " + (this.state.valid ? "" : "disabled")}
             href="#"
             onClick={this.fetch}>
            Fetch
          </a>
        </div>
      </div>
    )
  }

  _showError() {
    return this.state.valid || !this.state.changed
  }
}

export default Search
