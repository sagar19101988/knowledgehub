import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# I messed up by removing </div> tags.
# I will try to restore them by looking for their openings.

# Common pattern in this file:
# <div ...> ... </div>
# I'll just add </div> at the end of blocks that need them.

# Actually, I'll just restore the ones I KNOW I removed.
# Line 116, for example.

# I'll use a script that counts <div> and </div> and adds them at the end? 
# No, that's not safe for UI.

# I'll just manually fix the specific ones I broke.
# 1. Line 116 (closes line 99)
# 2. Line 124 (wait, where did 124 come from?)

# Let's check 125.
# 125: <motion.div ...>

# I'll use replace_file_content for the 116-117 area.
