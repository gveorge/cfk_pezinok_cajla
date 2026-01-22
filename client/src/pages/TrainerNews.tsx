import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function TrainerNews() {
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);

  const utils = trpc.useUtils();
  const { data: newsItems = [], isLoading } = trpc.news.listAll.useQuery();

  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => {
      utils.news.listAll.invalidate();
      utils.news.list.invalidate();
      setIsDialogOpen(false);
      toast.success("Aktualita bola úspešne vytvorená");
    },
    onError: (error) => {
      toast.error("Chyba pri vytváraní aktuality: " + error.message);
    },
  });

  const updateMutation = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.listAll.invalidate();
      utils.news.list.invalidate();
      setIsDialogOpen(false);
      setEditingNews(null);
      toast.success("Aktualita bola úspešne aktualizovaná");
    },
    onError: (error) => {
      toast.error("Chyba pri aktualizácii aktuality: " + error.message);
    },
  });

  const deleteMutation = trpc.news.delete.useMutation({
    onSuccess: () => {
      utils.news.listAll.invalidate();
      utils.news.list.invalidate();
      toast.success("Aktualita bola úspešne odstránená");
    },
    onError: (error) => {
      toast.error("Chyba pri odstraňovaní aktuality: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      published: formData.get("published") === "on",
    };

    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, ...data });
    } else {
      createMutation.mutate(data);
    }
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
            <h1 className="text-3xl font-bold text-foreground">Správa aktualít</h1>
            <p className="text-muted-foreground">Vytvárajte a spravujte novinky klubu</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingNews(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať aktualitu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingNews ? "Upraviť aktualitu" : "Pridať novú aktualitu"}</DialogTitle>
                  <DialogDescription>
                    Vyplňte informácie o aktualite
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Nadpis *</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingNews?.title}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Obsah *</Label>
                    <Textarea
                      id="content"
                      name="content"
                      defaultValue={editingNews?.content}
                      rows={8}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">URL obrázka</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      defaultValue={editingNews?.imageUrl || ''}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Voliteľné: URL obrázka, ktorý sa zobrazí pri aktualite
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      name="published"
                      defaultChecked={editingNews?.published ?? true}
                    />
                    <Label htmlFor="published">Publikovať na hlavnej stránke</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Zrušiť
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingNews ? "Uložiť zmeny" : "Pridať aktualitu"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* News List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam aktuality...</div>
        ) : newsItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {newsItems.map((item: any) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {item.published ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Publikované
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            Koncept
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {new Date(item.createdAt).toLocaleDateString("sk-SK")} {new Date(item.createdAt).toLocaleTimeString("sk-SK", { hour: '2-digit', minute: '2-digit' })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingNews(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Naozaj chcete odstrániť túto aktualitu?")) {
                            deleteMutation.mutate({ id: item.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-3">{item.content}</p>
                  {item.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full max-w-sm h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Zatiaľ nie sú žiadne aktuality.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať prvú aktualitu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
