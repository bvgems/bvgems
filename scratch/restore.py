import re

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'r') as f:
    code = f.read()

# Restore isFreeSize={true}
code = code.replace(
    'baseDelay={0.6}',
    'baseDelay={0.6}\n                    isFreeSize={true}'
)

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'w') as f:
    f.write(code)

