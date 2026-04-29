import os

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all Tabs with 2 spaces
text = text.replace('\t', '  ')

# Detect and remove any non-ascii characters (except maybe common ones if needed)
# But let's just stick to common ones.
# Actually, I'll just rewrite the specific problematic lines around 230.

lines = text.split('\n')
for i, line in enumerate(lines):
    if '</motion.div>' in line and i > 200 and i < 250:
         # Clean the indentation
         lines[i] = '        </motion.div>'
    if '</TabsContent>' in line and i > 200 and i < 250:
         lines[i] = '      </TabsContent>'

# Join and save
with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write('\n'.join(lines))

print("Fixed indentation and tab characters")
