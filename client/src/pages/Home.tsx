import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { LogOut, User, Users, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

type Category = "A" | "U15" | "U13" | "U11" | "U10" | "U9" | "U8";

const categories = [
  { id: "A" as Category, name: "A mužstvo", fullName: "A mužstvo" },
  { id: "U15" as Category, name: "U15", fullName: "Starší žiaci U15" },
  { id: "U13" as Category, name: "U13", fullName: "Mladší žiaci U13" },
  { id: "U11" as Category, name: "U11", fullName: "Staršia prípravka U11" },
  { id: "U10" as Category, name: "U10", fullName: "Staršia prípravka U10" },
  { id: "U9" as Category, name: "U9", fullName: "Mladšia prípravka U9" },
  { id: "U8" as Category, name: "U8", fullName: "Mladšia prípravka U8" },
];

// Mock data for trainers
const trainersData: Record<Category, Array<{ name: string; role: string; image: string; description: string }>> = {
  A: [
    {
      name: "Milan Dugovič",
      role: "Hlavný tréner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=milan",
      description: "UEFA Pro licencia, 15 rokov skúseností"
    },
    {
      name: "Ján Horváth",
      role: "Asistent trénera",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=jan",
      description: "UEFA B licencia, špecialista na kondíciu"
    }
  ],
  U15: [
    {
      name: "Martin Kováč",
      role: "Tréner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=martin",
      description: "UEFA B licencia, práca s mládežou"
    }
  ],
  U13: [
    {
      name: "Tomáš Varga",
      role: "Tréner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=tomas",
      description: "UEFA C licencia, 8 rokov s mládežou"
    }
  ],
  U11: [
    {
      name: "Michal Balog",
      role: "Tréner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michal",
      description: "UEFA C licencia, špecialista na techniku"
    }
  ],
  U10: [
    {
      name: "Róbert Takáč",
      role: "Tréner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
      description: "Trénerská licencia, 5 rokov praxe"
    }
  ],
  U9: [
    {
      name: "Lukáš Molnár",
      role: "Tréner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=lukas",
      description: "Trénerská licencia, práca s najmenšími"
    }
  ],
  U8: [
    {
      name: "Filip Šimon",
      role: "Tréner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=filip",
      description: "Trénerská licencia, špecialista na U8"
    }
  ]
};

// Mock data for A team players
const aTeamPlayers = [
  { number: 1, firstName: "Matej", lastName: "NOVÁK", position: "Brankár", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player1" },
  { number: 5, firstName: "Peter", lastName: "KOVÁČ", position: "Obranca", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player2" },
  { number: 7, firstName: "Martin", lastName: "HORVÁTH", position: "Stredný záložník", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player3" },
  { number: 9, firstName: "Tomáš", lastName: "VARGA", position: "Útočník", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player4" },
  { number: 10, firstName: "Ján", lastName: "BALOG", position: "Útočník", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player5" },
  { number: 11, firstName: "Michal", lastName: "TAKÁČ", position: "Krídelník", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player6" },
  { number: 3, firstName: "Róbert", lastName: "MOLNÁR", position: "Obranca", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player7" },
  { number: 8, firstName: "Filip", lastName: "ŠIMON", position: "Stredný záložník", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player8" },
  { number: 4, firstName: "Lukáš", lastName: "URBAN", position: "Obranca", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=player9" },
];

// Training times data
const trainingTimes: Record<Category, string[]> = {
  A: ["Pondelok 19:00 - 21:00", "Streda 19:00 - 21:00", "Piatok 18:00 - 20:00"],
  U15: ["Utorok 17:00 - 18:30", "Štvrtok 17:00 - 18:30"],
  U13: ["Utorok 16:00 - 17:30", "Štvrtok 16:00 - 17:30"],
  U11: ["Pondelok 16:00 - 17:00", "Streda 16:00 - 17:00"],
  U10: ["Pondelok 15:00 - 16:00", "Streda 15:00 - 16:00"],
  U9: ["Utorok 15:00 - 16:00", "Štvrtok 15:00 - 16:00"],
  U8: ["Utorok 14:30 - 15:30", "Štvrtok 14:30 - 15:30"],
};

// BFZ links
const bfzLinks: Record<Category, string> = {
  A: "https://sportnet.sme.sk/futbalnet/k/cfk-pezinok-cajla/tim/a-muzstvo/vysledky/",
  U15: "https://sportnet.sme.sk/futbalnet/k/cfk-pezinok-cajla/tim/u15-m-a/vysledky/",
  U13: "https://sportnet.sme.sk/futbalnet/k/cfk-pezinok-cajla/tim/u13-m-a/vysledky/",
  U11: "https://sportnet.sme.sk/futbalnet/k/cfk-pezinok-cajla/tim/u11-m-a/vysledky/",
  U10: "https://sportnet.sme.sk/futbalnet/k/cfk-pezinok-cajla/tim/u10-m-a/vysledky/",
  U9: "https://sportnet.sme.sk/futbalnet/k/cfk-pezinok-cajla/tim/u9-m-a/vysledky/",
  U8: "https://sportnet.sme.sk/futbalnet/k/cfk-pezinok-cajla/tim/u8-m-a/vysledky/",
};

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>("A");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const newsQuery = trpc.news.list.useQuery({ limit: 3 });
  const news = newsQuery.data || [];

  const trainers = trainersData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-lg shadow-sm">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img src="/club-logo.webp" alt="CFK Pezinok Cajla" className="h-16 w-16 object-contain" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">CFK Pezinok Cajla</h1>
                  <p className="text-sm text-muted-foreground">Futbalový klub</p>
                </div>
              </a>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/">
                <a className="text-sm font-medium text-primary">Domov</a>
              </Link>
              <Link href="/gallery">
                <a className="text-sm font-medium hover:text-primary transition-colors">Galéria</a>
              </Link>
              <Link href="/contact">
                <a className="text-sm font-medium hover:text-primary transition-colors">Kontakt</a>
              </Link>
              <Link href="/tax-donation">
                <a className="text-sm font-medium hover:text-primary transition-colors">2 % z dane</a>
              </Link>
              <Link href="/trainer">
                <a className="text-sm font-medium hover:text-primary transition-colors">Trénerská sekcia</a>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              {loading ? (
                <div className="text-sm text-muted-foreground">Načítavam...</div>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {user?.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Odhlásiť
                  </Button>
                </div>
              ) : (
                <Button size="sm" asChild>
                  <a href={getLoginUrl()}>Prihlásiť</a>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <nav className="flex flex-col gap-3">
                <Link href="/">
                  <a 
                    className="text-sm font-medium text-primary py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Domov
                  </a>
                </Link>
                <Link href="/gallery">
                  <a 
                    className="text-sm font-medium hover:text-primary py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Galéria
                  </a>
                </Link>
                <Link href="/contact">
                  <a 
                    className="text-sm font-medium hover:text-primary py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kontakt
                  </a>
                </Link>
                <Link href="/tax-donation">
                  <a 
                    className="text-sm font-medium hover:text-primary py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    2 % z dane
                  </a>
                </Link>
                <Link href="/trainer">
                  <a 
                    className="text-sm font-medium hover:text-primary py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Trénerská sekcia
                  </a>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Vitajte v CFK Pezinok Cajla
            </h2>
            <p className="text-xl md:text-2xl text-green-50 mb-8">
              Futbalový klub s tradíciou a perspektívou. Rozvíjame mladé talenty a podporujeme lásku k futbalu.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-green-700 hover:bg-gray-100 shadow-lg font-semibold">
                <Link href="/contact">
                  <a>Kontaktujte nás</a>
                </Link>
              </Button>
              <Button size="lg" asChild className="bg-white text-green-700 hover:bg-gray-100 shadow-lg font-semibold">
                <Link href="/gallery">
                  <a>Galéria</a>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs Section */}
      <section className="bg-white py-12">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-foreground">Naše kategórie</h2>
          
          {/* Horizontal Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
            <div className="mb-8">
              <h3 className="text-3xl font-bold mb-6 text-foreground">
                {categories.find(c => c.id === activeCategory)?.fullName}
              </h3>
              
              {/* Training Times */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Users className="h-6 w-6 text-green-600" />
                  Tréningové časy
                </h4>
                <div className="flex flex-wrap gap-4">
                  {trainingTimes[activeCategory].map((time, idx) => (
                    <span key={idx} className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg text-lg font-semibold shadow-md hover:from-green-700 hover:to-green-900 transition-all cursor-default">
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* BFZ Link */}
              <div className="mb-8">
                <Button size="lg" asChild className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg">
                  <a href={bfzLinks[activeCategory]} target="_blank" rel="noopener noreferrer">
                    Pozrieť výsledky na BFZ
                  </a>
                </Button>
              </div>
            </div>

            {/* Trainers Section */}
            <div className="mb-12">
              <h4 className="text-2xl font-bold mb-6 text-foreground">Tréneri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainers.map((trainer, idx) => (
                  <Card key={idx} className="bg-white border-gray-200 hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={trainer.image}
                          alt={trainer.name}
                          className="w-20 h-20 rounded-full bg-white/20"
                        />
                        <div>
                          <h5 className="font-bold text-lg text-foreground">{trainer.name}</h5>
                          <p className="text-green-600 text-sm font-medium">{trainer.role}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{trainer.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Player Cards (only for A team) */}
            {activeCategory === "A" && (
              <div>
                <h4 className="text-2xl font-bold mb-6 text-foreground">Hráči</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {aTeamPlayers.map((player, idx) => (
                    <Card key={idx} className="bg-white hover:shadow-2xl transition-all group overflow-hidden">
                      <CardContent className="p-0 relative">
                        <div className="absolute top-4 left-4 text-8xl font-bold text-gray-100 z-0">
                          {player.number}
                        </div>
                        <div className="relative z-10 p-6">
                          <div className="flex justify-center mb-4">
                            <img
                              src={player.image}
                              alt={`${player.firstName} ${player.lastName}`}
                              className="w-32 h-32 rounded-full bg-gray-100 group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-green-600 font-medium mb-1">{player.firstName}</p>
                            <h5 className="text-xl font-bold text-gray-900 mb-2">{player.lastName}</h5>
                            <p className="text-sm text-gray-600">{player.position}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* News Section */}
      {news.length > 0 && (
        <section className="py-16 px-4">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Aktuality</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item) => (
                <Card key={item.id} className="hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{item.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString('sk-SK')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3 text-lg">CFK Pezinok Cajla</h4>
              <p className="text-gray-300 text-sm">
                Futbalový klub s tradíciou a perspektívou
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-lg">Rýchle odkazy</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/">
                    <a className="text-gray-300 hover:text-white transition-colors">Domov</a>
                  </Link>
                </li>
                <li>
                  <Link href="/gallery">
                    <a className="text-gray-300 hover:text-white transition-colors">Galéria</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="text-gray-300 hover:text-white transition-colors">Kontakt</a>
                  </Link>
                </li>
                <li>
                  <Link href="/trainer">
                    <a className="text-gray-300 hover:text-white transition-colors">Trénerská sekcia</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-lg">Kontakt</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Cajlanská 243/A</li>
                <li>902 01 Pezinok</li>
                <li>info@cfkpezinok.sk</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} CFK Pezinok Cajla. Všetky práva vyhradené.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
