import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { Plus, ArrowLeft, Users, Calendar as CalendarIcon } from "lucide-react";
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

export default function TrainerTrainings() {
  const { isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  const utils = trpc.useUtils();
  const { data: trainings = [], isLoading } = trpc.trainings.list.useQuery(
    selectedCategory === "all" ? {} : { category: selectedCategory as any }
  );

  const { data: players = [] } = trpc.players.list.useQuery(
    selectedTraining ? { category: selectedTraining.category } : undefined,
    { enabled: !!selectedTraining }
  );

  const { data: attendanceRecords = [] } = trpc.attendance.getByTraining.useQuery(
    { trainingId: selectedTraining?.id },
    { enabled: !!selectedTraining }
  );

  const createMutation = trpc.trainings.create.useMutation({
    onSuccess: () => {
      utils.trainings.list.invalidate();
      setIsDialogOpen(false);
      toast.success("Tréning bol úspešne vytvorený");
    },
    onError: (error) => {
      toast.error("Chyba pri vytváraní tréningu: " + error.message);
    },
  });

  const markAttendanceMutation = trpc.attendance.mark.useMutation({
    onSuccess: () => {
      utils.attendance.getByTraining.invalidate();
      toast.success("Dochádzka bola uložená");
    },
    onError: (error) => {
      toast.error("Chyba pri ukladaní dochádzky: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      date: formData.get("date") as string,
      category: formData.get("category") as any,
      location: formData.get("location") as string || undefined,
      notes: formData.get("notes") as string || undefined,
    };

    createMutation.mutate(data);
  };

  const handleAttendanceChange = (playerId: number, present: boolean) => {
    if (selectedTraining) {
      markAttendanceMutation.mutate({
        trainingId: selectedTraining.id,
        playerId,
        present,
      });
    }
  };

  const isPlayerPresent = (playerId: number) => {
    const record = attendanceRecords.find((r: any) => r.playerId === playerId);
    return record?.present || false;
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
            <h1 className="text-3xl font-bold text-foreground">Správa tréningov</h1>
            <p className="text-muted-foreground">Vytvárajte tréningy a zaznamenávajte dochádzku</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Vytvoriť tréning
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Vytvoriť nový tréning</DialogTitle>
                  <DialogDescription>
                    Vyplňte informácie o tréningu
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Dátum a čas *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategória *</Label>
                    <Select name="category" required>
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
                    <Label htmlFor="location">Miesto</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="napr. Hlavné ihrisko"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Poznámky</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Obsah tréningu, ciele..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Zrušiť
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    Vytvoriť tréning
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
            Všetky
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

        {/* Trainings List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam tréningy...</div>
        ) : trainings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainings.map((training: any) => (
              <Card key={training.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    {new Date(training.date).toLocaleDateString("sk-SK")}
                  </CardTitle>
                  <CardDescription>
                    {categories.find(c => c.value === training.category)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <p className="text-muted-foreground">
                      Čas: {new Date(training.date).toLocaleTimeString("sk-SK", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {training.location && (
                      <p className="text-muted-foreground">Miesto: {training.location}</p>
                    )}
                    {training.notes && (
                      <p className="text-muted-foreground line-clamp-2">{training.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedTraining(training);
                      setAttendanceDialogOpen(true);
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Zaznamenať dochádzku
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Zatiaľ nie sú žiadne tréningy.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Vytvoriť prvý tréning
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Attendance Dialog */}
        <Dialog open={attendanceDialogOpen} onOpenChange={setAttendanceDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Dochádzka na tréning</DialogTitle>
              <DialogDescription>
                {selectedTraining && (
                  <>
                    {new Date(selectedTraining.date).toLocaleDateString("sk-SK")} - {categories.find(c => c.value === selectedTraining.category)?.label}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {players.length > 0 ? (
                <div className="space-y-3">
                  {players.map((player: any) => (
                    <div key={player.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <Checkbox
                        id={`player-${player.id}`}
                        checked={isPlayerPresent(player.id)}
                        onCheckedChange={(checked) => handleAttendanceChange(player.id, checked as boolean)}
                      />
                      <Label
                        htmlFor={`player-${player.id}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {player.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  V tejto kategórii nie sú žiadni hráči.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setAttendanceDialogOpen(false)}>
                Zavrieť
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
