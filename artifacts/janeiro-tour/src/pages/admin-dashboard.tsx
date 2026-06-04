import { useState, useRef, useCallback, useEffect } from "react";
  import { useLocation } from "wouter";
  import {
    useGetAdminMe, useAdminLogout, useGetAdminStats,
    useListTours, useCreateTour, useUpdateTour, useDeleteTour,
    useListDestinations, useCreateDestination, useUpdateDestination, useDeleteDestination,
    useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost,
    useListReviews, useCreateReview, useUpdateReview, useDeleteReview,
    useListFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq,
    useGetSettings, useUpdateSettings,
    useListReservations, useUpdateReservationStatus,
    useListAllExtras, useCreateTourExtra, useUpdateTourExtra, useDeleteTourExtra,
    getGetAdminMeQueryKey, getListToursQueryKey, getListDestinationsQueryKey,
    getListBlogPostsQueryKey, getListReviewsQueryKey, getListFaqsQueryKey,
    getGetSettingsQueryKey, getGetAdminStatsQueryKey,
  } from "@workspace/api-client-react";
  import { useQueryClient } from "@tanstack/react-query";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Label } from "@/components/ui/label";
  import { Badge } from "@/components/ui/badge";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
  import { Skeleton } from "@/components/ui/skeleton";
  import { Switch } from "@/components/ui/switch";
  import {
    LayoutDashboard, MapPin, Package, FileText, Star, HelpCircle,
    Settings, LogOut, Plus, Pencil, Trash2, BarChart3, Globe, Image,
    ExternalLink, Code2, Monitor, Upload, Save, Eye, RefreshCw, ChevronRight,
    Bold, Italic, Link2, ImagePlus, ClipboardList, Tag, X as XIcon,
    CheckCircle2, Clock, AlertCircle, DollarSign,
  } from "lucide-react";

  // ─── helpers ───────────────────────────────────────────────────────────────

  function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: React.ElementType; color: string }) {
    return (
      <div className="bg-card border rounded-xl p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    );
  }

  function ConfirmDelete({ onConfirm, label }: { onConfirm: () => void; label: string }) {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 size={15} /></Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete {label}?</DialogTitle></DialogHeader>
          <p className="text-muted-foreground text-sm">This action cannot be undone.</p>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onConfirm(); setOpen(false); }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function SectionLabel({ children }: { children: React.ReactNode }) {
    return <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-5 mb-2 border-t pt-4 first:border-t-0 first:pt-0 first:mt-0">{children}</p>;
  }

  // ─── image upload helper ──────────────────────────────────────────────────

  function ImageUploader({ value, onChange, label = "Image" }: { value: string; onChange: (url: string) => void; label?: string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getImageDataUrl = async (file: File): Promise<string> => {
      const raw = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
        reader.readAsDataURL(file);
      });
      try {
        const img = new window.Image();
        await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("load")); img.src = raw; });
        const MAX = 1600;
        let { width, height } = img;
        if (width <= MAX && height <= MAX && file.size < 1.5 * 1024 * 1024) return raw;
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return raw;
        ctx.drawImage(img, 0, 0, width, height);
        return canvas.toDataURL("image/jpeg", 0.82);
      } catch {
        return raw;
      }
    };

    const handleFile = useCallback(async (file: File) => {
      setUploading(true);
      setError(null);
      try {
        if (file.size > 30 * 1024 * 1024) {
          setError("Arquivo muito grande. Use uma imagem menor que 30MB.");
          return;
        }
        const dataUrl = await getImageDataUrl(file);
        if (dataUrl.length > 12 * 1024 * 1024) {
          setError("Imagem ainda muito grande após compressão. Tente uma com menor resolução.");
          return;
        }
        const res = await fetch("/api/upload/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ dataUrl, filename: file.name }),
        });
        const data = await res.json() as { url?: string; error?: string };
        if (data.url) {
          onChange(data.url);
        } else {
          setError(data.error ?? "Upload falhou. Tente usar uma URL.");
        }
      } catch (err) {
        console.error("[ImageUploader] upload error:", err);
        setError("Upload falhou: " + String(err instanceof Error ? err.message : err));
      } finally {
        setUploading(false);
      }
    }, [onChange]);

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input value={value} onChange={e => onChange(e.target.value)} placeholder="https://... or upload below" className="flex-1" />
          <Button type="button" variant="outline" size="sm" className="gap-1.5 shrink-0" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
            {uploading ? "Enviando…" : "Upload"}
          </Button>
        </div>
        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{error}</p>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        {value && <img src={value} alt="" className="mt-1 h-28 w-full object-cover rounded-lg border" onError={e => (e.target as HTMLImageElement).style.display = "none"} />}
      </div>
    );
  }

  // ─── tour form ───────────────────────────────────────────────────────────

  function TourForm({ tour, onSave, onClose }: { tour?: Record<string, unknown>; onSave: (data: Record<string, unknown>) => void; onClose: () => void }) {
    const [form, setForm] = useState<Record<string, unknown>>({
      slug: tour?.slug ?? "",
      title: tour?.title ?? "",
      titleEs: tour?.titleEs ?? "",
      titlePt: tour?.titlePt ?? "",
      destination: tour?.destination ?? "",
      category: tour?.category ?? "sightseeing",
      durationHours: tour?.durationHours ?? 4,
      priceFrom: tour?.priceFrom ?? 50,
      currency: tour?.currency ?? "USD",
      tourType: tour?.tourType ?? "group",
      groupSizeMax: tour?.groupSizeMax ?? 15,
      imageUrl: tour?.imageUrl ?? "",
      premiumBadge: tour?.premiumBadge ?? "",
      overview: tour?.overview ?? "",
      overviewEs: tour?.overviewEs ?? "",
      overviewPt: tour?.overviewPt ?? "",
      meetingPoint: tour?.meetingPoint ?? "",
      cancellationPolicy: tour?.cancellationPolicy ?? "Free cancellation up to 24 hours before.",
      seoTitle: tour?.seoTitle ?? "",
      seoDescription: tour?.seoDescription ?? "",
      regiondoWidget: tour?.regiondoWidget ?? "",
      published: tour?.published ?? true,
      featured: tour?.featured ?? false,
      languages: tour?.languages ?? ["English"],
      highlights: tour?.highlights ?? [],
      includedItems: tour?.includedItems ?? [],
      notIncludedItems: tour?.notIncludedItems ?? [],
      itinerary: tour?.itinerary ?? [],
      sortOrder: tour?.sortOrder ?? 10,
    });

    const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

    // helpers for array fields
    const arrVal = (key: string) => (form[key] as string[]) ?? [];
    const setArr = (key: string, idx: number, val: string) => {
      const arr = [...arrVal(key)]; arr[idx] = val; set(key, arr);
    };
    const addArr = (key: string) => set(key, [...arrVal(key), ""]);
    const removeArr = (key: string, idx: number) => set(key, arrVal(key).filter((_, i) => i !== idx));

    type ItineraryItem = { order: number; title: string; description: string; duration?: string };
    const itin = (form.itinerary as ItineraryItem[]) ?? [];
    const setItin = (idx: number, field: string, val: string) => {
      const arr = itin.map((item, i) => i === idx ? { ...item, [field]: val } : item);
      set("itinerary", arr);
    };
    const addItin = () => set("itinerary", [...itin, { order: itin.length + 1, title: "", description: "", duration: "" }]);
    const removeItin = (idx: number) => set("itinerary", itin.filter((_, i) => i !== idx));

    return (
      <div className="space-y-1 max-h-[75vh] overflow-y-auto pr-2">
        <SectionLabel>Basic Information</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Title (English) *</Label><Input value={form.title as string} onChange={e => set("title", e.target.value)} placeholder="Tour title" /></div>
          <div className="space-y-1"><Label>Slug *</Label><Input value={form.slug as string} onChange={e => set("slug", e.target.value)} placeholder="tour-slug-url" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Destination</Label><Input value={form.destination as string} onChange={e => set("destination", e.target.value)} placeholder="Rio de Janeiro" /></div>
          <div className="space-y-1"><Label>Category</Label>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.category as string} onChange={e => set("category", e.target.value)}>
              <option value="sightseeing">Sightseeing</option>
              <option value="culture">Cultural Experience</option>
              <option value="nature">Adventure / Nature</option>
              <option value="transfer">Airport Transfer</option>
              <option value="private">Private Tour</option>
              <option value="package">Multi-Day Package</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1"><Label>Duration (h)</Label><Input type="number" value={form.durationHours as number} onChange={e => set("durationHours", parseFloat(e.target.value))} /></div>
          <div className="space-y-1"><Label>Price From</Label><Input type="number" value={form.priceFrom as number} onChange={e => set("priceFrom", parseFloat(e.target.value))} /></div>
          <div className="space-y-1"><Label>Currency</Label>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.currency as string} onChange={e => set("currency", e.target.value)}>
              <option>USD</option><option>EUR</option><option>BRL</option>
            </select>
          </div>
          <div className="space-y-1"><Label>Max Group</Label><Input type="number" value={form.groupSizeMax as number} onChange={e => set("groupSizeMax", parseInt(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Tour Type</Label>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.tourType as string} onChange={e => set("tourType", e.target.value)}>
              <option value="group">Shared Tour</option>
              <option value="private">Private Tour</option>
              <option value="both">Shared & Private</option>
            </select>
          </div>
          <div className="space-y-1"><Label>Sort Order</Label><Input type="number" value={form.sortOrder as number} onChange={e => set("sortOrder", parseInt(e.target.value))} /></div>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <Label>Premium Badge <span className="text-muted-foreground font-normal">(optional — highlights a key selling point)</span></Label>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.premiumBadge as string} onChange={e => set("premiumBadge", e.target.value)}>
              <option value="">— No badge —</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Best Seller">Best Seller</option>
              <option value="Most Personalized Experience">Most Personalized Experience</option>
              <option value="Best for Families">Best for Families</option>
              <option value="Luxury Option">Luxury Option</option>
              <option value="Luxury Experience">Luxury Experience</option>
              <option value="Recommended">Recommended</option>
              <option value="Local Expert Guide">Local Expert Guide</option>
              <option value="Fully Customizable">Fully Customizable</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6 pt-1">
          <div className="flex items-center gap-2"><Switch checked={form.published as boolean} onCheckedChange={v => set("published", v)} /><Label>Published</Label></div>
          <div className="flex items-center gap-2"><Switch checked={form.featured as boolean} onCheckedChange={v => set("featured", v)} /><Label>Featured on Homepage</Label></div>
        </div>

        <SectionLabel>Main Image</SectionLabel>
        <ImageUploader value={form.imageUrl as string} onChange={v => set("imageUrl", v)} label="Tour Image" />

        <SectionLabel>Content (English)</SectionLabel>
        <div className="space-y-1"><Label>Overview *</Label><Textarea rows={4} value={form.overview as string} onChange={e => set("overview", e.target.value)} placeholder="Describe the tour experience..." /></div>
        <div className="space-y-1"><Label>Meeting Point</Label><Input value={form.meetingPoint as string} onChange={e => set("meetingPoint", e.target.value)} /></div>
        <div className="space-y-1"><Label>Cancellation Policy</Label><Input value={form.cancellationPolicy as string} onChange={e => set("cancellationPolicy", e.target.value)} /></div>

        <SectionLabel>Highlights</SectionLabel>
        {arrVal("highlights").map((h, i) => (
          <div key={i} className="flex gap-2">
            <Input value={h} onChange={e => setArr("highlights", i, e.target.value)} placeholder={`Highlight ${i+1}`} />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeArr("highlights", i)}><Trash2 size={14} /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => addArr("highlights")}><Plus size={13} />Add Highlight</Button>

        <SectionLabel>What's Included</SectionLabel>
        {arrVal("includedItems").map((h, i) => (
          <div key={i} className="flex gap-2">
            <Input value={h} onChange={e => setArr("includedItems", i, e.target.value)} placeholder="Included item" />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeArr("includedItems", i)}><Trash2 size={14} /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => addArr("includedItems")}><Plus size={13} />Add Included Item</Button>

        <SectionLabel>What's Not Included</SectionLabel>
        {arrVal("notIncludedItems").map((h, i) => (
          <div key={i} className="flex gap-2">
            <Input value={h} onChange={e => setArr("notIncludedItems", i, e.target.value)} placeholder="Not included item" />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeArr("notIncludedItems", i)}><Trash2 size={14} /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => addArr("notIncludedItems")}><Plus size={13} />Add Excluded Item</Button>

        <SectionLabel>Itinerary</SectionLabel>
        {itin.map((step, i) => (
          <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Step {i + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeItin(i)}><Trash2 size={13} /></Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={step.title} onChange={e => setItin(i, "title", e.target.value)} placeholder="e.g. Arrival at Cristo Redentor" /></div>
              <div className="space-y-1"><Label className="text-xs">Duration</Label><Input value={step.duration ?? ""} onChange={e => setItin(i, "duration", e.target.value)} placeholder="e.g. 1 hour" /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea rows={2} value={step.description} onChange={e => setItin(i, "description", e.target.value)} /></div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addItin}><Plus size={13} />Add Step</Button>

        <SectionLabel>Translations</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Title — Español</Label><Input value={form.titleEs as string} onChange={e => set("titleEs", e.target.value)} /></div>
          <div className="space-y-1"><Label>Title — Português</Label><Input value={form.titlePt as string} onChange={e => set("titlePt", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>Overview — Español</Label><Textarea rows={3} value={form.overviewEs as string} onChange={e => set("overviewEs", e.target.value)} /></div>
        <div className="space-y-1"><Label>Overview — Português</Label><Textarea rows={3} value={form.overviewPt as string} onChange={e => set("overviewPt", e.target.value)} /></div>

        <SectionLabel>SEO Settings</SectionLabel>
        <div className="space-y-1">
          <div className="flex justify-between"><Label>SEO Title</Label><span className="text-xs text-muted-foreground">{(form.seoTitle as string)?.length ?? 0}/60</span></div>
          <Input value={form.seoTitle as string} onChange={e => set("seoTitle", e.target.value)} maxLength={60} />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between"><Label>SEO Meta Description</Label><span className="text-xs text-muted-foreground">{(form.seoDescription as string)?.length ?? 0}/160</span></div>
          <Textarea rows={2} value={form.seoDescription as string} onChange={e => set("seoDescription", e.target.value)} maxLength={160} />
        </div>

        <SectionLabel>Regiondo Booking Widget</SectionLabel>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex gap-2">
          <Code2 size={16} className="flex-shrink-0 mt-0.5" />
          <span>Paste the Regiondo embed code for this tour. It will automatically appear in the booking section on the tour page.</span>
        </div>
        <div className="space-y-1">
          <Label>Regiondo Widget Embed Code</Label>
          <Textarea rows={5} value={form.regiondoWidget as string} onChange={e => set("regiondoWidget", e.target.value)}
            placeholder={'<!-- Paste your Regiondo widget code here -->\n<script src="https://cdn.regiondo.net/..." />'}
            className="font-mono text-xs" />
          <p className="text-xs text-muted-foreground">Leave empty to show a "Request via WhatsApp" button instead.</p>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} className="min-w-[100px]">Save Tour</Button>
        </div>
      </div>
    );
  }

  // ─── page editor ─────────────────────────────────────────────────────────

  const PAGES = [
    { path: "/", label: "Homepage" },
    { path: "/about", label: "About Us" },
    { path: "/our-story", label: "Our Story" },
    { path: "/tours", label: "Tours" },
    { path: "/destinations", label: "Destinations" },
    { path: "/contact", label: "Contact" },
    { path: "/faq", label: "FAQ" },
    { path: "/reviews", label: "Reviews" },
    { path: "/blog", label: "Travel Guide" },
    { path: "/transfers", label: "Airport Transfers" },
    { path: "/private-tours", label: "Private Tours" },
    { path: "/packages", label: "Packages" },
  ];

  function PageEditorTab() {
    const queryClient = useQueryClient();
    const { data: settings, isLoading } = useGetSettings();
    const updateSettings = useUpdateSettings({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) } });

    const [selectedPage, setSelectedPage] = useState("/");
    const [iframeKey, setIframeKey] = useState(0);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState<Record<string, string> | null>(null);

    useEffect(() => { if (settings && !form) setForm(settings as unknown as Record<string, string>); }, [settings]);
    const setF = (k: string, v: string) => setForm(f => f ? { ...f, [k]: v } : null);

    const save = async () => {
      if (!form) return;
      updateSettings.mutate({ data: form as Parameters<typeof updateSettings.mutate>[0]["data"] });
      setSaved(true);
      setTimeout(() => { setSaved(false); setIframeKey(k => k + 1); }, 1500);
    };

    if (isLoading || !form) return <Skeleton className="h-[600px] w-full rounded-xl" />;

    const previewUrl = selectedPage;

    return (
      <div className="flex flex-col gap-4">
        {/* toolbar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Visual Page Editor</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Select a page, edit content on the right, preview on the left</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setIframeKey(k => k + 1)}>
              <RefreshCw size={13} /> Refresh Preview
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(selectedPage, "_blank")}>
              <Eye size={13} /> Open Live
            </Button>
            <Button size="sm" className="gap-1.5 min-w-[120px]" onClick={save}>
              {saved ? <><Save size={13} />Saved</> : <><Save size={13} />Save Changes</>}
            </Button>
          </div>
        </div>

        {/* page picker */}
        <div className="flex flex-wrap gap-2">
          {PAGES.map(p => (
            <button key={p.path} onClick={() => { setSelectedPage(p.path); setIframeKey(k => k + 1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedPage === p.path ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>
              {p.label}
            </button>
          ))}
        </div>

        {/* split view */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* iframe preview */}
          <div className="bg-card border rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b text-xs text-muted-foreground">
              <Monitor size={13} /><span className="font-mono">{previewUrl}</span>
            </div>
            <iframe key={iframeKey} src={previewUrl} className="w-full flex-1 min-h-[600px]" style={{ border: "none" }} title="Page Preview" />
          </div>

          {/* edit panel */}
          <div className="bg-card border rounded-xl p-5 overflow-y-auto max-h-[700px] space-y-5">
            {selectedPage === "/" && <HomepageFields form={form} setF={setF} />}
            {selectedPage === "/about" && <AboutFields />}
            {selectedPage === "/our-story" && <OurStoryFields />}
            {selectedPage === "/contact" && <ContactFields form={form} setF={setF} />}
            {selectedPage === "/faq" && <FaqEditorFields />}
            {(selectedPage === "/tours" || selectedPage === "/destinations" || selectedPage === "/reviews" || selectedPage === "/blog" || selectedPage === "/transfers" || selectedPage === "/private-tours" || selectedPage === "/packages") && (
              <DynamicPageNote page={selectedPage} />
            )}
          </div>
        </div>
      </div>
    );
  }

  function HomepageFields({ form, setF }: { form: Record<string, string>; setF: (k: string, v: string) => void }) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-base border-b pb-2">Hero Section</h3>
        <div className="space-y-1"><Label>Headline (English)</Label><Input value={form.heroHeadline ?? ""} onChange={e => setF("heroHeadline", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Headline — Español</Label><Input value={form.heroHeadlineEs ?? ""} onChange={e => setF("heroHeadlineEs", e.target.value)} /></div>
          <div className="space-y-1"><Label>Headline — Português</Label><Input value={form.heroHeadlinePt ?? ""} onChange={e => setF("heroHeadlinePt", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>Subheadline (English)</Label><Textarea rows={2} value={form.heroSubheadline ?? ""} onChange={e => setF("heroSubheadline", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Subheadline — Español</Label><Textarea rows={2} value={form.heroSubheadlineEs ?? ""} onChange={e => setF("heroSubheadlineEs", e.target.value)} /></div>
          <div className="space-y-1"><Label>Subheadline — Português</Label><Textarea rows={2} value={form.heroSubheadlinePt ?? ""} onChange={e => setF("heroSubheadlinePt", e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Primary CTA Button</Label><Input value={form.heroPrimaryCtaText ?? ""} onChange={e => setF("heroPrimaryCtaText", e.target.value)} /></div>
          <div className="space-y-1"><Label>Secondary CTA Button</Label><Input value={form.heroSecondaryCtaText ?? ""} onChange={e => setF("heroSecondaryCtaText", e.target.value)} /></div>
        </div>

        <h3 className="font-semibold text-base border-b pb-2 pt-2">Contact Info</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Email</Label><Input value={form.contactEmail ?? ""} onChange={e => setF("contactEmail", e.target.value)} /></div>
          <div className="space-y-1"><Label>Phone</Label><Input value={form.contactPhone ?? ""} onChange={e => setF("contactPhone", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>WhatsApp Link</Label><Input value={form.contactWhatsapp ?? ""} onChange={e => setF("contactWhatsapp", e.target.value)} placeholder="https://wa.me/55..." /></div>
        <div className="space-y-1"><Label>Address</Label><Input value={form.address ?? ""} onChange={e => setF("address", e.target.value)} /></div>

        <h3 className="font-semibold text-base border-b pb-2 pt-2">Social Links</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Instagram</Label><Input value={form.instagramUrl ?? ""} onChange={e => setF("instagramUrl", e.target.value)} /></div>
          <div className="space-y-1"><Label>Facebook</Label><Input value={form.facebookUrl ?? ""} onChange={e => setF("facebookUrl", e.target.value)} /></div>
          <div className="space-y-1"><Label>TripAdvisor</Label><Input value={form.tripadvisorUrl ?? ""} onChange={e => setF("tripadvisorUrl", e.target.value)} /></div>
          <div className="space-y-1"><Label>Google Reviews</Label><Input value={form.googleReviewsUrl ?? ""} onChange={e => setF("googleReviewsUrl", e.target.value)} /></div>
        </div>
      </div>
    );
  }

  function ContactFields({ form, setF }: { form: Record<string, string>; setF: (k: string, v: string) => void }) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-base border-b pb-2">Contact Page Content</h3>
        <p className="text-xs text-muted-foreground">These values are shared with the Homepage settings.</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>Email</Label><Input value={form.contactEmail ?? ""} onChange={e => setF("contactEmail", e.target.value)} /></div>
          <div className="space-y-1"><Label>Phone</Label><Input value={form.contactPhone ?? ""} onChange={e => setF("contactPhone", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>WhatsApp Link</Label><Input value={form.contactWhatsapp ?? ""} onChange={e => setF("contactWhatsapp", e.target.value)} /></div>
        <div className="space-y-1"><Label>Address</Label><Input value={form.address ?? ""} onChange={e => setF("address", e.target.value)} /></div>
      </div>
    );
  }

  function AboutFields() {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-base border-b pb-2">About Us Page</h3>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 space-y-2">
          <p className="font-semibold">To edit the About Us page content:</p>
          <p>The About Us page has rich visual sections. Use the <strong>Tours</strong> tab to manage tour cards shown on this page.</p>
          <p>For text edits on the About Us sections (founder story, Afrotourism section, recognition), click <strong>Open Live</strong> above and the page content reflects real-time.</p>
          <p className="text-xs text-amber-700 mt-1">Full inline editing for static pages is on the roadmap — contact info, hero text and social links are all editable from the Homepage tab.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open("/about", "_blank")}>
            <ExternalLink size={13} /> Open About Page
          </Button>
        </div>
      </div>
    );
  }

  function OurStoryFields() {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-base border-b pb-2">Our Story Page</h3>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 space-y-2">
          <p className="font-semibold">To edit Our Story content:</p>
          <p>The Our Story page shows founder information and timeline. Use the preview to see the current content.</p>
          <p className="text-xs text-amber-700 mt-1">Full inline editing for static pages is coming. Contact info updates via Homepage tab.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open("/our-story", "_blank")}>
          <ExternalLink size={13} /> Open Our Story Page
        </Button>
      </div>
    );
  }

  function FaqEditorFields() {
    const queryClient = useQueryClient();
    const { data: faqs, isLoading } = useListFaqs();
    const updateFaq = useUpdateFaq({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }) } });
    const createFaq = useCreateFaq({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }) } });
    const deleteFaq = useDeleteFaq({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }) } });
    type Faq = NonNullable<typeof faqs>[number];
    const [editing, setEditing] = useState<Faq | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [newFaq, setNewFaq] = useState({ question: "", answer: "", questionEs: "", answerEs: "", questionPt: "", answerPt: "", sortOrder: 10 });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">FAQ Items</h3>
          <Button size="sm" className="gap-1" onClick={() => setAddOpen(true)}><Plus size={13} />Add FAQ</Button>
        </div>
        {isLoading ? <Skeleton className="h-32 w-full" /> : (
          <div className="space-y-2">
            {faqs?.map(faq => (
              <div key={faq.id} className="border rounded-lg p-3">
                {editing?.id === faq.id ? (
                  <div className="space-y-2">
                    <div className="space-y-1"><Label className="text-xs">Question (EN)</Label><Input defaultValue={editing.question} onChange={e => setEditing(f => f ? {...f,question:e.target.value} : null)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Answer (EN)</Label><Textarea rows={2} defaultValue={editing.answer} onChange={e => setEditing(f => f ? {...f,answer:e.target.value} : null)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Question — ES</Label><Input defaultValue={editing.questionEs ?? ""} onChange={e => setEditing(f => f ? {...f,questionEs:e.target.value} : null)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Answer — ES</Label><Textarea rows={2} defaultValue={editing.answerEs ?? ""} onChange={e => setEditing(f => f ? {...f,answerEs:e.target.value} : null)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Question — PT</Label><Input defaultValue={editing.questionPt ?? ""} onChange={e => setEditing(f => f ? {...f,questionPt:e.target.value} : null)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Answer — PT</Label><Textarea rows={2} defaultValue={editing.answerPt ?? ""} onChange={e => setEditing(f => f ? {...f,answerPt:e.target.value} : null)} /></div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { updateFaq.mutate({ id: faq.id, data: editing as Parameters<typeof updateFaq.mutate>[0]["data"] }); setEditing(null); }}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{faq.question}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setEditing(faq)}><Pencil size={13} /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteFaq.mutate({ id: faq.id })}><Trash2 size={13} /></Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {addOpen && (
          <div className="border rounded-lg p-4 space-y-2 bg-muted/30">
            <p className="font-semibold text-sm">New FAQ</p>
            <div className="space-y-1"><Label className="text-xs">Question (EN)</Label><Input value={newFaq.question} onChange={e => setNewFaq(f => ({...f,question:e.target.value}))} /></div>
            <div className="space-y-1"><Label className="text-xs">Answer (EN)</Label><Textarea rows={2} value={newFaq.answer} onChange={e => setNewFaq(f => ({...f,answer:e.target.value}))} /></div>
            <div className="space-y-1"><Label className="text-xs">Question — ES</Label><Input value={newFaq.questionEs} onChange={e => setNewFaq(f => ({...f,questionEs:e.target.value}))} /></div>
            <div className="space-y-1"><Label className="text-xs">Answer — ES</Label><Textarea rows={2} value={newFaq.answerEs} onChange={e => setNewFaq(f => ({...f,answerEs:e.target.value}))} /></div>
            <div className="space-y-1"><Label className="text-xs">Question — PT</Label><Input value={newFaq.questionPt} onChange={e => setNewFaq(f => ({...f,questionPt:e.target.value}))} /></div>
            <div className="space-y-1"><Label className="text-xs">Answer — PT</Label><Textarea rows={2} value={newFaq.answerPt} onChange={e => setNewFaq(f => ({...f,answerPt:e.target.value}))} /></div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { createFaq.mutate({ data: newFaq }); setAddOpen(false); setNewFaq({ question:"",answer:"",questionEs:"",answerEs:"",questionPt:"",answerPt:"",sortOrder:10 }); }}>Save FAQ</Button>
              <Button size="sm" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function DynamicPageNote({ page }: { page: string }) {
    const labels: Record<string, string> = {
      "/tours": "Tours — manage all tour content from the Tours tab above.",
      "/destinations": "Destinations — manage destinations from the Destinations tab above.",
      "/reviews": "Reviews — manage reviews from the Reviews tab above.",
      "/blog": "Travel Guide — manage blog posts from the Blog tab above.",
      "/transfers": "Airport Transfers — these are a subset of tours. Manage them from the Tours tab, filtering by category 'transfer'.",
      "/private-tours": "Private Tours — managed from the Tours tab, filtering by type 'private'.",
      "/packages": "Packages — managed from the Tours tab, filtering by category 'package'.",
    };
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-base border-b pb-2">Dynamic Page</h3>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="flex items-center gap-2"><ChevronRight size={14} className="shrink-0" />{labels[page] ?? "This page content is managed from the relevant tab above."}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(page, "_blank")}>
          <ExternalLink size={13} /> Open Live Page
        </Button>
      </div>
    );
  }

  // ─── main dashboard ───────────────────────────────────────────────────────

  export default function AdminDashboard() {
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const { data: me, isLoading: loadingMe } = useGetAdminMe();
    const { data: stats } = useGetAdminStats();

    const logout = useAdminLogout({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
          setLocation("/admin");
        },
      },
    });

    if (loadingMe) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-96 h-24 rounded-2xl" /></div>;
    if (!me) { setLocation("/admin"); return null; }

    return (
      <div className="min-h-screen bg-muted/20">
        <header className="bg-card border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <img src="/janeiro-logo.png" alt="Janeiro Tour" className="h-8 w-auto" onError={e => (e.target as HTMLImageElement).style.display = "none"} />
            <div>
              <p className="font-bold text-sm">Admin Dashboard</p>
              <p className="text-xs text-muted-foreground">Logged in as {me.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => window.open("/", "_blank")}>
              <ExternalLink size={14} /> View Site
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout.mutate(undefined)} className="gap-1">
              <LogOut size={14} /> Sign Out
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap h-auto gap-1 mb-8 bg-card border p-1 rounded-xl w-full justify-start">
              {[
                { value: "overview", icon: BarChart3, label: "Overview" },
                { value: "editor", icon: Monitor, label: "Page Editor" },
                { value: "tours", icon: Package, label: "Tours" },
                { value: "destinations", icon: MapPin, label: "Destinations" },
                { value: "blog", icon: FileText, label: "Travel Guide" },
                { value: "reviews", icon: Star, label: "Reviews" },
                { value: "faqs", icon: HelpCircle, label: "FAQs" },
                { value: "homepage", icon: Image, label: "Homepage" },
                { value: "settings", icon: Settings, label: "Settings & SEO" },
                { value: "reservations", icon: ClipboardList, label: "Reservations" },
                { value: "extras", icon: Tag, label: "Tour Extras" },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger key={value} value={value} className="gap-1.5 text-sm">
                  <Icon size={14} />{label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Tours" value={stats?.totalTours ?? 0} icon={Package} color="bg-primary" />
                <StatCard label="Destinations" value={stats?.totalDestinations ?? 0} icon={MapPin} color="bg-accent" />
                <StatCard label="Reviews" value={stats?.totalReviews ?? 0} icon={Star} color="bg-orange-500" />
                <StatCard label="Blog Posts" value={stats?.totalBlogPosts ?? 0} icon={FileText} color="bg-purple-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard label="Published Tours" value={stats?.publishedTours ?? 0} icon={Globe} color="bg-blue-500" />
                <StatCard label="Featured Tours" value={stats?.featuredTours ?? 0} icon={BarChart3} color="bg-indigo-500" />
                <StatCard label="Avg Rating" value={stats ? `${Number(stats.averageRating).toFixed(1)}/5` : "—"} icon={Star} color="bg-yellow-500" />
              </div>
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-3">Quick Start Guide</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Go to <strong>Page Editor</strong> to visually preview and edit any page with a live side-by-side view</li>
                  <li>Go to <strong>Tours</strong> → click <strong>Add Tour</strong> to create or edit tours — includes image upload, highlights, itinerary, inclusions, SEO and Regiondo widget</li>
                  <li>Go to <strong>Travel Guide</strong> to add and manage blog posts</li>
                  <li>Go to <strong>Homepage</strong> to edit hero text, CTAs and contact information</li>
                  <li>Go to <strong>Settings & SEO</strong> to manage global SEO and social media links</li>
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="editor"><PageEditorTab /></TabsContent>
            <TabsContent value="tours"><ToursTab /></TabsContent>
            <TabsContent value="destinations"><DestinationsTab /></TabsContent>
            <TabsContent value="blog"><BlogTab /></TabsContent>
            <TabsContent value="reviews"><ReviewsTab /></TabsContent>
            <TabsContent value="faqs"><FaqsTab /></TabsContent>
            <TabsContent value="homepage"><HomepageTab /></TabsContent>
            <TabsContent value="settings"><SettingsTab /></TabsContent>
            <TabsContent value="reservations"><ReservationsTab /></TabsContent>
            <TabsContent value="extras"><ExtrasTab /></TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // ─── tours tab ───────────────────────────────────────────────────────────

  function ToursTab() {
    const queryClient = useQueryClient();
    const { data: tours, isLoading } = useListTours();
    const createTour = useCreateTour({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListToursQueryKey() }) } });
    const updateTour = useUpdateTour({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListToursQueryKey() }) } });
    const deleteTour = useDeleteTour({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListToursQueryKey() }) } });
    const [editTour, setEditTour] = useState<Record<string, unknown> | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Tours ({tours?.length ?? 0})</h2>
            <p className="text-sm text-muted-foreground mt-1">Full CRUD with image upload, highlights, itinerary, SEO and Regiondo widget</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1"><Plus size={15} /> Add Tour</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Add New Tour</DialogTitle></DialogHeader>
              <TourForm
                onSave={(data) => { createTour.mutate({ data: data as unknown as Parameters<typeof createTour.mutate>[0]["data"] }); setCreateOpen(false); }}
                onClose={() => setCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tour</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Regiondo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : tours?.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {tour.imageUrl && <img src={tour.imageUrl} alt="" className="w-10 h-8 rounded object-cover flex-shrink-0" />}
                      <span className="font-medium text-sm max-w-[180px] truncate">{tour.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{tour.destination}</TableCell>
                  <TableCell className="text-sm">${tour.priceFrom}</TableCell>
                  <TableCell>
                    {(tour.regiondoWidget as string | null)?.trim()
                      ? <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Widget Active</Badge>
                      : <Badge variant="outline" className="text-muted-foreground text-xs">No Widget</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {tour.published && <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Published</Badge>}
                      {tour.featured && <Badge className="bg-primary/80 text-xs">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog open={editTour?.id === tour.id} onOpenChange={open => !open && setEditTour(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditTour(tour as unknown as Record<string, unknown>)}><Pencil size={15} /></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader><DialogTitle>Edit Tour: {tour.title}</DialogTitle></DialogHeader>
                          {editTour && (
                            <TourForm
                              tour={editTour}
                              onSave={(data) => { updateTour.mutate({ id: tour.id, data: data as Parameters<typeof updateTour.mutate>[0]["data"] }); setEditTour(null); }}
                              onClose={() => setEditTour(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <ConfirmDelete label="tour" onConfirm={() => deleteTour.mutate({ id: tour.id })} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  function DestinationsTab() {
    const queryClient = useQueryClient();
    const { data: destinations, isLoading } = useListDestinations();
    const createDest = useCreateDestination({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListDestinationsQueryKey() }) } });
    const updateDest = useUpdateDestination({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListDestinationsQueryKey() }) } });
    const deleteDest = useDeleteDestination({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListDestinationsQueryKey() }) } });
    type Dest = NonNullable<typeof destinations>[number];
    const [editDest, setEditDest] = useState<Dest | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const emptyDest = { slug: "", name: "", nameEs: "", namePt: "", country: "Brazil", imageUrl: "", heroImageUrl: "", description: "", descriptionEs: "", descriptionPt: "", seoTitle: "", seoDescription: "", featured: true, sortOrder: 10 };
    const [form, setForm] = useState(emptyDest);

    function DestForm({ values, set, onSave, onCancel }: {
      values: typeof emptyDest; set: (k: string, v: unknown) => void; onSave: () => void; onCancel: () => void;
    }) {
      const [lang, setLang] = useState<"en" | "es" | "pt">("en");
      return (
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label>Slug *</Label><Input value={values.slug} onChange={e => set("slug", e.target.value)} placeholder="rio-de-janeiro" /></div>
            <div className="space-y-1"><Label>Country</Label><Input value={values.country} onChange={e => set("country", e.target.value)} /></div>
          </div>
          <div className="border rounded-xl overflow-hidden">
            <div className="flex border-b bg-muted/30">
              {(["en", "es", "pt"] as const).map((code, i) => (
                <button key={code} onClick={() => setLang(code)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${lang === code ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}>
                  {["English", "Español", "Português"][i]}
                </button>
              ))}
            </div>
            <div className="p-3 space-y-2">
              {lang === "en" && (
                <>
                  <div className="space-y-1"><Label>Name — English *</Label><Input value={values.name} onChange={e => set("name", e.target.value)} placeholder="Rio de Janeiro" /></div>
                  <div className="space-y-1"><Label>Description — English *</Label><Textarea rows={3} value={values.description} onChange={e => set("description", e.target.value)} /></div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><Label>SEO Title</Label><span className="text-xs text-muted-foreground">{(values.seoTitle ?? "").length}/60</span></div>
                    <Input value={values.seoTitle ?? ""} onChange={e => set("seoTitle", e.target.value)} maxLength={60} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><Label>SEO Description</Label><span className="text-xs text-muted-foreground">{(values.seoDescription ?? "").length}/160</span></div>
                    <Textarea rows={2} value={values.seoDescription ?? ""} onChange={e => set("seoDescription", e.target.value)} maxLength={160} />
                  </div>
                </>
              )}
              {lang === "es" && (
                <>
                  <div className="space-y-1"><Label>Nombre — Español</Label><Input value={values.nameEs ?? ""} onChange={e => set("nameEs", e.target.value)} /></div>
                  <div className="space-y-1"><Label>Descripción — Español</Label><Textarea rows={4} value={values.descriptionEs ?? ""} onChange={e => set("descriptionEs", e.target.value)} /></div>
                </>
              )}
              {lang === "pt" && (
                <>
                  <div className="space-y-1"><Label>Nome — Português</Label><Input value={values.namePt ?? ""} onChange={e => set("namePt", e.target.value)} /></div>
                  <div className="space-y-1"><Label>Descrição — Português</Label><Textarea rows={4} value={values.descriptionPt ?? ""} onChange={e => set("descriptionPt", e.target.value)} /></div>
                </>
              )}
            </div>
          </div>
          <ImageUploader value={values.imageUrl} onChange={v => set("imageUrl", v)} label="Card Image *" />
          <ImageUploader value={values.heroImageUrl ?? ""} onChange={v => set("heroImageUrl", v)} label="Hero / Banner Image" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><Switch checked={!!values.featured} onCheckedChange={v => set("featured", v)} /><Label>Featured</Label></div>
            <div className="space-y-1"><Label className="text-xs">Sort Order</Label><Input type="number" value={values.sortOrder ?? 10} onChange={e => set("sortOrder", parseInt(e.target.value))} className="w-24" /></div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={onSave}>Save Destination</Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Destinations ({destinations?.length ?? 0})</h2>
            <p className="text-sm text-muted-foreground mt-1">Multilingual names, descriptions, hero images and SEO per destination</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add Destination</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add Destination</DialogTitle></DialogHeader>
              <DestForm
                values={form}
                set={(k, v) => setForm(f => ({ ...f, [k]: v } as typeof emptyDest))}
                onSave={() => { createDest.mutate({ data: form }); setCreateOpen(false); setForm(emptyDest); }}
                onCancel={() => setCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead><TableHead>Country</TableHead><TableHead>Languages</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? [...Array(4)].map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                : destinations?.map(dest => (
                  <TableRow key={dest.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {dest.imageUrl && <img src={dest.imageUrl} alt="" className="w-10 h-8 rounded object-cover flex-shrink-0" />}
                        <span className="font-medium">{dest.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{dest.country}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">EN</Badge>
                        {dest.nameEs && <Badge variant="outline" className="text-xs">ES</Badge>}
                        {dest.namePt && <Badge variant="outline" className="text-xs">PT</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{dest.featured && <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Featured</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditDest(dest)}><Pencil size={15} /></Button>
                        <ConfirmDelete label="destination" onConfirm={() => deleteDest.mutate({ id: dest.id })} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {editDest && (
          <Dialog open={!!editDest} onOpenChange={() => setEditDest(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Edit: {editDest.name}</DialogTitle></DialogHeader>
              <DestForm
                values={editDest as unknown as typeof emptyDest}
                set={(k, v) => setEditDest(d => d ? { ...d, [k]: v } as Dest : null)}
                onSave={() => { updateDest.mutate({ id: editDest.id, data: editDest as Parameters<typeof updateDest.mutate>[0]["data"] }); setEditDest(null); }}
                onCancel={() => setEditDest(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  function MarkdownEditor({ value, onChange: onChangeMd, placeholder, rows = 14 }: {
    value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
  }) {
    const taRef = useRef<HTMLTextAreaElement>(null);

    const wrap = (before: string, after: string) => {
      const ta = taRef.current;
      if (!ta) return;
      const s = ta.selectionStart, e = ta.selectionEnd;
      const sel = value.slice(s, e) || "text";
      const next = value.slice(0, s) + before + sel + after + value.slice(e);
      onChangeMd(next);
      setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length); }, 0);
    };

    const insertLink = () => {
      const ta = taRef.current;
      if (!ta) return;
      const s = ta.selectionStart, e = ta.selectionEnd;
      const sel = value.slice(s, e) || "link text";
      const url = window.prompt("Link URL (affiliate or page):", "https://");
      if (!url) return;
      const md = `[${sel}](${url})`;
      const next = value.slice(0, s) + md + value.slice(e);
      onChangeMd(next);
      setTimeout(() => { ta.focus(); ta.setSelectionRange(s, s + md.length); }, 0);
    };

    const insertImage = () => {
      const ta = taRef.current;
      if (!ta) return;
      const s = ta.selectionStart;
      const url = window.prompt("Image URL:", "https://");
      if (!url) return;
      const alt = window.prompt("Alt text / caption:", "image") || "image";
      const md = `\n\n![${alt}](${url})\n\n`;
      const next = value.slice(0, s) + md + value.slice(s);
      onChangeMd(next);
      setTimeout(() => { ta.focus(); ta.setSelectionRange(s + md.length, s + md.length); }, 0);
    };

    return (
      <div className="rounded-md border border-input overflow-hidden">
        <div className="flex items-center gap-0.5 px-2 py-1 bg-muted/40 border-b border-input">
          <button type="button" onClick={() => wrap("**", "**")} title="Bold"
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => wrap("*", "*")} title="Italic"
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <span className="w-px h-4 bg-border mx-1" />
          <button type="button" onClick={insertLink} title="Insert link / affiliate"
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Link2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={insertImage} title="Insert image"
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ImagePlus className="w-3.5 h-3.5" />
          </button>
          <span className="ml-auto text-[10px] text-muted-foreground/60 pr-1">Markdown</span>
        </div>
        <textarea
          ref={taRef}
          rows={rows}
          value={value}
          onChange={e => onChangeMd(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-sm font-mono bg-background text-foreground placeholder:text-muted-foreground resize-y focus:outline-none"
        />
      </div>
    );
  }

  function BlogForm({ values, onChange }: { values: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
    const [lang, setLang] = useState<"en" | "es" | "pt">("en");
    const str = (k: string) => (values[k] ?? "") as string;
    const imgs = () => (values.galleryImages ?? []) as string[];

    return (
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1"><Label>Slug *</Label><Input value={str("slug")} onChange={e => onChange("slug", e.target.value)} placeholder="article-url-slug" /></div>
          <div className="space-y-1"><Label>Author</Label><Input value={str("author")} onChange={e => onChange("author", e.target.value)} /></div>
          <div className="space-y-1"><Label>Category</Label><Input value={str("category")} onChange={e => onChange("category", e.target.value)} /></div>
        </div>
        <div className="flex items-center gap-6">
          <div className="space-y-1 w-28"><Label>Read Time (min)</Label><Input type="number" value={values.readTimeMinutes as number ?? 5} onChange={e => onChange("readTimeMinutes", parseInt(e.target.value))} /></div>
          <div className="flex items-center gap-2 mt-5"><Switch checked={!!values.published} onCheckedChange={v => onChange("published", v)} /><Label>Published</Label></div>
          <div className="flex items-center gap-2 mt-5"><Switch checked={!!values.featured} onCheckedChange={v => onChange("featured", v)} /><Label>Featured</Label></div>
        </div>
        <div className="border rounded-xl overflow-hidden">
          <div className="flex border-b bg-muted/30">
            {(["en", "es", "pt"] as const).map((code, i) => (
              <button key={code} onClick={() => setLang(code)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${lang === code ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}>
                {["English", "Español", "Português"][i]}
              </button>
            ))}
          </div>
          <div className="p-4 space-y-3">
            {lang === "en" && (<>
              <div className="space-y-1"><Label>Title — English *</Label><Input value={str("title")} onChange={e => onChange("title", e.target.value)} placeholder="Article title" /></div>
              <div className="space-y-1"><Label>Excerpt — English *</Label><Textarea rows={2} value={str("excerpt")} onChange={e => onChange("excerpt", e.target.value)} placeholder="Short description for blog listing" /></div>
              <div className="space-y-1"><Label>Content — English *</Label><MarkdownEditor value={str("content")} onChange={v => onChange("content", v)} placeholder="Write in Markdown… **bold**, *italic*, ![alt](url), [link text](url)" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Title — EN</Label><span className="text-xs text-muted-foreground">{str("seoTitle").length}/60</span></div>
                  <Input value={str("seoTitle")} onChange={e => onChange("seoTitle", e.target.value)} maxLength={60} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Description — EN</Label><span className="text-xs text-muted-foreground">{str("seoDescription").length}/160</span></div>
                  <Textarea rows={2} value={str("seoDescription")} onChange={e => onChange("seoDescription", e.target.value)} maxLength={160} />
                </div>
              </div>
            </>)}
            {lang === "es" && (<>
              <div className="space-y-1"><Label>Título — Español</Label><Input value={str("titleEs")} onChange={e => onChange("titleEs", e.target.value)} placeholder="Título del artículo" /></div>
              <div className="space-y-1"><Label>Extracto — Español</Label><Textarea rows={2} value={str("excerptEs")} onChange={e => onChange("excerptEs", e.target.value)} placeholder="Descripción corta" /></div>
              <div className="space-y-1"><Label>Contenido — Español</Label><MarkdownEditor value={str("contentEs")} onChange={v => onChange("contentEs", v)} placeholder="Escribe en Markdown… **negrita**, *cursiva*, ![alt](url), [texto](url)" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Título — ES</Label><span className="text-xs text-muted-foreground">{str("seoTitleEs").length}/60</span></div>
                  <Input value={str("seoTitleEs")} onChange={e => onChange("seoTitleEs", e.target.value)} maxLength={60} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Descripción — ES</Label><span className="text-xs text-muted-foreground">{str("seoDescriptionEs").length}/160</span></div>
                  <Textarea rows={2} value={str("seoDescriptionEs")} onChange={e => onChange("seoDescriptionEs", e.target.value)} maxLength={160} />
                </div>
              </div>
            </>)}
            {lang === "pt" && (<>
              <div className="space-y-1"><Label>Título — Português</Label><Input value={str("titlePt")} onChange={e => onChange("titlePt", e.target.value)} placeholder="Título do artigo" /></div>
              <div className="space-y-1"><Label>Excerto — Português</Label><Textarea rows={2} value={str("excerptPt")} onChange={e => onChange("excerptPt", e.target.value)} placeholder="Descrição curta" /></div>
              <div className="space-y-1"><Label>Conteúdo — Português</Label><MarkdownEditor value={str("contentPt")} onChange={v => onChange("contentPt", v)} placeholder="Escreva em Markdown… **negrito**, *itálico*, ![alt](url), [texto](url)" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Título — PT</Label><span className="text-xs text-muted-foreground">{str("seoTitlePt").length}/60</span></div>
                  <Input value={str("seoTitlePt")} onChange={e => onChange("seoTitlePt", e.target.value)} maxLength={60} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Descrição — PT</Label><span className="text-xs text-muted-foreground">{str("seoDescriptionPt").length}/160</span></div>
                  <Textarea rows={2} value={str("seoDescriptionPt")} onChange={e => onChange("seoDescriptionPt", e.target.value)} maxLength={160} />
                </div>
              </div>
            </>)}
          </div>
        </div>
        <SectionLabel>Images</SectionLabel>
        <ImageUploader value={str("imageUrl")} onChange={v => onChange("imageUrl", v)} label="Featured Image *" />
        <div className="space-y-2">
          <Label>Gallery Images</Label>
          <p className="text-xs text-muted-foreground">Additional images displayed within the article</p>
          {imgs().map((img, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input value={img} onChange={e => { const a = [...imgs()]; a[i] = e.target.value; onChange("galleryImages", a); }} placeholder="https://..." className="flex-1" />
              {img && <img src={img} alt="" className="w-10 h-8 rounded object-cover border flex-shrink-0" onError={e => (e.target as HTMLImageElement).style.display = "none"} />}
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("galleryImages", imgs().filter((_, idx) => idx !== i))}><Trash2 size={13} /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange("galleryImages", [...imgs(), ""])}>
            <Plus size={13} />Add Gallery Image
          </Button>
        </div>
      </div>
    );
  }

  function BlogTab() {
    const queryClient = useQueryClient();
    const { data: posts, isLoading } = useListBlogPosts();
    const deletePost = useDeleteBlogPost({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }) } });
    const updatePost = useUpdateBlogPost({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }) } });
    const createPost = useCreateBlogPost({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() }) } });
    type Post = NonNullable<typeof posts>[number];
    const [editPost, setEditPost] = useState<Post | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const emptyForm: Record<string, unknown> = {
      slug: "", title: "", titleEs: "", titlePt: "",
      excerpt: "", excerptEs: "", excerptPt: "",
      content: "", contentEs: "", contentPt: "",
      imageUrl: "", galleryImages: [],
      author: "Janeiro Tour Editorial", category: "Travel Guide", readTimeMinutes: 5,
      seoTitle: "", seoTitleEs: "", seoTitlePt: "",
      seoDescription: "", seoDescriptionEs: "", seoDescriptionPt: "",
      featured: false, published: true,
    };
    const [form, setForm] = useState<Record<string, unknown>>(emptyForm);
    const onChange = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

    const duplicatePost = (post: Post) => {
      const { id: _id, createdAt: _ca, ...rest } = post as Post & { id: number; createdAt: string };
      createPost.mutate({
        data: {
          ...rest,
          slug: `${post.slug}-copy-${Date.now().toString(36)}`,
          title: `${post.title} (Copy)`,
          published: false,
          galleryImages: (post.galleryImages ?? []) as string[],
        } as Parameters<typeof createPost.mutate>[0]["data"],
      });
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Travel Guide Posts ({posts?.length ?? 0})</h2>
            <p className="text-sm text-muted-foreground mt-1">Full multilingual editing — English, Español, Português — with gallery images and SEO</p>
          </div>
          <Dialog open={createOpen} onOpenChange={o => { setCreateOpen(o); if (!o) setForm(emptyForm); }}>
            <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add Post</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Add Travel Guide Post</DialogTitle></DialogHeader>
              <BlogForm values={form} onChange={onChange} />
              <div className="flex gap-3 justify-end pt-3 border-t">
                <Button variant="outline" onClick={() => { setCreateOpen(false); setForm(emptyForm); }}>Cancel</Button>
                <Button onClick={() => { createPost.mutate({ data: form as unknown as Parameters<typeof createPost.mutate>[0]["data"] }); setCreateOpen(false); setForm(emptyForm); }}>Save Post</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Languages</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? [...Array(4)].map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                : posts?.map(post => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.imageUrl && <img src={post.imageUrl} alt="" className="w-10 h-8 rounded object-cover flex-shrink-0" />}
                        <div>
                          <span className="font-medium max-w-[180px] truncate block">{post.title}</span>
                          <span className="text-xs text-muted-foreground">{post.author}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{post.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">EN</Badge>
                        {post.titleEs && <Badge variant="outline" className="text-xs">ES</Badge>}
                        {post.titlePt && <Badge variant="outline" className="text-xs">PT</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {post.published ? <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Published</Badge> : <Badge variant="outline" className="text-muted-foreground text-xs">Draft</Badge>}
                        {post.featured && <Badge className="bg-primary/80 text-xs text-primary-foreground">Featured</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Duplicate post" onClick={() => duplicatePost(post)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditPost(post)}><Pencil size={15} /></Button>
                        <ConfirmDelete label="post" onConfirm={() => deletePost.mutate({ id: post.id })} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {editPost && (
          <Dialog open={!!editPost} onOpenChange={() => setEditPost(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Edit: {editPost.title}</DialogTitle></DialogHeader>
              <BlogForm
                values={editPost as unknown as Record<string, unknown>}
                onChange={(k, v) => setEditPost(p => p ? { ...p, [k]: v } as Post : null)}
              />
              <div className="flex gap-3 justify-end pt-3 border-t">
                <Button variant="outline" onClick={() => setEditPost(null)}>Cancel</Button>
                <Button onClick={() => { updatePost.mutate({ id: editPost.id, data: editPost as Parameters<typeof updatePost.mutate>[0]["data"] }); setEditPost(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  function ReviewsTab() {
    const queryClient = useQueryClient();
    const { data: reviews, isLoading } = useListReviews();
    const deleteReview = useDeleteReview({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() }) } });
    const updateReview = useUpdateReview({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() }) } });
    const createReview = useCreateReview({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() }) } });
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState({ authorName:"", authorCountry:"", rating:5, comment:"", tourName:"", source:"Google Reviews", featured:false });
    const setF = (k: string, v: unknown) => setForm(f => ({...f,[k]:v}));

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Reviews & Testimonials ({reviews?.length ?? 0})</h2>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add Review</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add Review</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Author Name</Label><Input value={form.authorName} onChange={e => setF("authorName",e.target.value)} /></div>
                  <div className="space-y-1"><Label>Country</Label><Input value={form.authorCountry} onChange={e => setF("authorCountry",e.target.value)} placeholder="USA" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Tour Name</Label><Input value={form.tourName} onChange={e => setF("tourName",e.target.value)} /></div>
                  <div className="space-y-1"><Label>Source</Label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.source} onChange={e => setF("source",e.target.value)}>
                      <option>Google Reviews</option><option>TripAdvisor</option><option>Direct</option><option>Regiondo</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1"><Label>Rating</Label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setF("rating",n)} className={`text-2xl transition-colors ${n <= form.rating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1"><Label>Review Text</Label><Textarea rows={4} value={form.comment} onChange={e => setF("comment",e.target.value)} /></div>
                <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={v => setF("featured",v)} /><Label>Featured on Homepage</Label></div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button onClick={() => { createReview.mutate({ data: form }); setCreateOpen(false); }}>Save Review</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Author</TableHead><TableHead>Country</TableHead><TableHead>Rating</TableHead><TableHead>Tour</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? [...Array(4)].map((_,i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                : reviews?.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.authorName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.authorCountry}</TableCell>
                    <TableCell className="text-yellow-500">{"★".repeat(r.rating)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[120px] truncate">{r.tourName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r.source}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => updateReview.mutate({ id: r.id, data: { featured: !r.featured } })}>
                          <Star size={15} className={r.featured ? "fill-primary text-primary" : "text-muted-foreground"} />
                        </Button>
                        <ConfirmDelete label="review" onConfirm={() => deleteReview.mutate({ id: r.id })} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  function FaqsTab() {
    const queryClient = useQueryClient();
    const { data: faqs, isLoading } = useListFaqs();
    const deleteFaq = useDeleteFaq({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }) } });
    const updateFaq = useUpdateFaq({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }) } });
    const createFaq = useCreateFaq({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() }) } });
    type Faq = NonNullable<typeof faqs>[number];
    const [editFaq, setEditFaq] = useState<Faq | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState({ question:"", answer:"", questionEs:"", answerEs:"", questionPt:"", answerPt:"", sortOrder: 10 });

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">FAQs ({faqs?.length ?? 0})</h2>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add FAQ</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add FAQ</DialogTitle></DialogHeader>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-1"><Label>Question (English)</Label><Input value={form.question} onChange={e => setForm(f => ({...f,question:e.target.value}))} /></div>
                <div className="space-y-1"><Label>Answer (English)</Label><Textarea rows={3} value={form.answer} onChange={e => setForm(f => ({...f,answer:e.target.value}))} /></div>
                <div className="space-y-1"><Label>Question — Español</Label><Input value={form.questionEs} onChange={e => setForm(f => ({...f,questionEs:e.target.value}))} /></div>
                <div className="space-y-1"><Label>Answer — Español</Label><Textarea rows={2} value={form.answerEs} onChange={e => setForm(f => ({...f,answerEs:e.target.value}))} /></div>
                <div className="space-y-1"><Label>Question — Português</Label><Input value={form.questionPt} onChange={e => setForm(f => ({...f,questionPt:e.target.value}))} /></div>
                <div className="space-y-1"><Label>Answer — Português</Label><Textarea rows={2} value={form.answerPt} onChange={e => setForm(f => ({...f,answerPt:e.target.value}))} /></div>
                <div className="space-y-1"><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({...f,sortOrder:parseInt(e.target.value)}))} className="w-28" /></div>
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createFaq.mutate({ data: form }); setCreateOpen(false); setForm({question:"",answer:"",questionEs:"",answerEs:"",questionPt:"",answerPt:"",sortOrder:10}); }}>Save FAQ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Question</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? [...Array(5)].map((_,i) => <TableRow key={i}><TableCell colSpan={2}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                : faqs?.map(faq => (
                  <TableRow key={faq.id}>
                    <TableCell className="max-w-[500px]">
                      <p className="font-medium text-sm">{faq.question}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{faq.answer}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setEditFaq(faq)}><Pencil size={15} /></Button>
                        <ConfirmDelete label="FAQ" onConfirm={() => deleteFaq.mutate({ id: faq.id })} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {editFaq && (
          <Dialog open={!!editFaq} onOpenChange={() => setEditFaq(null)}>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Edit FAQ</DialogTitle></DialogHeader>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-1"><Label>Question (EN)</Label><Input defaultValue={editFaq.question} onChange={e => setEditFaq(f => f ? {...f,question:e.target.value} : null)} /></div>
                <div className="space-y-1"><Label>Question — Español</Label><Input defaultValue={editFaq.questionEs ?? ""} onChange={e => setEditFaq(f => f ? {...f,questionEs:e.target.value} : null)} /></div>
                <div className="space-y-1"><Label>Question — Português</Label><Input defaultValue={editFaq.questionPt ?? ""} onChange={e => setEditFaq(f => f ? {...f,questionPt:e.target.value} : null)} /></div>
                <div className="space-y-1"><Label>Answer (EN)</Label><Textarea rows={3} defaultValue={editFaq.answer} onChange={e => setEditFaq(f => f ? {...f,answer:e.target.value} : null)} /></div>
                <div className="space-y-1"><Label>Answer — Español</Label><Textarea rows={2} defaultValue={editFaq.answerEs ?? ""} onChange={e => setEditFaq(f => f ? {...f,answerEs:e.target.value} : null)} /></div>
                <div className="space-y-1"><Label>Answer — Português</Label><Textarea rows={2} defaultValue={editFaq.answerPt ?? ""} onChange={e => setEditFaq(f => f ? {...f,answerPt:e.target.value} : null)} /></div>
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t">
                <Button variant="outline" onClick={() => setEditFaq(null)}>Cancel</Button>
                <Button onClick={() => { updateFaq.mutate({ id: editFaq.id, data: editFaq as Parameters<typeof updateFaq.mutate>[0]["data"] }); setEditFaq(null); }}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  function HomepageTab() {
    const queryClient = useQueryClient();
    const { data: settings, isLoading } = useGetSettings();
    const updateSettings = useUpdateSettings({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) } });
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState<Record<string,string> | null>(null);
    useEffect(() => { if (settings && form === null) setForm(settings as unknown as Record<string,string>); }, [settings]);
    const setF = (k: string, v: string) => setForm(f => f ? {...f,[k]:v} : null);
    const save = () => {
      if (!form) return;
      updateSettings.mutate({ data: form as Parameters<typeof updateSettings.mutate>[0]["data"] });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    };
    if (isLoading || !form) return <Skeleton className="h-96 w-full rounded-xl" />;
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold">Homepage Content</h2><p className="text-sm text-muted-foreground mt-1">Edit hero text, CTAs and contact info</p></div>
          <Button onClick={save} className="min-w-[120px]">{saved ? "Saved" : "Save Changes"}</Button>
        </div>
        <div className="space-y-8">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-base">Hero Section</h3>
            <div className="space-y-1"><Label>Headline (English)</Label><Input value={form.heroHeadline ?? ""} onChange={e => setF("heroHeadline",e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Headline — Español</Label><Input value={form.heroHeadlineEs ?? ""} onChange={e => setF("heroHeadlineEs",e.target.value)} /></div>
              <div className="space-y-1"><Label>Headline — Português</Label><Input value={form.heroHeadlinePt ?? ""} onChange={e => setF("heroHeadlinePt",e.target.value)} /></div>
            </div>
            <div className="space-y-1"><Label>Subheadline (English)</Label><Textarea rows={2} value={form.heroSubheadline ?? ""} onChange={e => setF("heroSubheadline",e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Subheadline — Español</Label><Textarea rows={2} value={form.heroSubheadlineEs ?? ""} onChange={e => setF("heroSubheadlineEs",e.target.value)} /></div>
              <div className="space-y-1"><Label>Subheadline — Português</Label><Textarea rows={2} value={form.heroSubheadlinePt ?? ""} onChange={e => setF("heroSubheadlinePt",e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Primary CTA Button</Label><Input value={form.heroPrimaryCtaText ?? ""} onChange={e => setF("heroPrimaryCtaText",e.target.value)} /></div>
              <div className="space-y-1"><Label>Secondary CTA Button</Label><Input value={form.heroSecondaryCtaText ?? ""} onChange={e => setF("heroSecondaryCtaText",e.target.value)} /></div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-base">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.contactEmail ?? ""} onChange={e => setF("contactEmail",e.target.value)} /></div>
              <div className="space-y-1"><Label>Phone</Label><Input value={form.contactPhone ?? ""} onChange={e => setF("contactPhone",e.target.value)} /></div>
            </div>
            <div className="space-y-1"><Label>WhatsApp Link</Label><Input value={form.contactWhatsapp ?? ""} onChange={e => setF("contactWhatsapp",e.target.value)} /></div>
            <div className="space-y-1"><Label>Address</Label><Input value={form.address ?? ""} onChange={e => setF("address",e.target.value)} /></div>
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-base">Social Media</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Instagram URL</Label><Input value={form.instagramUrl ?? ""} onChange={e => setF("instagramUrl",e.target.value)} /></div>
              <div className="space-y-1"><Label>Facebook URL</Label><Input value={form.facebookUrl ?? ""} onChange={e => setF("facebookUrl",e.target.value)} /></div>
              <div className="space-y-1"><Label>TripAdvisor URL</Label><Input value={form.tripadvisorUrl ?? ""} onChange={e => setF("tripadvisorUrl",e.target.value)} /></div>
              <div className="space-y-1"><Label>Google Reviews URL</Label><Input value={form.googleReviewsUrl ?? ""} onChange={e => setF("googleReviewsUrl",e.target.value)} /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SettingsTab() {
    const queryClient = useQueryClient();
    const { data: settings, isLoading } = useGetSettings();
    const updateSettings = useUpdateSettings({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) } });
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState<Record<string,string> | null>(null);
    useEffect(() => { if (settings && form === null) setForm(settings as unknown as Record<string,string>); }, [settings]);
    const setF = (k: string, v: string) => setForm(f => f ? {...f,[k]:v} : null);
    if (isLoading || !form) return <Skeleton className="h-96 w-full rounded-xl" />;
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold">Settings & SEO</h2><p className="text-sm text-muted-foreground mt-1">Global site configuration and SEO</p></div>
          <Button onClick={() => { updateSettings.mutate({ data: form as Parameters<typeof updateSettings.mutate>[0]["data"] }); setSaved(true); setTimeout(() => setSaved(false), 2500); }} className="min-w-[120px]">
            {saved ? "Saved" : "Save Settings"}
          </Button>
        </div>
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">SEO Settings</h3>
            <div className="space-y-1"><Label>Site Title / Brand Name</Label><Input value={form.siteName ?? ""} onChange={e => setF("siteName",e.target.value)} placeholder="Janeiro Tour & Travel" /></div>
            <div className="space-y-1">
              <div className="flex justify-between"><Label>Default SEO Title</Label><span className="text-xs text-muted-foreground">{(form.seoTitle ?? "").length}/60 chars</span></div>
              <Input value={form.seoTitle ?? ""} onChange={e => setF("seoTitle",e.target.value)} maxLength={60} />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><Label>Default Meta Description</Label><span className="text-xs text-muted-foreground">{(form.seoDescription ?? "").length}/160 chars</span></div>
              <Textarea rows={3} value={form.seoDescription ?? ""} onChange={e => setF("seoDescription",e.target.value)} maxLength={160} />
            </div>
            <div className="space-y-1"><Label>OG Image URL (social sharing)</Label><Input value={form.ogImageUrl ?? ""} onChange={e => setF("ogImageUrl",e.target.value)} /></div>
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Languages</h3>
            <p className="text-sm text-muted-foreground">The site supports English, Spanish and Portuguese. Use the Tour and FAQ editors to add translations.</p>
            <div className="grid grid-cols-3 gap-4">
              {["English (EN) — Default", "Español (ES)", "Português PT-BR"].map(lang => (
                <div key={lang} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">{lang}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── reservations tab ───────────────────────────────────────────────────

  const STATUS_LABELS: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
    pending_confirmation: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200", Icon: Clock },
    confirmed:            { label: "Confirmed", color: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200", Icon: CheckCircle2 },
    cancelled:            { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200", Icon: XIcon },
    completed:            { label: "Completed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200", Icon: CheckCircle2 },
  };

  const PAYMENT_LABELS: Record<string, string> = { pending: "Pending", paid: "Paid", refunded: "Refunded", failed: "Failed" };

  function StatusBadge({ status }: { status: string }) {
    const s = STATUS_LABELS[status] ?? { label: status, color: "bg-gray-100 text-gray-800", Icon: AlertCircle };
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>
        <s.Icon size={11} />{s.label}
      </span>
    );
  }

  type Reservation = {
    id: number; bookingRef: string; tourSlug: string; tourTitle: string;
    customerName: string; customerEmail: string; customerPhone?: string | null; customerCountry?: string | null;
    hotelAddress?: string | null; pickupLocation?: string | null; dropoffLocation?: string | null; flightNumber?: string | null;
    preferredDate?: string | null; preferredTime?: string | null; pax: number; language?: string | null; notes?: string | null;
    basePrice: number | string; extrasTotal: number | string; totalAmount: number | string; currency: string;
    paymentStatus: string; bookingStatus: string; adminNotes?: string | null; createdAt: string | Date;
  };

  function ReservationsTab() {
    const { data: reservations = [], isLoading, refetch } = useListReservations() as { data: Reservation[]; isLoading: boolean; refetch: () => void };
    const updateStatus = useUpdateReservationStatus();
    const [filter, setFilter] = useState("all");
    const [selected, setSelected] = useState<Reservation | null>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [newStatus, setNewStatus] = useState("");

    const filtered = filter === "all" ? reservations : reservations.filter((r) => r.bookingStatus === filter);

    const openDetail = (r: Reservation) => { setSelected(r); setAdminNotes(r.adminNotes ?? ""); setNewStatus(r.bookingStatus); };

    const handleSave = async () => {
      if (!selected) return;
      await updateStatus.mutateAsync({ id: selected.id, data: { bookingStatus: newStatus as "pending_confirmation" | "confirmed" | "cancelled" | "completed", notes: adminNotes } });
      refetch();
      setSelected(null);
    };

    if (isLoading) return <div className="py-20 text-center text-muted-foreground">Loading reservations…</div>;

    const totalCollected = reservations.filter(r => r.paymentStatus === "paid").reduce((s, r) => s + Number(r.totalAmount), 0);

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-2xl font-bold">Reservations</h2><p className="text-sm text-muted-foreground mt-1">All customer bookings</p></div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 rounded-xl px-4 py-2">
            <DollarSign size={16} className="text-green-600" />
            <span className="text-sm font-bold text-green-600">${totalCollected.toFixed(0)} collected</span>
          </div>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {(["all", "pending_confirmation", "confirmed", "cancelled", "completed"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === s ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>
              {s === "all" ? "All" : STATUS_LABELS[s]?.label ?? s}
              {" "}<span className="opacity-60">({s === "all" ? reservations.length : reservations.filter(r => r.bookingStatus === s).length})</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground bg-card border rounded-xl">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" /><p>No reservations yet</p>
          </div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead><TableHead>Tour</TableHead><TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead><TableHead className="text-center">Pax</TableHead>
                  <TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(r)}>
                    <TableCell className="font-mono text-xs font-semibold">{r.bookingRef}</TableCell>
                    <TableCell><p className="truncate max-w-[140px] text-sm font-medium">{r.tourTitle}</p></TableCell>
                    <TableCell><p className="text-sm font-medium">{r.customerName}</p><p className="text-xs text-muted-foreground">{r.customerEmail}</p></TableCell>
                    <TableCell className="text-sm">{r.preferredDate ?? "—"}</TableCell>
                    <TableCell className="text-center text-sm">{r.pax}</TableCell>
                    <TableCell><StatusBadge status={r.bookingStatus} /></TableCell>
                    <TableCell><span className={`text-xs font-medium ${r.paymentStatus === "paid" ? "text-green-600" : "text-muted-foreground"}`}>{PAYMENT_LABELS[r.paymentStatus] ?? r.paymentStatus}</span></TableCell>
                    <TableCell className="text-right font-bold text-green-600">${Number(r.totalAmount).toFixed(0)} {r.currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {selected && (
          <Dialog open onOpenChange={() => setSelected(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono text-primary">{selected.bookingRef}</span>
                  <StatusBadge status={selected.bookingStatus} />
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground text-xs mb-0.5">Tour</p><p className="font-semibold">{selected.tourTitle}</p></div>
                  <div><p className="text-muted-foreground text-xs mb-0.5">Travelers</p><p className="font-semibold">{selected.pax} person{selected.pax > 1 ? "s" : ""}</p></div>
                  <div><p className="text-muted-foreground text-xs mb-0.5">Preferred Date</p><p className="font-semibold">{selected.preferredDate ?? "Not specified"}</p></div>
                  <div><p className="text-muted-foreground text-xs mb-0.5">Preferred Time</p><p className="font-semibold">{selected.preferredTime ?? "Not specified"}</p></div>
                </div>
                <div className="border rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-sm">Customer</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground text-xs">Name</p><p>{selected.customerName}</p></div>
                    <div><p className="text-muted-foreground text-xs">Email</p><p>{selected.customerEmail}</p></div>
                    <div><p className="text-muted-foreground text-xs">Phone</p><p>{selected.customerPhone ?? "—"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Country</p><p>{selected.customerCountry ?? "—"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Hotel / Address</p><p>{selected.hotelAddress ?? "—"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Pickup</p><p>{selected.pickupLocation ?? "—"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Drop-off</p><p>{selected.dropoffLocation ?? "—"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Flight</p><p>{selected.flightNumber ?? "—"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Language</p><p>{selected.language ?? "—"}</p></div>
                  </div>
                  {selected.notes && <div><p className="text-muted-foreground text-xs mb-1">Notes</p><p className="text-sm bg-muted/50 rounded p-2">{selected.notes}</p></div>}
                </div>
                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-2">Financials</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Base</span><span>${Number(selected.basePrice).toFixed(0)} {selected.currency}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Extras</span><span>${Number(selected.extrasTotal).toFixed(0)} {selected.currency}</span></div>
                    <div className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total</span><span className="text-green-600">${Number(selected.totalAmount).toFixed(0)} {selected.currency}</span></div>
                    <div className="flex justify-between text-xs mt-1"><span className="text-muted-foreground">Payment</span><span className={selected.paymentStatus === "paid" ? "text-green-600 font-medium" : ""}>{PAYMENT_LABELS[selected.paymentStatus] ?? selected.paymentStatus}</span></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Update Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      {Object.entries(STATUS_LABELS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Admin Notes</label>
                    <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} placeholder="Internal notes about this booking…"
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button onClick={handleSave} disabled={updateStatus.isPending} className="gap-1">
                  <Save size={14} />{updateStatus.isPending ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  // ─── extras tab ─────────────────────────────────────────────────────────

  type TourExtra = { id: number; tourSlug: string; name: string; description?: string | null; price: number | string; currency: string; isActive: boolean };
  const EMPTY_EXTRA = { name: "", description: "", price: "", currency: "USD" };
  const ICLASS = "w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  function ExtrasTab() {
    const { data: tours = [] } = useListTours();
    const { data: allExtras = [], refetch } = useListAllExtras() as { data: TourExtra[]; refetch: () => void };
    const createExtra = useCreateTourExtra();
    const updateExtra = useUpdateTourExtra();
    const deleteExtra = useDeleteTourExtra();
    const [selectedSlug, setSelectedSlug] = useState("");
    const [form, setForm] = useState(EMPTY_EXTRA);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState(EMPTY_EXTRA);

    const tourExtras = allExtras.filter((e) => e.tourSlug === selectedSlug);

    const selectedTourObj = (tours as { id: number; slug: string; title: string }[]).find(t => t.slug === selectedSlug);

    const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedSlug || !form.name.trim() || !form.price || !selectedTourObj) return;
      await createExtra.mutateAsync({ tourId: selectedTourObj.id, data: { name: form.name.trim(), description: form.description.trim() || undefined, price: parseFloat(form.price), currency: form.currency } });
      setForm(EMPTY_EXTRA);
      refetch();
    };

    const handleEditSave = async (id: number) => {
      if (!editForm.name.trim() || !editForm.price) return;
      await updateExtra.mutateAsync({ id, data: { name: editForm.name.trim(), description: editForm.description.trim() || undefined, price: parseFloat(editForm.price), currency: editForm.currency } });
      setEditingId(null);
      refetch();
    };

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Tour Extras &amp; Add-ons</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure optional add-ons shown on each tour page during booking</p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Select Tour</label>
          <select value={selectedSlug} onChange={(e) => setSelectedSlug(e.target.value)} className={ICLASS + " max-w-sm"}>
            <option value="">— Choose a tour —</option>
            {(tours as { slug: string; title: string }[]).map((t) => <option key={t.slug} value={t.slug}>{t.title}</option>)}
          </select>
        </div>

        {selectedSlug && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div>
              <h3 className="font-semibold mb-3">
                Extras for <span className="text-primary">{selectedSlug}</span>
                <span className="ml-2 text-xs font-normal text-muted-foreground">({tourExtras.length})</span>
              </h3>
              {tourExtras.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground bg-card border rounded-xl">
                  <Tag size={36} className="mx-auto mb-2 opacity-30" /><p>No extras yet — add one on the right</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tourExtras.map((extra) => (
                    <div key={extra.id} className="bg-card border rounded-xl p-4">
                      {editingId === extra.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2"><input value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className={ICLASS} /></div>
                            <input value={editForm.price} type="number" min="0" step="0.01" onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))} placeholder="Price" className={ICLASS} />
                            <select value={editForm.currency} onChange={(e) => setEditForm(f => ({ ...f, currency: e.target.value }))} className={ICLASS}>
                              <option value="USD">USD</option><option value="BRL">BRL</option><option value="EUR">EUR</option>
                            </select>
                            <div className="col-span-2"><input value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" className={ICLASS} /></div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleEditSave(extra.id)} disabled={updateExtra.isPending}><Save size={13} /> Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-sm">{extra.name}</p>
                            {extra.description && <p className="text-xs text-muted-foreground mt-0.5">{extra.description}</p>}
                            <p className="text-green-600 font-bold text-sm mt-1">+${Number(extra.price).toFixed(0)} {extra.currency}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingId(extra.id); setEditForm({ name: extra.name, description: extra.description ?? "", price: String(extra.price), currency: extra.currency }); }}><Pencil size={13} /></Button>
                            <ConfirmDelete label={extra.name} onConfirm={async () => { await deleteExtra.mutateAsync({ id: extra.id }); refetch(); }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Add New Extra</h3>
              <form onSubmit={handleAdd} className="bg-card border rounded-xl p-5 space-y-4">
                <div><label className="text-sm font-medium mb-1 block">Name <span className="text-destructive">*</span></label>
                  <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Professional Photos" className={ICLASS} required /></div>
                <div><label className="text-sm font-medium mb-1 block">Description</label>
                  <input value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description (optional)" className={ICLASS} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium mb-1 block">Price <span className="text-destructive">*</span></label>
                    <input value={form.price} type="number" min="0" step="0.01" onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} placeholder="25" className={ICLASS} required /></div>
                  <div><label className="text-sm font-medium mb-1 block">Currency</label>
                    <select value={form.currency} onChange={(e) => setForm(f => ({ ...f, currency: e.target.value }))} className={ICLASS}>
                      <option value="USD">USD</option><option value="BRL">BRL</option><option value="EUR">EUR</option>
                    </select></div>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={createExtra.isPending}>
                  <Plus size={15} />{createExtra.isPending ? "Adding…" : "Add Extra"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
