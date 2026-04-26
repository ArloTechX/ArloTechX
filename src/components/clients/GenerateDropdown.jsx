import { useEffect, useRef, useState } from 'react';
import { ChevronDown, FileText, FileSignature, ReceiptText } from 'lucide-react';

const options = [
  { type: 'quotation', label: 'Generate Quotation', icon: FileText },
  { type: 'agreement', label: 'Generate Agreement', icon: FileSignature },
  { type: 'invoice', label: 'Generate Invoice', icon: ReceiptText },
];

const GenerateDropdown = ({ onSelect, align = 'left' }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!rootRef.current || rootRef.current.contains(event.target)) return;
      setOpen(false);
    };

    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
      >
        Generate <ChevronDown size={14} />
      </button>

      {open ? (
        <div
          className={`absolute z-20 mt-2 w-52 rounded-xl border border-blue-100 bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.14)] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                onSelect(item.type);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <item.icon size={15} className="text-blue-600" />
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default GenerateDropdown;

