"use client";

import { useEffect, useRef, useState, ComponentProps } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { useMDXComponent } from "next-contentlayer/hooks";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./reveal";

function ImageLightbox({ src, alt = "" }: ComponentProps<"img">) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; };
  }, [open]);
  return (
    <>
      <motion.button type="button" onClick={() => setOpen(true)} aria-label={`Enlarge image: ${alt}`} className="reveal group my-3 block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-paper/10 bg-raised" initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" width={1600} height={1000} className="aspect-[16/10] w-full object-contain transition-opacity group-hover:opacity-90" />
      </motion.button>
      {open && createPortal(
        <dialog ref={dialog} className="image-dialog" aria-label={alt || "Project image"} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
          <button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close image" className="ml-auto mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-paper/15 text-paper"><X size={20} /></button>
          <img src={src} alt={alt} className="min-h-0 w-full min-w-0 flex-1 object-contain" />
          {alt && <p className="mt-4 w-full shrink-0 text-center text-sm text-secondary">{alt}</p>}
        </dialog>, document.body
      )}
    </>
  );
}

// MDX wraps images in paragraphs. The preview button is phrasing content;
// the modal is portaled to the body so paragraph markup stays valid.
const components = {
  img: ImageLightbox,
  Image,
  h2: ({ children, id }: ComponentProps<"h2">) => <Reveal as="h2" id={id}>{children}</Reveal>,
  h3: ({ children, id }: ComponentProps<"h3">) => <Reveal as="h3" id={id}>{children}</Reveal>,
};
export function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <div className="mdx"><Component components={components} /></div>;
}
