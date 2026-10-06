import re

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'r') as f:
    code = f.read()

modals_code = """
      {selectedProduct && (
        <AddToCartModal
          opened={productModal}
          onClose={closeProductModal}
          price={selectedProduct.price}
          image_url={selectedProduct.image_url}
          name={`${selectedProduct.gemstone_type || selectedProduct.collection_slug || ''} ${selectedProduct.shape || ''}`.trim()}
          size={selectedProduct.dimension}
          quality={selectedProduct.type || selectedProduct.quality}
          ct_weight={selectedProduct.ct_weight}
          color={selectedProduct.color}
          product={selectedProduct}
        />
      )}
      {quoteProduct && (
        <QuoteRequestModal 
          opened={!!quoteProduct} 
          onClose={() => setQuoteProduct(null)} 
          product={quoteProduct} 
        />
      )}
    </div>
"""

code = code.replace('    </div>\n  );\n}', modals_code + '  );\n}')

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'w') as f:
    f.write(code)

