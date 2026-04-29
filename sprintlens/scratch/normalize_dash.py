import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Fix common boundary pattern: )} \n </motion.div> \n </TabsContent>
# We replace it with clean formatting
pattern = re.compile(r'\)\}\s+</motion\.div>\s+</TabsContent>', re.MULTILINE)
text = pattern.sub(')}\n        </motion.div>\n      </TabsContent>', text)

# Also fix the start of new tabs
pattern2 = re.compile(r'</TabsContent>\s+<TabsContent value="([^"]+)">\s+<motion\.div', re.MULTILINE)
text = pattern2.sub(r'</TabsContent>\n\n      <TabsContent value="\1">\n        <motion.div', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)
print("Boundaries normalized")
