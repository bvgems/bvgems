import re

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'r') as f:
    code = f.read()

# 1. Imports
# Need AddToCartModal and IconShoppingCart
if "AddToCartModal" not in code:
    code = code.replace(
        'import { QuoteRequestModal }',
        'import { QuoteRequestModal }\nimport { AddToCartModal } from "@/components/CommonComponents/AddToCartModal";'
    )
if "IconShoppingCart" not in code:
    code = code.replace(
        'import { IconList, IconLayoutGrid }',
        'import { IconList, IconLayoutGrid, IconShoppingCart }'
    )

# 2. State
if "openProductModal" not in code:
    state_injection = """
  const [productModal, { open: openProductModal, close: closeProductModal }] = useDisclosure(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
"""
    code = code.replace('const [quoteProduct, setQuoteProduct] = useState<any>(null);', 'const [quoteProduct, setQuoteProduct] = useState<any>(null);' + state_injection)

# 3. List view add to cart
list_button = """                             <ActionIcon 
                               variant="filled" 
                               color="#0b182d" 
                               size="md" 
                               radius="xl"
                               className="shadow-sm hover:scale-105 transition-transform"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setSelectedProduct(row);
                                 openProductModal();
                               }}
                             >
                               <IconShoppingCart size={14} stroke={2} />
                             </ActionIcon>"""
code = code.replace(
    '<div className="flex justify-end">\n                           </div>',
    '<div className="flex justify-end">\n' + list_button + '\n                           </div>'
)

# 4. Grid view add to cart
grid_button = """                    onOpenQuote={(item: any) => setQuoteProduct(item)}
                    onAddToCart={() => {
                      setSelectedProduct(item);
                      openProductModal();
                    }}"""
code = code.replace('onOpenQuote={(item: any) => setQuoteProduct(item)}', grid_button)

# 5. Add Modal to bottom
modal_code = """      <QuoteRequestModal 
        opened={!!quoteProduct} 
        onClose={() => setQuoteProduct(null)} 
        product={quoteProduct} 
      />
      <AddToCartModal
        opened={productModal}
        onClose={closeProductModal}
        product={selectedProduct}
        isFreeSize={true}
      />"""
code = code.replace(
    '<QuoteRequestModal \n        opened={!!quoteProduct} \n        onClose={() => setQuoteProduct(null)} \n        product={quoteProduct} \n      />',
    modal_code
)

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'w') as f:
    f.write(code)

