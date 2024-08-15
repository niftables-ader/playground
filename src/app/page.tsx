'use client'

import { MouseEventHandler, useEffect, useState } from 'react'
import Image from 'next/image'
import { animated, useSpring } from '@react-spring/web'

const WIDTH = 10000
const HEIGHT = 4235

const IMG_RATIO = WIDTH / HEIGHT

export default function Home() {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [scaleRatio, setScaleRatio] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      const divWidth = 1080
      const divHeight = 670

      const imageHeightToDivWidth = divWidth * (1 / IMG_RATIO)
      const imageWidthToDivHeight = divHeight * IMG_RATIO

      if (imageWidthToDivHeight < divWidth) {
        setWidth(divWidth)
        setHeight(imageHeightToDivWidth)
        setScaleRatio(divWidth / 1920)
      } else {
        setWidth(imageWidthToDivHeight)
        setHeight(divHeight)
        setScaleRatio(divHeight / 940)
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
      const divWidth = 1080
      const divHeight = 670
      setLeftDistance(width / 2 - divWidth / 2)
      setTopDistance(height / 2 - divHeight / 2)
    }

    handleResize()
  }, [width, height])

  const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
  // const [{ x, y }, set] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    const cursorX = event.clientX - 31
    const cursorY = event.clientY - 134
    console.log('cursor', cursorX, cursorY)
    const centerX = 1070 / 2
    const centerY = 660 / 2

    // Calculate the offset from the center
    const offsetX = (cursorX - centerX) / centerX
    const offsetY = (cursorY - centerY) / centerY
    console.log('offset', offsetX, offsetY)

    // Update the spring with scaled values
    set({ x: offsetX * 50, y: offsetY * 50 })
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="relative w-[1080px] h-[670px] bg-black overflow-hidden">
        <animated.div
          className="absolute"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `-${leftDistance}px`,
            top: `-${topDistance}px`,
            transform: x.to((x) => `translate3d(${x}px, ${y.get()}px, 0)`),
            // transform: `translate3d(${x}px, ${y}px, 0)`,
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
    </div>
  )
}
