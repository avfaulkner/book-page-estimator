import React, { useState, useEffect } from "react";

const sections = [
  { id: "estimate", label: "Estimate Pages", icon: "📄" },
  { id: "cover", label: "Design Cover", icon: "🎨" },
  { id: "pdf", label: "Create PDF Book", icon: "📘" },
];

const Sidebar: React.FC = () => {
  const [active, setActive] = useState("estimate");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let current = "estimate";
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = id;
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow z-50">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h1 className="font-bold text-blue-700 text-lg">Book Tools</h1>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            <svg
              className="w-6 h-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="flex flex-col bg-white border-b border-slate-200">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 ${
                  active === id
                    ? "text-blue-700 font-semibold bg-blue-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 shadow">
        <div className="px-6 py-5 border-b border-slate-100 text-xl font-bold text-blue-700">
          Book Tools
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sections.map(({ id, label, icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                active === id
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="px-6 py-4 text-xs text-slate-500 border-t border-slate-100">
          © 2025 Book Page Estimator
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
