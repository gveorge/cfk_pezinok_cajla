import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Users, Trophy, Calendar, Image as ImageIcon, Phone, LogOut } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const teamCategories = [
  {
    id: "U8-U9",
    title: "Mladšia prípravka",
    subtitle: "U8-U9",
    description: "Nájmlad­ší hráči klubu začínajú svoju futbalovú cestu",
    icon: "⚽",
  },
  {
    id: "U10-U11",
    title: "Staršia prípravka",
    subtitle: "U10-U11",
    description: "Rozvíjanie základných futbalových zručností",
    icon: "🎯",
  },
  {
    id: "U13",
    title: "Mladší žiaci",
    subtitle: "U13",
    description: "Prechod k organizovanému tímovému futbalu",
    icon: "⚡",
  },
  {
    id: "U15",
    title: "Starší žiaci",
    subtitle: "U15",
    description: "Príprava na seniorský futbal",
    icon: "🔥",
  },
  {
    id: "A",
    title: "A mužstvo",
    subtitle: "Seniori",
    description: "Reprezentácia klubu v seniorských súťažiach",
    icon: "🏆",
  },
];

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { data: newsItems = [], isLoading: newsLoading } = trpc.news.list.useQuery({ limit: 3 });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header/Navigation */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src="/club-logo.jpg" alt="CFK Pezinok Čajla" className="h-12 w-12 object-contain rounded" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">CFK Pezinok Cajla</h1>
                  <p className="text-sm text-muted-foreground">Futbalový klub</p>
                </div>
              </a>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/">
                <a className="text-sm font-medium hover:text-primary transition-colors">Domov</a>
              </Link>
              <Link href="/gallery">
                <a className="text-sm font-medium hover:text-primary transition-colors">Galéria</a>
              </Link>
              <Link href="/contact">
                <a className="text-sm font-medium hover:text-primary transition-colors">Kontakt</a>
              </Link>
              {isAuthenticated && (
                <Link href="/trainer">
                  <a className="text-sm font-medium hover:text-primary transition-colors">Trénerská sekcia</a>
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2">
              {loading ? (
                <Button variant="outline" size="sm" disabled>
                  Načítavam...
                </Button>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Odhlásiť
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <a href={getLoginUrl()}>Prihlásiť</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Vitajte v CFK Pezinok Čajla
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Futbalový klub s tradíciou a perspektívou. Rozvíjame mladé talenty a podporujeme lásku k futbalu.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  <a>Kontaktujte nás</a>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gallery">
                  <a>
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Pozrite galériu
                  </a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Categories */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3 text-foreground">Naše kategórie</h3>
            <p className="text-muted-foreground">Futbal pre všetky vekové skupiny</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-base font-semibold text-primary">
                    {category.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3 text-foreground">Aktuality</h3>
            <p className="text-muted-foreground">Najnovšie správy z klubu</p>
          </div>

          {newsLoading ? (
            <div className="text-center text-muted-foreground">Načítavam aktuality...</div>
          ) : newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {newsItems.map((item: any) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  {item.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    <CardDescription>
                      {new Date(item.createdAt).toLocaleDateString("sk-SK")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Zatiaľ nie sú žiadne aktuality.</p>
              {isAuthenticated && (
                <Button asChild variant="outline">
                  <Link href="/trainer/news">
                    <a>Pridať aktualitu</a>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-2">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Trénerský tím</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Skúsení tréneri s licenciami UEFA</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-2">
                  <Trophy className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Úspechy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Víťazstvá v regionálnych súťažiach</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-2">
                  <Calendar className="h-12 w-12 text-primary" />
                </div>
                <CardTitle>Tréningy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Pravidelné tréningy počas celého roka</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3 text-foreground">CFK Pezinok Čajla</h4>
              <p className="text-sm text-muted-foreground">
                Futbalový klub s tradíciou a perspektívou
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Rýchle odkazy</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/">
                    <a className="text-muted-foreground hover:text-primary transition-colors">Domov</a>
                  </Link>
                </li>
                <li>
                  <Link href="/gallery">
                    <a className="text-muted-foreground hover:text-primary transition-colors">Galéria</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="text-muted-foreground hover:text-primary transition-colors">Kontakt</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Kontakt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+421 XXX XXX XXX</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CFK Pezinok Čajla. Všetky práva vyhradené.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
