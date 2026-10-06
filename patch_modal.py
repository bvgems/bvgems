import re

with open('src/components/CommonComponents/AddToCartModal.tsx', 'r') as f:
    content = f.read()

# Find the render function body
debug_code = """
  console.log("AddToCartModal Render Debug:", {
    hideShadeOptions,
    collection_slug: product?.collection_slug,
    isLabGrown: isLabGrown(product),
    type: product?.type,
    quality: product?.quality,
    extra_images: product?.extra_images
  });

  const perCarat = useMemo(() => getPerCaratPrice(product), [product]);
"""
content = content.replace('  const perCarat = useMemo(() => getPerCaratPrice(product), [product]);', debug_code)

with open('src/components/CommonComponents/AddToCartModal.tsx', 'w') as f:
    f.write(content)

print("Patched AddToCartModal")
