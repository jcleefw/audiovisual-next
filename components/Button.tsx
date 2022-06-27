import React, { ButtonHTMLAttributes } from 'react'
import cx from 'classnames'

interface ButtonProps {
  onClick?: (e: any) => void
  className?: string
  id?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  isDisabled?: boolean
  children: React.ReactElement | string
}

const buttonDisabled = 'bg-gray-300 text-gray-500'
const buttonEnabled = 'bg-green-300 text-gray-800'

export const Button = (props: ButtonProps) => {
  const {
    id,
    type = 'button',
    onClick,
    isDisabled = false,
    className,
    children,
  } = props
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      // TODO only enable button when the song is not pause
      className={cx(
        'px-6 py-2 rounded-md',
        {
          [buttonDisabled]: isDisabled,
          [buttonEnabled]: !isDisabled,
        },
        className
      )}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
