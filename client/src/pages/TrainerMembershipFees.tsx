import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const months = [
  { value: 1, label: "Január" },
  { value: 2, label: "Február" },
  { value: 3, label: "Marec" },
  { value: 4, label: "Apríl" },
  { value: 5, label: "Máj" },
  { value: 6, label: "Jún" },
  { value: 7, label: "Júl" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "Október" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export default function TrainerMembershipFees() {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: players = [], isLoading: loadingPlayers } = trpc.players.list.useQuery(
    selectedCategory === "all" ? {} : { category: selectedCategory as any }
  );

  const { data: payments = [], isLoading: loadingPayments, refetch } = trpc.membershipPayments.getAll.useQuery();

  const setPaymentMutation = trpc.membershipPayments.setPayment.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Platba bola aktualizovaná");
    },
    onError: (error) => {
      toast.error(`Chyba: ${error.message}`);
    },
  });

  const handlePaymentToggle = (playerId: number, paid: boolean) => {
    setPaymentMutation.mutate({
      playerId,
      year: selectedYear,
      month: selectedMonth,
      paid,
    });
  };

  // Get payment status for a player in selected month/year
  const getPaymentStatus = (playerId: number): boolean => {
    const payment = payments.find(
      (p: any) => p.playerId === playerId && p.year === selectedYear && p.month === selectedMonth
    );
    return payment ? payment.paid === 1 : false;
  };

  // Calculate statistics
  const totalPlayers = players.length;
  const paidPlayers = players.filter((p: any) => getPaymentStatus(p.id)).length;
  const unpaidPlayers = totalPlayers - paidPlayers;
  const paymentRate = totalPlayers > 0 ? Math.round((paidPlayers / totalPlayers) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Členský poplatok</h2>
        <p className="text-muted-foreground mt-2">Správa mesačných členských poplatkov hráčov</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Celkový počet hráčov</CardDescription>
            <CardTitle className="text-3xl">{totalPlayers}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Zaplatili</CardDescription>
            <CardTitle className="text-3xl text-green-600">{paidPlayers}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Nezaplatili</CardDescription>
            <CardTitle className="text-3xl text-red-600">{unpaidPlayers}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Miera platby</CardDescription>
            <CardTitle className="text-3xl">{paymentRate}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtre</CardTitle>
          <CardDescription>Vyberte mesiac, rok a kategóriu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rok</label>
              <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mesiac</label>
              <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Kategória</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky kategórie</SelectItem>
                  <SelectItem value="U8-U9">U8-U9</SelectItem>
                  <SelectItem value="U10-U11">U10-U11</SelectItem>
                  <SelectItem value="U13">U13</SelectItem>
                  <SelectItem value="U15">U15</SelectItem>
                  <SelectItem value="A">A mužstvo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Platby za {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
          </CardTitle>
          <CardDescription>Zaškrtnite hráčov, ktorí zaplatili členský poplatok</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPlayers || loadingPayments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Žiadni hráči v tejto kategórii
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Zaplatené</TableHead>
                    <TableHead>Meno hráča</TableHead>
                    <TableHead>Kategória</TableHead>
                    <TableHead>Pozícia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player: any) => {
                    const isPaid = getPaymentStatus(player.id);
                    return (
                      <TableRow key={player.id}>
                        <TableCell>
                          <Checkbox
                            checked={isPaid}
                            onCheckedChange={(checked) => handlePaymentToggle(player.id, checked as boolean)}
                            disabled={setPaymentMutation.isPending}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell>{player.category}</TableCell>
                        <TableCell>{player.position || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
