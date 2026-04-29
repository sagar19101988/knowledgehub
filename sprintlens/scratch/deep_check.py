import sys
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    # Find motion open
    if '<motion.div' in line:
        stack.append(f"M_OPEN_{i+1}")
    if '</motion.div>' in line:
        if stack and stack[-1].startswith("M_OPEN"):
            stack.pop()
        else:
            print(f"Excess M_CLOSE at {i+1}")
    
    # Find Tabs open
    if '<TabsContent' in line:
        stack.append(f"T_OPEN_{i+1}")
    if '</TabsContent>' in line:
        if stack and stack[-1].startswith("T_OPEN"):
            stack.pop()
        else:
            print(f"Excess T_CLOSE at {i+1}")

print("Current unclosed tags:")
for s in stack:
    print(s)
