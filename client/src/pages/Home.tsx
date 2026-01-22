import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Users,
  Target,
  Zap,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  LogOut,
  User,
} from "lucide-react";
import { Link } from "wouter";

const categories = [
  {
    id: "U8-U9",
    title: "Mladšia prípravka",
    subtitle: "U8-U9",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "U10-U11",
    title: "Staršia prípravka",
    subtitle: "U10-U11",
    icon: Target,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "U13",
    title: "Mladší žiaci",
    subtitle: "U13",
    icon: Zap,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "U15",
    title: "Starší žiaci",
    subtitle: "U15",
    icon: Trophy,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "A",
    title: "A mužstvo",
    subtitle: "Seniori",
    icon: Trophy,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
  },
];

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { data: newsItems = [] } = trpc.news.list.useQuery();

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
                <a className="text-sm font-medium hover:text-primary transition-colors">Galéria</a>
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

      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-green-100" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-green-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="container relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent">
              Vitajte v CFK Pezinok Cajla
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
              Futbalový klub s tradíciou a perspektívou. Rozvíjame mladé talenty a podporujeme lásku k futbalu.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/contact">
                  <a>Kontaktujte nás</a>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="/gallery">
                  <a>
                    <Calendar className="mr-2 h-5 w-5" />
                    Galéria
                  </a>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-4 text-foreground">Naše kategórie</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Futbal pre všetky vekové skupiny
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const categoryPath = `/category/${category.id.toLowerCase()}`;
                return (
                  <Link key={category.id} href={categoryPath}>
                    <a>
                      <Card
                        className={`${category.bgColor} border-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group`}
                      >
                        <CardHeader className="text-center pb-4">
                          <div className={`mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Icon className="h-10 w-10 text-white" />
                          </div>
                          <CardTitle className="text-xl font-bold">{category.title}</CardTitle>
                          <CardDescription className="text-base font-semibold">{category.subtitle}</CardDescription>
                        </CardHeader>
                      </Card>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* News Section */}
        {newsItems.length > 0 && (
          <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="container">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold mb-4 text-foreground">Aktuality</h3>
                <p className="text-lg text-muted-foreground">Najnovšie správy z klubu</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {newsItems.slice(0, 3).map((item: any) => (
                  <Card key={item.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                    {item.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
            </div>
          </section>
        )}


      </main>

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
