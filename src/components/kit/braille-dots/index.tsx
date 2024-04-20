import { SvgXml } from "react-native-svg"

const xml = (color: string) => `
    <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="2" height="2" fill="${color}" fill-opacity="0.5" />
        <rect x="3" width="2" height="2" fill="${color}" />
        <rect x="6" width="2" height="2" fill="${color}" />
        <rect x="9" width="2" height="2" fill="${color}" fill-opacity="0.5" />
        <rect x="12" width="2" height="2" fill="${color}" />
        <rect x="15" width="2" height="2" fill="${color}" />
        <rect y="3" width="2" height="2" fill="${color}" />
        <rect x="3" y="3" width="2" height="2" fill="${color}" />
        <rect
        x="6"
        y="3"
        width="2"
        height="2"
        fill="${color}"
        fill-opacity="0.5"
    />
        <rect
            x="9"
            y="3"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect
            x="12"
            y="3"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect x="15" y="3" width="2" height="2" fill="${color}" />
        <rect y="6" width="2" height="2" fill="${color}" />
        <rect
            x="3"
            y="6"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect
            x="6"
            y="6"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect
            x="9"
            y="6"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect x="12" y="6" width="2" height="2" fill="${color}" />
        <rect
            x="15"
            y="6"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect y="9" width="2" height="2" fill="${color}" />
        <rect x="3" y="9" width="2" height="2" fill="${color}" />
        <rect
            x="6"
            y="9"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect x="9" y="9" width="2" height="2" fill="${color}" />
        <rect x="12" y="9" width="2" height="2" fill="${color}" />
        <rect
            x="15"
            y="9"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect y="12" width="2" height="2" fill="${color}" fill-opacity="0.5" />
        <rect x="3" y="12" width="2" height="2" fill="${color}" />
        <rect x="6" y="12" width="2" height="2" fill="${color}" />
        <rect
            x="9"
            y="12"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect x="12" y="12" width="2" height="2" fill="${color}" />
        <rect x="15" y="12" width="2" height="2" fill="${color}" />
        <rect y="15" width="2" height="2" fill="${color}" fill-opacity="0.5" />
        <rect
            x="3"
            y="15"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect
            x="6"
            y="15"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect
            x="9"
            y="15"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
        <rect x="12" y="15" width="2" height="2" fill="${color}" />
        <rect
            x="15"
            y="15"
            width="2"
            height="2"
            fill="${color}"
            fill-opacity="0.5"
        />
    </svg>          
`

const BrailleDots = ({ color }: { color: string }) => (
  <SvgXml xml={xml(color)} width={24} height={24} />
)

export default BrailleDots
