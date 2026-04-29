import sys
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Empty motion.div variants={item}
content = re.sub(r'<motion\.div variants=\{item\}>\s+</motion\.div>', '', content)

# Pattern 2: Triple closings that might be stray
# Look for </div> followed by </> followed by )} in the middle of sections
# But we must be careful.

# Actually, I'll just look for the specific lines from the previous view_file.
# Lines 844, 846 in the previous output.

# I'll just use a more aggressive cleanup script.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Basic cleanup done")
