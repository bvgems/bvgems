import os
import re

file_path = "src/app/customer-support/faqs/FAQClient.tsx"
with open(file_path, "r") as f:
    content = f.read()

import_statement = "import { PageHeader } from \"@/components/CommonComponents/PageHeader\";\n"
if "PageHeader" not in content:
    content = content.replace("import { FAQComponent } from \"@/components/FAQs/FAQComponent\";", import_statement + "import { FAQComponent } from \"@/components/FAQs/FAQComponent\";")

old_hero_pattern = re.compile(r"      {/\* Hero Section \*/}.*?</Container>\n      </div>", re.DOTALL)
new_hero = """      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about our products, shipping, returns, and more. If you need further assistance, don't hesitate to contact us." 
      />"""

content = re.sub(old_hero_pattern, new_hero, content, count=1)

with open(file_path, "w") as f:
    f.write(content)
