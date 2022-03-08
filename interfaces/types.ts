import { IAudioContext } from 'standardized-audio-context'

export interface IAudioControlContext {
  selectedFile: { _nativeFile: File | null; fileReader: any } | null // TODO
  setSelectedFile: React.Dispatch<React.SetStateAction<any>>
  sourceNode: any
  audioContext: IAudioContext | null
  setSourceNode: React.Dispatch<React.SetStateAction<any>>
}
