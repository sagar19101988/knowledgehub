import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern: </TabsContent>
# We want to make sure it's preceded by </motion.div>
# BUT only if it wasn't already.

# Also, </motion.div> should be preceded by )} if there was a conditional map.

# I'll just do a global cleanup.
# 1. Standardize all boundaries to: </motion.div></TabsContent>
# Even if </motion.div> was missing.

# Find all </TabsContent> and replace with </motion.div></TabsContent>
# (We might end up with extra motion closings if they were already there, 
#  so we'll deduplicate afterwards)

new_content = content.replace('</TabsContent>', '</motion.div></TabsContent>')
new_content = new_content.replace('</motion.div></motion.div>', '</motion.div>')

# Also ensure exactly ONE motion.div after each TabsContent opening
new_content = re.sub(r'<TabsContent ([^>]+)>\s+<motion\.div', r'<TabsContent \1><motion.div', new_content)
# (Same logic for double openings)

with open(file_path, 'w', encoding='ascii') as f:
    f.write("".join(c for c in new_content if ord(c) < 128))

print("Dashboard Re-Balanced and Cleaned")
