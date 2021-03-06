// @flow

import React from 'react'
import { Helmet } from 'react-helmet'

import { APP_NAME } from '../config'
import { reducePrice } from '../utils/helpers'

import Button from './Button'
import ColorPicker from './ColorPicker'
import ImageGallery from './ImageGallery'
import ItemQuantity from './ItemQuantity'
import { Layout, LayoutItem } from './Layout'
import Price from './Price'
import Ratio from './Ratio'
import SizePicker from './SizePicker'
import Sticker from './Sticker'

import styles from '../styles/6-components/_components.product.scss'

type Props = {
  isLoading: boolean,
  hasErrored: boolean,
  productId: String,
  product: Object,
  fetchProduct: Function,
  addItemToCart: Function,
  setAlert: Function,
  removeAlert: Function,
}

type State = {
  quantity: number,
  size: string,
  color: Object,
}

class Product extends React.Component {
  constructor(props: Props) {
    super(props)

    this.state = {
      quantity: 1,
      size: '',
      color: {},
    }

    this.onAddItemToCart = this.onAddItemToCart.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.increaseQuantity = this.increaseQuantity.bind(this)
    this.decreaseQuantity = this.decreaseQuantity.bind(this)
    this.onSizeSelect = this.onSizeSelect.bind(this)
    this.onColorSelect = this.onColorSelect.bind(this)
  }

  state: State

  componentDidMount() {
    this.props.fetchProduct(this.props.productId)
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.productId !== this.props.productId) {
      this.props.fetchProduct(nextProps.productId)
    }

    if (nextProps.product) {
      const { color } = nextProps.product.fields

      this.setState({
        color: color ? color[0] : {},
      })
    }
  }

  onAddItemToCart() {
    const { productTitle, productImage, price, reduction } = this.props.product.fields

    if (this.state.size) {
      this.props.addItemToCart({
        id: this.props.productId,
        title: productTitle,
        image: productImage.fields,
        price: reduction ? reducePrice(price, reduction) : price,
        size: this.state.size,
        color: this.state.color,
      }, parseInt(this.state.quantity, 10))

      this.props.setAlert('success', 'Product added to cart')
      setTimeout(this.props.removeAlert, 1000)
    } else {
      this.props.setAlert('info', 'Please select a size for the seleceted product')
      setTimeout(this.props.removeAlert, 1000)
    }
  }

  onAddItemToCart: Function
  onSizeSelect: Function
  onColorSelect: Function

  onSizeSelect(size: Object) {
    this.setState({
      size: size.size,
    })
  }

  onColorSelect(color: Object) {
    this.setState({
      color,
    })
  }

  props: Props
  handleChange: Function
  increaseQuantity: Function
  decreaseQuantity: Function

  handleChange(event: Event & { target: HTMLInputElement }) {
    const name = event.target.name
    this.setState({
      [name]: event.target.value,
    })
  }

  increaseQuantity() {
    const quantity = this.state.quantity + 1
    this.setState({ quantity })
  }

  decreaseQuantity() {
    const quantity = this.state.quantity > 1 ? this.state.quantity - 1 : 1
    this.setState({ quantity })
  }

  render() {
    const {
      isLoading,
      hasErrored,
      product,
    } = this.props

    if (isLoading || !product) {
      return <p>Loading product ...</p>
    }

    if (hasErrored) {
      return <p>There was an error</p>
    }

    const {
      imageGallery,
      color,
      productTitle,
      productImage,
      productDescription,
      price,
      reduction,
      sizeSmall,
      sizeMedium,
      sizeLarge,
    } = product.fields

    return (
      <div>
        <Helmet
          title={`${APP_NAME}: ${productTitle}`}
          meta={[
            { name: 'description', content: '' },
            { property: 'og:title', content: `${APP_NAME}: ${productTitle}` },
          ]}
        />
        <Layout size="lg">
          <LayoutItem cols="2/4@tablet">
            <div className={styles.images}>
              {reduction > 0 && <Sticker text="sale" className={styles.sticker} />}
              {imageGallery ? <ImageGallery images={imageGallery} /> :
              <Ratio>
                <img src={`${productImage.fields.file.url}?w=600&h=600&fit=thumb&f=center`} alt={productImage.fields.title} />
              </Ratio>
              }
            </div>
          </LayoutItem>
          <LayoutItem cols="2/4@tablet">
            <h2 className={`${styles.title} u-h2`}>{productTitle}</h2>
            <Price price={price} reduction={reduction} className="u-margin-bottom" />
            <p>{productDescription}</p>
            <div className="u-margin-bottom">
              <ItemQuantity
                quantity={this.state.quantity}
                onChange={this.handleChange}
                onIncrease={this.increaseQuantity}
                onDecrease={this.decreaseQuantity}
              />
              <span className="u-margin-left">
                <Button text="Add to cart" onClick={this.onAddItemToCart} />
              </span>
            </div>
            <h3 className="u-h4 u-h-key">Select a size</h3>
            <SizePicker
              sizes={[
                { size: 's', available: sizeSmall },
                { size: 'm', available: sizeMedium },
                { size: 'l', available: sizeLarge },
              ]}
              onSelect={this.onSizeSelect}
              selected={this.state.size}
            />
            {color &&
              <div>
                <h3 className="u-h4 u-h-key">Select a color</h3>
                <ColorPicker
                  colors={color}
                  onSelect={this.onColorSelect}
                  selected={this.state.color}
                />
              </div>
            }
          </LayoutItem>
        </Layout>
      </div>
    )
  }
}

export default Product
