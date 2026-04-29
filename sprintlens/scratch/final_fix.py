import os

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace specifically the double closings that were accidentally tripled/doubled
text = text.replace('</motion.div></motion.div></TabsContent>', '</motion.div></TabsContent>')

# Also fix the joined ones to have a bit of space for safety
text = text.replace('</motion.div></TabsContent>', '</motion.div>\n      </TabsContent>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Final balance fix applied")
