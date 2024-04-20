import React from "react"

type Props = {
  children: React.ReactNode
  when: boolean
}

const RenderWhen = ({ children, when }: Props) => {
  if (!when) return null

  return <>{children}</>
}

export default RenderWhen
