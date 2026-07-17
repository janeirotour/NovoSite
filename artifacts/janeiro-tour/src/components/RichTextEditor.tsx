import { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, Color, FontSize } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import ImageExt from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TableKit } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { marked } from "marked";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code2, Link2,
  ImagePlus, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ListChecks, Quote, Minus, Undo2, Redo2,
  Table as TableIcon, Youtube as YoutubeIcon, Code, Eye, FileCode,
  Baseline, Highlighter, X as XIcon, Check, ExternalLink,
  ChevronDown, Upload,
} from "lucide-react";

/* ─── Helpers ─── */
function isHtml(str: string) {
  return /^\s*<[a-zA-Z]/.test(str);
}

async function toHtml(content: string): Promise<string> {
  if (!content?.trim()) return "";
  if (isHtml(content)) return content;
  return await marked(content, { gfm: true, breaks: true });
}

function wordCount(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

/* ─── Toolbar button ─── */
function TB({ onClick, active, title, disabled, children }: {
  onClick: () => void; active?: boolean; title?: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button" title={title} onClick={onClick} disabled={disabled}
      className={`p-1.5 rounded transition-colors text-sm shrink-0 ${active
        ? "bg-primary text-primary-foreground"
        : "hover:bg-muted text-foreground/70 hover:text-foreground"} disabled:opacity-40 disabled:cursor-not-allowed`}
    >{children}</button>
  );
}

function Sep() { return <span className="w-px h-5 bg-border mx-0.5 shrink-0" />; }

/* ─── Floating panel (for dialogs) ─── */
function FloatingPanel({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute z-50 bg-card border border-border rounded-xl shadow-xl top-full mt-1 left-0 min-w-[280px]">
      {children}
    </div>
  );
}

/* ─── Link dialog ─── */
function LinkPanel({ onApply, onRemove, onClose, initial }: {
  onApply: (url: string, newTab: boolean) => void;
  onRemove: () => void;
  onClose: () => void;
  initial?: { url: string; newTab: boolean };
}) {
  const [url, setUrl] = useState(initial?.url ?? "https://");
  const [newTab, setNewTab] = useState(initial?.newTab ?? true);
  return (
    <div className="p-3 space-y-2">
      <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Link</p>
      <input autoFocus type="url" value={url} onChange={e => setUrl(e.target.value)}
        placeholder="https://example.com"
        onKeyDown={e => { if (e.key === "Enter") onApply(url, newTab); }}
        className="w-full text-sm border rounded px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
      <label className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer select-none">
        <input type="checkbox" checked={newTab} onChange={e => setNewTab(e.target.checked)} />
        Open in new tab
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={() => onApply(url, newTab)}
          className="flex-1 text-xs bg-primary text-primary-foreground rounded py-1.5 font-medium hover:bg-primary/90">
          <Check size={11} className="inline mr-1" />Apply
        </button>
        {initial?.url && (
          <button type="button" onClick={onRemove}
            className="text-xs text-destructive border border-destructive/30 rounded px-3 py-1.5 hover:bg-destructive/10">
            Remove
          </button>
        )}
        <button type="button" onClick={onClose}
          className="text-xs border rounded px-3 py-1.5 text-foreground/70 hover:bg-muted">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ─── Image dialog ─── */
function ImagePanel({ onApply, onClose }: {
  onApply: (src: string, alt: string) => void;
  onClose: () => void;
}) {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json() as { url?: string };
      if (data.url) setSrc(data.url);
    } finally { setUploading(false); }
  };

  return (
    <div className="p-3 space-y-2">
      <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Insert Image</p>
      <div className="flex gap-2">
        <input type="url" value={src} onChange={e => setSrc(e.target.value)}
          placeholder="https://image-url.jpg"
          className="flex-1 text-sm border rounded px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
        <button type="button" onClick={() => fileRef.current?.click()}
          className="border rounded px-2.5 py-1.5 text-xs hover:bg-muted flex items-center gap-1 shrink-0">
          {uploading ? "…" : <><Upload size={11} /> Upload</>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {src && <img src={src} alt="preview" className="w-full max-h-28 object-cover rounded border" />}
      <input type="text" value={alt} onChange={e => setAlt(e.target.value)}
        placeholder="Alt text (SEO & accessibility)"
        className="w-full text-sm border rounded px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
      <div className="flex gap-2">
        <button type="button" onClick={() => src && onApply(src, alt)} disabled={!src}
          className="flex-1 text-xs bg-primary text-primary-foreground rounded py-1.5 font-medium hover:bg-primary/90 disabled:opacity-40">
          Insert Image
        </button>
        <button type="button" onClick={onClose}
          className="text-xs border rounded px-3 py-1.5 text-foreground/70 hover:bg-muted">Cancel</button>
      </div>
    </div>
  );
}

/* ─── YouTube dialog ─── */
function YoutubePanel({ onApply, onClose }: { onApply: (url: string) => void; onClose: () => void }) {
  const [url, setUrl] = useState("");
  return (
    <div className="p-3 space-y-2">
      <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Embed YouTube / Vimeo</p>
      <input autoFocus type="url" value={url} onChange={e => setUrl(e.target.value)}
        placeholder="https://youtube.com/watch?v=..."
        onKeyDown={e => { if (e.key === "Enter" && url) onApply(url); }}
        className="w-full text-sm border rounded px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary" />
      <div className="flex gap-2">
        <button type="button" onClick={() => url && onApply(url)} disabled={!url}
          className="flex-1 text-xs bg-primary text-primary-foreground rounded py-1.5 font-medium hover:bg-primary/90 disabled:opacity-40">
          Embed Video
        </button>
        <button type="button" onClick={onClose}
          className="text-xs border rounded px-3 py-1.5 text-foreground/70 hover:bg-muted">Cancel</button>
      </div>
    </div>
  );
}

/* ─── Table menu ─── */
function TablePanel({ isInTable, onInsert, onAction, onClose }: {
  isInTable: boolean;
  onInsert: () => void;
  onAction: (action: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="p-2 space-y-0.5 min-w-[200px]">
      <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide px-2 py-1">Table</p>
      {!isInTable && (
        <button type="button" onClick={() => { onInsert(); onClose(); }}
          className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted">
          Insert 3×3 table
        </button>
      )}
      {isInTable && (<>
        <button type="button" onClick={() => { onAction("addColBefore"); onClose(); }} className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted">Add column before</button>
        <button type="button" onClick={() => { onAction("addColAfter"); onClose(); }} className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted">Add column after</button>
        <button type="button" onClick={() => { onAction("addRowBefore"); onClose(); }} className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted">Add row before</button>
        <button type="button" onClick={() => { onAction("addRowAfter"); onClose(); }} className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted">Add row after</button>
        <button type="button" onClick={() => { onAction("delCol"); onClose(); }} className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted text-destructive">Delete column</button>
        <button type="button" onClick={() => { onAction("delRow"); onClose(); }} className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted text-destructive">Delete row</button>
        <button type="button" onClick={() => { onAction("delTable"); onClose(); }} className="w-full text-sm text-left px-2 py-1.5 rounded hover:bg-muted text-destructive">Delete table</button>
      </>)}
    </div>
  );
}

/* ─── Main component ─── */
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing…", minHeight = 400 }: RichTextEditorProps) {
  const [sourceView, setSourceView] = useState(false);
  const [sourceHtml, setSourceHtml] = useState("");
  const [panel, setPanel] = useState<"link" | "image" | "youtube" | "table" | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isProgrammatic = useRef(false);

  const closePanel = useCallback(() => setPanel(null), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline underline-offset-4 cursor-pointer" },
      }),
      ImageExt.configure({
        allowBase64: false,
        HTMLAttributes: { class: "rounded-lg max-w-full block mx-auto my-4" },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TableKit,
      Youtube.configure({ controls: true, nocookie: true, width: "100%", height: 360 }),
      CharacterCount,
      Placeholder.configure({ placeholder }),
      Typography,
    ],
    content: "",
    onUpdate: ({ editor: e }) => {
      if (isProgrammatic.current) { isProgrammatic.current = false; return; }
      if (!sourceView) onChange(e.getHTML());
    },
    editorProps: {
      attributes: { class: "rich-editor-content focus:outline-none" },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]?.type.startsWith("image/")) {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          const fd = new FormData();
          fd.append("image", file);
          fetch("/api/upload/image", { method: "POST", body: fd, credentials: "include" })
            .then(r => r.json())
            .then((d: { url?: string }) => {
              if (d.url) {
                const node = view.state.schema.nodes.image?.create({ src: d.url });
                if (node) view.dispatch(view.state.tr.replaceSelectionWith(node));
              }
            })
            .catch(() => {});
          return true;
        }
        return false;
      },
    },
  });

  /* Load initial content */
  useEffect(() => {
    if (!editor || initialized) return;
    setInitialized(true);
    (async () => {
      const html = await toHtml(value);
      isProgrammatic.current = true;
      editor.commands.setContent(html);
      setSourceHtml(html);
    })();
  }, [editor, initialized, value]);

  /* Sync when external value changes (e.g., switching posts) */
  useEffect(() => {
    if (!editor || !initialized) return;
    const current = editor.getHTML();
    if (value !== current) {
      (async () => {
        const html = await toHtml(value);
        isProgrammatic.current = true;
        editor.commands.setContent(html);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const words = wordCount(editor.getHTML());
  const readTime = Math.max(1, Math.round(words / 200));
  const charCount = (editor.storage.characterCount as { characters: () => number }).characters?.() ?? 0;

  /* Block type selector */
  const getBlockLabel = () => {
    for (let i = 1; i <= 6; i++) if (editor.isActive("heading", { level: i })) return `H${i}`;
    if (editor.isActive("blockquote")) return "Quote";
    if (editor.isActive("codeBlock")) return "Code";
    return "Normal";
  };

  const setBlock = (v: string) => {
    if (v === "Normal") editor.chain().focus().setParagraph().run();
    else if (v.startsWith("H")) editor.chain().focus().toggleHeading({ level: parseInt(v[1]) as 1|2|3|4|5|6 }).run();
    else if (v === "Quote") editor.chain().focus().toggleBlockquote().run();
    else if (v === "Code") editor.chain().focus().toggleCodeBlock().run();
  };

  const textColorRef = useRef<HTMLInputElement>(null);
  const highlightColorRef = useRef<HTMLInputElement>(null);

  const applyLink = (url: string, newTab: boolean) => {
    if (!url) { editor.chain().focus().unsetLink().run(); closePanel(); return; }
    editor.chain().focus().setLink({ href: url, target: newTab ? "_blank" : null }).run();
    closePanel();
  };

  const applyImage = (src: string, alt: string) => {
    editor.chain().focus().setImage({ src, alt }).run();
    closePanel();
  };

  const applyYoutube = (url: string) => {
    editor.commands.setYoutubeVideo({ src: url });
    closePanel();
  };

  const handleTableAction = (action: string) => {
    const chain = editor.chain().focus();
    if (action === "addColBefore") chain.addColumnBefore().run();
    else if (action === "addColAfter") chain.addColumnAfter().run();
    else if (action === "addRowBefore") chain.addRowBefore().run();
    else if (action === "addRowAfter") chain.addRowAfter().run();
    else if (action === "delCol") chain.deleteColumn().run();
    else if (action === "delRow") chain.deleteRow().run();
    else if (action === "delTable") chain.deleteTable().run();
  };

  const toggleSourceView = () => {
    if (!sourceView) {
      const html = editor.getHTML();
      setSourceHtml(html);
      setSourceView(true);
    } else {
      isProgrammatic.current = true;
      editor.commands.setContent(sourceHtml);
      onChange(sourceHtml);
      setSourceView(false);
    }
  };

  return (
    <div className="border border-input rounded-xl overflow-hidden bg-background flex flex-col">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/30 border-b border-input">

        {/* Block type */}
        <div className="relative">
          <select value={getBlockLabel()} onChange={e => setBlock(e.target.value)}
            className="text-xs border rounded px-2 py-1 bg-background cursor-pointer h-7 pr-6 appearance-none focus:outline-none">
            <option value="Normal">Normal</option>
            {[1,2,3,4,5,6].map(n => <option key={n} value={`H${n}`}>H{n}</option>)}
            <option value="Quote">Quote</option>
            <option value="Code">Code Block</option>
          </select>
          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>

        {/* Font size */}
        <div className="relative ml-0.5">
          <select defaultValue="" onChange={e => {
            if (!e.target.value) editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(e.target.value).run();
          }} className="text-xs border rounded px-2 py-1 bg-background cursor-pointer h-7 pr-6 appearance-none focus:outline-none" title="Font size">
            <option value="">Size</option>
            {["12px","14px","16px","18px","20px","24px","28px","32px","40px","48px"].map(s => (
              <option key={s} value={s}>{s.replace("px","")}</option>
            ))}
          </select>
          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>

        <Sep />

        {/* Text formatting */}
        <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)"><Bold size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)"><Italic size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)"><UnderlineIcon size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code"><Code size={13} /></TB>

        {/* Text color */}
        <div className="relative" title="Text color">
          <button type="button" onClick={() => textColorRef.current?.click()}
            className="p-1.5 rounded hover:bg-muted flex items-center gap-0.5 shrink-0">
            <Baseline size={13} />
            <div className="w-2.5 h-1 rounded-sm" style={{ backgroundColor: (editor.getAttributes("textStyle") as { color?: string }).color || "#000000" }} />
          </button>
          <input ref={textColorRef} type="color" className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={e => editor.chain().focus().setColor(e.target.value).run()} />
        </div>

        {/* Highlight */}
        <div className="relative" title="Highlight color">
          <button type="button" onClick={() => highlightColorRef.current?.click()}
            className="p-1.5 rounded hover:bg-muted flex items-center gap-0.5 shrink-0">
            <Highlighter size={13} />
            <div className="w-2.5 h-1 rounded-sm" style={{ backgroundColor: (editor.getAttributes("highlight") as { color?: string }).color || "#fef08a" }} />
          </button>
          <input ref={highlightColorRef} type="color" defaultValue="#fef08a" className="absolute opacity-0 w-0 h-0 pointer-events-none"
            onChange={e => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} />
        </div>

        <Sep />

        {/* Alignment */}
        <TB onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left"><AlignLeft size={13} /></TB>
        <TB onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center"><AlignCenter size={13} /></TB>
        <TB onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right"><AlignRight size={13} /></TB>
        <TB onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify"><AlignJustify size={13} /></TB>

        <Sep />

        {/* Lists */}
        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Checklist"><ListChecks size={13} /></TB>

        <Sep />

        {/* Blocks */}
        <TB onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote size={13} /></TB>
        <TB onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block"><Code2 size={13} /></TB>
        <TB onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule"><Minus size={13} /></TB>

        <Sep />

        {/* Link */}
        <div className="relative">
          <TB onClick={() => setPanel(p => p === "link" ? null : "link")} active={editor.isActive("link")} title="Insert / edit link"><Link2 size={13} /></TB>
          {panel === "link" && (
            <FloatingPanel onClose={closePanel}>
              <LinkPanel
                initial={editor.isActive("link") ? {
                  url: (editor.getAttributes("link") as { href?: string }).href ?? "",
                  newTab: (editor.getAttributes("link") as { target?: string }).target === "_blank",
                } : undefined}
                onApply={applyLink}
                onRemove={() => { editor.chain().focus().unsetLink().run(); closePanel(); }}
                onClose={closePanel}
              />
            </FloatingPanel>
          )}
        </div>

        {/* Image */}
        <div className="relative">
          <TB onClick={() => setPanel(p => p === "image" ? null : "image")} title="Insert image"><ImagePlus size={13} /></TB>
          {panel === "image" && (
            <FloatingPanel onClose={closePanel}>
              <ImagePanel onApply={applyImage} onClose={closePanel} />
            </FloatingPanel>
          )}
        </div>

        {/* YouTube */}
        <div className="relative">
          <TB onClick={() => setPanel(p => p === "youtube" ? null : "youtube")} title="Embed YouTube / Vimeo"><YoutubeIcon size={13} /></TB>
          {panel === "youtube" && (
            <FloatingPanel onClose={closePanel}>
              <YoutubePanel onApply={applyYoutube} onClose={closePanel} />
            </FloatingPanel>
          )}
        </div>

        {/* Table */}
        <div className="relative">
          <TB onClick={() => setPanel(p => p === "table" ? null : "table")} active={editor.isActive("table")} title="Table"><TableIcon size={13} /></TB>
          {panel === "table" && (
            <FloatingPanel onClose={closePanel}>
              <TablePanel
                isInTable={editor.isActive("table")}
                onInsert={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                onAction={handleTableAction}
                onClose={closePanel}
              />
            </FloatingPanel>
          )}
        </div>

        <Sep />

        {/* Undo / Redo */}
        <TB onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)"><Undo2 size={13} /></TB>
        <TB onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)"><Redo2 size={13} /></TB>

        <Sep />

        {/* Source toggle */}
        <TB onClick={toggleSourceView} active={sourceView} title="View / edit HTML source"><FileCode size={13} /></TB>
      </div>

      {/* ── BubbleMenu ── */}
      {!sourceView && (
        <BubbleMenu editor={editor} options={{ placement: "top-start" }}
          className="flex items-center gap-0.5 bg-popover border border-border rounded-lg shadow-lg px-1.5 py-1">
          <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={11} /></TB>
          <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={11} /></TB>
          <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><UnderlineIcon size={11} /></TB>
          <TB onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strike"><Strikethrough size={11} /></TB>
          <span className="w-px h-3.5 bg-border mx-0.5" />
          <TB onClick={() => setPanel("link")} active={editor.isActive("link")} title="Link"><Link2 size={11} /></TB>
          {editor.isActive("link") && (
            <TB onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link"><XIcon size={11} /></TB>
          )}
          {editor.isActive("link") && (
            <a href={(editor.getAttributes("link") as { href?: string }).href}
              target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-muted text-foreground/70" title="Open link">
              <ExternalLink size={11} />
            </a>
          )}
        </BubbleMenu>
      )}

      {/* ── Content area ── */}
      {sourceView ? (
        <textarea value={sourceHtml} onChange={e => setSourceHtml(e.target.value)}
          className="flex-1 px-4 py-4 font-mono text-xs bg-muted/20 focus:outline-none resize-none text-foreground"
          style={{ minHeight }} spellCheck={false} />
      ) : (
        <div className="flex-1 overflow-auto rich-editor-wrapper cursor-text" style={{ minHeight }}
          onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} className="h-full" />
        </div>
      )}

      {/* ── Status bar ── */}
      <div className="flex items-center gap-4 px-3 py-1.5 border-t border-input bg-muted/20 text-[11px] text-muted-foreground">
        <span><strong className="text-foreground">{words.toLocaleString()}</strong> words</span>
        <span><strong className="text-foreground">{charCount.toLocaleString()}</strong> chars</span>
        <span>~<strong className="text-foreground">{readTime}</strong> min read</span>
        <span className="ml-auto flex items-center gap-1.5">
          {sourceView ? <FileCode size={10} /> : <Eye size={10} />}
          {sourceView ? "HTML source" : "WYSIWYG"}
        </span>
      </div>

      {/* ── Editor CSS ── */}
      <style>{`
        .rich-editor-wrapper { padding: 1rem 1.25rem; }
        .rich-editor-content { min-height: 100%; }
        .rich-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: hsl(var(--muted-foreground)); pointer-events: none; height: 0;
        }
        .rich-editor-content > * + * { margin-top: 0.75em; }
        .rich-editor-content h1 { font-size: 2em; font-weight: 700; line-height: 1.2; margin-top: 1.2em; }
        .rich-editor-content h2 { font-size: 1.5em; font-weight: 700; line-height: 1.25; margin-top: 1em; }
        .rich-editor-content h3 { font-size: 1.25em; font-weight: 600; line-height: 1.3; margin-top: 0.8em; }
        .rich-editor-content h4 { font-size: 1.1em; font-weight: 600; }
        .rich-editor-content h5 { font-size: 1em; font-weight: 600; }
        .rich-editor-content h6 { font-size: 0.875em; font-weight: 600; color: hsl(var(--muted-foreground)); }
        .rich-editor-content p { line-height: 1.75; }
        .rich-editor-content ul { list-style: disc; padding-left: 1.5em; }
        .rich-editor-content ol { list-style: decimal; padding-left: 1.5em; }
        .rich-editor-content li { line-height: 1.7; margin-top: 0.25em; }
        .rich-editor-content ul[data-type="taskList"] { list-style: none; padding-left: 0.5em; }
        .rich-editor-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5em; }
        .rich-editor-content ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 0.25em; }
        .rich-editor-content blockquote {
          border-left: 3px solid hsl(var(--primary));
          padding: 0.5em 0 0.5em 1em;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          background: hsl(var(--muted) / 0.3);
          border-radius: 0 0.5rem 0.5rem 0;
          margin: 1em 0;
        }
        .rich-editor-content pre {
          background: hsl(var(--muted));
          border-radius: 0.5rem; padding: 1em;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.875em; overflow-x: auto;
        }
        .rich-editor-content code:not(pre code) {
          background: hsl(var(--muted)); border-radius: 0.25rem;
          padding: 0.15em 0.4em;
          font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.85em;
        }
        .rich-editor-content hr { border: none; border-top: 2px solid hsl(var(--border)); margin: 1.5em 0; }
        .rich-editor-content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .rich-editor-content td, .rich-editor-content th {
          border: 1px solid hsl(var(--border)); padding: 0.5em 0.75em;
          text-align: left; vertical-align: top; min-width: 60px;
        }
        .rich-editor-content th { background: hsl(var(--muted)); font-weight: 600; }
        .rich-editor-content img { border-radius: 0.5rem; max-width: 100%; }
        .rich-editor-content iframe { border-radius: 0.5rem; width: 100%; }
        .rich-editor-content .selectedCell { background: hsl(var(--primary) / 0.1); }
        .rich-editor-content a { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 4px; }
        .rich-editor-content mark { padding: 0.1em 0.2em; border-radius: 0.2em; }
      `}</style>
    </div>
  );
}
