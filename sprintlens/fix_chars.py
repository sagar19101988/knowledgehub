path = r'src\app\(app)\dashboard\page.tsx'
with open(path, 'rb') as f:
    data = f.read()
text = data.decode('utf-8', errors='replace')

# Replace ALL consecutive non-ASCII char sequences with a safe bullet placeholder
result = ''
i = 0
while i < len(text):
    ch = text[i]
    if ord(ch) <= 127:
        result += ch
        i += 1
    else:
        # Consume all consecutive non-ascii chars and collapse to a single bullet
        while i < len(text) and ord(text[i]) > 127:
            i += 1
        result += '*'  # safe ASCII placeholder

# Now do targeted replacements to restore meaningful chars:
# The '*' was originally one of: bullet, arrow, em-dash, checkmark, ellipsis
# We will fix the ones we know about by their surrounding context
import re

# bullet separator in subtitle: ">*<" pattern
result = result.replace('foreground/20">*</span>', 'foreground/20">&bull;</span>')

# Open -> Merge arrow
result = result.replace('Open *</div>', 'Open &rarr; Merge</div>')
result = result.replace('Open * Merge', 'Open &rarr; Merge')

# Done checkmark badge
result = result.replace("'done' ? '*' : '*'", "'done' ? '\u2713' : '\u22ef'")
result = result.replace("=== 'done' ? '*' : '*'", "=== 'done' ? '\u2713' : '\u22ef'")

# em-dash in descriptions - replace remaining * in string literals with hyphen
result = re.sub(r"'([^']*)\*([^']*)'", lambda m: "'" + m.group(1) + ' - ' + m.group(2) + "'", result)

# Any remaining * in JSX text nodes that look like separators
result = result.replace('done * active', 'done &bull; active')
result = result.replace('tasks * {', 'tasks &bull; {')

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(result)

with open(path, 'rb') as f:
    data2 = f.read()
non_ascii = sum(1 for b in data2 if b > 127)
print(f'Non-ASCII bytes remaining: {non_ascii}')

# Verify the bullet is now HTML entity
idx = data2.find(b'foreground/20')
region = data2[idx:idx+30]
print('Bullet area:', region.decode('ascii', errors='replace'))
print('Done!')
