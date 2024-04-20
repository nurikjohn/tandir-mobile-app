import { useRef } from "react"

const useRenderCount = (id: string) => {
  const renders = useRef(1)

  console.log("RENDERED: ", `[${id}]`, renders.current++)
}

export default useRenderCount
