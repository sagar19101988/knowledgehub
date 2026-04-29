import os

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

div_open = text.count('<div')
div_close = text.count('</div')

print(f"Div: {div_open} / {div_close}")
