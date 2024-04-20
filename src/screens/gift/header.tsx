import { memo, useEffect, useMemo } from "react"

import type { SkFont } from "@shopify/react-native-skia"
import {
  Group,
  Paragraph,
  Rect,
  Skia,
  rect,
  vec,
} from "@shopify/react-native-skia"
import { Dimensions } from "react-native"

import { PRIMARY } from "../../styles/colors"

import {
  CORNER_RADIUS,
  CornerCutout,
  DASH_SIZE,
  DASH_SIZE_FULL,
  DASH_WIDTH,
  DashCutout,
} from "./cutouts"

const PADDING = 32
const { width: WIDTH } = Dimensions.get("window")
const BOX_PADDING = 20
const INNER_PADDING = 16

const innerWidth = WIDTH - PADDING * 2

interface Props {
  font: SkFont
  smallFont: SkFont
  onLayout: any
}

const Header = ({ font, onLayout }: Props) => {
  const title = "Tandirni qizdiring 🔥"
  const description =
    "Do'stlaringizni kupon orqali Tandirga taklif qiling! Qayg'urmang, kuponlar har hafta berib boriladi, tugab qolmaydi!"

  const title2 = "qizdiring     !"

  const titleFont = Skia.Font(font.getTypeface()!, 20)
  const textDimensions2 = titleFont.measureText(title2)

  const customManager = useMemo(() => {
    const customManager = Skia.TypefaceFontProvider.Make()
    customManager.registerFont(font.getTypeface()!, "SpaceMono")

    return customManager
  }, [])

  const titleParagraph = useMemo(() => {
    const paragraph = Skia.ParagraphBuilder.Make(
      {
        textAlign: 2,
        textStyle: {
          color: Skia.Color("black"),
          fontFamilies: ["SpaceMono"],
          fontSize: 24,
          heightMultiplier: 1.1,
        },
      },
      customManager,
    )
      .addText(title)
      .build()

    paragraph.layout(textDimensions2.width)

    return paragraph
  }, [])

  const descriptionParagraph = useMemo(() => {
    const paragraph = Skia.ParagraphBuilder.Make(
      {
        textAlign: 2,
        textStyle: {
          color: Skia.Color("black"),
          fontFamilies: ["SpaceMono"],
          fontSize: 14,
          heightMultiplier: 1.1,
        },
      },
      customManager,
    )
      .addText(description)
      .build()

    paragraph.layout(innerWidth - BOX_PADDING * 2 - INNER_PADDING * 2)

    return paragraph
  }, [])

  const headerHeight =
    titleParagraph?.getHeight()! +
      descriptionParagraph?.getHeight()! +
      16 +
      INNER_PADDING * 2 +
      BOX_PADDING * 2 || 216

  const inner = Skia.XYWHRect(PADDING, 0, innerWidth, headerHeight)

  useEffect(() => {
    if (headerHeight) {
      onLayout(headerHeight)
    }
  }, [headerHeight])

  return (
    <Group clip={inner}>
      <Rect
        x={inner.x}
        y={inner.y + DASH_WIDTH / 2 - 1}
        width={inner.width}
        height={inner.height - CORNER_RADIUS - DASH_WIDTH / 2 + 1}
        color={PRIMARY}
      />

      <CornerCutout
        x={inner.x}
        y={inner.y + inner.height}
        radius={CORNER_RADIUS}
        rotate={-Math.PI / 2}
        color={PRIMARY}
      />
      <CornerCutout
        x={inner.x + inner.width}
        y={inner.y + inner.height}
        radius={CORNER_RADIUS}
        rotate={Math.PI}
        color={PRIMARY}
      />

      <Rect
        x={inner.x + CORNER_RADIUS}
        y={inner.y + inner.height - CORNER_RADIUS - 2}
        width={inner.width - 2 * CORNER_RADIUS}
        height={CORNER_RADIUS + 2 - DASH_WIDTH / 2 + 1}
        color={PRIMARY}
      />

      <DashCutout
        strokeWidth={DASH_WIDTH}
        color={PRIMARY}
        p1={vec(inner.x + DASH_SIZE_FULL / 2, inner.y)}
        p2={vec(inner.x + inner.width, inner.y)}
        size={DASH_SIZE_FULL}
      />

      <Group
        clip={rect(
          inner.x + CORNER_RADIUS,
          inner.y + inner.height - DASH_WIDTH,
          inner.width - 2 * CORNER_RADIUS,
          DASH_WIDTH,
        )}>
        <DashCutout
          strokeWidth={DASH_WIDTH}
          color={PRIMARY}
          p1={vec(
            inner.x + CORNER_RADIUS - DASH_SIZE / 2,
            inner.y + inner.height - 1,
          )}
          p2={vec(
            inner.x + inner.width - CORNER_RADIUS,
            inner.y + inner.height - 1,
          )}
        />
      </Group>

      <Paragraph
        paragraph={titleParagraph}
        width={textDimensions2.width}
        x={inner.x + inner.width / 2 - textDimensions2.width / 2}
        y={BOX_PADDING + INNER_PADDING}
      />

      <Paragraph
        paragraph={descriptionParagraph}
        width={inner.width - BOX_PADDING * 2 - INNER_PADDING * 2}
        x={inner.x + BOX_PADDING + INNER_PADDING}
        y={BOX_PADDING + INNER_PADDING + titleParagraph?.getHeight()! + 16}
      />
    </Group>
  )
}

export default memo(Header)
