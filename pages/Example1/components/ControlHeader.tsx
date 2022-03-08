import React, { useContext } from 'react'
import AudioControl from '../AudioControl'
import cx from 'classnames'
import { AudioControlContext } from '../../example1'
import { IAudioControlContext } from '../../../interfaces/types'
const buttonClassName = 'px-6 py-2 bg-green-300 text-gray-800 rounded-md'

export const ControlHeader = () => {
  const context = useContext(AudioControlContext) as IAudioControlContext
  return (
    <div className="flex p-2 justify-between">
      <div className="flex text-sm text-gray-600 items-center">
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
        <p className="pl-1">then I'll play the song</p>
      </div>
      <button
        id="playSampleButton"
        type="button"
        onClick={(e) => AudioControl.playSample(e, context)}
        className={buttonClassName}
      >
        Play Sample File
      </button>
      <button
        id="stopSampleButton"
        type="button"
        onClick={(e) => AudioControl.stopSample(e, context)}
        className={buttonClassName}
      >
        Stop Sample File
      </button>
      <button
        id="resumeSampleButton"
        type="button"
        onClick={(e) => AudioControl.resumeSample(e, context)}
        className={buttonClassName}
      >
        Resume Sample File
      </button>
      <button
        id="pauseSampleButton"
        type="button"
        onClick={(e) => AudioControl.pauseSample(e, context)}
        className={buttonClassName}
      >
        Pause Sample File
      </button>
    </div>
  )
}
