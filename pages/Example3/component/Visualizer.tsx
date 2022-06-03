import React, { useEffect, useState } from 'react'

const Visualizer = (props: any) => {
  const canvasRef = React.createRef<HTMLCanvasElement>()
  const { audioData } = props

  // const draw = () => {
  //   console.log('drawing...')
  //   if (canvasRef.current) {
  //     const canvas = canvasRef.current as HTMLCanvasElement

  //     const height = canvas.height
  //     const width = canvas.width
  //     const context = canvas.getContext('2d')
  //     let x = 0
  //     const sliceWidth = (width * 1.0) / audioData.length

  //     context.lineWidth = 2
  //     context.strokeStyle = '#000000'
  //     context?.clearRect(0, 0, width, height)

  //     context?.beginPath()
  //     context?.moveTo(0, height / 2)
  //     for (const item of audioData) {
  //       const y = (item / 255.0) * height
  //       context?.lineTo(x, y)
  //       x += sliceWidth
  //     }
  //     context?.lineTo(x, height / 2)
  //     context?.stroke()
  //   }
  // }

  const myDraw = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const threshold = 0
      // clear the current state
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
      //the max count of bins for the visualization
      const maxBinCount = audioData.length
      ctx?.save()

      ctx?.fillText(audioData.join(','), 10, 50)

      ctx?.scale(0.5, 0.5)
      ctx?.translate(canvas.width, canvas.height)
      ctx.fillStyle = '#fff'

      var bass = Math.floor(audioData[1]) //1Hz Frequenz
      var radius =
        0.45 * canvas.width <= 450
          ? -(bass * 0.25 + 0.45 * canvas.width)
          : -(bass * 0.25 + 450)

      var bar_length_factor = 1
      if (canvas.width >= 785) {
        bar_length_factor = 1.0
      } else if (canvas.width < 785) {
        bar_length_factor = 1.5
      } else if (canvas.width < 500) {
        bar_length_factor = 20.0
      }
      //go over each bin
      for (var i = 0; i < maxBinCount; i++) {
        var value = audioData[i]
        if (value >= threshold) {
          ctx?.fillRect(
            0,
            radius,
            canvas.width <= 450 ? 2 : 3,
            -value / bar_length_factor
          )
          ctx?.rotate(((180 / 128) * Math.PI) / 180)
        }
      }

      for (var i = 0; i < maxBinCount; i++) {
        var value = audioData[i]
        if (value >= threshold) {
          ctx?.rotate((-(180 / 128) * Math.PI) / 180)
          ctx?.fillRect(
            0,
            radius,
            canvas.width <= 450 ? 2 : 3,
            -value / bar_length_factor
          )
        }
      }

      for (var i = 0; i < maxBinCount; i++) {
        var value = audioData[i]
        if (value >= threshold) {
          ctx?.rotate(((180 / 128) * Math.PI) / 180)
          ctx?.fillRect(
            0,
            radius,
            canvas.width <= 450 ? 2 : 3,
            -value / bar_length_factor
          )
        }
      }

      ctx?.restore()
    }
  }

  useEffect(() => {
    if (audioData && audioData.length > 0) myDraw()
  }, [audioData])

  const [screenSize, getDimension] = useState({
    dynamicWidth: 0,
    dynamicHeight: 0,
  })
  const setDimension = () => {
    getDimension({
      dynamicWidth: window?.innerWidth,
      dynamicHeight: window?.innerHeight,
    })
  }

  useEffect(() => {
    if (window) {
      if (Object.values(screenSize).every((val) => val === 0)) {
        setDimension()
      }
      window.addEventListener('resize', setDimension)

      return () => {
        window.removeEventListener('resize', setDimension)
      }
    }
  }, [screenSize])

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <canvas
        style={{ background: 'linear-gradient(#ff0088, red)' }}
        width={screenSize.dynamicWidth}
        height={screenSize.dynamicHeight}
        ref={canvasRef}
      />
    </div>
  )
}

export default Visualizer
