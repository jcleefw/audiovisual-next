export const performFileReader = (file: File) => {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  var url = URL.createObjectURL(file)
  return {
    fileReader,
    url,
  }
}

export const setupAudioContext = (playerRef: any) => {
  const aContext = new AudioContext()
  const analyzer = aContext.createAnalyser()
  const dataArray = new Uint8Array(analyzer.frequencyBinCount)
  const nodeSource = aContext.createMediaElementSource(
    playerRef as HTMLAudioElement
  )

  nodeSource.connect(aContext.destination)

  playerRef.play()
  console.log('analyzer', analyzer)

  return {
    nodeSource,
    aContext,
    dataArray,
    analyzer,
  }
}

export const drawAudio = async (url: string, audioContext: AudioContext) => {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((arrayBuffer) => arrayBuffer)
    .then((arrayBuffer) => {
      const filteredData = filterData(arrayBuffer)
      const normalizedData = normalizeData(filteredData)
      return normalizedData
    })
}

const normalizeData = (filteredData: number[]) => {
  const multiplier = Math.pow(Math.max(...filteredData), -1)
  return filteredData.map((n) => n * multiplier)
}

const filterData = (audioBuffer: AudioBuffer) => {
  const rawData = audioBuffer.getChannelData(0) // We only need to work with one channel of data
  const samples = 70000 // Number of samples we want to have in our final data set
  const blockSize = Math.floor(rawData.length / samples) // the number of samples in each subdivision
  const filteredData = []
  for (let i = 0; i < samples; i++) {
    let blockStart = blockSize * i // the location of the first sample in the block
    let sum = 0
    for (let j = 0; j < blockSize; j++) {
      sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
    }
    filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
  }
  return filteredData
}
