import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Users, Calendar, BarChart3, Newspaper, Image as ImageIcon, Home, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function TrainerDashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Načítavam...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Prístup iba pre trénerov</CardTitle>
            <CardDescription>Pre prístup do trénerské sekcie sa musíte prihlásiť</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Prihlásiť sa</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    {
      href: "/trainer/players",
      icon: Users,
      title: "Hráči",
      description: "Správa hráčov a ich profilov",
    },
    {
      href: "/trainer/trainings",
      icon: Calendar,
      title: "Tréningy",
      description: "Vytváranie a správa tréningov",
    },
    {
      href: "/trainer/attendance",
      icon: BarChart3,
      title: "Dochádzka",
      description: "Prehľad dochádzky hráčov",
    },
    {
      href: "/trainer/news",
      icon: Newspaper,
      title: "Aktuality",
      description: "Správa noviniek a oznámení",
    },
    {
      href: "/trainer/gallery",
      icon: ImageIcon,
      title: "Galéria",
      description: "Nahrávanie fotografií",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/trainer">
              <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src="/club-logo.webp" alt="CFK Pezinok Cajla" className="h-16 w-16 object-contain" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Trénerská sekcia</h1>
                  <p className="text-sm text-muted-foreground">CFK Pezinok Cajla</p>
                </div>
              </a>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <a>
                    <Home className="h-4 w-4 mr-2" />
                    Domov
                  </a>
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Odhlásiť
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-foreground">Vitajte, {user?.name}!</h2>
            <p className="text-muted-foreground">Vyberte sekciu, ktorú chcete spravovať</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a>
                    <Card className="hover:shadow-lg transition-all hover:border-primary/50 border-2 h-full">
                      <CardHeader>
                        <div className="mb-2">
                          <Icon className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
