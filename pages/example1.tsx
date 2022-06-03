import React, { createContext, useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { NextPage } from 'next'
import { AudioContext } from 'standardized-audio-context'
import { ControlHeader } from './Example1/components/ControlHeader'
import { IAudioControlContext } from '../interfaces/types'

export const AudioControlContext = createContext<IAudioControlContext | null>(
  null
)

const IndexPage: NextPage = () => {
  const [selectedFile, setSelectedFile] =
    useState<IAudioControlContext['selectedFile']>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [sourceNode, setSourceNode] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState<number | null>(null)

  useEffect(() => {
    if (audioContext === null) {
      setAudioContext(new AudioContext())
    }
    // TODO
    if (audioContext?.currentTime) {
      setCurrentTime(currentTime)
    }
  }, [audioContext, audioContext?.currentTime, selectedFile])
  console.log('anything?', sourceNode)

  return (
    <Layout title="Example 1">
      <div className="container mx-auto px-4">
        <header className="mt-10">
          <h1 className="font-bold uppercase text-2xl">description</h1>
          <p>
            An example build with simple audio file and work in for play, pause,
            resume.
          </p>
          <p>This is built with Audio context with createBufferSource.</p>
        </header>
        <hr className="my-8 border-gray-400" />
        <AudioControlContext.Provider
          value={{
            selectedFile,
            setSelectedFile,
            audioContext,
            sourceNode,
            setSourceNode,
          }}
        >
          <ControlHeader />

          <h3>DOES NOT WORK Current Time: {currentTime}</h3>
        </AudioControlContext.Provider>
      </div>
    </Layout>
  )
}

export default IndexPage
