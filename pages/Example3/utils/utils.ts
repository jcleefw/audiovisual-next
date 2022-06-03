import { AudioContextStatesProps } from '../../example3'

export const performFileReader = (file: File) => {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  var url = URL.createObjectURL(file)
  return {
    fileReader,
    url,
  }
}

export const createBuffer = async (
  url: string,
  states: AudioContextStatesProps,
  setStates: React.Dispatch<
    React.SetStateAction<AudioContextStatesProps | null>
  >
) => {
  console.log('createBuffer ... ')
  const analyser = states.audioContext.createAnalyser()
  const source = states.audioContext.createBufferSource()
  source.connect(analyser)
  setStates({ ...states, analyser })
  const something = await fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => states.audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      source.buffer = audioBuffer
      source.connect(states.audioContext.destination)
      source.start()
      setStates({ ...states, bufferSource: source })
      return source
    })
  return something
}
