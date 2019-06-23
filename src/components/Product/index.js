import React from 'react'
import ProductService from '../../services/ProductService'

class Product extends React.Component {
  constructor(props) {
    super(props)

    this.productService = new ProductService()
    this.state = {
      product: {}
    }
  }

  componentDidMount() {
    this.productService.get(this.props.match.params.asin)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            product: result
          })
        }
       )
  }

  render() {
    return (
      <div className="jumbotron">
        <h3 className="display-8">{this.state.product.title}</h3>
        <div className='card-image-wrapper'>
          <img src={this.state.product.amazon_image_url} className="card-img-top" />
        </div>
        <p>
          <span className="badge badge-primary">Category</span>
          {this.state.product.category}
        </p>
        <p>
          <span className="badge badge-primary">Rank</span>
          {this.state.product.best_seller_rank}
        </p>
        <hr className="my-4"/>
        <a className="btn btn-primary btn-lg" href={"https://www.amazon.com/dp/" + this.state.product.asin}>
          See on Amazon
        </a>
      </div>
    )
  }
}

export default Product
