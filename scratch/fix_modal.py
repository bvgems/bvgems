import re

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'r') as f:
    code = f.read()

# Add Modal to imports
code = code.replace(
    '  ActionIcon } from "@mantine/core";',
    '  ActionIcon, Modal } from "@mantine/core";'
)
# Wait, let's just add it to the large destructured import:
code = code.replace(
    '  Group,',
    '  Group,\n  Modal,'
)

# Now, wrap AddToCartModal with <Modal>
old_modal = '''      {selectedProduct && (
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
      )}'''

new_modal = '''      <Modal
        p={0}
        size={1000}
        opened={productModal}
        onClose={closeProductModal}
        overlayProps={{ style: { backdropFilter: "blur(4px)" } }}
        transitionProps={{ transition: "slide-right" }}
        centered
      >
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
            hideShadeOptions={true}
          />
        )}
      </Modal>'''

code = code.replace(old_modal, new_modal)

with open('src/components/FreeSizeGemtones/FreeSizeGridView.tsx', 'w') as f:
    f.write(code)

