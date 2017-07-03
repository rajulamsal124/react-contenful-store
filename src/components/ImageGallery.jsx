// @flow

import React from 'react'
import shortid from 'shortid'

import styles from '../styles/6-components/_components.image-gallery.scss'

type Props = {
  images: Array<Object>,
}

type State = {
  slideCount: number,
  activeSlide: number,
}

class ImageGallery extends React.Component {
  constructor(props: Props) {
    super(props)

    this.state = {
      slideCount: this.props.images.length,
      activeSlide: 0,
    }

    this.goToSlide = this.goToSlide.bind(this)
    this.nextSlide = this.nextSlide.bind(this)
    this.prevSlide = this.prevSlide.bind(this)
  }

  state: State
  props: Props
  goToSlide: Function
  nextSlide: Function
  prevSlide: Function

  goToSlide(event: & { currentTarget: HTMLElement }) {
    this.setState({
      activeSlide: parseInt(event.currentTarget.getAttribute('data-slide'), 10),
    })
  }

  nextSlide() {
    const increment = this.state.activeSlide + 1
    const nextSlide = increment < this.state.slideCount ? increment : 0

    this.setState({
      activeSlide: nextSlide,
    })
  }

  prevSlide() {
    const decrement = this.state.activeSlide - 1
    const prevSlide = decrement < 0 ? this.state.slideCount - 1 : decrement

    this.setState({
      activeSlide: prevSlide,
    })
  }

  render() {
    const { images } = this.props
    const { slideCount, activeSlide } = this.state

    const sliderStyles = {
      width: `${images.length * 100}%`,
      transform: `translateX(${-(100 / slideCount) * activeSlide}%)`,
    }

    const slideStyles = {
      width: `${100 / images.length}%`,
    }

    const slides = images.map((image) => {
      const id = shortid.generate()

      return (
        <div key={id} className={styles.slide} style={slideStyles}>
          <img className={styles.img} src={image.fields.file.url} alt={image.fields.title} />
        </div>
      )
    })

    const thumbs = images.map((image, i) => {
      const id = shortid.generate()
      const activeClass = i === activeSlide ? styles['is-active'] : ''

      return (
        <div
          role="button"
          tabIndex={0}
          key={id}
          className={`${styles.thumb} ${activeClass}`}
          onClick={this.goToSlide}
          data-slide={i}
        >
          <img src={`${image.fields.file.url}?w=80&h=80&fit=thumb&f=center`} alt={image.fields.title} />
        </div>
      )
    })

    return (
      <div className={styles.root}>
        <div className={styles.wrap}>
          <div className={styles.viewport}>
            <div className={styles.slider} style={sliderStyles}>
              {slides}
            </div>
          </div>
          <button onClick={this.prevSlide} className={styles.prev}>&larr;</button>
          <button onClick={this.nextSlide} className={styles.next}>&rarr;</button>
        </div>

        <div className={styles.nav}>
          {thumbs}
        </div>
      </div>
    )
  }
}

export default ImageGallery
