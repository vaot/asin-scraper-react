export default class ProductService {
  get(asin) {
    fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${asin}`)
  }

  getAll() {
    return fetch(`${process.env.REACT_APP_API_URL}/api/v1/products`)
  }

  fetch(asin) {
    return fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${asin}/fetch`)
  }

  destroy(asin) {
    return fetch(`${process.env.REACT_APP_API_URL}/api/v1/products/${asin}`, {
      method: 'delete'
    })
  }
}
