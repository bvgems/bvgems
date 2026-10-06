import re

file_path = "src/components/TradeShows/TradeShows.tsx"
with open(file_path, "r") as f:
    content = f.read()

# remove AnimatedText import
content = re.sub(r"import\s*\{\s*AnimatedText\s*\}\s*from\s*\"../CommonComponents/AnimatedText\";\n?", "", content)

# remove AnimatedText block
pattern = re.compile(r"<AnimatedText\s*text=\"Upcoming Trade Shows\"[^\>]*/>", re.DOTALL)
content = re.sub(pattern, "", content)

with open(file_path, "w") as f:
    f.write(content)
