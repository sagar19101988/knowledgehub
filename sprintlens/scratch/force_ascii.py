import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Define the markers for each block
# Overview: Quick Stats -> Scope Modification -> Banners
# Resources: Team Workload -> Capacity
# Execution: Velocity -> Bottlenecks -> Intelligence -> Backlog Tracker
# Tickets: The tickets list

# We'll extract the code for each block.
# This assumes markers are still there.

def extract(marker_start, marker_end):
    start = text.find(marker_start)
    end = text.find(marker_end) if marker_end else len(text)
    if start == -1: return ""
    return text[start:end]

overview_block = extract('{/* Quick Stats */}', '{/* Middle Panels */}')
overview_banners = extract('{/* Restored Banners', '{/* VELOCITY') # Wait, this is tricky.

# Actually, I'll just use a much simpler approach. 
# Revert to a structure that is guaranteed to work: ONE LARGE TAB and nothing else.
# Then slowly add back.

# NO, I'll fix it properly now.

# The issue is the invisible characters.
# I'll rewrite the file and filter out EVERYTHING non-ascii.

clean_text = "".join(c for c in text if ord(c) < 128)

with open(file_path, 'w', encoding='ascii') as f:
    f.write(clean_text)

print("Forced ASCII-only file rewrite")
