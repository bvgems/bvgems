import re

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'r') as f:
    code = f.read()

# Replace the existing simple action icon in FreeSize list view with the Desktop/Mobile combo
simple_icon = r'<ActionIcon\s*variant="filled"\s*color="#0b182d"\s*size="md"\s*radius="xl"\s*className="shadow-sm hover:scale-105 transition-transform"\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setSelectedProduct\(row\);\s*openProductModal\(\);\s*\}\}\s*>\s*<IconShoppingCart size=\{14\} stroke=\{2\} \/>\s*<\/ActionIcon>'

combo_code = """                              {/* Mobile Cart Icon */}
                              <div className="md:hidden">
                                <ActionIcon
                                  variant="outline"
                                  color="#0b182d"
                                  size="md"
                                  radius="md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProduct(row);
                                    openProductModal();
                                  }}
                                >
                                  <IconShoppingCart size={16} />
                                </ActionIcon>
                              </div>
                              
                              {/* Desktop Cart Button */}
                              <div className="hidden md:block">
                                <Button
                                  variant="outline"
                                  color="#0b182d"
                                  size="xs"
                                  radius="md"
                                  leftSection={<IconShoppingCart size={16} />}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSelectedProduct(row);
                                    openProductModal();
                                  }}
                                >
                                  ADD TO CART
                                </Button>
                              </div>"""

code = re.sub(simple_icon, combo_code.replace('\\', '\\\\'), code, flags=re.DOTALL)

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'w') as f:
    f.write(code)

