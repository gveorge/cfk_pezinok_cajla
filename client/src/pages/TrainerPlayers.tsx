import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const categories = [
  { value: "U8-U9", label: "Mladšia prípravka (U8-U9)" },
  { value: "U10-U11", label: "Staršia prípravka (U10-U11)" },
  { value: "U13", label: "Mladší žiaci (U13)" },
  { value: "U15", label: "Starší žiaci (U15)" },
  { value: "A", label: "A mužstvo" },
];

export default function TrainerPlayers() {
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<any>(null);

  const utils = trpc.useUtils();
  const { data: players = [], isLoading } = trpc.players.list.useQuery(
    selectedCategory === "all" ? {} : { category: selectedCategory as any }
  );

  const createMutation = trpc.players.create.useMutation({
    onSuccess: () => {
      utils.players.list.invalidate();
      setIsDialogOpen(false);
      toast.success("Hráč bol úspešne vytvorený");
    },
    onError: (error) => {
      toast.error("Chyba pri vytváraní hráča: " + error.message);
    },
  });

  const updateMutation = trpc.players.update.useMutation({
    onSuccess: () => {
      utils.players.list.invalidate();
      setIsDialogOpen(false);
      setEditingPlayer(null);
      toast.success("Hráč bol úspešne aktualizovaný");
    },
    onError: (error) => {
      toast.error("Chyba pri aktualizácii hráča: " + error.message);
    },
  });

  const deleteMutation = trpc.players.delete.useMutation({
    onSuccess: () => {
      utils.players.list.invalidate();
      toast.success("Hráč bol úspešne odstránený");
    },
    onError: (error) => {
      toast.error("Chyba pri odstraňovaní hráča: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      dateOfBirth: formData.get("dateOfBirth") as string || undefined,
      category: formData.get("category") as any,
      parentName: formData.get("parentName") as string || undefined,
      parentPhone: formData.get("parentPhone") as string || undefined,
      parentEmail: formData.get("parentEmail") as string || undefined,
      notes: formData.get("notes") as string || undefined,
    };

    if (editingPlayer) {
      updateMutation.mutate({ id: editingPlayer.id, ...data });
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
            <h1 className="text-3xl font-bold text-foreground">Správa hráčov</h1>
            <p className="text-muted-foreground">Pridávajte a spravujte hráčov klubu</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPlayer(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať hráča
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingPlayer ? "Upraviť hráča" : "Pridať nového hráča"}</DialogTitle>
                  <DialogDescription>
                    Vyplňte informácie o hráčovi
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Meno a priezvisko *</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editingPlayer?.name}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">Dátum narodenia</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      defaultValue={editingPlayer?.dateOfBirth ? new Date(editingPlayer.dateOfBirth).toISOString().split('T')[0] : ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategória *</Label>
                    <Select name="category" defaultValue={editingPlayer?.category} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte kategóriu" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parentName">Meno rodiča</Label>
                    <Input
                      id="parentName"
                      name="parentName"
                      defaultValue={editingPlayer?.parentName || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parentPhone">Telefón rodiča</Label>
                    <Input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      defaultValue={editingPlayer?.parentPhone || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parentEmail">Email rodiča</Label>
                    <Input
                      id="parentEmail"
                      name="parentEmail"
                      type="email"
                      defaultValue={editingPlayer?.parentEmail || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Poznámky</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      defaultValue={editingPlayer?.notes || ''}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Zrušiť
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingPlayer ? "Uložiť zmeny" : "Pridať hráča"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            Všetci
          </Button>
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

        {/* Players List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam hráčov...</div>
        ) : players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player: any) => (
              <Card key={player.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{player.name}</CardTitle>
                      <CardDescription>{categories.find(c => c.value === player.category)?.label}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingPlayer(player);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Naozaj chcete odstrániť tohto hráča?")) {
                            deleteMutation.mutate({ id: player.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    {player.dateOfBirth && (
                      <p className="text-muted-foreground">
                        Narodený: {new Date(player.dateOfBirth).toLocaleDateString("sk-SK")}
                      </p>
                    )}
                    {player.parentName && (
                      <p className="text-muted-foreground">Rodič: {player.parentName}</p>
                    )}
                    {player.parentPhone && (
                      <p className="text-muted-foreground">Tel: {player.parentPhone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Zatiaľ nie sú žiadni hráči.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať prvého hráča
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
