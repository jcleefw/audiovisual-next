class BufferLoader {
  buffers: { [x: string]: object }
  context: null | AudioContext
  buffer: any
  constructor() {
    this.buffers = {}
    this.context = null
    this.buffer = null
    this.init()
    console.log('here now ', this)
  }

  init = () => {
    try {
      // window.AudioContext = window.AudioContext
      this.context = new AudioContext()
    } catch (_) {
      alert('Web Audio API is not supported in this browser')
    }
  }
}

export default BufferLoader
