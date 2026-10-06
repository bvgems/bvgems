const fs = require('fs');
const file = 'src/components/GridView/GridViewTopFilters.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSwitchStr = `                <div className="flex flex-col justify-center items-center lg:items-start w-full pt-1">
                  <Switch
                    checked={toleranceEnabled}
                    onChange={(event) => setToleranceEnabled(event.currentTarget.checked)}
                    label={<span className="text-xs font-bold text-[#0b182d]">Apply ±5 Tolerance</span>}
                    color="violet"
                    size="sm"
                  />
                </div>`;
                
const newSwitchStr = ``;

content = content.replace(oldSwitchStr, newSwitchStr);

const oldLabelStr = `label={\`Weight (CT)\${toleranceEnabled ? " (±5)" : ""}\`}`;
const newLabelStr = `label="Weight (CT)"`;
content = content.replace(oldLabelStr, newLabelStr);

fs.writeFileSync(file, content);
console.log("Done");
