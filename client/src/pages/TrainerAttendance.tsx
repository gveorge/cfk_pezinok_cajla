import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ArrowLeft } from "lucide-react";
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

        {/* Compact Attendance Table */}
        {playersLoading ? (
          <div className="text-center py-12 text-muted-foreground">Načítavam dochádzku...</div>
        ) : players.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left p-3 font-semibold text-sm">Hráč</th>
                      <th className="text-left p-3 font-semibold text-sm">Kategória</th>
                      <th className="text-center p-3 font-semibold text-sm">Tréningy</th>
                      <th className="text-center p-3 font-semibold text-sm">Prítomnosť</th>
                      <th className="text-center p-3 font-semibold text-sm">Dochádzka</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {players.map((player: any) => (
                      <PlayerAttendanceRow
                        key={player.id}
                        player={player}
                        dateRange={getDateRange()}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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

function PlayerAttendanceRow({ player, dateRange }: { player: any; dateRange: any }) {
  const { data: stats } = trpc.attendance.getStats.useQuery({
    playerId: player.id,
    ...dateRange,
  });

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const categoryLabels: Record<string, string> = {
    "U8-U9": "U8-U9",
    "U10-U11": "U10-U11",
    "U13": "U13",
    "U15": "U15",
    "A": "A tím",
  };

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="p-3">
        <div className="font-medium text-sm">{player.name}</div>
        {player.position && (
          <div className="text-xs text-muted-foreground">{player.position}</div>
        )}
      </td>
      <td className="p-3">
        <span className="text-sm text-muted-foreground">
          {categoryLabels[player.category] || player.category}
        </span>
      </td>
      <td className="p-3 text-center">
        <span className="text-sm font-medium">{stats?.total || 0}</span>
      </td>
      <td className="p-3 text-center">
        <span className="text-sm font-medium">{stats?.present || 0}</span>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${getPercentageColor(stats?.percentage || 0)}`}>
            {stats?.percentage || 0}%
          </span>
        </div>
      </td>
    </tr>
  );
}
