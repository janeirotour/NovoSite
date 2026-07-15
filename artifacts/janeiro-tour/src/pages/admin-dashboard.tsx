import { useState, useRef, useCallback, useEffect } from "react";
  import { useLocation, useSearch } from "wouter";
  import { BlogConversionData, DEFAULT_BLOG_CONVERSION } from "@/components/blog/BlogConversionSection";
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
    useListAdminTourAvailability, useCreateAvailabilityEntry, useUpdateAvailabilityEntry, useDeleteAvailabilityEntry,
    useListAdminUsers, useChangeAdminPassword,
    useListGroupPrograms, useCreateGroupProgram, useUpdateGroupProgram, useDeleteGroupProgram,
    useListHotels, useCreateHotel, useUpdateHotel, useDeleteHotel,
    useListSpecialSeasons, useCreateSpecialSeason, useUpdateSpecialSeason, useDeleteSpecialSeason,
    useListB2bQuotes, useUpdateB2bQuote,
    useListB2bPricing, useUpdateB2bPricing,
    useListB2bTiers, useUpdateB2bTiers,
    getGetAdminMeQueryKey, getListToursQueryKey, getListDestinationsQueryKey,
    getListBlogPostsQueryKey, getListReviewsQueryKey, getListFaqsQueryKey,
    getGetSettingsQueryKey, getGetAdminStatsQueryKey, getListAdminUsersQueryKey,
    getListGroupProgramsQueryKey, getListHotelsQueryKey, getListSpecialSeasonsQueryKey,
    getListB2bQuotesQueryKey,
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
    CheckCircle2, Clock, AlertCircle, DollarSign, CalendarDays, Ban, Users, Boxes,
    Sparkles, Search, KeyRound, ShieldCheck, Building2, SlidersHorizontal,
    ChevronDown, TrendingUp, Award, Mail, Phone,
  } from "lucide-react";
  import { Calendar } from "@/components/ui/calendar";
  import { Popover as UIPopover, PopoverContent as UIPopoverContent, PopoverTrigger as UIPopoverTrigger } from "@/components/ui/popover";
  import { format as formatDate, addMonths, startOfMonth, endOfMonth } from "date-fns";

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

  // ─── AI text assist ──────────────────────────────────────────────────────

  function AiAssistButton({ field, context, onResult, label = "Gerar com IA" }: {
    field: string; context: Record<string, string>; onResult: (text: string) => void; label?: string;
  }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch("/api/ai/generate-text", {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field, context }),
        });
        const data = await res.json() as { text?: string; error?: string };
        if (data.text) { onResult(data.text); }
        else { setError(data.error ?? "Falhou"); }
      } catch { setError("Erro de rede"); }
      finally { setLoading(false); }
    };

    return (
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline"
          className="gap-1.5 text-violet-700 border-violet-200 hover:bg-violet-50 hover:border-violet-400 text-xs h-7 px-2"
          disabled={loading} onClick={generate}>
          {loading ? <RefreshCw size={11} className="animate-spin" /> : <Sparkles size={11} />}
          {loading ? "Gerando…" : label}
        </Button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }

  // ─── SEO analyzer (Rank Math-style) ─────────────────────────────────────

  function SeoAnalyzer({ title, description, content = "", keyword = "" }: {
    title: string; description: string; content?: string; keyword?: string;
  }) {
    type Check = { ok: boolean; label: string; detail: string };
    const checks: Check[] = [];
    const kw = keyword.toLowerCase().trim();

    const titleLen = title.length;
    const descLen = description.length;

    if (titleLen === 0) {
      checks.push({ ok: false, label: "SEO Title", detail: "Título SEO está vazio." });
    } else if (titleLen < 30) {
      checks.push({ ok: false, label: "SEO Title curto", detail: `Título tem ${titleLen} chars. Ideal: 50–60.` });
    } else if (titleLen > 60) {
      checks.push({ ok: false, label: "SEO Title longo", detail: `Título tem ${titleLen} chars. Ideal: 50–60.` });
    } else {
      checks.push({ ok: true, label: "SEO Title", detail: `${titleLen} chars — perfeito.` });
    }

    if (descLen === 0) {
      checks.push({ ok: false, label: "Meta Description", detail: "Meta description está vazia." });
    } else if (descLen < 100) {
      checks.push({ ok: false, label: "Meta Description curta", detail: `${descLen} chars. Ideal: 120–155.` });
    } else if (descLen > 160) {
      checks.push({ ok: false, label: "Meta Description longa", detail: `${descLen} chars. Ideal: 120–155.` });
    } else {
      checks.push({ ok: true, label: "Meta Description", detail: `${descLen} chars — ótimo.` });
    }

    if (kw) {
      const inTitle = title.toLowerCase().includes(kw);
      checks.push({ ok: inTitle, label: "Keyword no título", detail: inTitle ? `"${keyword}" encontrada no título.` : `"${keyword}" ausente no título.` });

      const inDesc = description.toLowerCase().includes(kw);
      checks.push({ ok: inDesc, label: "Keyword na descrição", detail: inDesc ? `"${keyword}" encontrada na descrição.` : `"${keyword}" ausente na descrição.` });

      if (content) {
        const inContent = content.toLowerCase().includes(kw);
        checks.push({ ok: inContent, label: "Keyword no conteúdo", detail: inContent ? "Keyword encontrada no conteúdo." : "Keyword ausente no conteúdo." });
      }
    }

    if (content) {
      const wordCount = content.trim().split(/\s+/).length;
      if (wordCount < 100) {
        checks.push({ ok: false, label: "Conteúdo curto", detail: `${wordCount} palavras. Mínimo recomendado: 300.` });
      } else {
        checks.push({ ok: true, label: "Comprimento do conteúdo", detail: `${wordCount} palavras — bem.` });
      }
    }

    const score = checks.length === 0 ? 0 : Math.round((checks.filter(c => c.ok).length / checks.length) * 100);
    const scoreColor = score >= 80 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-500";
    const barColor = score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
    const scoreLabel = score >= 80 ? "Bom" : score >= 50 ? "Pode melhorar" : "Fraco";

    return (
      <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Análise SEO</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${scoreColor}`}>{score}/100</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${score >= 80 ? "bg-green-100 text-green-700" : score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{scoreLabel}</span>
          </div>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${score}%` }} />
        </div>
        <div className="space-y-1.5">
          {checks.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              {c.ok
                ? <CheckCircle2 size={13} className="text-green-500 mt-0.5 shrink-0" />
                : <AlertCircle size={13} className="text-amber-500 mt-0.5 shrink-0" />}
              <span className={c.ok ? "text-muted-foreground" : "text-foreground"}>{c.detail}</span>
            </div>
          ))}
          {checks.length === 0 && <p className="text-xs text-muted-foreground">Preencha o título e a descrição SEO para ver a análise.</p>}
        </div>
      </div>
    );
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
      availableTimes: tour?.availableTimes ?? [],
      pricingRules: tour?.pricingRules ?? [],
      transportationPricing: tour?.transportationPricing ?? null,
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
          <div className="flex items-center justify-between">
            <div className="flex justify-between w-full"><Label>SEO Title</Label><span className="text-xs text-muted-foreground">{(form.seoTitle as string)?.length ?? 0}/60</span></div>
          </div>
          <Input value={form.seoTitle as string} onChange={e => set("seoTitle", e.target.value)} maxLength={60} placeholder="Ex: Cristo Redentor & Rio City Tour — Janeiro Tour & Travel" />
          <AiAssistButton field="seoTitle" context={{ title: form.title as string, destination: form.destination as string, overview: form.overview as string }} onResult={v => set("seoTitle", v.slice(0, 60))} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex justify-between w-full"><Label>SEO Meta Description</Label><span className="text-xs text-muted-foreground">{(form.seoDescription as string)?.length ?? 0}/160</span></div>
          </div>
          <Textarea rows={2} value={form.seoDescription as string} onChange={e => set("seoDescription", e.target.value)} maxLength={160} placeholder="Ex: Join our expert local guide for a 7-hour Rio tour..." />
          <AiAssistButton field="seoDescription" context={{ title: form.title as string, destination: form.destination as string, overview: form.overview as string }} onResult={v => set("seoDescription", v.slice(0, 160))} />
        </div>
        <SeoAnalyzer title={form.seoTitle as string} description={form.seoDescription as string} content={form.overview as string} keyword={form.destination as string} />

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

        {/* ─── Available Times ─────────────────────────────────────── */}
        <SectionLabel>Available Start Times</SectionLabel>
        <p className="text-xs text-muted-foreground -mt-1">Set which start times are available for this tour. Leave empty to show all standard time slots.</p>
        {(arrVal("availableTimes") as string[]).map((t, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="time"
              value={t}
              onChange={e => setArr("availableTimes", i, e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeArr("availableTimes", i)}><Trash2 size={14} /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => addArr("availableTimes")}><Plus size={13} />Add Time Slot</Button>

        {/* ─── Pricing Rules ────────────────────────────────────────── */}
        <SectionLabel>Dynamic Pricing Rules</SectionLabel>
        <p className="text-xs text-muted-foreground -mt-1">Define price tiers by group size. Leave empty to use the flat "Price From" rate for all group sizes.</p>
        {(() => {
          type PricingTier = { label: string; minPax: number; maxPax: number | null; pricePerPerson: number; currency: string };
          const rules = (form.pricingRules as PricingTier[]) ?? [];
          const setRules = (r: PricingTier[]) => set("pricingRules", r);
          return (
            <>
              {rules.map((tier, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Tier {i + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setRules(rules.filter((_, j) => j !== i))}><Trash2 size={13} /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1 col-span-2"><Label className="text-xs">Label (shown to customer)</Label><Input value={tier.label} onChange={e => setRules(rules.map((r, j) => j === i ? { ...r, label: e.target.value } : r))} placeholder="e.g. Per Person, Group Rate, Private Tour" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1"><Label className="text-xs">Min Pax</Label><Input type="number" min={1} value={tier.minPax} onChange={e => setRules(rules.map((r, j) => j === i ? { ...r, minPax: parseInt(e.target.value) || 1 } : r))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Max Pax (blank = no limit)</Label><Input type="number" min={1} value={tier.maxPax ?? ""} onChange={e => setRules(rules.map((r, j) => j === i ? { ...r, maxPax: e.target.value ? parseInt(e.target.value) : null } : r))} placeholder="∞" /></div>
                    <div className="space-y-1"><Label className="text-xs">Price/Person (USD)</Label><Input type="number" min={0} step={0.01} value={tier.pricePerPerson} onChange={e => setRules(rules.map((r, j) => j === i ? { ...r, pricePerPerson: parseFloat(e.target.value) || 0 } : r))} /></div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setRules([...rules, { label: "", minPax: 1, maxPax: null, pricePerPerson: Number(form.priceFrom) || 50, currency: "USD" }])}><Plus size={13} />Add Pricing Tier</Button>
            </>
          );
        })()}

        {/* ─── Transportation Add-On ────────────────────────────────── */}
        <SectionLabel>Round-Trip Transportation Add-On</SectionLabel>
        <p className="text-xs text-muted-foreground -mt-1">Optional transportation from guest accommodation to tour meeting point.</p>
        {(() => {
          type TransTier = { minPax: number; maxPax: number | null; vehicle: string; price: number; currency: string };
          type TransPricing = { enabled: boolean; name: string; description: string; tiers: TransTier[] };
          const trans = (form.transportationPricing as TransPricing | null) ?? { enabled: false, name: "Round-Trip Private Transportation", description: "Private round-trip transportation between your accommodation and the tour meeting point.", tiers: [] };
          const setTrans = (t: TransPricing) => set("transportationPricing", t);
          return (
            <>
              <div className="flex items-center gap-2">
                <Switch checked={trans.enabled} onCheckedChange={v => setTrans({ ...trans, enabled: v })} />
                <Label>Enable transportation add-on for this tour</Label>
              </div>
              {trans.enabled && (
                <>
                  <div className="space-y-1"><Label className="text-xs">Add-on Name</Label><Input value={trans.name} onChange={e => setTrans({ ...trans, name: e.target.value })} /></div>
                  <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea rows={2} value={trans.description} onChange={e => setTrans({ ...trans, description: e.target.value })} /></div>
                  <p className="text-xs font-semibold text-muted-foreground pt-1">Vehicle Tiers by Group Size</p>
                  {trans.tiers.map((tier, i) => (
                    <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Tier {i + 1}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setTrans({ ...trans, tiers: trans.tiers.filter((_, j) => j !== i) })}><Trash2 size={13} /></Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1 col-span-2"><Label className="text-xs">Vehicle</Label><Input value={tier.vehicle} onChange={e => setTrans({ ...trans, tiers: trans.tiers.map((t, j) => j === i ? { ...t, vehicle: e.target.value } : t) })} placeholder="e.g. Private Car" /></div>
                        <div className="space-y-1"><Label className="text-xs">Min Pax</Label><Input type="number" min={1} value={tier.minPax} onChange={e => setTrans({ ...trans, tiers: trans.tiers.map((t, j) => j === i ? { ...t, minPax: parseInt(e.target.value) || 1 } : t) })} /></div>
                        <div className="space-y-1"><Label className="text-xs">Max Pax</Label><Input type="number" min={1} value={tier.maxPax ?? ""} onChange={e => setTrans({ ...trans, tiers: trans.tiers.map((t, j) => j === i ? { ...t, maxPax: e.target.value ? parseInt(e.target.value) : null } : t) })} placeholder="∞" /></div>
                        <div className="space-y-1 col-span-2"><Label className="text-xs">Total Price (USD, per vehicle)</Label><Input type="number" min={0} value={tier.price} onChange={e => setTrans({ ...trans, tiers: trans.tiers.map((t, j) => j === i ? { ...t, price: parseFloat(e.target.value) || 0 } : t) })} /></div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setTrans({ ...trans, tiers: [...trans.tiers, { minPax: 1, maxPax: null, vehicle: "Private Car", price: 120, currency: "USD" }] })}><Plus size={13} />Add Vehicle Tier</Button>
                </>
              )}
            </>
          );
        })()}

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
      "/packages": "Packages — manage from the Packages tab above.",
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
    const search = useSearch();
    const activeTab = new URLSearchParams(search).get("tab") ?? "overview";
    const { data: me, isLoading: loadingMe } = useGetAdminMe();
    const { data: stats } = useGetAdminStats();
    const { data: reservationsData } = useListReservations();

    if (loadingMe) return (
      <div className="flex items-center justify-center py-32">
        <Skeleton className="w-96 h-24 rounded-2xl" />
      </div>
    );
    if (!me) return null;

    const reservations = reservationsData ?? [];
    const recentReservations = [...reservations]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    const totalRevenue = reservations
      .filter(r => r.paymentStatus === "paid")
      .reduce((s, r) => s + Number(r.totalAmount), 0);

    const paymentBadge = (s: string) => {
      if (s === "paid") return "bg-green-100 text-green-700";
      if (s === "pending") return "bg-amber-100 text-amber-700";
      if (s === "failed") return "bg-red-100 text-red-700";
      return "bg-gray-100 text-gray-600";
    };

    const nav = (tab: string) => setLocation(`/admin/dashboard?tab=${tab}`);

    const PageHeader = ({ title, description }: { title: string; description?: string }) => (
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    );

    const renderContent = () => {
      switch (activeTab) {
        case "overview":
          return (
            <div className="space-y-7">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, <span className="font-medium text-gray-700">{me.username}</span>. Here's your business overview.</p>
              </div>

              {/* Primary KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: `$${totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, icon: DollarSign, iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
                  { label: "Reservations", value: reservations.length, icon: ClipboardList, iconColor: "text-blue-600", iconBg: "bg-blue-50" },
                  { label: "Published Tours", value: stats?.publishedTours ?? 0, icon: Globe, iconColor: "text-violet-600", iconBg: "bg-violet-50" },
                  { label: "Avg Rating", value: stats ? `${Number(stats.averageRating).toFixed(1)} ★` : "—", icon: Star, iconColor: "text-amber-600", iconBg: "bg-amber-50" },
                ].map(({ label, value, icon: Icon, iconColor, iconBg }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Secondary stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Total Tours", value: stats?.totalTours ?? 0, icon: Package },
                  { label: "Destinations", value: stats?.totalDestinations ?? 0, icon: MapPin },
                  { label: "Reviews", value: stats?.totalReviews ?? 0, icon: Star },
                  { label: "Blog Posts", value: stats?.totalBlogPosts ?? 0, icon: FileText },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-300 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-lg font-bold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent reservations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                  <h2 className="font-semibold text-gray-900">Recent Reservations</h2>
                  <button
                    onClick={() => nav("reservations")}
                    className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {recentReservations.length === 0 ? (
                  <div className="py-14 text-center text-gray-400 text-sm">No reservations yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Customer</th>
                          <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Tour</th>
                          <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                          <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Payment</th>
                          <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReservations.map((r, i) => (
                          <tr key={r.id} className={`hover:bg-gray-50/70 transition-colors ${i < recentReservations.length - 1 ? "border-b border-gray-50" : ""}`}>
                            <td className="px-6 py-3.5">
                              <p className="font-medium text-gray-900">{r.customerName}</p>
                              <p className="text-xs text-gray-400">{r.customerEmail}</p>
                            </td>
                            <td className="px-6 py-3.5 text-gray-600 max-w-[180px] truncate">{r.tourTitle}</td>
                            <td className="px-6 py-3.5 font-semibold text-gray-900">${Number(r.totalAmount).toFixed(0)}</td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentBadge(r.paymentStatus)}`}>
                                {r.paymentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick navigation */}
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { tab: "tours", label: "Manage Tours", icon: Package, desc: "Add & edit tour listings" },
                    { tab: "reservations", label: "View Bookings", icon: ClipboardList, desc: "All reservations" },
                    { tab: "blog", label: "Travel Guide", icon: FileText, desc: "Blog posts & articles" },
                    { tab: "settings", label: "SEO Settings", icon: Settings, desc: "Site SEO & meta tags" },
                  ].map(({ tab, label, icon: Icon, desc }) => (
                    <button
                      key={tab}
                      onClick={() => nav(tab)}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-primary/40 hover:shadow-md transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="font-semibold text-sm text-gray-900">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );

        case "tours":         return <><PageHeader title="Tours" description="Manage your tour listings, pricing, and availability." /><ToursTab /></>;
        case "destinations":  return <><PageHeader title="Destinations" description="Manage destination pages and content." /><DestinationsTab /></>;
        case "blog":          return <><PageHeader title="Travel Guide" description="Manage blog posts and travel articles." /><BlogTab /></>;
        case "reviews":       return <><PageHeader title="Reviews & Ratings" description="Manage customer reviews and testimonials." /><ReviewsTab /></>;
        case "faqs":          return <><PageHeader title="FAQs" description="Manage frequently asked questions." /><FaqsTab /></>;
        case "homepage":      return <><PageHeader title="Homepage Content" description="Edit hero text, CTAs and contact information." /><HomepageTab /></>;
        case "settings":      return <><PageHeader title="Settings & SEO" description="Global site settings, SEO metadata and social links." /><SettingsTab /></>;
        case "reservations":  return <><PageHeader title="Reservations" description="View and manage all tour bookings." /><ReservationsTab /></>;
        case "packages":        return <><PageHeader title="Packages" description="Manage multi-tour travel packages." /><PackagesTab /></>;
        case "group-programs":  return <><PageHeader title="Group Programs" description="Manage B2B group travel programs." /><GroupProgramsTab /></>;
        case "hotels":         return <><PageHeader title="Hotels & Accommodation" description="Manage the global hotel catalog. Active hotels appear automatically on all package pages." /><HotelsTab /></>;
        case "extras":        return <><PageHeader title="Tour Extras" description="Manage add-ons and optional upgrades." /><ExtrasTab /></>;
        case "availability":  return <><PageHeader title="Availability" description="Manage tour schedules and available dates." /><AvailabilityTab /></>;
        case "editor":        return <><PageHeader title="Page Editor" description="Live preview and edit any page on the site." /><PageEditorTab /></>;
        case "blog-monetization": return <><PageHeader title="Blog Monetization" description="Manage conversion sections and affiliate links shown on all blog and travel guide pages." /><BlogMonetizationTab /></>;
        case "users":         return <><PageHeader title="Admin Users" description="Manage admin accounts and change passwords." /><UsersTab /></>;
        case "b2b-quotes":    return <><PageHeader title="B2B Quotes" description="Manage group travel quote requests from travel agents and operators." /><B2bQuotesTab /></>;
        case "b2b-pricing":   return <><PageHeader title="B2B Pricing & Tiers" description="Configure base pricing settings and group discount tiers for the estimate engine." /><B2bPricingTab /></>;
        default:              return null;
      }
    };

    return (
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    );
  }

  // ─── packages tab ────────────────────────────────────────────────────────

  type AdminPackage = {
    id: number; slug: string; title: string; subtitle?: string | null;
    description: string; badge?: string | null; badgeColor?: string | null;
    priceFrom: string; originalPrice?: string | null; savingsPercent?: number | null;
    imageUrl: string; durationLabel?: string | null; groupSizeLabel?: string | null;
    highlights: string[]; includedItems: string[]; toursIncluded: unknown[];
    published: boolean; sortOrder: number;
  };

  const emptyPkg: Omit<AdminPackage, "id"> = {
    slug: "", title: "", subtitle: "", description: "",
    badge: "", badgeColor: "green", priceFrom: "", originalPrice: "",
    savingsPercent: undefined as unknown as null, imageUrl: "", durationLabel: "",
    groupSizeLabel: "", highlights: [], includedItems: [], toursIncluded: [],
    published: true, sortOrder: 10,
  };

  function PackageForm({ pkg, onSave, onClose }: {
    pkg?: AdminPackage; onSave: (data: Omit<AdminPackage, "id">) => void; onClose: () => void;
  }) {
    const [form, setForm] = useState<Omit<AdminPackage, "id">>(pkg ? {
      slug: pkg.slug, title: pkg.title, subtitle: pkg.subtitle ?? "",
      description: pkg.description, badge: pkg.badge ?? "", badgeColor: pkg.badgeColor ?? "green",
      priceFrom: pkg.priceFrom, originalPrice: pkg.originalPrice ?? "",
      savingsPercent: pkg.savingsPercent ?? null,
      imageUrl: pkg.imageUrl, durationLabel: pkg.durationLabel ?? "",
      groupSizeLabel: pkg.groupSizeLabel ?? "",
      highlights: pkg.highlights ?? [], includedItems: pkg.includedItems ?? [],
      toursIncluded: pkg.toursIncluded ?? [],
      published: pkg.published, sortOrder: pkg.sortOrder,
    } : emptyPkg);

    const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
    const listToArray = (s: string) => s.split("\n").map(l => l.trim()).filter(Boolean);
    const arrayToList = (a: unknown[]) => (a as string[]).join("\n");

    type TourEntry = { slug: string; title: string; duration: string; priceFrom?: number; description?: string };
    const getTours = () => (form.toursIncluded as TourEntry[]) ?? [];
    const setTourEntry = (i: number, field: keyof TourEntry, val: string | number) => {
      const arr = [...getTours()]; arr[i] = { ...arr[i], [field]: val }; set("toursIncluded", arr);
    };
    const addTourEntry = () => set("toursIncluded", [...getTours(), { slug: "", title: "", duration: "", priceFrom: 0, description: "" }]);
    const removeTourEntry = (i: number) => set("toursIncluded", getTours().filter((_, j) => j !== i));

    return (
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">

        {/* ── Identity ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Slug *</Label>
            <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="afro-rio-soul" />
          </div>
          <div className="space-y-1">
            <Label>Sort Order</Label>
            <Input type="number" value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-1">
          <Label>Title *</Label>
          <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Afro Rio Soul" />
        </div>
        <div className="space-y-1">
          <Label>Subtitle</Label>
          <Input value={form.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} placeholder="Cultural Immersion — Rio's African Heart" />
        </div>
        <div className="space-y-1">
          <Label>Description *</Label>
          <Textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} />
        </div>

        {/* ── Photo ── */}
        <div className="space-y-1">
          <Label>Package Photo *</Label>
          <ImageUploader
            label="Package Image"
            value={form.imageUrl}
            onChange={url => set("imageUrl", url)}
          />
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="mt-2 rounded-lg h-32 w-full object-cover border" />
          )}
        </div>

        {/* ── Pricing ── */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Price From (USD) *</Label>
            <Input value={form.priceFrom} onChange={e => set("priceFrom", e.target.value)} placeholder="289" />
          </div>
          <div className="space-y-1">
            <Label>Original Price</Label>
            <Input value={form.originalPrice ?? ""} onChange={e => set("originalPrice", e.target.value)} placeholder="395" />
          </div>
          <div className="space-y-1">
            <Label>Savings %</Label>
            <Input type="number" value={form.savingsPercent ?? ""} onChange={e => set("savingsPercent", e.target.value ? Number(e.target.value) : null)} placeholder="27" />
          </div>
        </div>

        {/* ── Labels ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Duration Label</Label>
            <Input value={form.durationLabel ?? ""} onChange={e => set("durationLabel", e.target.value)} placeholder="2–3 days" />
          </div>
          <div className="space-y-1">
            <Label>Group Size Label</Label>
            <Input value={form.groupSizeLabel ?? ""} onChange={e => set("groupSizeLabel", e.target.value)} placeholder="Up to 45 people" />
          </div>
        </div>

        {/* ── Badge ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Badge</Label>
            <Input value={form.badge ?? ""} onChange={e => set("badge", e.target.value)} placeholder="Best Seller" />
          </div>
          <div className="space-y-1">
            <Label>Badge Color</Label>
            <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.badgeColor ?? "green"} onChange={e => set("badgeColor", e.target.value)}>
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="orange">Orange</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="red">Red</option>
            </select>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="space-y-1">
          <Label>Highlights (one per line)</Label>
          <Textarea rows={4} value={arrayToList(form.highlights)} onChange={e => set("highlights", listToArray(e.target.value))} placeholder={"Afro-Brazilian History & Immersion Walking Tour (4h)\nFavela Tour with a community-born guide (3h)"} />
        </div>
        <div className="space-y-1">
          <Label>Included Items (one per line)</Label>
          <Textarea rows={4} value={arrayToList(form.includedItems)} onChange={e => set("includedItems", listToArray(e.target.value))} placeholder={"3 curated tours\nRound-trip transport\nAirport arrival & departure transfers"} />
        </div>

        {/* ── Tours Included ── */}
        <div className="space-y-2">
          <Label>Tours Included in Package</Label>
          <p className="text-xs text-muted-foreground -mt-1">Add the individual tours that make up this package</p>
          {getTours().map((t, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tour {i + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeTourEntry(i)}><Trash2 size={13} /></Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Title *</Label>
                  <Input value={t.title} onChange={e => setTourEntry(i, "title", e.target.value)} placeholder="Little Africa Tour" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Slug *</Label>
                  <Input value={t.slug} onChange={e => setTourEntry(i, "slug", e.target.value)} placeholder="little-africa" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Duration</Label>
                  <Input value={t.duration} onChange={e => setTourEntry(i, "duration", e.target.value)} placeholder="4 hours" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price From (USD)</Label>
                  <Input type="number" value={t.priceFrom ?? ""} onChange={e => setTourEntry(i, "priceFrom", parseFloat(e.target.value) || 0)} placeholder="95" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Short Description (optional)</Label>
                <Input value={t.description ?? ""} onChange={e => setTourEntry(i, "description", e.target.value)} placeholder="Cultural walking tour through historic Afro-Brazilian neighborhoods" />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addTourEntry}>
            <Plus size={13} /> Add Tour to Package
          </Button>
        </div>

        {/* ── Published ── */}
        <div className="flex items-center gap-3 py-2">
          <Switch checked={form.published} onCheckedChange={v => set("published", v)} />
          <Label>Published</Label>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => onSave(form)}
            className="gap-1.5"
          >
            <Save size={14} /> Save Package
          </Button>
        </div>
      </div>
    );
  }

  function PackagesTab() {
    const queryClient = useQueryClient();
    const [packages, setPackages] = useState<AdminPackage[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [editPkg, setEditPkg] = useState<AdminPackage | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    async function load() {
      setLoading(true);
      const r = await fetch("/api/admin/packages", { credentials: "include" });
      if (r.ok) setPackages(await r.json());
      setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleSave(data: Omit<AdminPackage, "id">, id?: number) {
      setSaving(true);
      const url = id ? `/api/admin/packages/${id}` : "/api/admin/packages";
      const method = id ? "PUT" : "POST";
      await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setSaving(false);
      setEditPkg(null);
      setCreateOpen(false);
      load();
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    }

    async function handleDelete(id: number) {
      await fetch(`/api/admin/packages/${id}`, { method: "DELETE", credentials: "include" });
      load();
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Packages ({packages?.length ?? 0})</h2>
            <p className="text-sm text-muted-foreground mt-1">Multi-day bundled packages with pricing, badge, highlights and itinerary</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1"><Plus size={15} /> Add Package</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Add New Package</DialogTitle></DialogHeader>
              <PackageForm onSave={data => handleSave(data)} onClose={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Price/pax</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : packages?.map(pkg => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {pkg.imageUrl && <img src={pkg.imageUrl} alt="" className="w-12 h-9 rounded object-cover flex-shrink-0" />}
                      <div>
                        <p className="font-medium text-sm">{pkg.title}</p>
                        {pkg.subtitle && <p className="text-xs text-muted-foreground">{pkg.subtitle}</p>}
                        <p className="text-xs text-muted-foreground font-mono">{pkg.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-green-600">${Number(pkg.priceFrom).toFixed(0)}</TableCell>
                  <TableCell>
                    {pkg.badge
                      ? <Badge className="text-xs bg-green-100 text-green-700 border-green-200">{pkg.badge}</Badge>
                      : <span className="text-muted-foreground text-xs">—</span>}
                  </TableCell>
                  <TableCell>
                    {pkg.published
                      ? <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Published</Badge>
                      : <Badge variant="outline" className="text-muted-foreground text-xs">Draft</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{pkg.sortOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/packages/${pkg.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" title="View on site"><ExternalLink size={14} /></Button>
                      </a>
                      <Dialog open={editPkg?.id === pkg.id} onOpenChange={open => !open && setEditPkg(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setEditPkg(pkg)}><Pencil size={15} /></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader><DialogTitle>Edit Package: {pkg.title}</DialogTitle></DialogHeader>
                          {editPkg && (
                            <PackageForm
                              pkg={editPkg}
                              onSave={data => handleSave(data, pkg.id)}
                              onClose={() => setEditPkg(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <ConfirmDelete label="package" onConfirm={() => handleDelete(pkg.id)} />
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

  // ─── group programs tab ──────────────────────────────────────────────────

  function GroupProgramsTab() {
    const queryClient = useQueryClient();
    const { data: programs, isLoading } = useListGroupPrograms();
    const createProgram = useCreateGroupProgram();
    const updateProgram = useUpdateGroupProgram();
    const deleteProgram = useDeleteGroupProgram();

    type GPForm = {
      slug: string; title: string; subtitle: string; duration: string;
      heroImageUrl: string; overview: string; targetAudience: string;
      highlights: string; whatsIncluded: string; whatsNotIncluded: string;
      transportation: string; pdfUrl: string; whatsappNumber: string;
      landOnlyFromPrice: string; completeFromPrice: string;
      currency: string; published: boolean; sortOrder: string;
    };

    const EMPTY: GPForm = {
      slug: "", title: "", subtitle: "", duration: "5 days / 4 nights",
      heroImageUrl: "", overview: "", targetAudience: "",
      highlights: "", whatsIncluded: "", whatsNotIncluded: "",
      transportation: "", pdfUrl: "", whatsappNumber: "",
      landOnlyFromPrice: "", completeFromPrice: "",
      currency: "USD", published: false, sortOrder: "0",
    };

    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<GPForm>(EMPTY);
    const [dialogOpen, setDialogOpen] = useState(false);

    const invalidate = () => queryClient.invalidateQueries({ queryKey: getListGroupProgramsQueryKey() });

    function openCreate() { setEditId(null); setForm(EMPTY); setDialogOpen(true); }
    function openEdit(p: typeof programs extends (infer T)[] | undefined ? T : never) {
      if (!p) return;
      setEditId(p.id);
      setForm({
        slug: p.slug, title: p.title, subtitle: p.subtitle ?? "",
        duration: p.duration, heroImageUrl: p.heroImageUrl, overview: p.overview,
        targetAudience: p.targetAudience,
        highlights: (p.highlights ?? []).join("\n"),
        whatsIncluded: (p.whatsIncluded ?? []).join("\n"),
        whatsNotIncluded: (p.whatsNotIncluded ?? []).join("\n"),
        transportation: p.transportation ?? "",
        pdfUrl: p.pdfUrl ?? "", whatsappNumber: p.whatsappNumber ?? "",
        landOnlyFromPrice: String(p.landOnlyFromPrice),
        completeFromPrice: String(p.completeFromPrice),
        currency: p.currency ?? "USD",
        published: p.published ?? false,
        sortOrder: String(p.sortOrder ?? 0),
      });
      setDialogOpen(true);
    }

    function handleSubmit() {
      const payload = {
        slug: form.slug, title: form.title, subtitle: form.subtitle || undefined,
        duration: form.duration, heroImageUrl: form.heroImageUrl, overview: form.overview,
        targetAudience: form.targetAudience,
        highlights: form.highlights.split("\n").map(s => s.trim()).filter(Boolean),
        whatsIncluded: form.whatsIncluded.split("\n").map(s => s.trim()).filter(Boolean),
        whatsNotIncluded: form.whatsNotIncluded.split("\n").map(s => s.trim()).filter(Boolean),
        transportation: form.transportation || undefined,
        pdfUrl: form.pdfUrl || undefined, whatsappNumber: form.whatsappNumber || undefined,
        landOnlyFromPrice: parseFloat(form.landOnlyFromPrice),
        completeFromPrice: parseFloat(form.completeFromPrice),
        currency: form.currency, published: form.published,
        sortOrder: parseInt(form.sortOrder) || 0,
        suggestedItinerary: [], accommodationOptions: [], optionalExperiences: [],
        pricingLandOnly: [], pricingComplete: [],
      };
      if (editId) {
        updateProgram.mutate({ id: editId, data: payload }, { onSuccess: () => { setDialogOpen(false); invalidate(); } });
      } else {
        createProgram.mutate({ data: payload }, { onSuccess: () => { setDialogOpen(false); invalidate(); } });
      }
    }

    const F = (field: keyof GPForm) => ({
      value: form[field] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [field]: e.target.value })),
    });

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">B2B multi-day programs for incentive groups, corporates, and affinity travel.</p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> New Program
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
        ) : !programs?.length ? (
          <div className="text-center py-16 text-muted-foreground text-sm border-2 border-dashed border-gray-200 rounded-2xl">
            No group programs yet. Click "New Program" to create one.
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Land Only</TableHead>
                  <TableHead>Complete</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.duration}</TableCell>
                    <TableCell className="text-sm font-semibold">${p.landOnlyFromPrice}</TableCell>
                    <TableCell className="text-sm font-semibold text-primary">${p.completeFromPrice}</TableCell>
                    <TableCell>
                      <Badge variant={p.published ? "default" : "secondary"} className="text-xs">
                        {p.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(p)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <ConfirmDelete
                          label={p.title}
                          onConfirm={() => deleteProgram.mutate({ id: p.id }, { onSuccess: invalidate })}
                        />
                        <a href={`/group-travel/${p.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Group Program" : "New Group Program"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Title *</Label>
                  <Input placeholder="Black Heritage Rio Experience" {...F("title")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug *</Label>
                  <Input placeholder="black-heritage-rio" {...F("slug")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Subtitle</Label>
                <Input placeholder="Short tagline" {...F("subtitle")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Duration *</Label>
                  <Input placeholder="5 days / 4 nights" {...F("duration")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Input placeholder="USD" {...F("currency")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Hero Image URL *</Label>
                <Input placeholder="https://..." {...F("heroImageUrl")} />
              </div>
              <div className="space-y-1.5">
                <Label>Overview *</Label>
                <Textarea rows={3} placeholder="Program overview…" {...F("overview")} />
              </div>
              <div className="space-y-1.5">
                <Label>Target Audience *</Label>
                <Input placeholder="Incentive groups, corporate travel, affinity groups" {...F("targetAudience")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Land Only From (USD) *</Label>
                  <Input type="number" placeholder="990" {...F("landOnlyFromPrice")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Complete From (USD) *</Label>
                  <Input type="number" placeholder="1690" {...F("completeFromPrice")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Highlights (one per line)</Label>
                <Textarea rows={4} placeholder="Afro-Brazilian cultural immersion&#10;Private Christ the Redeemer visit&#10;Favela community partnership" {...F("highlights")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>What's Included (one per line)</Label>
                  <Textarea rows={4} {...F("whatsIncluded")} />
                </div>
                <div className="space-y-1.5">
                  <Label>What's Not Included (one per line)</Label>
                  <Textarea rows={4} {...F("whatsNotIncluded")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Transportation</Label>
                <Textarea rows={2} placeholder="Private A/C coach for all transfers…" {...F("transportation")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>PDF Brochure URL</Label>
                  <Input placeholder="https://..." {...F("pdfUrl")} />
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp Number</Label>
                  <Input placeholder="+5521999999999" {...F("whatsappNumber")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Sort Order</Label>
                  <Input type="number" {...F("sortOrder")} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={form.published}
                    onCheckedChange={v => setForm(f => ({ ...f, published: v }))}
                    id="gp-published"
                  />
                  <Label htmlFor="gp-published">Published</Label>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createProgram.isPending || updateProgram.isPending}
                  className="gap-1.5"
                >
                  {(createProgram.isPending || updateProgram.isPending) ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {editId ? "Save Changes" : "Create Program"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                      <a href={`/tours/${tour.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" title="View on site"><ExternalLink size={14} /></Button>
                      </a>
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
                        <a href={`/destinations/${dest.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" title="View on site"><ExternalLink size={14} /></Button>
                        </a>
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
              <div className="space-y-1">
                <div className="flex items-center justify-between"><Label>Excerpt — English *</Label><AiAssistButton field="excerpt" context={{ title: str("title"), content: str("content").slice(0, 300) }} onResult={v => onChange("excerpt", v.slice(0, 200))} /></div>
                <Textarea rows={2} value={str("excerpt")} onChange={e => onChange("excerpt", e.target.value)} placeholder="Short description for blog listing" />
              </div>
              <div className="space-y-1"><Label>Content — English *</Label><MarkdownEditor value={str("content")} onChange={v => onChange("content", v)} placeholder="Write in Markdown… **bold**, *italic*, ![alt](url), [link text](url)" /></div>
              <div className="space-y-2 mt-1">
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Title — EN</Label><span className="text-xs text-muted-foreground">{str("seoTitle").length}/60</span></div>
                  <Input value={str("seoTitle")} onChange={e => onChange("seoTitle", e.target.value)} maxLength={60} placeholder="Ex: Best Places in Brazil — Janeiro Travel Guide" />
                  <AiAssistButton field="seoTitle" context={{ title: str("title"), excerpt: str("excerpt") }} onResult={v => onChange("seoTitle", v.slice(0, 60))} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Description — EN</Label><span className="text-xs text-muted-foreground">{str("seoDescription").length}/160</span></div>
                  <Textarea rows={2} value={str("seoDescription")} onChange={e => onChange("seoDescription", e.target.value)} maxLength={160} placeholder="Ex: Discover the best travel spots in Brazil with our local experts..." />
                  <AiAssistButton field="seoDescription" context={{ title: str("title"), excerpt: str("excerpt") }} onResult={v => onChange("seoDescription", v.slice(0, 160))} />
                </div>
                <SeoAnalyzer title={str("seoTitle")} description={str("seoDescription")} content={str("content")} keyword={str("title").split(" ").slice(0, 3).join(" ")} />
              </div>
            </>)}
            {lang === "es" && (<>
              <div className="space-y-1"><Label>Título — Español</Label><Input value={str("titleEs")} onChange={e => onChange("titleEs", e.target.value)} placeholder="Título del artículo" /></div>
              <div className="space-y-1"><Label>Extracto — Español</Label><Textarea rows={2} value={str("excerptEs")} onChange={e => onChange("excerptEs", e.target.value)} placeholder="Descripción corta" /></div>
              <div className="space-y-1"><Label>Contenido — Español</Label><MarkdownEditor value={str("contentEs")} onChange={v => onChange("contentEs", v)} placeholder="Escribe en Markdown… **negrita**, *cursiva*, ![alt](url), [texto](url)" /></div>
              <div className="space-y-2 mt-1">
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Título — ES</Label><span className="text-xs text-muted-foreground">{str("seoTitleEs").length}/60</span></div>
                  <Input value={str("seoTitleEs")} onChange={e => onChange("seoTitleEs", e.target.value)} maxLength={60} />
                  <AiAssistButton field="seoTitle" context={{ title: str("titleEs") || str("title"), excerpt: str("excerptEs") || str("excerpt"), lang: "Spanish" }} onResult={v => onChange("seoTitleEs", v.slice(0, 60))} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Descripción — ES</Label><span className="text-xs text-muted-foreground">{str("seoDescriptionEs").length}/160</span></div>
                  <Textarea rows={2} value={str("seoDescriptionEs")} onChange={e => onChange("seoDescriptionEs", e.target.value)} maxLength={160} />
                  <AiAssistButton field="seoDescription" context={{ title: str("titleEs") || str("title"), excerpt: str("excerptEs") || str("excerpt"), lang: "Spanish" }} onResult={v => onChange("seoDescriptionEs", v.slice(0, 160))} />
                </div>
                <SeoAnalyzer title={str("seoTitleEs")} description={str("seoDescriptionEs")} content={str("contentEs")} />
              </div>
            </>)}
            {lang === "pt" && (<>
              <div className="space-y-1"><Label>Título — Português</Label><Input value={str("titlePt")} onChange={e => onChange("titlePt", e.target.value)} placeholder="Título do artigo" /></div>
              <div className="space-y-1"><Label>Excerto — Português</Label><Textarea rows={2} value={str("excerptPt")} onChange={e => onChange("excerptPt", e.target.value)} placeholder="Descrição curta" /></div>
              <div className="space-y-1"><Label>Conteúdo — Português</Label><MarkdownEditor value={str("contentPt")} onChange={v => onChange("contentPt", v)} placeholder="Escreva em Markdown… **negrito**, *itálico*, ![alt](url), [texto](url)" /></div>
              <div className="space-y-2 mt-1">
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Título — PT</Label><span className="text-xs text-muted-foreground">{str("seoTitlePt").length}/60</span></div>
                  <Input value={str("seoTitlePt")} onChange={e => onChange("seoTitlePt", e.target.value)} maxLength={60} />
                  <AiAssistButton field="seoTitle" context={{ title: str("titlePt") || str("title"), excerpt: str("excerptPt") || str("excerpt"), lang: "Brazilian Portuguese" }} onResult={v => onChange("seoTitlePt", v.slice(0, 60))} />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between"><Label>SEO Descrição — PT</Label><span className="text-xs text-muted-foreground">{str("seoDescriptionPt").length}/160</span></div>
                  <Textarea rows={2} value={str("seoDescriptionPt")} onChange={e => onChange("seoDescriptionPt", e.target.value)} maxLength={160} />
                  <AiAssistButton field="seoDescription" context={{ title: str("titlePt") || str("title"), excerpt: str("excerptPt") || str("excerpt"), lang: "Brazilian Portuguese" }} onResult={v => onChange("seoDescriptionPt", v.slice(0, 160))} />
                </div>
                <SeoAnalyzer title={str("seoTitlePt")} description={str("seoDescriptionPt")} content={str("contentPt")} />
              </div>
            </>)}
          </div>
        </div>
        <SectionLabel>Images</SectionLabel>
        <ImageUploader value={str("imageUrl")} onChange={v => onChange("imageUrl", v)} label="Featured Image *" />
        <div className="space-y-2">
          <Label>Gallery Images</Label>
          <p className="text-xs text-muted-foreground">Additional images displayed within the article. Upload or paste URLs.</p>
          {imgs().map((img, i) => (
            <div key={i} className="border rounded-lg p-3 space-y-2 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Image {i + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => onChange("galleryImages", imgs().filter((_, idx) => idx !== i))}><Trash2 size={13} /></Button>
              </div>
              <ImageUploader
                label={`Gallery Image ${i + 1}`}
                value={img}
                onChange={v => { const a = [...imgs()]; a[i] = v; onChange("galleryImages", a); }}
              />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => onChange("galleryImages", [...imgs(), ""])}>
            <Plus size={13} /> Add Gallery Image
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
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" title="View on site"><ExternalLink size={14} /></Button>
                        </a>
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
    const invalidate = () => queryClient.invalidateQueries({ queryKey: getListFaqsQueryKey() });
    const { data: faqs, isLoading } = useListFaqs({ includeDisabled: true });
    const deleteFaq = useDeleteFaq({ mutation: { onSuccess: invalidate } });
    const updateFaq = useUpdateFaq({ mutation: { onSuccess: invalidate } });
    const createFaq = useCreateFaq({ mutation: { onSuccess: invalidate } });
    type Faq = NonNullable<typeof faqs>[number];
    const [editFaq, setEditFaq] = useState<Faq | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    const blankForm = { question:"", answer:"", questionEs:"", answerEs:"", questionPt:"", answerPt:"", sortOrder: 10, isEnabled: true };
    const [form, setForm] = useState(blankForm);

    const allFaqs = faqs ?? [];

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">FAQs ({allFaqs.length})</h2>
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
                <div className="flex items-center gap-4">
                  <div className="space-y-1 flex-1"><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({...f,sortOrder:parseInt(e.target.value)||0}))} className="w-28" /></div>
                  <div className="space-y-1 flex items-center gap-2 pt-5"><Switch checked={form.isEnabled} onCheckedChange={v => setForm(f => ({...f,isEnabled:v}))} /><Label>{form.isEnabled ? "Enabled" : "Disabled"}</Label></div>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createFaq.mutate({ data: form }); setCreateOpen(false); setForm(blankForm); }}>Save FAQ</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="w-24 text-center">Enabled</TableHead>
                <TableHead className="w-20 text-center">Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_,i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                : allFaqs.map(faq => (
                  <TableRow key={faq.id} className={faq.isEnabled ? "" : "opacity-50"}>
                    <TableCell className="max-w-[420px]">
                      <p className="font-medium text-sm">{faq.question}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{faq.answer}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={faq.isEnabled}
                        onCheckedChange={v => updateFaq.mutate({ id: faq.id, data: { isEnabled: v } })}
                      />
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{faq.sortOrder}</TableCell>
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
                <div className="flex items-center gap-4">
                  <div className="space-y-1 flex-1"><Label>Sort Order</Label><Input type="number" defaultValue={editFaq.sortOrder} onChange={e => setEditFaq(f => f ? {...f,sortOrder:parseInt(e.target.value)||0} : null)} className="w-28" /></div>
                  <div className="space-y-1 flex items-center gap-2 pt-5"><Switch checked={editFaq.isEnabled} onCheckedChange={v => setEditFaq(f => f ? {...f,isEnabled:v} : null)} /><Label>{editFaq.isEnabled ? "Enabled" : "Disabled"}</Label></div>
                </div>
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
            <p className="text-sm text-muted-foreground">The site supports 5 languages. All UI text is fully translated. Dynamic content (tour descriptions, blog posts) supports EN/ES/PT — French and German fall back to English content.</p>
            <div className="grid grid-cols-5 gap-3">
              {[
                { code: "EN", name: "English", badge: "Default", full: true },
                { code: "ES", name: "Español", badge: "Full", full: true },
                { code: "PT", name: "Português", badge: "Full", full: true },
                { code: "FR", name: "Français", badge: "UI only", full: false },
                { code: "DE", name: "Deutsch", badge: "UI only", full: false },
              ].map(lang => (
                <div key={lang.code} className="flex flex-col items-center gap-1.5 p-3 border rounded-lg bg-muted/30 text-center">
                  <div className={`w-2 h-2 rounded-full ${lang.full ? "bg-green-500" : "bg-amber-400"}`} />
                  <span className="text-sm font-bold">{lang.code}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{lang.name}</span>
                  <span className={`text-xs font-medium ${lang.full ? "text-green-600" : "text-amber-600"}`}>{lang.badge}</span>
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

  // ─── availability tab ──────────────────────────────────────────────────────

  function AvailabilityTab() {
    const queryClient = useQueryClient();
    const { data: tours = [] } = useListTours();
    const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
    const [month, setMonth] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [form, setForm] = useState({ availableSpots: "", isBlocked: false, notes: "" });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    const from = formatDate(startOfMonth(addMonths(month, -1)), "yyyy-MM-dd");
    const to = formatDate(endOfMonth(addMonths(month, 1)), "yyyy-MM-dd");

    const { data: entries = [], refetch } = useListAdminTourAvailability(
      selectedTourId ?? 0,
      { from, to },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { query: { enabled: !!selectedTourId } as any }
    );

    const createEntry = useCreateAvailabilityEntry();
    const updateEntry = useUpdateAvailabilityEntry();
    const deleteEntry = useDeleteAvailabilityEntry();

    const parseLocalDate = (s: string) => {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d, 12, 0, 0);
    };

    const entryByDate = new Map(entries.map((e) => [e.date, e]));
    const availableDates = entries.filter((e) => !e.isBlocked).map((e) => parseLocalDate(e.date));
    const blockedDates = entries.filter((e) => e.isBlocked).map((e) => parseLocalDate(e.date));

    const handleDayClick = (day: Date | undefined) => {
      if (!day || !selectedTourId) return;
      const dateStr = formatDate(day, "yyyy-MM-dd");
      const existing = entryByDate.get(dateStr);
      setSelectedDate(day);
      if (existing) {
        setEditingId(existing.id);
        setForm({
          availableSpots: existing.availableSpots?.toString() ?? "",
          isBlocked: existing.isBlocked,
          notes: existing.notes ?? "",
        });
      } else {
        setEditingId(null);
        setForm({ availableSpots: "", isBlocked: false, notes: "" });
      }
      setShowForm(true);
    };

    const handleSave = async () => {
      if (!selectedDate || !selectedTourId) return;
      const dateStr = formatDate(selectedDate, "yyyy-MM-dd");
      const data = {
        date: dateStr,
        availableSpots: form.availableSpots ? parseInt(form.availableSpots) : null,
        isBlocked: form.isBlocked,
        notes: form.notes || null,
      };
      if (editingId) {
        await updateEntry.mutateAsync({ id: editingId, data });
      } else {
        await createEntry.mutateAsync({ tourId: selectedTourId, data });
      }
      setShowForm(false);
      setSelectedDate(undefined);
      queryClient.invalidateQueries();
      refetch();
    };

    const handleDelete = async () => {
      if (!editingId) return;
      await deleteEntry.mutateAsync({ id: editingId });
      setShowForm(false);
      setSelectedDate(undefined);
      queryClient.invalidateQueries();
      refetch();
    };

    const upcomingEntries = [...entries]
      .filter((e) => new Date(e.date + "T12:00:00") >= new Date())
      .sort((a, b) => a.date.localeCompare(b.date));

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><CalendarDays size={20} className="text-primary" /> Tour Availability</h2>
          <p className="text-sm text-muted-foreground mt-1">Set available dates and manage capacity per tour. If no dates are configured, all future dates are open.</p>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <label className="text-sm font-medium mb-2 block">Select Tour</label>
          <select
            className="w-full max-w-xs border rounded-lg px-3 py-2 text-sm bg-background"
            value={selectedTourId ?? ""}
            onChange={(e) => {
              setSelectedTourId(e.target.value ? Number(e.target.value) : null);
              setShowForm(false);
              setSelectedDate(undefined);
            }}
          >
            <option value="">— Choose a tour —</option>
            {(tours as { id: number; title: string; slug: string }[]).map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        {selectedTourId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block" />
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300 inline-block" />
                  Blocked
                </span>
                <span className="text-muted-foreground ml-auto text-xs">Click any date to add/edit</span>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDayClick}
                month={month}
                onMonthChange={setMonth}
                modifiers={{ available: availableDates, blocked: blockedDates }}
                modifiersClassNames={{
                  available: "!bg-green-100 !text-green-800 font-semibold rounded-md",
                  blocked: "!bg-red-100 !text-red-700 opacity-60 rounded-md",
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              {showForm && selectedDate ? (
                <div className="bg-card border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <CalendarDays size={15} className="text-primary" />
                      {editingId ? "Edit" : "Add"} — {formatDate(selectedDate, "MMMM d, yyyy")}
                    </h3>
                    <button
                      onClick={() => { setShowForm(false); setSelectedDate(undefined); }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.isBlocked}
                      onCheckedChange={(v) => setForm((f) => ({ ...f, isBlocked: v }))}
                      id="isBlocked"
                    />
                    <label htmlFor="isBlocked" className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <Ban size={13} className={form.isBlocked ? "text-red-500" : "text-muted-foreground"} />
                      {form.isBlocked ? "Blocked (unavailable)" : "Available"}
                    </label>
                  </div>

                  {!form.isBlocked && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Available spots (leave blank for unlimited)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Unlimited"
                        value={form.availableSpots}
                        onChange={(e) => setForm((f) => ({ ...f, availableSpots: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Notes (optional)</label>
                    <Input
                      placeholder="e.g. Special event, private group…"
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      className="h-8 text-sm"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={handleSave}
                      disabled={createEntry.isPending || updateEntry.isPending}
                    >
                      <Save size={13} />{editingId ? "Update" : "Save"}
                    </Button>
                    {editingId && (
                      <Button size="sm" variant="destructive" onClick={handleDelete} disabled={deleteEntry.isPending}>
                        <Trash2 size={13} />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 border rounded-xl p-6 text-center text-sm text-muted-foreground">
                  <CalendarDays size={28} className="mx-auto mb-2 opacity-30" />
                  Click a date on the calendar to add or edit availability
                </div>
              )}

              <div className="bg-card border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Upcoming Entries</h3>
                  <Badge variant="secondary">{upcomingEntries.length}</Badge>
                </div>
                {upcomingEntries.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No availability configured — all future dates are open by default
                  </div>
                ) : (
                  <div className="divide-y max-h-64 overflow-y-auto">
                    {upcomingEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-muted/40 transition-colors text-sm"
                        onClick={() => handleDayClick(parseLocalDate(entry.date))}
                      >
                        <div className="flex items-center gap-2">
                          {entry.isBlocked
                            ? <Ban size={13} className="text-red-500" />
                            : <CheckCircle2 size={13} className="text-green-500" />
                          }
                          <span className="font-medium">{formatDate(parseLocalDate(entry.date), "EEE, MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground text-xs">
                          {!entry.isBlocked && entry.availableSpots && (
                            <span className="flex items-center gap-1">
                              <Users size={11} />{entry.availableSpots} spots
                            </span>
                          )}
                          {entry.isBlocked && (
                            <Badge variant="destructive" className="text-xs py-0">Blocked</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── blog monetization tab ──────────────────────────────────────────────

  function BlogMonetizationTab() {
    const qc = useQueryClient();
    const { data: settings } = useGetSettings();
    const updateSettings = useUpdateSettings();

    const getConversionData = (): BlogConversionData => {
      const raw = (settings as { blogConversionData?: unknown } | undefined)?.blogConversionData;
      if (raw && typeof raw === "object") {
        return { ...DEFAULT_BLOG_CONVERSION, ...(raw as Partial<BlogConversionData>) };
      }
      return { ...DEFAULT_BLOG_CONVERSION };
    };

    const [form, setForm] = useState<BlogConversionData>(getConversionData);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
      if (settings) setForm(getConversionData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    const save = () => {
      updateSettings.mutate(
        { data: { blogConversionData: form as unknown as Record<string, unknown> } as Parameters<typeof updateSettings.mutate>[0]["data"] },
        {
          onSuccess: () => {
            qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          },
        }
      );
    };

    const setPromo = (key: keyof BlogConversionData, value: unknown) =>
      setForm((f) => ({ ...f, [key]: value }));

    const updateService = (i: number, field: string, value: string) =>
      setForm((f) => {
        const services = [...f.promoServices];
        services[i] = { ...services[i], [field]: value };
        return { ...f, promoServices: services };
      });

    const updateCta = (i: number, field: string, value: string) =>
      setForm((f) => {
        const ctas = [...f.promoCtas];
        ctas[i] = { ...ctas[i], [field]: value };
        return { ...f, promoCtas: ctas };
      });

    const updateAffiliate = (i: number, field: string, value: unknown) =>
      setForm((f) => {
        const cards = [...f.affiliateCards];
        cards[i] = { ...cards[i], [field]: value };
        return { ...f, affiliateCards: cards };
      });

    const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        {children}
      </div>
    );

    const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</Label>
        {children}
      </div>
    );

    return (
      <div className="space-y-6 max-w-4xl">
        {/* Save bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Changes apply globally to all blog posts and travel guide articles.</p>
          <Button
            onClick={save}
            disabled={updateSettings.isPending}
            className="bg-[#009743] hover:bg-[#007a36] text-white"
          >
            {saved ? "✓ Saved" : updateSettings.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        {/* ── Promo Section ─── */}
        <SectionCard title="Section 1 — Janeiro Tour & Travel Promo">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Show promo section</span>
            <Switch
              checked={form.promoEnabled}
              onCheckedChange={(v) => setPromo("promoEnabled", v)}
            />
          </div>

          <Field label="Section Title">
            <Input value={form.promoTitle} onChange={(e) => setPromo("promoTitle", e.target.value)} />
          </Field>

          <Field label="Description">
            <Textarea rows={3} value={form.promoDescription} onChange={(e) => setPromo("promoDescription", e.target.value)} />
          </Field>

          <div>
            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">Featured Services</Label>
            <div className="space-y-3">
              {form.promoServices.map((svc, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl">
                  <Input placeholder="Title" value={svc.title} onChange={(e) => updateService(i, "title", e.target.value)} />
                  <Input placeholder="Link (e.g. /tours)" value={svc.href} onChange={(e) => updateService(i, "href", e.target.value)} />
                  <Input placeholder="Description" value={svc.description} onChange={(e) => updateService(i, "description", e.target.value)} className="col-span-2" />
                </div>
              ))}
            </div>
          </div>

          <Field label="Featured Destinations (one per line)">
            <Textarea
              rows={4}
              value={form.promoDestinations.join("\n")}
              onChange={(e) => setPromo("promoDestinations", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            />
          </Field>

          <div>
            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">CTA Buttons</Label>
            <div className="space-y-3">
              {form.promoCtas.map((cta, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl">
                  <Input placeholder="Button Label" value={cta.label} onChange={(e) => updateCta(i, "label", e.target.value)} />
                  <Input placeholder="Link (e.g. /tours)" value={cta.href} onChange={(e) => updateCta(i, "href", e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── Affiliate Section ─── */}
        <SectionCard title="Section 2 — Affiliate Travel Resources">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Show affiliate resources section</span>
            <Switch
              checked={form.affiliatesEnabled}
              onCheckedChange={(v) => setPromo("affiliatesEnabled", v)}
            />
          </div>

          <Field label="Section Title">
            <Input value={form.affiliatesTitle} onChange={(e) => setPromo("affiliatesTitle", e.target.value)} />
          </Field>

          <Field label="Description">
            <Textarea rows={2} value={form.affiliatesDescription} onChange={(e) => setPromo("affiliatesDescription", e.target.value)} />
          </Field>

          <div>
            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3 block">Affiliate Cards</Label>
            <div className="space-y-4">
              {form.affiliateCards.map((card, i) => (
                <div key={card.id} className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{card.title || `Card ${i + 1}`}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{card.enabled ? "Visible" : "Hidden"}</span>
                      <Switch
                        checked={card.enabled}
                        onCheckedChange={(v) => updateAffiliate(i, "enabled", v)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Card Title" value={card.title} onChange={(e) => updateAffiliate(i, "title", e.target.value)} />
                    <Input placeholder="Button Label" value={card.buttonLabel} onChange={(e) => updateAffiliate(i, "buttonLabel", e.target.value)} />
                  </div>
                  <Textarea placeholder="Card Description" rows={2} value={card.description} onChange={(e) => updateAffiliate(i, "description", e.target.value)} />
                  <Input placeholder="Affiliate URL (https://...)" value={card.url} onChange={(e) => updateAffiliate(i, "url", e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Preview note */}
        <div className="rounded-xl bg-[#009743]/5 border border-[#009743]/20 px-4 py-3 text-sm text-[#009743]">
          💡 These sections appear automatically on all existing and future blog posts, travel guide articles, and destination pages.
        </div>
      </div>
    );
  }

  // ─── users tab ───────────────────────────────────────────────────────────

  function UsersTab() {
    const queryClient = useQueryClient();
    const invalidate = () => queryClient.invalidateQueries({ queryKey: getListAdminUsersQueryKey() });
    const { data: users, isLoading } = useListAdminUsers();
    const changePassword = useChangeAdminPassword({ mutation: { onSuccess: invalidate } });

    const [dialogUser, setDialogUser] = useState<{ id: number; username: string } | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");

    const openDialog = (user: { id: number; username: string }) => {
      setDialogUser(user);
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setShowNew(false);
      setShowConfirm(false);
    };

    const handleSave = async () => {
      if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
      if (!dialogUser) return;
      setError("");
      try {
        await changePassword.mutateAsync({ id: dialogUser.id, data: { newPassword } });
        setDialogUser(null);
      } catch {
        setError("Failed to change password. Please try again.");
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Admin Accounts</p>
              <p className="text-xs text-gray-400">Only admins logged in to this panel can change passwords.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(users ?? []).map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="text-gray-400 text-xs font-mono">#{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full px-2.5 py-0.5">
                        <ShieldCheck className="w-3 h-3" /> {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs"
                        onClick={() => openDialog(user)}
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        Change Password
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <Dialog open={!!dialogUser} onOpenChange={(open) => { if (!open) setDialogUser(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                Change Password — <span className="text-amber-700">{dialogUser?.username}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="new-pw">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-pw"
                    type={showNew ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(""); }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNew(v => !v)}
                  >
                    {showNew ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-40" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-pw">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-pw"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat the password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                    className="pr-10"
                    onKeyDown={e => e.key === "Enter" && handleSave()}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirm(v => !v)}
                  >
                    {showConfirm ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-40" />}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
              )}
              {changePassword.isSuccess && !error && (
                <p className="text-sm text-green-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Password changed successfully.
                </p>
              )}
              <div className="flex gap-2 justify-end pt-1">
                <Button variant="outline" onClick={() => setDialogUser(null)}>Cancel</Button>
                <Button
                  onClick={handleSave}
                  disabled={changePassword.isPending || !newPassword || !confirmPassword}
                  className="gap-1.5"
                >
                  {changePassword.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                  Save Password
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─── Hotels Tab ─────────────────────────────────────────────────────────────
  function HotelsTab() {
    const qc = useQueryClient();
    const { data: hotels = [], isLoading } = useListHotels({ activeOnly: false });
    const { data: seasons = [], isLoading: loadingSeasons } = useListSpecialSeasons();
    const createHotel = useCreateHotel({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListHotelsQueryKey() }) } });
    const updateHotel = useUpdateHotel({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListHotelsQueryKey() }) } });
    const deleteHotel = useDeleteHotel({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListHotelsQueryKey() }) } });
    const createSeason = useCreateSpecialSeason({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListSpecialSeasonsQueryKey() }) } });
    const updateSeason = useUpdateSpecialSeason({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListSpecialSeasonsQueryKey() }) } });
    const deleteSeason = useDeleteSpecialSeason({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListSpecialSeasonsQueryKey() }) } });

    const EMPTY_HOTEL = { slug: "", name: "", neighborhood: "", category: "Upscale", starLevel: 4, heroImageUrl: "", shortDescEn: "", shortDescEs: "", shortDescPt: "", bestForEn: "", bestForEs: "", bestForPt: "", roomType: "Queen Double", maxOccupancy: 2, regularRate: 0, specialRate: 0, specialRateConditionsEn: "Holidays, New Year's Eve and Carnival. Final price must be confirmed before booking.", specialRateConditionsEs: "Feriados, Nochevieja y Carnaval. El precio final debe confirmarse antes de la reserva.", specialRateConditionsPt: "Feriados, Réveillon e Carnaval. O preço final deve ser confirmado antes da reserva.", currency: "BRL", availabilityStatus: "available", isActive: true, isPublished: true, sortOrder: 10 };
    const EMPTY_SEASON = { name: "", startDate: "", endDate: "", descriptionEn: "", descriptionEs: "", descriptionPt: "", isActive: true };

    const [editHotel, setEditHotel] = useState<typeof EMPTY_HOTEL & { id?: number } | null>(null);
    const [editSeason, setEditSeason] = useState<typeof EMPTY_SEASON & { id?: number } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ type: "hotel" | "season"; id: number; name: string } | null>(null);
    const [hotelSubTab, setHotelSubTab] = useState<"hotels" | "seasons">("hotels");

    const CATEGORIES = ["Comfortable", "Upscale", "Premium", "Luxury", "Airport Hotel", "Beachfront Hotel", "Business Hotel", "Group-Friendly Hotel"];
    const STATUS_OPTIONS = [{ value: "available", label: "Available" }, { value: "on_request", label: "On Request" }, { value: "unavailable", label: "Unavailable" }];

    function fmtBRL(n: number) { return `R$ ${Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`; }
    function statusBadge(s: string) {
      if (s === "unavailable") return <Badge variant="destructive" className="text-[10px]">Unavailable</Badge>;
      if (s === "on_request") return <Badge variant="outline" className="border-amber-400 text-amber-600 text-[10px]">On Request</Badge>;
      return <Badge className="bg-green-100 text-green-700 text-[10px]">Available</Badge>;
    }

    async function saveHotel() {
      if (!editHotel) return;
      const body = { ...editHotel, regularRate: Number(editHotel.regularRate), specialRate: Number(editHotel.specialRate) };
      if (editHotel.id) { await updateHotel.mutateAsync({ id: editHotel.id, data: body as Parameters<typeof updateHotel.mutateAsync>[0]["data"] }); }
      else { await createHotel.mutateAsync({ data: body as Parameters<typeof createHotel.mutateAsync>[0]["data"] }); }
      setEditHotel(null);
    }
    async function saveSeason() {
      if (!editSeason) return;
      const body = { name: editSeason.name, startDate: editSeason.startDate, endDate: editSeason.endDate, descriptionEn: editSeason.descriptionEn, descriptionEs: editSeason.descriptionEs, descriptionPt: editSeason.descriptionPt, isActive: editSeason.isActive };
      if (editSeason.id) { await updateSeason.mutateAsync({ id: editSeason.id, data: body }); }
      else { await createSeason.mutateAsync({ data: body }); }
      setEditSeason(null);
    }
    async function confirmDelete() {
      if (!deleteConfirm) return;
      if (deleteConfirm.type === "hotel") await deleteHotel.mutateAsync({ id: deleteConfirm.id });
      else await deleteSeason.mutateAsync({ id: deleteConfirm.id });
      setDeleteConfirm(null);
    }

    return (
      <div className="space-y-6">
        <div className="flex gap-0 border-b border-gray-200">
          <button onClick={() => setHotelSubTab("hotels")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${hotelSubTab === "hotels" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Hotel Catalog ({hotels.length})</button>
          <button onClick={() => setHotelSubTab("seasons")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${hotelSubTab === "seasons" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Special Seasons ({seasons.length})</button>
        </div>

        {hotelSubTab === "hotels" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Active &amp; published hotels appear automatically on every package, tour and group travel page.</p>
              <Button onClick={() => setEditHotel({ ...EMPTY_HOTEL })} className="gap-1.5"><Plus className="w-4 h-4" /> Add Hotel</Button>
            </div>
            {isLoading ? (<div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : (
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader><TableRow><TableHead>Hotel</TableHead><TableHead>Neighborhood</TableHead><TableHead>Category</TableHead><TableHead>Regular Rate</TableHead><TableHead>Status</TableHead><TableHead>Active</TableHead><TableHead>Published</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {hotels.map(h => (
                      <TableRow key={h.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {h.heroImageUrl && <img src={h.heroImageUrl} alt={h.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                            <div><p className="font-semibold text-sm">{h.name}</p><div className="flex gap-0.5 mt-0.5">{Array.from({ length: h.starLevel }).map((_, i) => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}</div></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{h.neighborhood}</TableCell>
                        <TableCell className="text-sm text-gray-600">{h.category}</TableCell>
                        <TableCell className="text-sm font-medium">{fmtBRL(Number(h.regularRate))}<span className="text-xs text-gray-400 ml-1">/night</span></TableCell>
                        <TableCell>{statusBadge(h.availabilityStatus)}</TableCell>
                        <TableCell><Switch checked={h.isActive} onCheckedChange={async () => { await updateHotel.mutateAsync({ id: h.id, data: { isActive: !h.isActive } as Parameters<typeof updateHotel.mutateAsync>[0]["data"] }); }} /></TableCell>
                        <TableCell><Switch checked={h.isPublished} onCheckedChange={async () => { await updateHotel.mutateAsync({ id: h.id, data: { isPublished: !h.isPublished } as Parameters<typeof updateHotel.mutateAsync>[0]["data"] }); }} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setEditHotel({ ...EMPTY_HOTEL, ...h, regularRate: Number(h.regularRate), specialRate: Number(h.specialRate) })}><Pencil className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteConfirm({ type: "hotel", id: h.id, name: h.name })}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {hotelSubTab === "seasons" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">When booking dates fall within a special season, customers see a confirmation-required warning on hotel prices.</p>
              <Button onClick={() => setEditSeason({ ...EMPTY_SEASON })} className="gap-1.5"><Plus className="w-4 h-4" /> Add Season</Button>
            </div>
            {loadingSeasons ? (<div className="space-y-2">{[1,2].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}</div>) : (
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead>Active</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {seasons.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium text-sm">{s.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{s.startDate}</TableCell>
                        <TableCell className="text-sm text-gray-600">{s.endDate}</TableCell>
                        <TableCell><Switch checked={s.isActive} onCheckedChange={async () => { await updateSeason.mutateAsync({ id: s.id, data: { name: s.name, startDate: s.startDate, endDate: s.endDate, isActive: !s.isActive } }); }} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button size="sm" variant="outline" onClick={() => setEditSeason({ ...EMPTY_SEASON, ...s })}><Pencil className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteConfirm({ type: "season", id: s.id, name: s.name })}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Hotel Modal */}
        <Dialog open={!!editHotel} onOpenChange={o => { if (!o) setEditHotel(null); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editHotel?.id ? "Edit Hotel" : "Add Hotel"}</DialogTitle></DialogHeader>
            {editHotel && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Name *</Label><Input value={editHotel.name} onChange={e => setEditHotel(p => ({ ...p!, name: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Slug *</Label><Input value={editHotel.slug} onChange={e => setEditHotel(p => ({ ...p!, slug: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Neighborhood</Label><Input value={editHotel.neighborhood} onChange={e => setEditHotel(p => ({ ...p!, neighborhood: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Category</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editHotel.category} onChange={e => setEditHotel(p => ({ ...p!, category: e.target.value }))}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                  <div className="space-y-1"><Label>Star Level (1–5)</Label><Input type="number" min={1} max={5} value={editHotel.starLevel} onChange={e => setEditHotel(p => ({ ...p!, starLevel: Number(e.target.value) }))} /></div>
                  <div className="space-y-1"><Label>Availability</Label><select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editHotel.availabilityStatus} onChange={e => setEditHotel(p => ({ ...p!, availabilityStatus: e.target.value }))}>{STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                  <div className="space-y-1"><Label>Regular Rate (BRL/room/night)</Label><Input type="number" value={editHotel.regularRate} onChange={e => setEditHotel(p => ({ ...p!, regularRate: Number(e.target.value) }))} /></div>
                  <div className="space-y-1"><Label>Special Season Rate (BRL reference)</Label><Input type="number" value={editHotel.specialRate} onChange={e => setEditHotel(p => ({ ...p!, specialRate: Number(e.target.value) }))} /></div>
                  <div className="space-y-1 col-span-2"><Label>Hero Image URL</Label><Input value={editHotel.heroImageUrl} onChange={e => setEditHotel(p => ({ ...p!, heroImageUrl: e.target.value }))} placeholder="https://..." /></div>
                  <div className="space-y-1 col-span-2"><Label>Description (EN)</Label><Textarea rows={2} value={editHotel.shortDescEn} onChange={e => setEditHotel(p => ({ ...p!, shortDescEn: e.target.value }))} /></div>
                  <div className="space-y-1 col-span-2"><Label>Description (ES)</Label><Textarea rows={2} value={editHotel.shortDescEs} onChange={e => setEditHotel(p => ({ ...p!, shortDescEs: e.target.value }))} /></div>
                  <div className="space-y-1 col-span-2"><Label>Description (PT)</Label><Textarea rows={2} value={editHotel.shortDescPt} onChange={e => setEditHotel(p => ({ ...p!, shortDescPt: e.target.value }))} /></div>
                  <div className="space-y-1 col-span-2"><Label>Best For (EN)</Label><Input value={editHotel.bestForEn} onChange={e => setEditHotel(p => ({ ...p!, bestForEn: e.target.value }))} /></div>
                  <div className="space-y-1 col-span-2"><Label>Best For (ES)</Label><Input value={editHotel.bestForEs} onChange={e => setEditHotel(p => ({ ...p!, bestForEs: e.target.value }))} /></div>
                  <div className="space-y-1 col-span-2"><Label>Best For (PT)</Label><Input value={editHotel.bestForPt} onChange={e => setEditHotel(p => ({ ...p!, bestForPt: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>Sort Order</Label><Input type="number" value={editHotel.sortOrder} onChange={e => setEditHotel(p => ({ ...p!, sortOrder: Number(e.target.value) }))} /></div>
                  <div className="flex items-center gap-6 pt-4 col-span-2">
                    <div className="flex items-center gap-2"><Switch checked={editHotel.isActive} onCheckedChange={v => setEditHotel(p => ({ ...p!, isActive: v }))} /><Label>Active</Label></div>
                    <div className="flex items-center gap-2"><Switch checked={editHotel.isPublished} onCheckedChange={v => setEditHotel(p => ({ ...p!, isPublished: v }))} /><Label>Published</Label></div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => setEditHotel(null)}>Cancel</Button>
                  <Button onClick={saveHotel} disabled={createHotel.isPending || updateHotel.isPending} className="gap-1.5">{(createHotel.isPending || updateHotel.isPending) ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}Save Hotel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Season Modal */}
        <Dialog open={!!editSeason} onOpenChange={o => { if (!o) setEditSeason(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editSeason?.id ? "Edit Special Season" : "Add Special Season"}</DialogTitle></DialogHeader>
            {editSeason && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1"><Label>Name *</Label><Input value={editSeason.name} onChange={e => setEditSeason(p => ({ ...p!, name: e.target.value }))} placeholder="e.g. Carnival 2027" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Start Date *</Label><Input type="date" value={editSeason.startDate} onChange={e => setEditSeason(p => ({ ...p!, startDate: e.target.value }))} /></div>
                  <div className="space-y-1"><Label>End Date *</Label><Input type="date" value={editSeason.endDate} onChange={e => setEditSeason(p => ({ ...p!, endDate: e.target.value }))} /></div>
                </div>
                <div className="space-y-1"><Label>Description (EN)</Label><Textarea rows={2} value={editSeason.descriptionEn} onChange={e => setEditSeason(p => ({ ...p!, descriptionEn: e.target.value }))} /></div>
                <div className="space-y-1"><Label>Description (ES)</Label><Textarea rows={2} value={editSeason.descriptionEs} onChange={e => setEditSeason(p => ({ ...p!, descriptionEs: e.target.value }))} /></div>
                <div className="space-y-1"><Label>Description (PT)</Label><Textarea rows={2} value={editSeason.descriptionPt} onChange={e => setEditSeason(p => ({ ...p!, descriptionPt: e.target.value }))} /></div>
                <div className="flex items-center gap-2"><Switch checked={editSeason.isActive} onCheckedChange={v => setEditSeason(p => ({ ...p!, isActive: v }))} /><Label>Active</Label></div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => setEditSeason(null)}>Cancel</Button>
                  <Button onClick={saveSeason} disabled={createSeason.isPending || updateSeason.isPending} className="gap-1.5">{(createSeason.isPending || updateSeason.isPending) ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}Save</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog open={!!deleteConfirm} onOpenChange={o => { if (!o) setDeleteConfirm(null); }}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
            <p className="text-sm text-gray-600">Delete <strong>{deleteConfirm?.name}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleteHotel.isPending || deleteSeason.isPending}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

// ─────────────────────────────────────────────────────────────────────────────
// B2B QUOTES TAB
// ─────────────────────────────────────────────────────────────────────────────
const B2B_STATUSES = ["New Lead", "In Review", "Proposal Sent", "Negotiating", "Confirmed", "Lost", "Archived"];

const STATUS_COLORS: Record<string, string> = {
  "New Lead": "bg-blue-100 text-blue-800",
  "In Review": "bg-yellow-100 text-yellow-800",
  "Proposal Sent": "bg-purple-100 text-purple-800",
  "Negotiating": "bg-orange-100 text-orange-800",
  "Confirmed": "bg-green-100 text-green-800",
  "Lost": "bg-red-100 text-red-800",
  "Archived": "bg-gray-100 text-gray-600",
};

function B2bQuotesTab() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editAssigned, setEditAssigned] = useState("");

  type B2bQuoteRow = { id: number; contactName: string; email: string; company?: string; country?: string; quoteRef: string; status: string; estimateLow?: string | number; estimateHigh?: string | number; createdAt: string; internalNotes?: string; assignedTo?: string; groupData?: Record<string, unknown>; estimateBreakdown?: Record<string, unknown>; phone?: string; language?: string; preferredContact?: string };

  const { data: rawQuotes = [], isLoading } = useListB2bQuotes({ status: statusFilter || undefined });
  const quotes = rawQuotes as B2bQuoteRow[];
  const updateQuote = useUpdateB2bQuote();

  const filtered = quotes.filter(q =>
    !search || q.contactName?.toLowerCase().includes(search.toLowerCase()) || q.email?.toLowerCase().includes(search.toLowerCase()) || q.quoteRef?.toLowerCase().includes(search.toLowerCase()) || q.company?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedQuote = selected !== null ? filtered.find(q => q.id === selected) ?? quotes.find(q => q.id === selected) : null;

  useEffect(() => {
    if (selectedQuote) {
      setEditStatus(selectedQuote.status ?? "");
      setEditNotes(selectedQuote.internalNotes ?? "");
      setEditAssigned(selectedQuote.assignedTo ?? "");
    }
  }, [selected]);

  async function saveQuote() {
    if (!selected) return;
    await updateQuote.mutateAsync({ id: selected, data: { status: editStatus, internalNotes: editNotes, assignedTo: editAssigned } });
    qc.invalidateQueries({ queryKey: getListB2bQuotesQueryKey() });
  }

  function fmt(n: number | string | undefined) {
    const num = Number(n);
    if (!num) return "—";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by name, email, ref…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {B2B_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="text-sm text-gray-500 whitespace-nowrap">{filtered.length} quote{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-2">
          {isLoading && <div className="text-center py-8 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto" /></div>}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No quotes yet</p>
            </div>
          )}
          {filtered.map(q => (
            <button
              key={q.id}
              type="button"
              onClick={() => setSelected(q.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${selected === q.id ? "border-[#FFB600] bg-[#FFB600]/5" : "border-gray-200 hover:border-gray-300 bg-white"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900 truncate">{q.contactName}</span>
                <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[q.status] ?? "bg-gray-100 text-gray-600"}`}>{q.status}</span>
              </div>
              <div className="text-xs text-gray-500 truncate">{q.company || q.email}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-mono text-gray-400">{q.quoteRef}</span>
                <span className="text-xs text-[#FFB600] font-semibold">{fmt(q.estimateLow)}–{fmt(q.estimateHigh)} <span className="text-gray-400 font-normal">pp</span></span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{new Date(q.createdAt).toLocaleDateString()}</div>
            </button>
          ))}
        </div>

        {/* Detail pane */}
        <div className="lg:col-span-2">
          {!selectedQuote ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <Building2 className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Select a quote to review</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">{selectedQuote.contactName}</div>
                  <div className="text-xs text-gray-300 font-mono">{selectedQuote.quoteRef}</div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[selectedQuote.status] ?? "bg-gray-700 text-gray-200"}`}>{selectedQuote.status}</span>
              </div>

              <div className="p-6 space-y-5">
                {/* Contact info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { icon: Mail, label: "Email", value: selectedQuote.email },
                    { icon: Phone, label: "Phone", value: selectedQuote.phone || "—" },
                    { icon: Building2, label: "Company", value: selectedQuote.company || "—" },
                    { icon: Globe, label: "Country", value: selectedQuote.country || "—" },
                    { icon: TrendingUp, label: "Low Estimate", value: fmt(selectedQuote.estimateLow) + " pp" },
                    { icon: TrendingUp, label: "High Estimate", value: fmt(selectedQuote.estimateHigh) + " pp" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2">
                      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400">{label}</div>
                        <div className="font-medium text-gray-800 break-all">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Group data */}
                {selectedQuote.groupData && Object.keys(selectedQuote.groupData).length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Group Details</div>
                    <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2">
                      {Object.entries(selectedQuote.groupData).filter(([, v]) => v !== undefined && v !== "" && v !== false).map(([k, v]) => (
                        <div key={k} className="text-xs">
                          <span className="text-gray-400">{k.replace(/([A-Z])/g, " $1").toLowerCase()}: </span>
                          <span className="font-medium text-gray-800">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status management */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Manage Quote</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <select
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                      >
                        {B2B_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Assigned To</Label>
                      <Input value={editAssigned} onChange={e => setEditAssigned(e.target.value)} placeholder="Team member name" className="text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Internal Notes</Label>
                    <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} placeholder="Internal notes (not visible to client)…" />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveQuote} disabled={updateQuote.isPending} className="bg-[#FFB600] hover:bg-[#e6a400] text-black gap-1.5 text-sm">
                      {updateQuote.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// B2B PRICING TAB
// ─────────────────────────────────────────────────────────────────────────────
const PRICING_GROUP_LABELS: Record<string, string> = {
  accommodation: "Accommodation",
  transport: "Transportation",
  experience: "Experiences",
  meal: "Meals",
  service: "Guide & Services",
  markup: "Markup & Range",
  peak: "Peak Season",
};

function B2bPricingTab() {
  const qc = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<"pricing" | "tiers">("pricing");

  // ── Pricing settings ──
  const { data: pricingData = [], isLoading: pricingLoading } = useListB2bPricing();
  const updatePricing = useUpdateB2bPricing();
  const [pricingEdits, setPricingEdits] = useState<Record<string, string>>({});
  const [pricingSaved, setPricingSaved] = useState(false);

  useEffect(() => {
    const init: Record<string, string> = {};
    (pricingData as Array<{ settingKey: string; settingValue: string; settingGroup: string; settingLabel: string }>).forEach(s => { init[s.settingKey] = s.settingValue; });
    setPricingEdits(init);
  }, [pricingData]);

  async function savePricing() {
    const updates = Object.entries(pricingEdits).map(([settingKey, settingValue]) => ({ settingKey, settingValue: Number(settingValue) }));
    await updatePricing.mutateAsync({ data: updates });
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 2000);
  }

  // ── Group tiers ──
  const { data: tiersData = [], isLoading: tiersLoading } = useListB2bTiers();
  const updateTiers = useUpdateB2bTiers();
  const [tierEdits, setTierEdits] = useState<Array<{ id: number; discountPct: string; markupPct: string; complimentaryPolicy: string }>>([]);
  const [tiersSaved, setTiersSaved] = useState(false);

  useEffect(() => {
    setTierEdits((tiersData as Array<{ id: number; discountPct: string; markupPct: string; complimentaryPolicy: string }>).map(t => ({
      id: t.id,
      discountPct: t.discountPct,
      markupPct: t.markupPct,
      complimentaryPolicy: t.complimentaryPolicy ?? "",
    })));
  }, [tiersData]);

  function updateTierEdit(id: number, field: "discountPct" | "markupPct" | "complimentaryPolicy", val: string) {
    setTierEdits(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t));
  }

  async function saveTiers() {
    const updates = tierEdits.map(t => ({ id: t.id, discountPct: Number(t.discountPct), markupPct: Number(t.markupPct), complimentaryPolicy: t.complimentaryPolicy }));
    await updateTiers.mutateAsync({ data: updates });
    setTiersSaved(true);
    setTimeout(() => setTiersSaved(false), 2000);
  }

  // Group pricing by settingGroup
  type PricingRow = { settingKey: string; settingValue: string; settingGroup: string; settingLabel: string };
  const pricingGroups = (pricingData as PricingRow[]).reduce((acc, s) => {
    const g = s.settingGroup ?? "other";
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {} as Record<string, PricingRow[]>);

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveSubTab("pricing")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === "pricing" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Pricing Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("tiers")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === "tiers" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Award className="w-3.5 h-3.5" /> Group Tiers
        </button>
      </div>

      {/* ── Pricing settings ── */}
      {activeSubTab === "pricing" && (
        <div className="space-y-5">
          {pricingLoading && <div className="text-center py-8 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto" /></div>}

          {Object.entries(pricingGroups).map(([group, settings]) => (
            <div key={group} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FFB600]" />
                <span className="text-sm font-bold text-gray-700">{PRICING_GROUP_LABELS[group] ?? group}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {settings.map(s => (
                  <div key={s.settingKey} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{s.settingLabel}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={pricingEdits[s.settingKey] ?? s.settingValue}
                        onChange={e => setPricingEdits(prev => ({ ...prev, [s.settingKey]: e.target.value }))}
                        className="w-28 text-right text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!pricingLoading && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">Changes apply immediately to new quote estimates.</p>
              <Button onClick={savePricing} disabled={updatePricing.isPending} className={`gap-1.5 text-sm ${pricingSaved ? "bg-[#009743] text-white" : "bg-[#FFB600] hover:bg-[#e6a400] text-black"}`}>
                {updatePricing.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : pricingSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {pricingSaved ? "Saved!" : "Save Pricing"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Group tiers ── */}
      {activeSubTab === "tiers" && (
        <div className="space-y-4">
          {tiersLoading && <div className="text-center py-8 text-gray-400"><RefreshCw className="w-5 h-5 animate-spin mx-auto" /></div>}

          <p className="text-sm text-gray-500">Configure discount and markup percentages for each group size tier. Tiers are applied automatically based on passenger count.</p>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Tier</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Pax Range</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Discount %</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Markup %</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Complimentary Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(tiersData as Array<{ id: number; tierName: string; minPax: number; maxPax: number | null; discountPct: string; markupPct: string; complimentaryPolicy: string }>).map((tier) => {
                  const edit = tierEdits.find(t => t.id === tier.id);
                  if (!edit) return null;
                  return (
                    <tr key={tier.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{tier.tierName}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {tier.minPax}–{tier.maxPax ?? "∞"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-center">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="50"
                            value={edit.discountPct}
                            onChange={e => updateTierEdit(tier.id, "discountPct", e.target.value)}
                            className="w-20 text-center text-sm"
                          />
                          <span className="text-gray-400 text-xs">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-center">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="50"
                            value={edit.markupPct}
                            onChange={e => updateTierEdit(tier.id, "markupPct", e.target.value)}
                            className="w-20 text-center text-sm"
                          />
                          <span className="text-gray-400 text-xs">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={edit.complimentaryPolicy}
                          onChange={e => updateTierEdit(tier.id, "complimentaryPolicy", e.target.value)}
                          placeholder="e.g. 1 FOC per 15 pax"
                          className="text-sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!tiersLoading && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">FOC = Free of Charge (complimentary room/seat)</p>
              <Button onClick={saveTiers} disabled={updateTiers.isPending} className={`gap-1.5 text-sm ${tiersSaved ? "bg-[#009743] text-white" : "bg-[#FFB600] hover:bg-[#e6a400] text-black"}`}>
                {updateTiers.isPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : tiersSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {tiersSaved ? "Saved!" : "Save Tiers"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
