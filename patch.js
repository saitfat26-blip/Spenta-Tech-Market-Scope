const fs = require('fs');
let code = fs.readFileSync('src/components/SectionMap.tsx', 'utf8');

// Add isMapCollapsed state
if (!code.includes('isMapCollapsed')) {
  code = code.replace(
    /const \[isHovered, setIsHovered\] = useState\(false\);/,
    "const [isHovered, setIsHovered] = useState(false);\n  const [isMapCollapsed, setIsMapCollapsed] = useState(false);"
  );
}

// Update the root div to not be hidden on mobile
code = code.replace(
  /<div className="fixed left-6 top-1\/2 -translate-y-1\/2 z-\[80\] hidden xl:block">/,
  '<div className="fixed bottom-24 left-4 xl:left-6 xl:top-1/2 xl:-translate-y-1/2 xl:bottom-auto z-[80]">'
);

// We need to add the toggle button at the top of the SectionMap
const toggleBtn = `
          {/* Map Collapse Toggle */}
          <button 
            onClick={() => setIsMapCollapsed(!isMapCollapsed)}
            className="mb-2 p-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-700 rounded-full shadow-lg transition-colors flex items-center justify-center mx-auto"
            title="Toggle Map"
          >
            {isMapCollapsed ? <Map className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
`;

code = code.replace(
  /<motion\.div \n            style={{ scale: mapScale, transformOrigin: 'left center' }}/,
  toggleBtn + '\n          <motion.div \n            style={{ scale: mapScale, transformOrigin: "left center" }}'
);

// We need to wrap the internal content of the main container in a motion.div for height transition
// The main container is: className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-[2rem] p-2 flex flex-col items-center gap-2 shadow-2xl relative"

// Let's replace the opening and closing of that container's INNER content.
// Wait, the main container has a ref={containerRef} because we measure positions relative to it.
// We must keep the container but hide its contents.
code = code.replace(
  /className="bg-slate-950\/80 backdrop-blur-md border border-slate-800 rounded-\[2rem\] p-2 flex flex-col items-center gap-2 shadow-2xl relative"\n            onMouseEnter={\(\) => setIsOpen\(true\)}\n            onMouseLeave={\(\) => setIsOpen\(false\)}\n          >/,
  `className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-[2rem] p-2 flex flex-col items-center shadow-2xl relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <AnimatePresence initial={false}>
              {!isMapCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex flex-col items-center gap-2 overflow-hidden w-full relative"
                >
`
);

// Add the closing tag for the motion.div before the end of the container
// Let's find the end of the container by finding the end of the scale div
// Actually, it's easier to find the zoom controls and close it right before them? No, zoom controls are outside the container?
// Let's look at the structure.
