import React, { useContext } from 'react'
import AudioControl from '../AudioControl'
import cx from 'classnames'
import { AudioControlContext } from '../../example1'
import { IAudioControlContext } from '../../../interfaces/types'
import { Button } from '../../../components/Button'
const buttonClassName = 'px-6 py-2 rounded-md'

export const ControlHeader = () => {
  const context = useContext(AudioControlContext) as IAudioControlContext

  const enabledPlayButton = context.selectedFile
  return (
    <div className="flex p-2 flex-col">
      <div className="flex my-4 text-sm text-gray-600 items-center">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <span
            className={cx(
              buttonClassName,
              'bg-red-200 flex-center flex text-gray-800'
            )}
          >
            Give me a file{' '}
          </span>

          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={(e) => AudioControl.handleFileChange(e, context)}
          />
        </label>
        {!context.selectedFile && (
          <p className="pl-1">then I'll play the song</p>
        )}
        {context.selectedFile && (
          <b>{context.selectedFile._nativeFile?.name}</b>
        )}
      </div>
      <div>
        <Button
          id="playSampleButton"
          isDisabled={!enabledPlayButton}
          onClick={(e) => AudioControl.playSample(e, context)}
        >
          Play Sample File
        </Button>

        <Button
          id="stopSampleButton"
          isDisabled={!context.sourceNode}
          onClick={(e) => AudioControl.stopSample(e, context)}
        >
          Stop Sample File
        </Button>

        <Button
          id="resumeSampleButton"
          isDisabled={!context.sourceNode}
          onClick={(e) => AudioControl.resumeSample(e, context)}
        >
          Resume Sample File
        </Button>

        <Button
          id="pauseSampleButton"
          isDisabled={!context.sourceNode}
          onClick={(e) => AudioControl.pauseSample(e, context)}
        >
          Pause Sample File
        </Button>
      </div>
    </div>
  )
}
