import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Restore the main layout divs in the header
# This is derived from the standard layout seen in early parts of conversation
text = text.replace('Live Search\n          </p>', 'Live Search\n          </p>\n        </div>')
text = text.replace('loadStats(val);\n                 }}\n               >\n                 <option', 'loadStats(val);\n                 }}\n               >\n                 <option') # No change needed here

# Fix the iteration selector and live sync header
text = text.replace('Select Specific Iteration...</option>\n                 {sprintsData.availableSprints.map', 'Select Specific Iteration...</option>\n                 {sprintsData.availableSprints.map') # No change

# I'll just restore the </div> tags globally where they are obviously missing
# By looking for <div and then the next sibling.

# Actually, I'll just use a much larger replace.

block1_start = '<div className="flex flex-col sm:flex-row items-baseline justify-between space-y-4 sm:space-y-0 relative z-10">'
block1_end = '<div className="flex items-center space-x-4 relative z-10">'

# I'll just fix the whole header.
header_fix = """      <div className="flex flex-col sm:flex-row items-baseline justify-between space-y-4 sm:space-y-0 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
             {loading ? 'Analyzing Iterations...' : activeStats?.name ? `${activeStats.name} Analytics` : 'Dashboard Analytics'}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Active Iteration Telemetry <span className="mx-2 text-foreground/20">&bull;</span> Live Search
          </p>
        </div>
        <div className="flex items-center space-x-4 relative z-10">
          {!loading && sprintsData?.availableSprints && (
             <div className="flex bg-muted/50 border border-muted-foreground/20 rounded-lg overflow-hidden">
               <select 
                 className="bg-transparent text-foreground text-sm w-72 p-2.5 outline-none cursor-pointer appearance-none"
                 value={targetSprint}
                 onChange={(e) => {
                    const val = e.target.value;
                    setTargetSprint(val);
                    loadStats(val);
                 }}
               >
                 <option value="" className="bg-background text-muted-foreground">Select Specific Iteration...</option>
                 {sprintsData.availableSprints.map((path: string) => (
                    <option key={path} value={path} className="bg-background">
                      {path.split('\\\\').slice(-3).join('  -  ')}
                    </option>
                 ))}
               </select>
             </div>
          )}
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-600 dark:text-emerald-400 font-semibold backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live Sync</span>
          </div>
        </div>
      </div>"""

# Replace the whole header area
# We'll search for the start and the end of the Live Sync div
start_pat = '<div className="flex flex-col sm:flex-row items-baseline justify-between space-y-4 sm:space-y-0 relative z-10">'
end_pat = '<span>Live Sync</span>'

start_idx = text.find(start_pat)
end_idx = text.find(end_pat)

if start_idx != -1 and end_idx != -1:
    # Need to find the end of the Live Sync div
    # It was: </span>\n          </div>\n        </div>\n      </div>
    actual_end_idx = text.find('</span>', end_idx) + 7
    new_text = text[:start_idx] + header_fix + text[actual_end_idx:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Header restored.")
else:
    print("Markers not found.")
