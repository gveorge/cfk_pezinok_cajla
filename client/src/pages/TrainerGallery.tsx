import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const categories = [
  { value: "all", label: "Všetky" },
  { value: "U8-U9", label: "Mladšia prípravka" },
  { value: "U10-U11", label: "Staršia prípravka" },
  { value: "U13", label: "Mladší žiaci" },
  { value: "U15", label: "Starší žiaci" },
  { value: "A", label: "A mužstvo" },
  { value: "general", label: "Všeobecné" },
];

export default function TrainerGallery() {
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: galleryItems = [], isLoading } = trpc.gallery.list.useQuery(
    selectedCategory === "all" ? {} : { category: selectedCategory }
  );

  const createMutation = trpc.gallery.create.useMutation({
    onSuccess: () => {
      utils.gallery.list.invalidate();
      setIsDialogOpen(false);
      toast.success("Fotografia bola úspešne pridaná");
    },
    onError: (error) => {
      toast.error("Chyba pri pridávaní fotografie: " + error.message);
    },
  });

  const deleteMutation = trpc.gallery.delete.useMutation({
    onSuccess: () => {
      utils.gallery.list.invalidate();
      toast.success("Fotografia bola úspešne odstránená");
    },
    onError: (error) => {
      toast.error("Chyba pri odstraňovaní fotografie: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageUrl = formData.get("imageUrl") as string;
    
    // Extract a simple key from URL for storage reference
    const imageKey = imageUrl.split('/').pop() || 'image';
    
    const data = {
      title: formData.get("title") as string || undefined,
      imageUrl,
      imageKey,
      category: formData.get("category") as any || undefined,
    };

    createMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="mb-6">
          <Link href="/trainer">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na dashboard
            </a>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Správa galérie</h1>
            <p className="text-muted-foreground">Pridávajte fotografie do klubovej galérie</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Pridať fotografiu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Pridať fotografiu</DialogTitle>
                  <DialogDescription>
                    Zadajte URL fotografie a voliteľné informácie
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">URL fotografie *</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Zadajte priamy odkaz na fotografiu
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Popis</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Voliteľný popis fotografie"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategória</Label>
                    <Select name="category">
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte kategóriu (voliteľné)" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.value !== "all").map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Zrušiť
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    Pridať fotografiu
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.value)}
              size="sm"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam galériu...</div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item: any) => (
              <Card key={item.id} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Fotografia"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm("Naozaj chcete odstrániť túto fotografiu?")) {
                          deleteMutation.mutate({ id: item.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.title && (
                    <div className="p-3 bg-card">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Zatiaľ nie sú žiadne fotografie.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať prvú fotografiu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
