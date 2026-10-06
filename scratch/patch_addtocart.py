import re

with open('src/components/GridView/AnimatedCard.tsx', 'r') as f:
    code = f.read()

# We need to insert the Add To Cart button in the Free Size block.
# Let's find:
#                            {item?.price && (
#                              <span className="font-medium text-gray-400 text-[10px] sm:text-xs">
#                                ${(getPerCaratPrice(item) || 0).toFixed(2)}/ct
#                              </span>
#                            )}
#                          </div>
#                        </div>
#                      </div>

find_str = """                           {item?.price && (
                             <span className="font-medium text-gray-400 text-[10px] sm:text-xs">
                               ${(getPerCaratPrice(item) || 0).toFixed(2)}/ct
                             </span>
                           )}
                         </div>
                       </div>
                     </div>"""

replace_str = """                           {item?.price && (
                             <span className="font-medium text-gray-400 text-[10px] sm:text-xs">
                               ${(getPerCaratPrice(item) || 0).toFixed(2)}/ct
                             </span>
                           )}
                         </div>
                       </div>
                       
                       {onAddToCart && (
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
                       )}
                     </div>"""

# Since this pattern appears TWICE (once in calibrated, once in free size), I should replace it in both, or just the second occurrence!
# Wait, in calibrated, the code already has `{!isFreeSize && onAddToCart && (` exactly after `</div>\n                       </div>`.
# So `find_str` will ONLY match the free size one, because the calibrated one has `{!isFreeSize...` instead of just `</div>`!
# Let's double check if my `find_str` matches exactly.

code = code.replace(find_str, replace_str)

with open('src/components/GridView/AnimatedCard.tsx', 'w') as f:
    f.write(code)

