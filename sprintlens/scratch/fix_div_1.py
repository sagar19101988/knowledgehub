import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the iteration selector div
text = re.sub(r'</select>\s+\n\s+\)\}', r'</select></div>)}', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Restored iteration selector div")
