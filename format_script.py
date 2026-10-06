import os
import re

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return

    with open(filepath, 'r') as f:
        content = f.read()
    
    # Track if we need to add imports
    needs_import = False
    
    # Define replacements
    if 'CartComponent.tsx' in filepath or 'checkout' in filepath or 'BillingSummary' in filepath or 'MyOrders' in filepath:
        # Cart/Checkout exact values
        # CartComponent uses total.toFixed(2), value.product.price, etc.
        # Actually for Cart we just leave toFixed(2) as it is exact for price, and for weight we leave it or remove toFixed.
        # Let's inspect CartComponent.tsx manually
        pass
    else:
        # General display files
        original = content
        
        # Replace weight displays (usually item.ct_weight or element.ct_weight)
        # We need to be careful with template literals and JSX
        # E.g. {element.ct_weight} -> {formatDisplayWeight(element.ct_weight)}
        # E.g. ${item.ct_weight} -> ${formatDisplayWeight(item.ct_weight)}
        
        content = re.sub(r'\{element\.ct_weight\}', r'{formatDisplayWeight(element.ct_weight)}', content)
        content = re.sub(r'\{item\.ct_weight\}', r'{formatDisplayWeight(item.ct_weight)}', content)
        content = re.sub(r'\{product\.ct_weight\}', r'{formatDisplayWeight(product.ct_weight)}', content)
        content = re.sub(r'\$\{item\.ct_weight\}', r'${formatDisplayWeight(item.ct_weight)}', content)
        
        # Replace price displays
        # e.g. `$${getPerStonePrice(item)}` -> `$${formatDisplayPrice(getPerStonePrice(item))}`
        content = re.sub(r'\$\$\{getPerStonePrice\(([^)]+)\)\}', r'$${formatDisplayPrice(getPerStonePrice(\1))}', content)
        content = re.sub(r'\{getPerStonePrice\(([^)]+)\)\.toFixed\(2\)\}', r'{formatDisplayPrice(getPerStonePrice(\1))}', content)
        content = re.sub(r'\$\$\{getPerCaratPrice\(([^)]+)\)\.toFixed\(2\)\}', r'$${formatDisplayPrice(getPerCaratPrice(\1))}', content)
        content = re.sub(r'\$\$\{getPerCaratPrice\(([^)]+)\)\}', r'$${formatDisplayPrice(getPerCaratPrice(\1))}', content)
        
        content = re.sub(r'\$ \{Number\(element\.price\)\.toFixed\(2\)\}', r'$ {formatDisplayPrice(element.price)}', content)
        content = re.sub(r'\$ \{element\.price\}', r'$ {formatDisplayPrice(element.price)}', content)
        content = re.sub(r'\$\{item\.price\}', r'${formatDisplayPrice(item.price)}', content)
        content = re.sub(r'\$\{element\.price\}', r'${formatDisplayPrice(element.price)}', content)
        
        # Add import if changed
        if content != original:
            if 'formatDisplayPrice' in content or 'formatDisplayWeight' in content:
                # Find the imports section
                import_stmt = 'import { formatDisplayPrice, formatDisplayWeight } from "@/utils/priceHelpers";\n'
                if import_stmt not in content:
                    # just put it after the first import
                    content = re.sub(r'^(import .*?\n)', r'\1' + import_stmt, content, count=1)
            
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated {filepath}")

# Files to process
files = [
    'src/components/GridView/AnimatedCard.tsx',
    'src/components/Category/CategoryTable.tsx',
    'src/components/Category/CategoryContent.tsx',
    'src/components/ProductDetails/ProductDetailsPage.tsx',
    'src/components/ProductDetails/ProductSpecifications.tsx',
    'src/components/CommonComponents/AddToCartModal.tsx',
    'src/components/FreeSizeGemtones/FreeSizeGridView.tsx',
    'src/components/FreeSizeGemstones/FreeSizeGemstonesDetails.tsx',
    'src/components/ColorstoneLayoutsGridView/LayoutProductPage.tsx',
    'src/components/ColorstoneLayoutsGridView/ProductCard.tsx',
    'src/components/Jewerly/JewerlyProductDetails.tsx',
    'src/components/Jewerly/JeweleryDetailsTable.tsx',
    'src/app/special-page/page.tsx'
]

for f in files:
    process_file(f)

