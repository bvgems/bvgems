import re

with open('src/components/GridView/AnimatedCard.tsx', 'r') as f:
    code = f.read()

# We want to replace the whole `) : (` block inside the `{isFreeSize ? ...}` ternary to the end.
# Wait, the code has:
#           <div className="p-3.5 md:p-5 flex flex-col flex-grow bg-white relative">
#             {!isFreeSize ? (
#               <div className="flex flex-col h-full">...</div>
#             ) : (
#               <div>...</div>
#             )}
#           </div>

# Let's extract the first block `(!isFreeSize)` up to `) : (` 
# But wait! If both branches now have EXACTLY the same layout and classes, maybe I can just unify them?
# The difference is:
# 1. h3 title: `item?.collection_slug` vs `item?.lot_number || item?.collection_slug`
# 2. subtitle: `item?.shape • item?.quality • item?.size` vs `item?.shape • item?.color • item?.dimension`
# 3. Request pricing button: `getTitleSizeClass(item?.collection_slug)` vs `getTitleSizeClass(item?.lot_number)`
# 4. Add to cart button: `!isFreeSize && onAddToCart` is already there!

# Actually, unifying them might be even cleaner. But let's just replace the `isFreeSize == true` branch block for safety to not break calibrated stones.

is_free_size_replacement = """              <div className="flex flex-col h-full">
                 <div className="flex justify-between items-start gap-2 mb-1">
                   <h3 className={`font-bold text-[#0b182d] ${getTitleSizeClass(item?.lot_number || item?.collection_slug)} tracking-tight leading-tight`}>
                     {item?.lot_number || item?.collection_slug || "Gemstone"}
                   </h3>
                   <div className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap border border-gray-100 shadow-sm">
                     {item?.ct_weight} ct
                   </div>
                 </div>
                 
                 <p className="text-gray-500 text-[11px] sm:text-xs tracking-wide font-medium mt-0.5 flex flex-wrap items-center gap-1.5">
                   {item?.shape && (
                     <>
                       <span>{item?.shape}</span>
                       <span className="text-gray-300 text-[10px]">•</span>
                     </>
                   )}
                   {item?.color && (
                     <>
                       <span>{item?.color}</span>
                       <span className="text-gray-300 text-[10px]">•</span>
                     </>
                   )}
                   <span className="text-gray-400">{item?.dimension?.replace(/mm/gi, '').trim()} mm</span>
                 </p>

                 <div className="mt-auto flex flex-col pt-4 border-t border-gray-50 mt-4">
                   {user ? (
                     <div className="flex items-end justify-between gap-2">
                       <div className="flex flex-col">
                         <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Per Stone</span>
                         <div className="flex items-baseline gap-1.5">
                           <span className="font-bold text-[#0b182d] text-lg sm:text-xl tracking-tight leading-none">
                             {item?.price ? (
                               `$${getPerStonePrice(item)}`
                             ) : (
                               <button 
                                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenQuote && onOpenQuote(item); }} 
                                 className={`text-blue-600 underline bg-transparent border-none p-0 cursor-pointer font-bold ${getTitleSizeClass(item?.lot_number || item?.collection_slug)} tracking-tight leading-tight whitespace-nowrap hover:text-blue-800 transition-colors`}
                               >
                                 Request Pricing
                               </button>
                             )}
                           </span>
                           {item?.price && (
                             <span className="font-medium text-gray-400 text-[10px] sm:text-xs">
                               ${(getPerCaratPrice(item) || 0).toFixed(2)}/ct
                             </span>
                           )}
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div className="flex items-center justify-between gap-2">
                       <div 
                         onClick={(e) => { e.stopPropagation(); open(); }}
                         className="flex flex-col group cursor-pointer w-full"
                       >
                         <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Pricing</span>
                         <div className="flex items-center justify-between bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/60 transition-colors">
                           <div className="flex items-center gap-1.5 text-blue-600">
                             <IconLock size={14} stroke={2.5} />
                             <span className="text-xs font-bold tracking-wide">Sign in to view prices</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
              </div>"""

# we need to find the specific block starting with 
# `            ) : (` and ending before `          </div>\n        </Card>\n      </motion.div>`

regex = r'            \) : \(\n              <div>\n                <p>Dimension:.*?<\/div>\n            \)'

code = re.sub(regex, '            ) : (\n' + is_free_size_replacement + '\n            )', code, flags=re.DOTALL)

with open('src/components/GridView/AnimatedCard.tsx', 'w') as f:
    f.write(code)

