import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Aggressively remove all whitespace between closing expressions/tags and next tags
# Pattern: )} \s+ </motion.div> \s+ </TabsContent>
text = re.sub(r'\)\}\s+</motion\.div>\s+</TabsContent>', ')}</motion.div></TabsContent>', text)

# Also fix other boundaries
text = re.sub(r'</motion\.div>\s+</TabsContent>\s+<TabsContent', '</motion.div></TabsContent><TabsContent', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Aggressive boundary cleaning done")
