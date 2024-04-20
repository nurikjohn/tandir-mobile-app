import React from "react"

import { Platform } from "react-native"
import ContextMenuView, {
  ContextMenuProps,
} from "react-native-context-menu-view"
import { useTheme } from "react-native-paper"

export type MenuProps = {
  preview: React.ReactNode
  children: React.ReactElement<any, any>
  onPreviewPress?: any
} & ContextMenuProps

const ContextMenu = ({ onPreviewPress, preview, children }: MenuProps) => {
  const theme = useTheme()

  if (Platform.OS != "ios") {
    return children
  }

  return (
    <ContextMenuView
      onPreviewPress={onPreviewPress}
      previewBackgroundColor={theme.colors.background}
      preview={preview}>
      {children}
    </ContextMenuView>
  )
}

export default ContextMenu
