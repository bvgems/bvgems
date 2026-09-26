import re

with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

# Add import Link
if 'import Link' not in content:
    content = content.replace('import Image from "next/image";', 'import Image from "next/image";\nimport Link from "next/link";')

# Insert URL generator logic
url_logic = """
  const generateSeoUrl = (newShape: string | null, newColor: string | null) => {
    const shapeToUse = newShape || selectedShape || (shapes?.length ? shapes[0] : "round");
    const shapeSlug = shapeToUse.toLowerCase().replace(/\\s+/g, "-");
    const params = new URLSearchParams();
    
    const colorToUse = newColor || (isSapphire ? selectedSapphireColor : null);
    if (colorToUse && isSapphire) {
      params.set("color", colorToUse);
    }
    if (typeFilter) {
      params.set("type", typeFilter);
    }
    if (emeraldShade && isEmerald) {
      params.set("shade", emeraldShade);
    }
    
    const queryStr = params.toString();
    return `/calibrated-stones/${handle}/${shapeSlug}${queryStr ? '?' + queryStr : ''}`;
  };
"""

if 'const generateSeoUrl' not in content:
    # Find a good place to insert it, maybe after router = useRouter()
    content = content.replace('const router = useRouter();', 'const router = useRouter();\n' + url_logic)

# Replace Mobile Dropdown logic for shape
content = content.replace(
    'onChange={(val) => setSelectedShape(val)}',
    'onChange={(val) => { setSelectedShape(val); if(val) router.push(generateSeoUrl(val, null), { scroll: false }); }}'
)

# Replace Mobile Dropdown logic for color
content = content.replace(
    'onChange={(val) => setSelectedSapphireColor(val!)}',
    'onChange={(val) => { setSelectedSapphireColor(val!); if(val) router.push(generateSeoUrl(null, val), { scroll: false }); }}'
)

# Replace desktop shape logic with Link
desktop_shape_old = """                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => setSelectedShape(shape)}
                      >
                        <Tooltip label={shape}>"""

desktop_shape_new = """                    return (
                      <Link
                        href={generateSeoUrl(shape, null)}
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                        scroll={false}
                        onClick={() => setSelectedShape(shape)}
                      >
                        <Tooltip label={shape}>"""

content = content.replace(desktop_shape_old, desktop_shape_new)

# Make sure to close the Link instead of div
content = content.replace("""                        </Tooltip>
                      </div>
                    );
                  })}""", """                        </Tooltip>
                      </Link>
                    );
                  })""")


# Replace desktop color logic with Link
desktop_color_old = """                          <Tooltip label={item?.value} key={index}>
                            <span
                              onClick={() =>
                                setSelectedSapphireColor(item?.value)
                              }"""
desktop_color_new = """                          <Tooltip label={item?.value} key={index}>
                            <Link
                              href={generateSeoUrl(null, item?.value)}
                              scroll={false}
                              onClick={() => setSelectedSapphireColor(item?.value)}
                              style={{ display: "inline-block" }}
                            >
                              <span"""

content = content.replace(desktop_color_old, desktop_color_new)

# Add closing span and link for color
content = content.replace("""                            </span>
                          </Tooltip>""", """                            </span>
                            </Link>
                          </Tooltip>""")

with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(content)

print("Applied SEO links successfully!")
