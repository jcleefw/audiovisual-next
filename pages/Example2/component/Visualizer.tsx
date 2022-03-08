import React, { useEffect } from 'react'

const Visualizer = (props: any) => {
  // const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const canvasRef = React.createRef<HTMLCanvasElement>()
  const { audioData } = props

  const draw = () => {
    console.log('drawing...')
    if (canvasRef.current) {
      const canvas = canvasRef.current as HTMLCanvasElement

      const height = canvas.height
      const width = canvas.width
      const context = canvas.getContext('2d')
      let x = 0
      const sliceWidth = (width * 1.0) / audioData.length

      context.lineWidth = 2
      context.strokeStyle = '#000000'
      context?.clearRect(0, 0, width, height)

      context?.beginPath()
      context?.moveTo(0, height / 2)
      for (const item of audioData) {
        const y = (item / 255.0) * height
        context?.lineTo(x, y)
        x += sliceWidth
      }
      context?.lineTo(x, height / 2)
      context?.stroke()
    }
  }

  function drawBars(array) {
    console.log('drawing bar')
    const canvas = canvasRef.current as HTMLCanvasElement
    const dpr = window.devicePixelRatio || 1
    const padding = 20
    canvas.width = canvas.offsetWidth * dpr
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr
    const ctx = canvas.getContext('2d')
    ctx?.scale(dpr, dpr)
    ctx?.translate(0, canvas.offsetHeight / 2 + padding)

    // draw the line segments
    const width = canvas.offsetWidth / array.length
    for (let i = 0; i < array.length; i++) {
      const x = width * i
      let height: number | boolean = array[i] * canvas.offsetHeight - padding
      if (height < 0) {
        height = 0
      } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2
      }
      drawLineSegment(ctx, x, height, width, (i + 1) % 2)
    }
  }

  const drawLineSegment = (ctx, x, height, width, isEven) => {
    ctx.lineWidth = 1 // how thick the line is
    ctx.strokeStyle = '#fff' // what color our line is
    ctx.beginPath()
    height = isEven ? height : -height
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven)
    ctx.lineTo(x + width, 0)
    ctx.stroke()
  }

  useEffect(() => {
    if (audioData && audioData.length > 0) drawBars(audioData)
  }, [audioData])
  return (
    <div style={{ background: '#282828', height: '600px', width: '600px' }}>
      <canvas width="600" height="600" ref={canvasRef} />
    </div>
  )
}

export default Visualizer
