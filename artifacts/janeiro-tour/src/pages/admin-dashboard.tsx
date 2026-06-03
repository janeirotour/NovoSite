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
  Settings, LogOut, Plus, Pencil, Trash2, BarChart3, Users, Globe
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

// Simple Tour Form
function TourForm({ tour, onSave, onClose }: { tour?: Record<string, unknown>; onSave: (data: Record<string, unknown>) => void; onClose: () => void }) {
  const [form, setForm] = useState<Record<string, unknown>>({
    slug: tour?.slug ?? "", title: tour?.title ?? "", destination: tour?.destination ?? "",
    category: tour?.category ?? "sightseeing", durationHours: tour?.durationHours ?? 4,
    priceFrom: tour?.priceFrom ?? 50, currency: tour?.currency ?? "USD",
    tourType: tour?.tourType ?? "group", groupSizeMax: tour?.groupSizeMax ?? 15,
    imageUrl: tour?.imageUrl ?? "", overview: tour?.overview ?? "",
    meetingPoint: tour?.meetingPoint ?? "", cancellationPolicy: tour?.cancellationPolicy ?? "Free cancellation up to 24 hours before.",
    published: tour?.published ?? true, featured: tour?.featured ?? false,
    languages: tour?.languages ?? ["English"], highlights: tour?.highlights ?? [],
    includedItems: tour?.includedItems ?? [], notIncludedItems: tour?.notIncludedItems ?? [],
    itinerary: tour?.itinerary ?? [],
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Title</Label><Input value={form.title as string} onChange={e => set("title", e.target.value)} /></div>
        <div className="space-y-1"><Label>Slug</Label><Input value={form.slug as string} onChange={e => set("slug", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1"><Label>Destination</Label><Input value={form.destination as string} onChange={e => set("destination", e.target.value)} /></div>
        <div className="space-y-1"><Label>Category</Label>
          <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.category as string} onChange={e => set("category", e.target.value)}>
            {["sightseeing","nature","culture","transfer","private","package"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1"><Label>Duration (h)</Label><Input type="number" value={form.durationHours as number} onChange={e => set("durationHours", parseFloat(e.target.value))} /></div>
        <div className="space-y-1"><Label>Price From</Label><Input type="number" value={form.priceFrom as number} onChange={e => set("priceFrom", parseFloat(e.target.value))} /></div>
        <div className="space-y-1"><Label>Max Group</Label><Input type="number" value={form.groupSizeMax as number} onChange={e => set("groupSizeMax", parseInt(e.target.value))} /></div>
      </div>
      <div className="space-y-1"><Label>Image URL</Label><Input value={form.imageUrl as string} onChange={e => set("imageUrl", e.target.value)} /></div>
      <div className="space-y-1"><Label>Overview</Label><Textarea rows={3} value={form.overview as string} onChange={e => set("overview", e.target.value)} /></div>
      <div className="space-y-1"><Label>Meeting Point</Label><Input value={form.meetingPoint as string} onChange={e => set("meetingPoint", e.target.value)} /></div>
      <div className="space-y-1"><Label>Cancellation Policy</Label><Input value={form.cancellationPolicy as string} onChange={e => set("cancellationPolicy", e.target.value)} /></div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2"><Switch checked={form.published as boolean} onCheckedChange={v => set("published", v)} /><Label>Published</Label></div>
        <div className="flex items-center gap-2"><Switch checked={form.featured as boolean} onCheckedChange={v => set("featured", v)} /><Label>Featured</Label></div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(form)}>Save Tour</Button>
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
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard size={16} className="text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-sm">Janeiro Tour Admin</p>
            <p className="text-xs text-muted-foreground">Welcome, {me.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>View Site</Button>
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
              { value: "settings", icon: Settings, label: "Settings" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger key={value} value={value} className="gap-1.5 text-sm">
                <Icon size={14} />{label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Tours" value={stats?.totalTours ?? 0} icon={Package} color="bg-primary" />
              <StatCard label="Destinations" value={stats?.totalDestinations ?? 0} icon={MapPin} color="bg-accent" />
              <StatCard label="Reviews" value={stats?.totalReviews ?? 0} icon={Star} color="bg-orange-500" />
              <StatCard label="Blog Posts" value={stats?.totalBlogPosts ?? 0} icon={FileText} color="bg-purple-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Published Tours" value={stats?.publishedTours ?? 0} icon={Globe} color="bg-blue-500" />
              <StatCard label="Featured Tours" value={stats?.featuredTours ?? 0} icon={BarChart3} color="bg-indigo-500" />
              <StatCard label="Avg Rating" value={stats ? `${Number(stats.averageRating).toFixed(1)}/5` : "—"} icon={Star} color="bg-yellow-500" />
            </div>
          </TabsContent>

          {/* Tours Tab */}
          <TabsContent value="tours">
            <ToursTab />
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinations">
            <DestinationsTab />
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <BlogTab />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <FaqsTab />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
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
        <h2 className="text-2xl font-bold">Tours ({tours?.length ?? 0})</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1"><Plus size={15} /> Add Tour</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Add Tour</DialogTitle></DialogHeader>
            <TourForm onSave={(data) => { createTour.mutate({ data: data as unknown as Parameters<typeof createTour.mutate>[0]["data"] }); setCreateOpen(false); }} onClose={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
              ))
            ) : tours?.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{tour.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{tour.destination}</TableCell>
                <TableCell className="text-sm">${tour.priceFrom}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
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
                        <DialogHeader><DialogTitle>Edit Tour</DialogTitle></DialogHeader>
                        {editTour && <TourForm tour={editTour} onSave={(data) => { updateTour.mutate({ id: tour.id, data: data as Parameters<typeof updateTour.mutate>[0]["data"] }); setEditTour(null); }} onClose={() => setEditTour(null)} />}
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
  const [editDest, setEditDest] = useState<typeof destinations extends (infer T)[] | undefined ? T | null : null>(null);
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
              {(["slug","name","country","imageUrl","description"] as const).map(k => (
                <div key={k} className="space-y-1">
                  <Label className="capitalize">{k}</Label>
                  {k === "description" ? <Textarea rows={3} value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} /> : <Input value={form[k] as string} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} />}
                </div>
              ))}
              <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={v => setForm(f => ({...f,featured:v}))} /><Label>Featured</Label></div>
              <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createDest.mutate({ data: form }); setCreateOpen(false); }}>Save</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Country</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? [...Array(4)].map((_,i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : destinations?.map(dest => (
                <TableRow key={dest.id}>
                  <TableCell className="font-medium">{dest.name}</TableCell>
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
            <DialogHeader><DialogTitle>Edit Destination</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {(["slug","name","country","imageUrl","description"] as const).map(k => (
                <div key={k} className="space-y-1">
                  <Label className="capitalize">{k}</Label>
                  {k === "description"
                    ? <Textarea rows={3} defaultValue={(editDest as unknown as Record<string,string>)[k]} onChange={e => setEditDest(d => d ? {...d,[k]:e.target.value} : null)} />
                    : <Input defaultValue={(editDest as unknown as Record<string,string>)[k]} onChange={e => setEditDest(d => d ? {...d,[k]:e.target.value} : null)} />}
                </div>
              ))}
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
  const [editPost, setEditPost] = useState<typeof posts extends (infer T)[] | undefined ? T | null : null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const emptyForm = { slug: "", title: "", excerpt: "", content: "", imageUrl: "", author: "Janeiro Tour Editorial", category: "Travel Guide", readTimeMinutes: 5, featured: false, published: true };
  const [form, setForm] = useState(emptyForm);
  const setF = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Blog Posts ({posts?.length ?? 0})</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add Post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Add Blog Post</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {(["slug","title","excerpt","imageUrl","author","category"] as const).map(k => (
                <div key={k} className="space-y-1"><Label className="capitalize">{k}</Label><Input value={form[k] as string} onChange={e => setF(k,e.target.value)} /></div>
              ))}
              <div className="space-y-1"><Label>Content</Label><Textarea rows={5} value={form.content} onChange={e => setF("content",e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Read Time (min)</Label><Input type="number" value={form.readTimeMinutes} onChange={e => setF("readTimeMinutes",parseInt(e.target.value))} /></div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={v => setF("published",v)} /><Label>Published</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={v => setF("featured",v)} /><Label>Featured</Label></div>
              </div>
              <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createPost.mutate({ data: form }); setCreateOpen(false); setForm(emptyForm); }}>Save</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? [...Array(4)].map((_,i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : posts?.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{post.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{post.category}</TableCell>
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
            <DialogHeader><DialogTitle>Edit Post</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {(["slug","title","excerpt","imageUrl","author","category"] as const).map(k => (
                <div key={k} className="space-y-1"><Label className="capitalize">{k}</Label>
                  <Input defaultValue={editPost[k] as string} onChange={e => setEditPost(p => p ? {...p,[k]:e.target.value} : null)} /></div>
              ))}
              <div className="space-y-1"><Label>Content</Label><Textarea rows={5} defaultValue={editPost.content} onChange={e => setEditPost(p => p ? {...p,content:e.target.value} : null)} /></div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={!!editPost.published} onCheckedChange={v => setEditPost(p => p ? {...p,published:v} : null)} /><Label>Published</Label></div>
                <div className="flex items-center gap-2"><Switch checked={!!editPost.featured} onCheckedChange={v => setEditPost(p => p ? {...p,featured:v} : null)} /><Label>Featured</Label></div>
              </div>
              <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setEditPost(null)}>Cancel</Button>
                <Button onClick={() => { updatePost.mutate({ id: editPost.id, data: editPost as Parameters<typeof updatePost.mutate>[0]["data"] }); setEditPost(null); }}>Save</Button></div>
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
        <h2 className="text-2xl font-bold">Reviews ({reviews?.length ?? 0})</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild><Button className="gap-1"><Plus size={15} /> Add Review</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Review</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {(["authorName","authorCountry","tourName","source","comment"] as const).map(k => (
                <div key={k} className="space-y-1"><Label className="capitalize">{k}</Label>
                  {k === "comment" ? <Textarea rows={3} value={form[k] as string} onChange={e => setF(k,e.target.value)} /> : <Input value={form[k] as string} onChange={e => setF(k,e.target.value)} />}</div>
              ))}
              <div className="space-y-1"><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={e => setF("rating",parseInt(e.target.value))} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={v => setF("featured",v)} /><Label>Featured</Label></div>
              <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createReview.mutate({ data: form }); setCreateOpen(false); }}>Save</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Author</TableHead><TableHead>Country</TableHead><TableHead>Rating</TableHead><TableHead>Tour</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? [...Array(4)].map((_,i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : reviews?.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.authorName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.authorCountry}</TableCell>
                  <TableCell>{"★".repeat(r.rating)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[120px] truncate">{r.tourName ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => updateReview.mutate({ id: r.id, data: { featured: !r.featured } })}>
                        <span className={r.featured ? "text-primary" : "text-muted-foreground"}>★</span>
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
  const [editFaq, setEditFaq] = useState<typeof faqs extends (infer T)[] | undefined ? T | null : null>(null);
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
              <div className="space-y-1"><Label>Question</Label><Input value={form.question} onChange={e => setForm(f => ({...f,question:e.target.value}))} /></div>
              <div className="space-y-1"><Label>Answer</Label><Textarea rows={4} value={form.answer} onChange={e => setForm(f => ({...f,answer:e.target.value}))} /></div>
              <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => { createFaq.mutate({ data: form }); setCreateOpen(false); setForm({question:"",answer:"",sortOrder:10}); }}>Save</Button></div>
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
                  <TableCell className="max-w-[400px]">
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
            <div className="space-y-3">
              <div className="space-y-1"><Label>Question</Label><Input defaultValue={editFaq.question} onChange={e => setEditFaq(f => f ? {...f,question:e.target.value} : null)} /></div>
              <div className="space-y-1"><Label>Question (ES)</Label><Input defaultValue={editFaq.questionEs ?? ""} onChange={e => setEditFaq(f => f ? {...f,questionEs:e.target.value} : null)} /></div>
              <div className="space-y-1"><Label>Question (PT)</Label><Input defaultValue={editFaq.questionPt ?? ""} onChange={e => setEditFaq(f => f ? {...f,questionPt:e.target.value} : null)} /></div>
              <div className="space-y-1"><Label>Answer</Label><Textarea rows={3} defaultValue={editFaq.answer} onChange={e => setEditFaq(f => f ? {...f,answer:e.target.value} : null)} /></div>
              <div className="space-y-1"><Label>Answer (ES)</Label><Textarea rows={2} defaultValue={editFaq.answerEs ?? ""} onChange={e => setEditFaq(f => f ? {...f,answerEs:e.target.value} : null)} /></div>
              <div className="space-y-1"><Label>Answer (PT)</Label><Textarea rows={2} defaultValue={editFaq.answerPt ?? ""} onChange={e => setEditFaq(f => f ? {...f,answerPt:e.target.value} : null)} /></div>
              <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setEditFaq(null)}>Cancel</Button>
                <Button onClick={() => { updateFaq.mutate({ id: editFaq.id, data: editFaq as Parameters<typeof updateFaq.mutate>[0]["data"] }); setEditFaq(null); }}>Save</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function SettingsTab() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }) } });
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Record<string,string> | null>(null);

  if (!form && settings) {
    setForm(settings as unknown as Record<string,string>);
  }

  const setF = (k: string, v: string) => setForm(f => f ? {...f,[k]:v} : null);

  if (isLoading || !form) return <Skeleton className="h-96 w-full rounded-xl" />;

  const textFields: Array<{ key: string; label: string; textarea?: boolean }> = [
    { key: "heroHeadline", label: "Hero Headline" },
    { key: "heroHeadlineEs", label: "Hero Headline (ES)" },
    { key: "heroHeadlinePt", label: "Hero Headline (PT)" },
    { key: "heroSubheadline", label: "Hero Subheadline", textarea: true },
    { key: "heroSubheadlineEs", label: "Hero Subheadline (ES)", textarea: true },
    { key: "heroSubheadlinePt", label: "Hero Subheadline (PT)", textarea: true },
    { key: "heroPrimaryCtaText", label: "Primary CTA Button" },
    { key: "heroSecondaryCtaText", label: "Secondary CTA Button" },
    { key: "contactEmail", label: "Contact Email" },
    { key: "contactPhone", label: "Contact Phone" },
    { key: "contactWhatsapp", label: "WhatsApp Link" },
    { key: "address", label: "Address" },
    { key: "instagramUrl", label: "Instagram URL" },
    { key: "facebookUrl", label: "Facebook URL" },
    { key: "tripadvisorUrl", label: "TripAdvisor URL" },
    { key: "googleReviewsUrl", label: "Google Reviews URL" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <Button onClick={() => { updateSettings.mutate({ data: form as Parameters<typeof updateSettings.mutate>[0]["data"] }); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>
      <div className="bg-card border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {textFields.map(({ key, label, textarea }) => (
          <div key={key} className={`space-y-1 ${textarea ? "md:col-span-2" : ""}`}>
            <Label className="text-sm text-muted-foreground">{label}</Label>
            {textarea
              ? <Textarea rows={2} value={form[key] ?? ""} onChange={e => setF(key, e.target.value)} />
              : <Input value={form[key] ?? ""} onChange={e => setF(key, e.target.value)} />}
          </div>
        ))}
      </div>
    </div>
  );
}
