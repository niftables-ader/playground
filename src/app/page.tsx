'use client'

import { MouseEventHandler, useEffect, useState } from 'react'
import Image from 'next/image'
import { animated, useSpring, to } from '@react-spring/web'

const WIDTH = 10000
const HEIGHT = 4235

const IMG_RATIO = WIDTH / HEIGHT

export default function Home() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [scaleRatio, setScaleRatio] = useState(1)
  const [blur, setBlur] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      const imageHeightToWindowWidth = windowWidth * (1 / IMG_RATIO)
      const imageWidthToWindowHeight = windowHeight * IMG_RATIO

      if (imageWidthToWindowHeight < windowWidth) {
        setWidth(windowWidth)
        setHeight(imageHeightToWindowWidth)
        setScaleRatio(windowWidth / 1920)
      } else {
        setWidth(imageWidthToWindowHeight)
        setHeight(windowHeight)
        setScaleRatio(windowHeight / 940)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const [leftDistance, setLeftDistance] = useState(0)
  const [topDistance, setTopDistance] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      setLeftDistance(width / 2 - windowWidth / 2)
      setTopDistance(height / 2 - windowHeight / 2)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [width, height])

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
  }))

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    let newX = 0,
      newY = 0
    const cursorX = event.clientX
    const cursorY = event.clientY
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    if (Math.abs(centerX - cursorX) > 0.1 * window.innerWidth) {
      let xDisplacment = centerX - cursorX
      xDisplacment =
        xDisplacment > 0
          ? xDisplacment - 0.1 * window.innerWidth
          : xDisplacment + 0.1 * window.innerWidth

      const movmentAreaLenght =
        window.innerWidth * 0.9 - window.innerWidth * 0.6
      newX = (xDisplacment * leftDistance) / movmentAreaLenght
      // make sure no white bars appear
      if (newX < 0) {
        newX = Math.abs(newX) > leftDistance ? -leftDistance : newX
      } else {
        newX = Math.abs(newX) > leftDistance ? leftDistance : newX
      }
    }

    if (Math.abs(centerY - cursorY) > 0.1 * window.innerHeight) {
      let YDisplacment = centerY - cursorY
      YDisplacment =
        YDisplacment > 0
          ? YDisplacment - 0.1 * window.innerHeight
          : YDisplacment + 0.1 * window.innerHeight

      const movmentAreaLenght =
        window.innerHeight * 0.9 - window.innerHeight * 0.6
      newY = (YDisplacment * topDistance) / movmentAreaLenght
      // make sure no white bars appear
      if (newY < 0) {
        newY = Math.abs(newY) > topDistance ? -topDistance : newY
      } else {
        newY = Math.abs(newY) > topDistance ? topDistance : newY
      }
    }

    api.start({
      x: newX,
      y: newY,
      config: { mass: 2, tension: 70, friction: 30 },
      onChange(result, ctrl, item) {
        let to = ctrl.springs.x.animation.to as number
        to = !to ? ctrl.springs.y.animation.to as number : to
        setBlur((Math.abs(to - x.get()) / 800) * 10)
      },
      onRest(result, ctrl, item) {
        setBlur(0)
      },
    })
  }

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      <animated.div
        className="absolute"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          left: `-${leftDistance}px`,
          top: `-${topDistance}px`,
          filter: `blur(${blur}px)`,
          x,
          y,
        }}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={'/wlppr.jpg'}
          alt="wlppr"
          width={width}
          height={height}
          style={{}}
        />
      </animated.div>
    </div>
  )
}
