import { ScrollView, View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import SyntaxHighlighter from "react-native-syntax-highlighter"

interface Props {
  code: string
  language?: string
}

const Code = ({ code, language }: Props) => {
  const theme = useTheme()

  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: theme.colors.surface,
      }}>
      {language ? (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 2,
            borderBottomColor: theme.colors.surface,
          }}>
          <Text variant="labelLarge">{language}</Text>
        </View>
      ) : null}

      <SyntaxHighlighter
        language={"javascript"}
        style={{
          hljs: {
            background: theme.colors.background,
            color: theme.colors.onSurface,
            display: "block",
            overflowX: "auto",
          },
          "hljs-attribute": { color: "#EB5757" },
          "hljs-built_in": { color: "#BB6BD9" },
          "hljs-builtin-name": { color: "#BB6BD9" },
          "hljs-bullet": { color: "#27AE60" },
          "hljs-comment": { color: "#828282" },
          "hljs-emphasis": { fontStyle: "italic" },
          "hljs-keyword": { color: "#b854d4" },
          "hljs-link": { color: "#EB5757" },
          "hljs-literal": { color: "#BB6BD9" },
          "hljs-meta": { color: "#BB6BD9" },
          "hljs-name": { color: "#EB5757" },
          "hljs-number": { color: "#BB6BD9" },
          "hljs-params": { color: "#BB6BD9" },
          "hljs-quote": { color: "#828282" },
          "hljs-regexp": { color: "#EB5757" },
          "hljs-section": { color: "#2D9CDB" },
          "hljs-selector-class": { color: "#EB5757" },
          "hljs-selector-id": { color: "#EB5757" },
          "hljs-selector-tag": { color: "#b854d4" },
          "hljs-string": { color: "#27AE60" },
          "hljs-strong": { fontWeight: "bold" },
          "hljs-symbol": { color: "#27AE60" },
          "hljs-tag": { color: "#EB5757" },
          "hljs-template-variable": { color: "#EB5757" },
          "hljs-title": { color: "#2D9CDB" },
          "hljs-type": { color: "#BB6BD9" },
          "hljs-variable": { color: "#EB5757" },

          "hljs-deletion": { background: "#EB5757" },
          "hljs-doctag": { color: "#2D9CDB" },
        }}
        PreTag={View}
        CodeTag={(props: any) => {
          return (
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                padding: 16,
              }}>
              {<View {...props}></View>}
            </ScrollView>
          )
        }}>
        {code}
      </SyntaxHighlighter>
    </View>
  )
}

export default Code
