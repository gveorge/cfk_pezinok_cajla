import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function TrainerChangePassword() {
  const [, setLocation] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trainer, setTrainer] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('trainerSession');
    if (!session) {
      setLocation('/trainer-login');
      return;
    }
    setTrainer(JSON.parse(session));
  }, []);

  const changePasswordMutation = trpc.trainer.changePassword.useMutation();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Všetky polia sú povinné");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Nové heslá sa nezhodujú");
      return;
    }

    if (newPassword.length < 6) {
      setError("Nové heslo musí mať aspoň 6 znakov");
      return;
    }

    setIsLoading(true);
    try {
      if (!trainer) {
        setError("Trénerská relácia sa stratila. Prihláste sa znova.");
        setLocation("/trainer-login");
        return;
      }

      const result = await changePasswordMutation.mutateAsync({
        trainerId: trainer.id,
        currentPassword,
        newPassword,
      });

      if (result.success) {
        setSuccess(true);
        toast.success("Heslo bolo úspešne zmenené!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setLocation("/trainer-dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Zmena hesla zlyhala. Skúste znova.");
      toast.error("Chyba pri zmene hesla");
    } finally {
      setIsLoading(false);
    }
  };

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 border-b">
            <CardTitle className="text-2xl text-green-800">Zmena hesla</CardTitle>
            <CardDescription>Aktualizujte svoje trénerské heslo</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Heslo zmenené!</p>
                  <p className="text-sm text-green-700">Presmerovávam vás na dashboard...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aktuálne heslo
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Zadajte vaše aktuálne heslo"
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nové heslo
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Zadajte nové heslo"
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Potvrďte nové heslo
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Potvrďte nové heslo"
                  disabled={isLoading}
                  className="border-gray-300"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium py-2 rounded-lg transition-all"
              >
                {isLoading ? "Zmena hesla..." : "Zmeniť heslo"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => setLocation("/trainer-dashboard")}
                className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                ← Späť na dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
