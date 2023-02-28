import * as React from 'react'

function Logo({className, ...props}: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      {...props}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 90 90"
    >
      <rect
        x="44.548"
        y="1.414"
        width="61"
        height="61"
        rx="9"
        transform="rotate(45 44.548 1.414)"
        className="stroke-black dark:stroke-white"
        strokeWidth="2"
      />
      <path
        d="M20.048 76.048v1H39.26V56.253h4.358l10.85 20.267.282.528h20.986l-.811-1.48-12.38-22.584c3.002-1.608 5.41-3.797 7.202-6.568 2.15-3.292 3.196-7.296 3.196-11.958 0-4.62-1.015-8.643-3.089-12.027-2.065-3.37-4.959-5.95-8.653-7.73-3.689-1.78-7.96-2.653-12.787-2.653H20.048v64Zm24.28-35.084H39.26V27.706h5.068c1.937 0 3.53.266 4.808.762l.008.004.008.003c1.27.468 2.193 1.186 2.826 2.138l.006.008.005.009c.637.915.998 2.164.998 3.828 0 1.642-.36 2.867-.992 3.76l-.008.01c-.627.91-1.546 1.601-2.82 2.054-1.289.445-2.894.682-4.839.682Z"
        className="fill-black stroke-white dark:fill-white dark:stroke-black"
        strokeWidth="2"
      />
    </svg>
  )
}

export {Logo}
