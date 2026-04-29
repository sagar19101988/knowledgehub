import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Self-Correction: Remove ALL </motion.div> and <motion.div ...> first to start clean?
# NO, some are structural for cards.

# I'll just count them.
m_open = text.count('<motion.div')
m_close = text.count('</motion.div>')

print(f"Before: {m_open} / {m_close}")

if m_open > m_close:
    # Add missing closings before the final few tags
    closings = '\n' + ('</motion.div>\n' * (m_open - m_close))
    text = text.replace('  )\n}', closings + '  )\n}')
elif m_close > m_open:
    # This is harder, we have to find which ones to remove.
    # Usually they are at the end.
    for _ in range(m_close - m_open):
        text = text.rsplit('</motion.div>', 1)[0] + text.rsplit('</motion.div>', 1)[1] if '</motion.div>' in text else text

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"After fix: {text.count('<motion.div')} / {text.count('</motion.div>')}")
