import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove multiple empty lines
text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Whitespace cleaned.")
