import sys
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

motion_open = len(re.findall(r'<motion\.div', content))
motion_close = len(re.findall(r'</motion\.div>', content))
tabs_open = len(re.findall(r'<TabsContent', content))
tabs_close = len(re.findall(r'</TabsContent>', content))
card_open = len(re.findall(r'<Card[ >]', content))
card_close = len(re.findall(r'</Card>', content))

print(f"Motion: {motion_open} / {motion_close}")
print(f"Tabs: {tabs_open} / {tabs_close}")
print(f"Card: {card_open} / {card_close}")
