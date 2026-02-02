import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function TrainerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const loginMutation = trpc.trainer.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        username,
        password,
      });

      if (result.success) {
        toast.success(`Vitajte, ${result.trainer.fullName}!`);
        // Store trainer info in localStorage
        localStorage.setItem("trainerSession", JSON.stringify(result.trainer));
        setLocation("/trainer-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Prihlásenie zlyhalo. Skúste znova.");
      toast.error("Chyba pri prihlásení");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/club-logo.jpg" alt="CFK Pezinok Cajla" className="h-20 w-20 mx-auto mb-4 rounded" />
          <h1 className="text-3xl font-bold text-gray-900">CFK Pezinok Cajla</h1>
          <p className="text-gray-600 mt-1">Trénerská sekcia</p>
        </div>

        {/* Login Card */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="text-green-900">Prihlásenie trénerov</CardTitle>
            <CardDescription>Zadajte vaše prihlasovacie údaje</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Meno používateľa
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="napr. Siandorj"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Heslo
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Zadajte heslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-green-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-2"
              >
                {isLoading ? "Prihlasovanie..." : "Prihlásiť sa"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">
                <strong>Testovací účty:</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                <li>• Siandorj / Cajla123</li>
                <li>• Cajkovicm / Cajla123</li>
                <li>• Hupkas / Cajla123</li>
                <li>• Jedinakp / Cajla123</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          <button onClick={() => setLocation("/")} className="text-green-600 hover:text-green-700 font-medium">
            ← Späť na domovskú stránku
        </button>
        </p>
      </div>
    </div>
  );
}
