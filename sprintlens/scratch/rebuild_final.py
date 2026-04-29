import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove ALL existing TabsContent/motion.div wrappers within the dynamic section
# We'll keep the main motion.div at 83 and the final closings.

# Actually, I'll just find the start: {!loading && activeStats && (
# and replace everything until the final closings.

start_marker = '{/* Dynamic Tabbed Navigation */}'
end_marker = '</Tabs>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # We'll just define the tabs simply.
    # Overview -> 1. PBIs, 2. Banners
    # Execution -> 1. Velocity, 2. Bottlenecks, 3. Intelligence, 4. Tracker
    # Resources -> 1. Workload, 2. Capacity
    # Tickets -> Search
    pass
else:
    print("Markers not found")
