import React from 'react'
import Search from '../Search'
import { Redirect } from 'react-router'

class Products extends React.Component {

  constructor(props) {
    super(props)

    this.viewProduct = this.viewProduct.bind(this)
    this.onNewProduct = this.onNewProduct.bind(this)

    this.state = {
      products: [],
      selectedItem: null
    }
  }

  viewProduct(asin) {
    this.setState({
      selectedItem: asin
    })
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/products`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            products: result
          })
        }
       )
  }

  onNewProduct(product) {
    if (!this.state.products.filter((obj) => {  return obj.asin == product.asin })[0]) {
      this.setState((prevState) => {
        return {
          products: [product, ...prevState.products]
        }
      })
    }
  }

  render() {
    const { products } = this.state

    if (this.state.selectedItem) {
      return <Redirect to={"/products/" + this.state.selectedItem} push/>
    }

    return (
      <div>
        <Search onNewProduct={this.onNewProduct}></Search>
        <div className='products-component__products'>
          {products.map(product => (
            <div key={product.asin} className={"card " + product.status} onClick={() => this.viewProduct(product.asin)}>
              <div className='inactive-overlay'>
                <span>Loading...</span>
              </div>
              <div className="card-header">
                {product.asin}
              </div>
              <div className='card-image-wrapper'>
                <img src={product.amazon_image_url} className="card-img-top" />
              </div>
              <div className="card-body">
                <h5 className="card-title collapse-text" data-title="{product.title}">
                  {product.title}
                </h5>
                <p className="card-text">
                  <span className="badge badge-primary">Category</span>
                  {product.category}
                </p>
                <p className="card-text">
                  <span className="badge badge-primary">Rank</span>
                  #{product.best_seller_rank}
                </p>
                <p className="card-text">
                  <span className="badge badge-primary">Dimensions</span>
                  {product.length_in_hundreds/100} x {product.width_in_hundreds/100} x {product.height_in_hundreds/100}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Products
