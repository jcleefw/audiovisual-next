import React from 'react'
import { IAudioContext } from 'standardized-audio-context'
import { IAudioControlContext } from '../../interfaces/types'

const handleFileChange = (
  e: React.ChangeEvent,
  context: IAudioControlContext
) => {
  const target = e.target as HTMLInputElement
  console.log('handleFileChange', target.files)

  if (target.files?.length) {
    const selectedFile = target.files[0]
    console.log('selectedFile', selectedFile)
    const fileReader = performFileReader(selectedFile)
    context.setSelectedFile({
      _nativeFile: selectedFile,
      fileReader,
    })
  }
}

const performFileReader = (file: File) => {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  var url = URL.createObjectURL(file)
  return {
    fileReader,
    url,
  }
}

const playSample = (e: React.MouseEvent, context: IAudioControlContext) => {
  const { audioContext, selectedFile, setSourceNode } = context
  if (audioContext) {
    const analyzer = audioContext.createAnalyser()
    const node = audioContext.createBufferSource()
    console.log('sourceNode', node)
    node.connect(analyzer)
    node.connect(audioContext.destination)
    performRequest(audioContext, selectedFile?.fileReader.url, node)
    setSourceNode(node)
    node.start(0)
  }
}

const stopSample = (e: React.MouseEvent, context: IAudioControlContext) => {
  const { sourceNode, audioContext, setSourceNode } = context
  if (audioContext) {
    sourceNode.disconnect(audioContext.destination)
    sourceNode.stop(0)
    setSourceNode(null)
  }
}

const pauseSample = (e: React.MouseEvent, context: IAudioControlContext) => {
  const { sourceNode, audioContext } = context
  if (audioContext) {
    audioContext.suspend()
    console.log('pause', audioContext)
  }
}

const resumeSample = (e: React.MouseEvent, context: IAudioControlContext) => {
  const { audioContext } = context
  if (audioContext) {
    audioContext.resume()
  }
}

const performRequest = (
  audioContext: IAudioContext,
  url: string,
  sourceNode: any
) => {
  console.log('performRequest')
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'

  request.onload = function () {
    // decode the data
    audioContext.decodeAudioData(
      request.response,
      function (buffer) {
        // when the audio is decoded play the sound
        sourceNode.buffer = buffer
        // node.start(0)
        console.log('buffer loaded completed ... ', buffer)
        //on error
      },
      function (e) {
        console.log('decode audio', e)
      }
    )
  }
  request.send()
}

export default {
  handleFileChange,
  playSample,
  stopSample,
  performRequest,
  resumeSample,
  pauseSample,
}
