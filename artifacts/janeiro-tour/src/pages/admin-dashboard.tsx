import { useState } from "react";
import { useLocation } from "wouter";
import {
  useGetAdminMe, useAdminLogout, useGetAdminStats,
  useListTours, useCreateTour, useUpdateTour, useDeleteTour,
  useListDestinations, useCreateDestination, useUpdateDestination, useDeleteDestination,
  useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost,
  useListReviews, useCreateReview, useUpdateReview, useDeleteReview,
  useListFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq,
  useGetSettings, useUpdateSettings,
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
  Settings, LogOut, Plus, Pencil, Trash2, BarChart3, Globe, Image, ExternalLink, Code2
} from "lucide-react";

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
            <option value="group">Group</option>
            <option value="private">Private</option>
            <option value="both">Group & Private</option>
          </select>
        </div>
        <div className="space-y-1"><Label>Sort Order</Label><Input type="number" value={form.sortOrder as number} onChange={e => set("sortOrder", parseInt(e.target.value))} /></div>
      </div>
      <div className="flex gap-6 pt-1">
        <div className="flex items-center gap-2"><Switch checked={form.published as boolean} onCheckedChange={v => set("published", v)} /><Label>Published</Label></div>
        <div className="flex items-center gap-2"><Switch checked={form.featured as boolean} onCheckedChange={v => set("featured", v)} /><Label>Featured on Homepage</Label></div>
      </div>

      <SectionLabel>Images</SectionLabel>
      <div className="space-y-1">
        <Label>Main Image URL</Label>
        <Input value={form.imageUrl as string} onChange={e => set("imageUrl", e.target.value)} placeholder="https://images.unsplash.com/..." />
        {(form.imageUrl as string) && (
          <img src={form.imageUrl as string} alt="" className="mt-2 h-28 w-full object-cover rounded-lg border" onError={e => (e.target as HTMLImageElement).style.display = "none"} />
        )}
      </div>

      <SectionLabel>Content (English)</SectionLabel>
      <div className="space-y-1"><Label>Overview *</Label><Textarea rows={4} value={form.overview as string} onChange={e => set("overview", e.target.value)} placeholder="Describe the tour experience..." /></div>
      <div className="space-y-1"><Label>Meeting Point</Label><Input value={form.meetingPoint as string} onChange={e => set("meetingPoint", e.target.value)} /></div>
      <div className="space-y-1"><Label>Cancellation Policy</Label><Input value={form.cancellationPolicy as string} onChange={e => set("cancellationPolicy", e.target.value)} /></div>

      <SectionLabel>Translations</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Title — Español</Label><Input value={form.titleEs as string} onChange={e => set("titleEs", e.target.value)} placeholder="Título en español" /></div>
        <div className="space-y-1"><Label>Title — Português</Label><Input value={form.titlePt as string} onChange={e => set("titlePt", e.target.value)} placeholder="Título em português" /></div>
      </div>
      <div className="space-y-1"><Label>Overview — Español</Label><Textarea rows={3} value={form.overviewEs as string} onChange={e => set("overviewEs", e.target.value)} placeholder="Descripción en español..." /></div>
      <div className="space-y-1"><Label>Overview — Português</Label><Textarea rows={3} value={form.overviewPt as string} onChange={e => set("overviewPt", e.target.value)} placeholder="Descrição em português..." /></div>

      <SectionLabel>SEO Settings</SectionLabel>
      <div className="space-y-1"><Label>SEO Title</Label><Input value={form.seoTitle as string} onChange={e => set("seoTitle", e.target.value)} placeholder="Tour title for search engines (50-60 chars)" /></div>
      <div className="space-y-1"><Label>SEO Meta Description</Label><Textarea rows={2} value={form.seoDescription as string} onChange={e => set("seoDescription", e.target.value)} placeholder="Description for Google search results (150-160 chars)" /></div>

      <SectionLabel>🎫 Regiondo Booking Widget</SectionLabel>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex gap-2">
        <Code2 size={16} className="flex-shrink-0 mt-0.5" />
        <span>Paste the Regiondo embed code for this tour. It will automatically appear in the booking section on the tour page. Visitors will book, pay and receive confirmation entirely through Regiondo.</span>
      </div>
      <div className="space-y-1">
        <Label>Regiondo Widget Embed Code</Label>
        <Textarea
          rows={6}
          value={form.regiondoWidget as string}
          onChange={e => set("regiondoWidget", e.target.value)}
          placeholder={'<!-- Paste your Regiondo widget code here -->\n<script src="https://cdn.regiondo.net/..." />\n<div data-regiondo-product="..."></div>'}
          className="font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">Leave empty to show a "Request via WhatsApp" button instead.</p>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(form)} className="min-w-[100px]">Save Tour</Button>
      </div>
    </div>
  );
}

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
      {/* Top Bar */}
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
              { value: "tours", icon: Package, label: "Tours" },
              { value: "destinations", icon: MapPin, label: "Destinations" },
              { value: "blog", icon: FileText, label: "Blog" },
              { value: "reviews", icon: Star, label: "Reviews" },
              { value: "faqs", icon: HelpCircle, label: "FAQs" },
              { value: "homepage", icon: Image, label: "Homepage" },
              { value: "settings", icon: Settings, label: "Settings & SEO" },
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
                <li>Go to <strong>Tours</strong> → click <strong>Add Tour</strong> to create a new tour</li>
                <li>Fill in the tour details, images, and translations</li>
                <li>Paste your <strong>Regiondo widget code</strong> in the Booking Widget section</li>
                <li>Set the tour as <strong>Published</strong> and optionally <strong>Featured</strong></li>
                <li>Edit the <strong>Homepage</strong> hero text and CTAs from the Homepage tab</li>
                <li>Manage SEO titles and meta descriptions in <strong>Settings & SEO</strong></li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="tours"><ToursTab /></TabsContent>
          <TabsContent value="destinations"><DestinationsTab /></TabsContent>
          <TabsContent value="blog"><BlogTab /></TabsContent>
          <TabsContent value="reviews"><ReviewsTab /></TabsContent>
          <TabsContent value="faqs"><FaqsTab /></TabsContent>
          <TabsContent value="homepage"><HomepageTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
          <p className="text-sm text-muted-foreground mt-1">Add tours and paste Regiondo widget codes for instant online booking</p>
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
  const [form, setForm] = useState({ slug: "", name: "", country: "Brazil", imageUrl: "", description: "", featured: true });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Destinations ({destinations?.length ?? 0})</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add Destination</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Destination</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Rio de Janeiro" /></div>
                <div className="space-y-1"><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({...f, slug:e.target.value}))} placeholder="rio-de-janeiro" /></div>
              </div>
              <div className="space-y-1"><Label>Image URL</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl:e.target.value}))} placeholder="https://images.unsplash.com/..." /></div>
              {form.imageUrl && <img src={form.imageUrl} alt="" className="h-24 w-full object-cover rounded-lg border" onError={e => (e.target as HTMLImageElement).style.display="none"} />}
              <div className="space-y-1"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm(f => ({...f, description:e.target.value}))} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={v => setForm(f => ({...f,featured:v}))} /><Label>Featured</Label></div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createDest.mutate({ data: form }); setCreateOpen(false); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destination</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? [...Array(4)].map((_,i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : destinations?.map(dest => (
                <TableRow key={dest.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {dest.imageUrl && <img src={dest.imageUrl} alt="" className="w-10 h-8 rounded object-cover flex-shrink-0" />}
                      <span className="font-medium">{dest.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{dest.country}</TableCell>
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
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Name</Label><Input defaultValue={editDest.name} onChange={e => setEditDest(d => d ? {...d, name:e.target.value} : null)} /></div>
                <div className="space-y-1"><Label>Slug</Label><Input defaultValue={editDest.slug} onChange={e => setEditDest(d => d ? {...d, slug:e.target.value} : null)} /></div>
              </div>
              <div className="space-y-1"><Label>Image URL</Label><Input defaultValue={editDest.imageUrl ?? ""} onChange={e => setEditDest(d => d ? {...d, imageUrl:e.target.value} : null)} /></div>
              {editDest.imageUrl && <img src={editDest.imageUrl} alt="" className="h-24 w-full object-cover rounded-lg border" onError={e => (e.target as HTMLImageElement).style.display="none"} />}
              <div className="space-y-1"><Label>Description</Label><Textarea rows={3} defaultValue={editDest.description ?? ""} onChange={e => setEditDest(d => d ? {...d, description:e.target.value} : null)} /></div>
              <div className="flex items-center gap-2"><Switch checked={!!editDest.featured} onCheckedChange={v => setEditDest(d => d ? {...d, featured:v} : null)} /><Label>Featured</Label></div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setEditDest(null)}>Cancel</Button>
                <Button onClick={() => { updateDest.mutate({ id: editDest.id, data: editDest as Parameters<typeof updateDest.mutate>[0]["data"] }); setEditDest(null); }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
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

  const emptyForm = { slug: "", title: "", excerpt: "", content: "", imageUrl: "", author: "Janeiro Tour Editorial", category: "Travel Guide", readTimeMinutes: 5, featured: false, published: true };
  const [form, setForm] = useState(emptyForm);
  const setF = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const BlogFormFields = ({ values, onChange }: { values: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) => (
    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Title *</Label><Input value={values.title as string} onChange={e => onChange("title", e.target.value)} /></div>
        <div className="space-y-1"><Label>Slug</Label><Input value={values.slug as string} onChange={e => onChange("slug", e.target.value)} /></div>
      </div>
      <div className="space-y-1"><Label>Image URL</Label><Input value={values.imageUrl as string} onChange={e => onChange("imageUrl", e.target.value)} placeholder="https://images.unsplash.com/..." /></div>
      {(values.imageUrl as string) && <img src={values.imageUrl as string} alt="" className="h-24 w-full object-cover rounded-lg border" onError={e => (e.target as HTMLImageElement).style.display="none"} />}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Author</Label><Input value={values.author as string} onChange={e => onChange("author", e.target.value)} /></div>
        <div className="space-y-1"><Label>Category</Label><Input value={values.category as string} onChange={e => onChange("category", e.target.value)} /></div>
      </div>
      <div className="space-y-1"><Label>Excerpt</Label><Textarea rows={2} value={values.excerpt as string} onChange={e => onChange("excerpt", e.target.value)} /></div>
      <div className="space-y-1"><Label>Content</Label><Textarea rows={6} value={values.content as string} onChange={e => onChange("content", e.target.value)} /></div>
      <div className="space-y-1"><Label>Read Time (min)</Label><Input type="number" value={values.readTimeMinutes as number} onChange={e => onChange("readTimeMinutes", parseInt(e.target.value))} className="w-32" /></div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2"><Switch checked={values.published as boolean} onCheckedChange={v => onChange("published",v)} /><Label>Published</Label></div>
        <div className="flex items-center gap-2"><Switch checked={values.featured as boolean} onCheckedChange={v => onChange("featured",v)} /><Label>Featured</Label></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Blog Posts ({posts?.length ?? 0})</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add Post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Add Blog Post</DialogTitle></DialogHeader>
            <BlogFormFields values={form} onChange={setF} />
            <div className="flex gap-3 justify-end pt-3 border-t">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={() => { createPost.mutate({ data: form }); setCreateOpen(false); setForm(emptyForm); }}>Save Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Author</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? [...Array(4)].map((_,i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : posts?.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{post.category}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{post.author}</TableCell>
                  <TableCell>{post.published && <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Published</Badge>}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
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
            <BlogFormFields
              values={editPost as unknown as Record<string, unknown>}
              onChange={(k, v) => setEditPost(p => p ? {...p, [k]: v} as Post : null)}
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
              <div className="space-y-1"><Label>Rating (1–5)</Label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setF("rating",n)} className={`text-2xl transition-colors ${n <= form.rating ? "text-yellow-400" : "text-gray-300"}`}>★</button>
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
                      <Button variant="ghost" size="sm" title={r.featured ? "Remove from featured" : "Feature this review"} onClick={() => updateReview.mutate({ id: r.id, data: { featured: !r.featured } })}>
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
  const [form, setForm] = useState({ question:"", answer:"", sortOrder: 10 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">FAQs ({faqs?.length ?? 0})</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add FAQ</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add FAQ</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1"><Label>Question (English)</Label><Input value={form.question} onChange={e => setForm(f => ({...f,question:e.target.value}))} /></div>
              <div className="space-y-1"><Label>Answer (English)</Label><Textarea rows={4} value={form.answer} onChange={e => setForm(f => ({...f,answer:e.target.value}))} /></div>
              <div className="space-y-1"><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm(f => ({...f,sortOrder:parseInt(e.target.value)}))} className="w-28" /></div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createFaq.mutate({ data: form }); setCreateOpen(false); setForm({question:"",answer:"",sortOrder:10}); }}>Save FAQ</Button>
              </div>
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
  // Initialize form when settings load (only once)
  const formInitialized = form !== null;
  if (!formInitialized && settings) {
    // This is safe as a synchronous init before render tree commits
    setForm(settings as unknown as Record<string,string>);
  }
  const setF = (k: string, v: string) => setForm(f => f ? {...f,[k]:v} : null);

  const save = () => {
    if (!form) return;
    updateSettings.mutate({ data: form as Parameters<typeof updateSettings.mutate>[0]["data"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (isLoading || !form) return <Skeleton className="h-96 w-full rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Homepage Content</h2>
          <p className="text-sm text-muted-foreground mt-1">Edit the text, CTAs and contact info displayed on the homepage</p>
        </div>
        <Button onClick={save} className="min-w-[120px]">{saved ? "✓ Saved!" : "Save Changes"}</Button>
      </div>

      <div className="space-y-8">
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-base">🌟 Hero Section</h3>
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
          <h3 className="font-semibold text-base">📞 Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.contactEmail ?? ""} onChange={e => setF("contactEmail",e.target.value)} /></div>
            <div className="space-y-1"><Label>Phone</Label><Input value={form.contactPhone ?? ""} onChange={e => setF("contactPhone",e.target.value)} /></div>
          </div>
          <div className="space-y-1"><Label>WhatsApp Link (full wa.me URL)</Label><Input value={form.contactWhatsapp ?? ""} onChange={e => setF("contactWhatsapp",e.target.value)} placeholder="https://wa.me/5521972633333" /></div>
          <div className="space-y-1"><Label>Address</Label><Input value={form.address ?? ""} onChange={e => setF("address",e.target.value)} /></div>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-base">🔗 Social Media</h3>
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
  const formInitialized = form !== null;
  if (!formInitialized && settings) {
    setForm(settings as unknown as Record<string,string>);
  }
  const setF = (k: string, v: string) => setForm(f => f ? {...f,[k]:v} : null);

  if (isLoading || !form) return <Skeleton className="h-96 w-full rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Settings & SEO</h2>
          <p className="text-sm text-muted-foreground mt-1">Global site settings and search engine optimization</p>
        </div>
        <Button onClick={() => {
          updateSettings.mutate({ data: form as Parameters<typeof updateSettings.mutate>[0]["data"] });
          setSaved(true); setTimeout(() => setSaved(false), 2500);
        }} className="min-w-[120px]">
          {saved ? "✓ Saved!" : "Save Settings"}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">🔍 SEO Settings</h3>
          <p className="text-sm text-muted-foreground">These values appear in Google search results and social media previews</p>
          <div className="space-y-1"><Label>Site Title / Brand Name</Label><Input value={form.siteName ?? ""} onChange={e => setF("siteName",e.target.value)} placeholder="Janeiro Tour & Travel" /></div>
          <div className="space-y-1">
            <div className="flex justify-between"><Label>Default SEO Title</Label><span className="text-xs text-muted-foreground">{(form.seoTitle ?? "").length}/60 chars</span></div>
            <Input value={form.seoTitle ?? ""} onChange={e => setF("seoTitle",e.target.value)} placeholder="Brazil Tours & Travel Experiences | Janeiro Tour" maxLength={60} />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between"><Label>Default Meta Description</Label><span className="text-xs text-muted-foreground">{(form.seoDescription ?? "").length}/160 chars</span></div>
            <Textarea rows={3} value={form.seoDescription ?? ""} onChange={e => setF("seoDescription",e.target.value)} placeholder="Discover Brazil with Janeiro Tour. Premium tours, private experiences and airport transfers in Rio de Janeiro, Iguazu Falls, Amazon and more." maxLength={160} />
          </div>
          <div className="space-y-1"><Label>OG Image URL (for social sharing)</Label><Input value={form.ogImageUrl ?? ""} onChange={e => setF("ogImageUrl",e.target.value)} placeholder="https://..." /></div>
        </div>

        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">🌐 Languages</h3>
          <p className="text-sm text-muted-foreground">The site supports English, Spanish and Portuguese. Use the Tour and FAQ editors to add translations per content item.</p>
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
