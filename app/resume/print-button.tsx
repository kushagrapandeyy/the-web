"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return <button type="button" onClick={() => window.print()} className="button-primary print:hidden"><Printer size={16} aria-hidden="true" />Export PDF / Print</button>;
}
