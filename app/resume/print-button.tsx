"use client";

import { Download, Printer } from "lucide-react";

export function PrintButton() {
  return <div className="flex flex-wrap items-center gap-4 print:hidden">
    <a href="/resume.pdf" download="Kushagra-Pandey-Resume.pdf" className="text-link"><Download size={16} aria-hidden="true" />Download PDF</a>
    <button type="button" onClick={() => window.print()} className="button-primary"><Printer size={16} aria-hidden="true" />Export PDF / Print</button>
  </div>;
}
