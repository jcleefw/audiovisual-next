import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

import cx from 'classnames'
import Visualizer from './Example2/component/Visualizer'
import {
  drawAudio,
  performFileReader,
  setupAudioContext,
} from './Example2/utils/utils'
import Layout from '../components/Layout'
const buttonClassName = 'px-6 py-2 bg-green-300 text-gray-800 rounded-md'

interface ExampleFileProps extends File {
  url: string
}
const Example2: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState<ExampleFileProps | null>(
    null
  )
  const [sourceNode, setSourceNode] = useState<any>(null)
  const [audioContext, setAudioContext] = useState<any>(null)
  const playerRef = React.useRef<HTMLAudioElement>(null)
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0))
  // const [analyzer, setAnalyzer] = useState<any>(null)

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
    console.log('button is click', audioContext)
    if (playerRef.current) {
      if (type === 'play') playerRef?.current.play()
      else if (type === 'stop') {
        playerRef?.current.pause()
      }
    }
  }

  const drawAudioData = async () => {
    const data = await drawAudio(selectedFile?.url, audioContext)
    setAudioData(data)
  }

  // TODO need to handle change of file
  useEffect(() => {
    if (selectedFile && playerRef.current && !audioContext) {
      const audioContextPopulation = setupAudioContext(playerRef.current)
      setSourceNode(audioContextPopulation.nodeSource)
      setAudioContext(audioContextPopulation.aContext)
      setAudioData(audioContextPopulation.dataArray)

      console.log('werwer', audioContextPopulation)
      // requestAnimationFrame(tick)
    }

    if (audioContext && selectedFile) {
      drawAudioData()
    }
  }, [selectedFile, audioContext])

  return (
    <Layout title="Example 1">
      <div className="container mx-auto px-4">
        <header className="mt-10">
          <h1 className="font-bold uppercase text-2xl">description</h1>
          <p>
            An example build with simple audio file and work in for play, pause,
            resume.
          </p>
          <p>This is built purely with AudioContext.</p>
        </header>
        <hr className="my-8 border-gray-400" />
        <input type="file" onChange={onChangeHandler} />
        {selectedFile && (
          <audio ref={playerRef} controls src={selectedFile.url}></audio>
        )}
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
      </div>
    </Layout>
  )
}

export default Example2
