import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove Tabs Imports
text = text.replace(', Tabs, TabsList, TabsTrigger, TabsContent', '')
text = text.replace('import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"', '')

# 2. Extract the content parts
# We'll remove the Tab wrappers and keep the inner blocks.

# This is a bit complex with regex because of the nesting.
# I'll just remove the literal strings of the tab tags.

tags_to_remove = [
    '<Tabs defaultValue="overview" className="w-full">',
    '<TabsList>',
    '<TabsTrigger value="overview">Overview</TabsTrigger>',
    '<TabsTrigger value="execution">Execution</TabsTrigger>',
    '<TabsTrigger value="resources">Resources</TabsTrigger>',
    '<TabsTrigger value="tickets">Work Items</TabsTrigger>',
    '</TabsList>',
    '<TabsContent value="overview">',
    '<TabsContent value="execution">',
    '<TabsContent value="resources">',
    '<TabsContent value="tickets">',
    '</TabsContent>',
    '</Tabs>',
    '<div className="sticky top-0 z-20 pb-4 bg-background/80 backdrop-blur-md pt-2 -mt-2">',
    '</div>' # This one is dangerous, I'll be more specific
]

# Specifically replace the sticky div and its closing
text = text.replace('<div className="sticky top-0 z-20 pb-4 bg-background/80 backdrop-blur-md pt-2 -mt-2">', '')

# Remove all occurrences of the other tags
for tag in tags_to_remove:
    text = text.replace(tag, '')

# Now we need to fix the extra </motion.div> and extra <motion.div> that were tab-specific
# I'll just do a global balance fix again but simpler.

# And remove the Work Items Search section at the end which was new.
# It starts around: <motion.div variants={item} className="space-y-6"> ... Search by ID ...
# I'll look for SEARCH section.

search_section_pattern = re.compile(r'<motion\.div variants=\{item\} className="space-y-6">.*?Search by ID, title, or assignee.*?</motion\.div>\s+</motion\.div>', re.DOTALL)
text = search_section_pattern.sub('', text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Reverted Tab wrappers and Work Items search section.")
