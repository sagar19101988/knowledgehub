import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: <motion.div ...> \s* </motion.div>
# We'll use re.DOTALL and match greedily but specifically for empty content.
pattern = re.compile(r'<motion\.div[^>]*>\s*</motion\.div>', re.DOTALL)
content = pattern.sub('', content)

# Also remove double empty lines that might contain weird characters
content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Cleaned empty motion components")
