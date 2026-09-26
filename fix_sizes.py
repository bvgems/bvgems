with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'onChange={(val) => setSelectedSizes(val ? [val] : [])}',
    'onChange={(val) => { setSelectedSizes(val ? [val] : []); if(val) router.push(generateSeoUrl(null, null, val), { scroll: false }); }}'
)

content = content.replace(
    '''onChange={(value) =>
                        setSelectedSizes(value ? [value] : [])
                      }''',
    '''onChange={(value) => {
                        setSelectedSizes(value ? [value] : []);
                        if(value) router.push(generateSeoUrl(null, null, value), { scroll: false });
                      }}'''
)

with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(content)
