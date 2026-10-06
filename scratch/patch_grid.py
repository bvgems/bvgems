import re

with open('scratch/FreeSizeGridView.tsx', 'r') as f:
    code = f.read()

# 1. Add missing imports
imports_to_add = """
import { IconList, IconLayoutGrid } from "@tabler/icons-react";
import { Table, ActionIcon } from "@mantine/core";
import { useAuth } from "@/hooks/useAuth";
import { getPerCaratPrice, getPerStonePrice } from "@/utils/priceHelpers";
import { QuoteRequestModal } from "@/components/CommonComponents/QuoteRequestModal";
import { useDisclosure } from "@mantine/hooks";
import { generateFreeSizeStoneUrl } from "@/utils/seoUrlHelpers";
"""

# Insert right after '"use client";'
code = code.replace('"use client";', '"use client";\n' + imports_to_add)

# 2. Add state for viewMode, quoteProduct, useAuth
state_to_add = """
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const [quoteProduct, setQuoteProduct] = useState<any>(null);
"""
# Insert inside FreeSizeGridView before const ITEMS_PER_PAGE
code = re.sub(r'(const ITEMS_PER_PAGE = 18;)', state_to_add + r'\1', code)

# 3. Change Top Controls Section to match calibrated stones structure (add toggle)
toggle_code = """
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-8 gap-4 w-full">
            <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Showing {displayItems.length} result{displayItems.length !== 1 ? 's' : ''}
            </div>
            
            <div className="flex-grow flex items-center justify-end gap-4 w-full md:w-auto">
              {/* --- Sort dropdown --- */}
              <div className="w-full md:w-[180px]">
                <Select
                  size="sm"
                  placeholder="Sort by Carat"
                  value={sortOrder}
                  onChange={setSortOrder}
                  data={[
                    { label: "Ctw. Low to High", value: "lowToHigh" },
                    { label: "Ctw. High to Low", value: "highToLow" },
                  ]}
                  clearable={false}
                  className="w-full"
                />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden bg-white shrink-0">
                <ActionIcon radius="0" variant={viewMode === "list" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("list")} size="lg"><IconList size={18} /></ActionIcon>
                <ActionIcon radius="0" variant={viewMode === "grid" ? "filled" : "transparent"} color="dark" onClick={() => setViewMode("grid")} size="lg"><IconLayoutGrid size={18} /></ActionIcon>
              </div>
            </div>
          </div>
"""

# replace the entire Top Controls Section
top_controls_regex = r'\{\/\* === Top Controls Section === \*\/\}.*?\{\/\* === Grid Section === \*\/\}'
code = re.sub(top_controls_regex, '{/* === Top Controls Section === */}\n      <div className="mt-6 px-4 md:px-8">' + toggle_code + '</div>\n\n      {/* === Grid Section === */}', code, flags=re.DOTALL)

# 4. Modify Grid.Col span to span={{ base: 6, sm: 6, md: 4, lg: 3 }} (to show 4 cards per row)
code = code.replace('span={{ base: 6, sm: 6, md: 4 }}', 'span={{ base: 6, sm: 6, md: 4, lg: 3 }}')

# 5. Render list view or grid view conditionally
grid_section_code = """
          {viewMode === "list" ? (
             <div className="bg-white rounded shadow-sm border border-gray-100 p-1 md:p-2 w-full overflow-hidden">
               <Table highlightOnHover highlightOnHoverColor="#f5f5f5" striped verticalSpacing="sm" horizontalSpacing="xs" style={{ tableLayout: "fixed", width: "100%" }}>
                 <Table.Thead>
                   <Table.Tr className="font-bold text-xs text-gray-700 uppercase">
                     <Table.Th className="w-[45px] md:w-[60px] pl-3 md:pl-4">Pic</Table.Th>
                     <Table.Th className="w-[28%] md:w-[12%]">Lot #</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[15%]">Shape</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Color</Table.Th>
                     <Table.Th className="w-[32%] md:w-[18%]">Dimensions</Table.Th>
                     <Table.Th className="w-[15%] md:w-[10%]">Ct.</Table.Th>
                     <Table.Th className="hidden md:table-cell md:w-[12%]">Price/Ct</Table.Th>
                     <Table.Th className="w-[25%] md:w-[12%]">Price/St</Table.Th>
                     <Table.Th className="w-[50px] md:w-[100px] pr-3 md:pr-4"></Table.Th>
                   </Table.Tr>
                 </Table.Thead>
                 <Table.Tbody>
                   {displayItems.slice(0, visibleCount).length > 0 ? (
                     displayItems.slice(0, visibleCount).map((row: any, idx: number) => (
                       <Table.Tr 
                        key={row.id || idx}
                        onClick={(e: any) => {
                          if (e.target?.closest?.('button, input, [role="button"]')) return;
                          const stoneHandle = row?.collection_slug?.toLowerCase() || "unknown";
                          router.push(generateFreeSizeStoneUrl(row, stoneHandle));
                        }}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                         <Table.Td className="p-1 md:p-2 pl-3 md:pl-4">
                           {row.image_url ? <img src={row.image_url} alt={row.collection_slug} className="w-8 h-8 md:w-10 md:h-10 rounded object-contain mix-blend-multiply" /> : <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>}
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm font-medium whitespace-normal p-1 md:p-2 leading-tight">{row.lot_number || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2 capitalize">{row.shape || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">{row.color || "-"}</Table.Td>
                         <Table.Td className="text-xs md:text-sm p-1 md:p-2">
                           <span className="md:hidden">{row.dimension?.replace(/mm/gi, '').trim() || "-"}</span>
                           <span className="hidden md:inline">{row.dimension || "-"}</span>
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm whitespace-nowrap p-1 md:p-2">{row.ct_weight || "-"}</Table.Td>
                         <Table.Td className="hidden md:table-cell text-xs md:text-sm p-1 md:p-2">
                           {user ? (
                             <span className="font-semibold text-gray-900">
                               {row.price ? (
                                 `$${(getPerCaratPrice(row) || 0).toFixed(2)}`
                               ) : (
                                 <button 
                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(row); }} 
                                   className="text-blue-600 underline bg-transparent border-none p-0 cursor-pointer text-xs md:text-sm flex flex-col md:inline-block text-left leading-tight"
                                 >
                                   <span className="md:hidden">Request<br/>Pricing</span>
                                   <span className="hidden md:inline whitespace-nowrap">Request Pricing</span>
                                 </button>
                               )}
                             </span>
                           ) : (
                             <span className="text-gray-400 text-[10px] italic">Sign in</span>
                           )}
                         </Table.Td>
                         <Table.Td className="text-xs md:text-sm p-1 md:p-2">
                           {user ? (
                             <span className="font-semibold text-gray-900">
                               {row.price ? (
                                 `$${getPerStonePrice(row)}`
                               ) : (
                                 <button 
                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(row); }} 
                                   className="text-blue-600 underline bg-transparent border-none p-0 cursor-pointer text-xs md:text-sm flex flex-col md:inline-block text-left leading-tight"
                                 >
                                   <span className="md:hidden">Request<br/>Pricing</span>
                                   <span className="hidden md:inline whitespace-nowrap">Request Pricing</span>
                                 </button>
                               )}
                             </span>
                           ) : (
                             <span className="text-gray-400 text-[10px] italic">Sign in</span>
                           )}
                         </Table.Td>
                         <Table.Td className="p-1 md:p-2 pr-3 md:pr-4">
                           <div className="flex justify-end">
                             {/* No Add to Cart button for free size stones typically, but if we had one it would go here */}
                           </div>
                         </Table.Td>
                       </Table.Tr>
                     ))
                   ) : (
                     <Table.Tr><Table.Td colSpan={9} className="text-center py-12 text-gray-500 italic">No matching stones found.</Table.Td></Table.Tr>
                   )}
                 </Table.Tbody>
               </Table>
             </div>
          ) : (
          <Grid className="px-5 mt-5">
            {displayItems
              .slice(0, visibleCount)
              .map((item: any, index: number) => (
                <Grid.Col
                  key={item?.id || index}
                  span={{ base: 6, sm: 6, md: 4, lg: 3 }}
                  className="mobile-card"
                >
                  <AnimatedCard
                    item={item}
                    index={index}
                    baseDelay={0.6}
                    isFreeSize={true}
                    onOpenQuote={(item) => setQuoteProduct(item)}
                  />
                </Grid.Col>
              ))}
          </Grid>
          )}
"""

grid_regex = r'<Grid className="px-5 mt-5">.*?<\/Grid>'
code = re.sub(grid_regex, grid_section_code.replace('\\', '\\\\'), code, flags=re.DOTALL)

# Add QuoteRequestModal at the end of the return statement
quote_modal = """
      <QuoteRequestModal 
        opened={!!quoteProduct} 
        onClose={() => setQuoteProduct(null)} 
        product={quoteProduct} 
      />
    </div>
"""
code = re.sub(r'<\/div>\s*$', quote_modal, code)

with open('scratch/FreeSizeGridView.tsx', 'w') as f:
    f.write(code)

