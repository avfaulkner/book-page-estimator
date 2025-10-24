import React, { useState, useEffect } from "react";

const sections = [
  { id: "estimate", label: "Estimate Pages", icon: "📄" },
  { id: "cover", label: "Design Cover", icon: "🎨" },
  { id: "pdf", label: "Create PDF Book", icon: "📘" },
];

const Sidebar: React.FC = () => {
  const [active, setActive] = useState("estimate");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let current = "estimate";
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
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
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white shadow-md border-r border-slate-200 transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-6 py-5 border-b border-slate-100 text-xl font-bold text-blue-700">
          Book Tools
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sections.map(({ id, label, icon }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setIsOpen(false)}
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
