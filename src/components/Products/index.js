import React from 'react'
import Search from '../Search'
import { Redirect } from 'react-router'
import ProductService from '../../services/ProductService'
import ActionCable from 'actioncable'

class Products extends React.Component {

  constructor(props) {
    super(props)

    let cable = ActionCable.createConsumer(`ws://${process.env.REACT_APP_API_HOST}/cable`)

    // Receive updates from the backend via action cable.
    cable.subscriptions.create({ channel: 'ProductsChannel' }, {
      received: (data) => {
        this.onProcessedProduct(data.product)
      }
    })

    this.viewProduct = this.viewProduct.bind(this)
    this.onNewProduct = this.onNewProduct.bind(this)

    this.productService = new ProductService()
    this.state = {
      products: [],
      selectedItem: null
    }
  }

  // When products are processed/scraped we receive them
  // via action cable and perform this callback.
  // If the coming product is not in the list, it is coming from a different
  // client so we just add to the list. If it is in the list, it was created
  // by this client.
  onProcessedProduct(product) {
    this.setState((prevState) => {
      let index = prevState.products.findIndex((prod) => { return prod.asin == product.asin })
      if (index == -1) {
        prevState.products.unshift(product)
      } else {
        prevState.products[index] = product
      }

      return {
        products: prevState.products
      }
    })
  }

  viewProduct(asin) {
    this.setState({
      selectedItem: asin
    })
  }

  componentDidMount() {
    this.productService.getAll()
      .then(res => res.json())
      .then((result) => {
        this.setState({
          products: result
        })
      })
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

  deleteProduct(product) {
    this.productService.destroy(product.asin)
      .then(res => res.json())
      .then((result) => {
        if (result.success) {
          let index = this.state.products.indexOf(product)
          this.setState((prevState) => {
            prevState.products.splice(index, 1)

            return {
              products: prevState.products
            }
          })
        }
      })
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
            <div key={product.asin} className={"card " + product.status}>
              <div className='is-clickable' onClick={() => this.viewProduct(product.asin)}>
                <div className='inactive-overlay'>
                  <span>
                    <img src={process.env.PUBLIC_URL + "ajax-loader.gif"} />
                    Loading...
                  </span>
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

              <div className='card-footer'>
                <button className='btn-sm btn-danger'
                        onClick={() => this.deleteProduct(product)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Products
