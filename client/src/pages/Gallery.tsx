import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const categories = [
  { value: "all", label: "Všetky" },
  { value: "U8", label: "U8" },
  { value: "U9", label: "U9" },
  { value: "U10", label: "U10" },
  { value: "U11", label: "U11" },
  { value: "U13", label: "U13" },
  { value: "U15", label: "U15" },
  { value: "A", label: "A mužstvo" },
  { value: "general", label: "Všeobecné" },
];

// Generate years from 2020 to current year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2019 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));
years.unshift({ value: "all", label: "Všetky roky" });

export default function Gallery() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const { data: galleryItems = [], isLoading } = trpc.gallery.list.useQuery(
    selectedCategory === "all" ? {} : { category: selectedCategory }
  );

  // Filter by year on client side
  const filteredItems = selectedYear === "all" 
    ? galleryItems 
    : galleryItems.filter((item: any) => {
        const itemYear = new Date(item.createdAt).getFullYear().toString();
        return itemYear === selectedYear;
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-lg">
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
                <a className="text-sm font-medium hover:text-primary transition-colors">Domov</a>
              </Link>
              <Link href="/gallery">
                <a className="text-sm font-medium text-primary">Galéria</a>
              </Link>
              <Link href="/contact">
                <a className="text-sm font-medium hover:text-primary transition-colors">Kontakt</a>
              </Link>
              <Link href="/trainer">
                <a className="text-sm font-medium hover:text-primary transition-colors">Trénerská sekcia</a>
              </Link>
            </nav>

            <div className="flex items-center gap-2">
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
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container max-w-7xl">
          <Link href="/">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na domov
            </a>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Galéria</h1>
            <p className="text-lg text-muted-foreground">
              Fotografie z tréningov, zápasov a klubových podujatí
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-6 mb-8">
            {/* Year Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Filtrovať podľa roku</h3>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Vyberte rok" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Filtrovať podľa kategórie</h3>
              <div className="flex flex-wrap gap-2">
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
            </div>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Načítavam galériu...</div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="aspect-square w-full overflow-hidden bg-muted">
                      <img
                        src={item.imageUrl}
                        alt={item.title || "Fotografia"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {item.title && (
                      <div className="p-4">
                        <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString('sk-SK')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground text-lg mb-2">Žiadne fotografie</p>
                <p className="text-sm text-muted-foreground">
                  Pre zvolené filtre neboli nájdené žiadne fotografie.
                </p>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 text-white py-12 mt-16">
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
                <li>Pezinok, Slovensko</li>
                <li>+421 XXX XXX XXX</li>
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
