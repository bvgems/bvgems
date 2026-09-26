import os

directory = 'src'
old_string = '/loose-gemstones'
new_string = '/calibrated-stones'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            if old_string in content:
                content = content.replace(old_string, new_string)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file_path}")
