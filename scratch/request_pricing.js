const fs = require('fs');
const file = 'src/components/GridView/GridView.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `<button 
                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(row); }} 
                                   className="text-blue-600 underline whitespace-nowrap bg-transparent border-none p-0 cursor-pointer text-xs md:text-sm"
                                 >
                                   Request Pricing
                                 </button>`;

const newStr = `<button 
                                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuoteProduct(row); }} 
                                   className="text-blue-600 underline bg-transparent border-none p-0 cursor-pointer text-xs md:text-sm flex flex-col md:inline-block text-left leading-tight"
                                 >
                                   <span className="md:hidden">Request<br/>Pricing</span>
                                   <span className="hidden md:inline whitespace-nowrap">Request Pricing</span>
                                 </button>`;

content = content.replaceAll(oldStr, newStr);
fs.writeFileSync(file, content);
console.log("Done");
