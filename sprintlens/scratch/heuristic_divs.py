import os

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
stack = [] # Track indentation of open <div> tags

for i, line in enumerate(lines):
    stripped = line.strip()
    indent = len(line) - len(line.lstrip())
    
    # If it's a <div> or <select or <select ... (roughly)
    if '<div' in line and '/>' not in line:
        stack.append(indent)
    
    # If we are significantly de-indenting, and it's not a closing tag of something else
    # we might have missed a </div>
    # Actually, let's look for </Card>, </CardHeader>, </CardContent>, </motion.div>
    # These are our markers!
    
    if '</Card' in line or '</motion.div>' in line or ')}' in line or '</select>' in line:
        # Check if we have open divs with more indentation than this closing tag
        while stack and stack[-1] >= indent:
             new_lines.append(' ' * stack[-1] + '</div>\n')
             stack.pop()
             
    new_lines.append(line)
    
    # Special cases for expressions
    if ')}' in line:
        while stack and stack[-1] >= indent:
             new_lines.append(' ' * stack[-1] + '</div>\n')
             stack.pop()

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Heuristic div restoration complete.")
