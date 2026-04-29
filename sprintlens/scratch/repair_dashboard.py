import os
import re

file_path = r'c:\AITestingMaster\AI-Projects\sprintlens\src\app\(app)\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

anchor = """spillReason || 'No explicit narrative logged.'}"
                        </span>
                     </div>
                  ))}"""

if anchor in content:
    injection = """
                </CardContent>
             </Card>
          </motion.div>
       )}
        </motion.div>
      </TabsContent>

      <TabsContent value="execution">
        <motion.div variants={item} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <motion.div variants={item} className="lg:col-span-4">
              <Card className="h-full border-white/10 shadow-lg shadow-black/5 bg-gradient-to-br from-background to-muted/10 min-h-[450px] flex flex-col">
                <CardHeader className="flex flex-col space-y-4 pb-2">"""
    
    new_content = content.replace(anchor, anchor + injection)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Restored")
else:
    print("Anchor not found")
