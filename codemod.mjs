import fs from 'fs';

const files = [
  "apps/mobile/src/intelligence/components/InsightRail.tsx",
  "apps/mobile/src/shell/components/ScreenHeader.tsx",
  "apps/mobile/src/foundation/primitives/Surface.tsx",
  "apps/mobile/src/foundation/primitives/Screen.tsx",
  "apps/mobile/src/foundation/primitives/IconButton.tsx",
  "apps/mobile/src/foundation/primitives/Button.tsx",
  "apps/mobile/src/foundation/primitives/Text.tsx",
  "apps/mobile/src/voice/components/VoiceButton.tsx",
  "apps/mobile/src/voice/components/RecordingVisualizer.tsx",
  "apps/mobile/src/decision/components/PropertyCard.tsx",
  "apps/mobile/src/conversation/components/ConversationViewport.tsx",
  "apps/mobile/src/conversation/components/ConversationFeed.tsx",
  "apps/mobile/src/conversation/components/MessageBubble.tsx",
  "apps/mobile/src/conversation/components/ZaneAiComposerDock.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('theme.colors')) {
    
    if (!content.includes('useTheme')) {
      content = content.replace(
        /import \{ theme \} from "@\/foundation\/theme\/tokens";/,
        'import { theme } from "@/foundation/theme/tokens";\nimport { useTheme } from "@/foundation/theme/ThemeProvider";'
      );
      if (!content.includes('useTheme')) {
        content = 'import { useTheme } from "@/foundation/theme/ThemeProvider";\n' + content;
      }
    }
    
    if (!content.includes('useMemo(')) {
       content = content.replace(/from "react";/, ', useMemo } from "react";');
       content = content.replace(/\} from "react";/, ', useMemo } from "react";');
       
       if (!content.includes('useMemo }')) {
          content = 'import { useMemo } from "react";\n' + content;
       }
       // fix double curly braces if they occurred
       content = content.replace(/, useMemo \} \} from/g, ', useMemo } from');
       content = content.replace(/\{ import \{/g, 'import {');
    }

    content = content.replace(/const styles = StyleSheet\.create\(\{/, 'const createStyles = (colors: any) => StyleSheet.create({');

    // Inside styles definition and components, replace theme.colors with colors
    content = content.replace(/theme\.colors/g, 'colors');

    // Provide the hook inside components
    const exportMatch = content.match(/export function ([A-Z][a-zA-Z0-9_]*)\s*\([^)]*\)\s*(?::\s*[A-Z][a-zA-Z0-9_]*\s*)?\{/);
    if (exportMatch) {
       const funcDef = exportMatch[0];
       content = content.replace(funcDef, `${funcDef}\n  const { colors } = useTheme();\n  const styles = useMemo(() => createStyles(colors), [colors]);`);
    } else {
       // fallback for forwardRef or other
       const arrowMatch = content.match(/const ([A-Z][a-zA-Z0-9_]*) = .* \(/);
       if (arrowMatch) {
         content = content.replace(/(const [A-Z][a-zA-Z0-9_]* = .* => \{)/, `$1\n  const { colors } = useTheme();\n  const styles = useMemo(() => createStyles(colors), [colors]);`);
       }
    }

    fs.writeFileSync(file, content);
    console.log(`Processed ${file}`);
  }
}
