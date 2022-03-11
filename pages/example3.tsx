import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

import cx from 'classnames'
import Visualizer from './Example3/component/Visualizer'
import { createBuffer, performFileReader } from './Example3/utils/utils'
const buttonClassName = 'px-6 py-2 bg-green-300 text-gray-800 rounded-md'

interface ExampleFileProps extends File {
  url: string
}

export interface AudioContextStatesProps {
  audioContext: AudioContext
  analyser?: AnalyserNode
  bufferSource?: AudioBufferSourceNode
}
const Example2: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState<ExampleFileProps | null>(
    null
  )
  const [RID, setRID] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [states, setStates] = useState<AudioContextStatesProps | null>(null)
  const [buffer, setBuffer] = useState<any>(null)
  const [playTimer, setPlayTimer] = useState<number>(0.0)
  const playerRef = React.useRef<HTMLAudioElement>(null)
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

  const stop = () => {
    playerRef.current?.pause()
    cancelAnimationFrame(RID)
    setRID(null)
    states?.audioContext.suspend()
  }
  const play = () => {
    playerRef.current?.play()
    const rafID = requestAnimationFrame(tick)
    setRID(rafID)
    states?.audioContext.resume()
  }

  const onClickHandler = (type: string) => {
    if (playerRef.current && states?.audioContext) {
      const currentTime = states.audioContext.currentTime
      if (type === 'play' && !RID) {
        play()
      } else if (type === 'stop') {
        stop()
      }
      console.log('current Time', currentTime)
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
    console.log('ticker ... ')
    if (states?.analyser) {
      const analyser = states.analyser
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser?.getByteFrequencyData(dataArray)
      console.log(dataArray)
      const rafID = requestAnimationFrame(tick)
      setRID(rafID)
    }
  }

  useEffect(() => {
    if (selectedFile?.url && !loaded) {
      drawAudio()
    }
    if (states?.audioContext && selectedFile && !buffer) {
      const bufferswhy = createBuffer(selectedFile.url, states, setStates)
      setBuffer(bufferswhy)
      setPlayTimer(states.audioContext.currentTime)
    }

    if (buffer && loaded) {
      console.log('about to start request....')
      requestAnimationFrame(tick)
    }
  }, [selectedFile, states, loaded, buffer])
  return (
    <div>
      <input type="file" onChange={onChangeHandler} />
      <audio ref={playerRef} controls src={selectedFile?.url}></audio>
      <button
        className={cx(buttonClassName)}
        onClick={(_e) => onClickHandler('play')}
      >
        play
      </button>
      <button
        className={cx(buttonClassName)}
        onClick={(_e) => onClickHandler('stop')}
      >
        stop
      </button>
      {/* <Visualizer audioData={audioData} /> */}
    </div>
  )
}

export default Example2
