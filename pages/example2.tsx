import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'

import {
  drawAudio,
  performFileReader,
  setupAudioContext,
} from './Example2/utils/utils'
import Layout from '../components/Layout'
import { Button } from '../components/Button'

interface ExampleFileProps extends File {
  url: string
}
const Example2: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState<ExampleFileProps | null>(
    null
  )
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const playerRef = React.useRef<HTMLAudioElement>(null)

  const onChangeHandler = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement

    if (target.files?.length) {
      const file = target.files[0]
      console.log('selectedFile', file)
      const fileRead = performFileReader(file)
      setSelectedFile({ ...file, url: fileRead.url })
    }
  }

  const onClickHandler = (type: string) => {
    if (playerRef.current) {
      if (type === 'play') playerRef?.current.play()
      else if (type === 'stop') {
        playerRef?.current.pause()
      }
    }
  }

  const drawAudioData = async () => {
    if (selectedFile?.url && audioContext) {
      const data = await drawAudio(selectedFile?.url, audioContext)
      console.log('audio data as', data)
    }
  }

  useEffect(() => {
    if (selectedFile && playerRef.current && !audioContext) {
      const audioContextPopulation = setupAudioContext(playerRef.current)
      setAudioContext(audioContextPopulation.aContext)
    }

    if (audioContext && selectedFile) {
      drawAudioData()
    }
  }, [selectedFile, audioContext])

  return (
    <Layout title="Example 2">
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
        <Button onClick={() => onClickHandler('play')}>play</Button>
        <Button onClick={() => onClickHandler('stop')}>stop</Button>
      </div>
    </Layout>
  )
}

export default Example2
