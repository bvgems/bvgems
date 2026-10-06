import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# Add getCategoryData import
if "import { getCategoryData } from" not in code:
    code = code.replace('import { shopByColorOptions } from "@/utils/constants";', 'import { shopByColorOptions } from "@/utils/constants";\nimport { getCategoryData } from "@/apis/api";')

# Add state for categoryData
state_hook = '''
  const [categoryData, setCategoryData] = useState<any>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (selectedGems.length > 0) {
      setIsVideoLoading(true);
      const gem = selectedGems[0].toLowerCase();
      getCategoryData(gem).then((data) => {
        if (active) {
          setCategoryData(data);
          setIsVideoLoading(false);
        }
      }).catch(() => {
        if (active) setIsVideoLoading(false);
      });
    } else {
      setCategoryData(null);
    }
    return () => { active = false; };
  }, [selectedGems]);
'''

if "const [categoryData, setCategoryData]" not in code:
    code = code.replace('const SingleNumberFilter =', state_hook + '\nconst SingleNumberFilter =')

# Wait, the hook needs to be inside the TopFilters component!
# Let's see where the component starts.
