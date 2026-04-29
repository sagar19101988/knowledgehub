import os

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i in range(len(lines)):
    # Look for the double motion.div patterns
    if i < len(lines)-1 and '</motion.div>' in lines[i] and '</motion.div>' in lines[i+1]:
        # Keep only one if they are adjacent or separated by just space
        new_lines.append(lines[i])
        skip = True
        continue
    if skip:
        skip = False
        continue
    new_lines.append(lines[i])

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Deduplicated adjacent motion closings")
