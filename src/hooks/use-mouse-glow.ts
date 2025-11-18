import { useRef, MouseEvent } from 'react'

export function useMouseGlow() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    buttonRef.current.style.setProperty('--mouse-x', `${x}px`)
    buttonRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return { buttonRef, handleMouseMove }
}
