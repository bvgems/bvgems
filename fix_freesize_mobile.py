with open('src/components/FreeSizeGemtones/FreeSizeGridViewTopFilters.tsx', 'r') as f:
    content = f.read()

# 1. RangeFilter wrapper
content = content.replace(
    '<div className="flex flex-col gap-2 w-full max-w-[250px]">',
    '<div className="flex flex-col gap-2 w-full max-w-[250px] items-center lg:items-start">'
)

# 2. Gem Type wrapper
old_gem = """        {/* GEM TYPE */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide">Gem Type</label>
          <div className="flex flex-wrap gap-4">"""
new_gem = """        {/* GEM TYPE */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide text-center lg:text-left">Gem Type</label>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">"""
content = content.replace(old_gem, new_gem)

# 3. Sapphire Colors wrapper
old_sap = """          {/* SAPPHIRE COLORS SUB-FILTER */}
          {selectedGems.includes("Sapphire") && sapphireColors.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 block">Sapphire Colors</label>
              <div className="flex flex-wrap gap-4">"""
new_sap = """          {/* SAPPHIRE COLORS SUB-FILTER */}
          {selectedGems.includes("Sapphire") && sapphireColors.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center lg:items-start">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 block text-center lg:text-left">Sapphire Colors</label>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">"""
content = content.replace(old_sap, new_sap)

# 4. Shape wrapper
old_shape = """        {/* SHAPE */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide">Shape</label>
          <div className="flex flex-wrap gap-4">"""
new_shape = """        {/* SHAPE */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <label className="text-sm font-bold text-[#0b182d] uppercase tracking-wide text-center lg:text-left">Shape</label>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">"""
content = content.replace(old_shape, new_shape)

# 5. Additional filters
old_add = """      {/* ADDITIONAL FREE SIZE FILTERS */}
      <div className="flex flex-col lg:flex-row gap-6 items-end mb-8 flex-wrap">"""
new_add = """      {/* ADDITIONAL FREE SIZE FILTERS */}
      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-end mb-8 flex-wrap justify-center lg:justify-start w-full">"""
content = content.replace(old_add, new_add)

# 6. Dimensions filters
old_dim = """      <div className="flex flex-col lg:flex-row gap-10 items-start">"""
new_dim = """      <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start w-full">"""
content = content.replace(old_dim, new_dim)

# 7. Tolerance switch
old_tol = """        <div className="flex flex-col justify-center h-full pt-4">
          <Switch"""
new_tol = """        <div className="flex flex-col justify-center items-center lg:items-start h-full pt-4">
          <Switch"""
content = content.replace(old_tol, new_tol)


with open('src/components/FreeSizeGemtones/FreeSizeGridViewTopFilters.tsx', 'w') as f:
    f.write(content)

print("Done")
