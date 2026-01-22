import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const categories = [
  { value: "all", label: "Všetky kategórie" },
  { value: "U8-U9", label: "Mladšia prípravka (U8-U9)" },
  { value: "U10-U11", label: "Staršia prípravka (U10-U11)" },
  { value: "U13", label: "Mladší žiaci (U13)" },
  { value: "U15", label: "Starší žiaci (U15)" },
  { value: "A", label: "A mužstvo" },
];

const months = [
  { value: "all", label: "Celková dochádzka" },
  { value: "0", label: "Január" },
  { value: "1", label: "Február" },
  { value: "2", label: "Marec" },
  { value: "3", label: "Apríl" },
  { value: "4", label: "Máj" },
  { value: "5", label: "Jún" },
  { value: "6", label: "Júl" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "Október" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

export default function TrainerAttendance() {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const currentYear = new Date().getFullYear();

  const { data: players = [], isLoading: playersLoading } = trpc.players.list.useQuery(
    selectedCategory === "all" ? {} : { category: selectedCategory as any }
  );

  // Calculate date range for selected month
  const getDateRange = () => {
    if (selectedMonth === "all") return { startDate: undefined, endDate: undefined };
    
    const monthNum = parseInt(selectedMonth);
    const startDate = new Date(currentYear, monthNum, 1);
    const endDate = new Date(currentYear, monthNum + 1, 0, 23, 59, 59);
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Prehľad dochádzky</h1>
          <p className="text-muted-foreground">Sledujte dochádzku hráčov na tréningy</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="text-sm font-medium mb-2 block">Kategória</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
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
          <div>
            <label className="text-sm font-medium mb-2 block">Obdobie</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Attendance Stats */}
        {playersLoading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam dochádzku...</div>
        ) : players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player: any) => (
              <PlayerAttendanceCard
                key={player.id}
                player={player}
                dateRange={getDateRange()}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {selectedCategory === "all"
                  ? "Zatiaľ nie sú žiadni hráči."
                  : "V tejto kategórii nie sú žiadni hráči."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function PlayerAttendanceCard({ player, dateRange }: { player: any; dateRange: any }) {
  const { data: stats } = trpc.attendance.getStats.useQuery({
    playerId: player.id,
    ...dateRange,
  });

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{player.name}</CardTitle>
        <CardDescription>
          {categories.find(c => c.value === player.category)?.label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Celkovo tréningov</span>
            </div>
            <span className="font-semibold">{stats?.total || 0}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Zúčastnených</span>
            </div>
            <span className="font-semibold">{stats?.present || 0}</span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Dochádzka</span>
              <span className={`text-2xl font-bold ${getPercentageColor(stats?.percentage || 0)}`}>
                {stats?.percentage || 0}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${stats?.percentage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
