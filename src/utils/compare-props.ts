function compareProps<PropTypes>(keys?: (keyof PropTypes)[]) {
  return (prevProps: PropTypes, nextProps: PropTypes) => {
    if (!keys) return true

    return !keys.some((key) => prevProps[key] != nextProps[key])
  }
}

export default compareProps
