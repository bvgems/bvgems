import re

with open('src/components/GridView/AnimatedCard.tsx', 'r') as f:
    code = f.read()

# Fix 1: change lot_number || collection_slug to collection_slug
# Wait, for free size, if we just use collection_slug, will it be defined? Yes, it's the gem type.
code = code.replace(
    'getTitleSizeClass(item?.lot_number || item?.collection_slug)',
    'getTitleSizeClass(item?.collection_slug)'
)
code = code.replace(
    '{item?.lot_number || item?.collection_slug || "Gemstone"}',
    '{item?.collection_slug || "Gemstone"}'
)

# Fix 2: change item?.color to item?.type || "Natural"
# Wait, in the subtitle we had:
#                   {item?.color && (
#                     <>
#                       <span>{item?.color}</span>
#                       <span className="text-gray-300 text-[10px]">•</span>
#                     </>
#                   )}

color_block = """                  {item?.color && (
                     <>
                       <span>{item?.color}</span>
                       <span className="text-gray-300 text-[10px]">•</span>
                     </>
                   )}"""

type_block = """                  <span>{item?.type || item?.quality || "Natural"}</span>
                  <span className="text-gray-300 text-[10px]">•</span>"""

# Wait, `item?.color` is used twice in AnimatedCard.tsx - once in !isFreeSize (wait, !isFreeSize uses `item?.quality || "Natural"`).
# Let's just do a string replace on the exact block in the free size section.
# To be safe, I'll find it within the free size block.

free_size_start = code.find('            ) : (')
if free_size_start != -1:
    free_size_code = code[free_size_start:]
    free_size_code = free_size_code.replace(color_block, type_block)
    
    # We also need to add the `onAddToCart` button rendering!
    # In my last patch, I left it out of the free size branch (I commented `/* Add to cart is NOT rendered for free size stones typically... */`).
    # Let's replace that comment with the actual button code.
    
    add_to_cart_comment = "{/* Add to cart is NOT rendered for free size stones typically, but if we wanted we could conditionally check onAddToCart */}"
    
    add_to_cart_code = """                      {onAddToCart && (
                        <ActionIcon 
                          variant="filled" 
                          color="#0b182d" 
                          size="lg" 
                          radius="xl"
                          className="shadow-md hover:scale-105 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart();
                          }}
                        >
                          <IconShoppingCart size={18} stroke={2} />
                        </ActionIcon>
                      )}"""
                      
    free_size_code = free_size_code.replace(add_to_cart_comment, add_to_cart_code)
    
    code = code[:free_size_start] + free_size_code

with open('src/components/GridView/AnimatedCard.tsx', 'w') as f:
    f.write(code)

