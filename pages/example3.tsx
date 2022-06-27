import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Visualizer from './Example3/component/Visualizer'
import { createBuffer, performFileReader } from './Example3/utils/utils'
import { Button } from '../components/Button'

interface ExampleFileProps extends File {
  url: string
}

export interface AudioContextStatesProps {
  audioContext: AudioContext
  analyser?: AnalyserNode
  bufferSource?: AudioBufferSourceNode
}
const Example3: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState<ExampleFileProps | null>(
    null
  )
  const [audioData, setAudioData] = useState<Uint8Array | null>(null)

  const [RID, setRID] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [states, setStates] = useState<AudioContextStatesProps | null>(null)
  const [buffer, setBuffer] = useState<AudioBufferSourceNode | null>(null)
  const [isPlaying, setPlayed] = useState<boolean>(false)
  // const [playTimer, setPlayTimer] = useState<number>(0.0)
  // const playerRef = React.useRef<HTMLAudioElement>(null)
  const onChangeHandler = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement
    console.log('handleFileChange', target.files)

    if (target.files?.length) {
      const file = target.files[0]
      console.log('selectedFile', file)
      const fileRead = performFileReader(file)
      setSelectedFile({ ...file, url: fileRead.url })
    }
  }

  const onClickHandler = (type: string) => {
    const analyzer = states?.audioContext.createAnalyser()
    const audioContext = states?.audioContext

    console.log('arrayBuffer', selectedFile?.arrayBuffer)
    if (analyzer && audioContext) {
      if (type === 'play') {
        states?.bufferSource?.start()
        setPlayed(true)
      } else if (type === 'pause') {
        audioContext.suspend()
      } else if (type === 'resume') {
        audioContext.resume()
      }
    }
  }

  const drawAudio = () => {
    const audioContext = new AudioContext()
    setStates({
      audioContext,
    })
    setLoaded(true)
  }

  const tick = () => {
    if (states?.analyser) {
      const analyser = states.analyser
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser?.getByteFrequencyData(dataArray)
      const rafID = requestAnimationFrame(tick)
      setRID(rafID)
      setAudioData(dataArray)
    }
  }

  useEffect(() => {
    if (selectedFile?.url && !loaded) {
      drawAudio()
    }

    if (states?.audioContext && selectedFile && !buffer) {
      // TODO  deal with callback async. This is a very important step to previous infinite loop
      const bufferswhy = createBuffer(selectedFile.url, states, setStates)
      setBuffer(bufferswhy)
      // setPlayTimer(states.audioContext.currentTime)
    }

    if (loaded && buffer) {
      console.log('about to start request....')
      requestAnimationFrame(tick)
    }
  }, [selectedFile, states, loaded, buffer])
  return (
    <div>
      <input type="file" onChange={onChangeHandler} />
      <Button isDisabled={isPlaying} onClick={() => onClickHandler('play')}>
        play
      </Button>
      <Button onClick={() => onClickHandler('resume')}>resume</Button>
      <Button onClick={() => onClickHandler('pause')}>pause</Button>
      <Visualizer audioData={audioData} />
    </div>
  )
}

export default Example3
