import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, LogOut, User, ArrowLeft, Heart } from "lucide-react";
import { Link } from "wouter";

export default function TaxDonation() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50">
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
                <a className="text-sm font-medium hover:text-primary transition-colors">Domov</a>
              </Link>
              <Link href="/gallery">
                <a className="text-sm font-medium hover:text-primary transition-colors">Galéria</a>
              </Link>
              <Link href="/contact">
                <a className="text-sm font-medium hover:text-primary transition-colors">Kontakt</a>
              </Link>
              <Link href="/tax-donation">
                <a className="text-sm font-medium text-primary">2 % z dane</a>
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
                  <Link href="/trainer-login"><a>Prihlásiť</a></Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container max-w-4xl">
          <Link href="/">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na domov
            </a>
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-green-800 mb-6">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Poukážte nám 2 % z dane</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vaša podpora pomáha rozvíjať mladé futbalové talenty a udržiavať činnosť nášho klubu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FileText className="h-6 w-6 text-green-600" />
                  Údaje o prijímateľovi
                </CardTitle>
                <CardDescription>Informácie potrebné na vyplnenie tlačiva</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Názov organizácie:</p>
                  <p className="text-lg font-medium">CFK Pezinok - Cajla</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">IČO:</p>
                  <p className="text-lg font-medium">31103367</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Právna forma:</p>
                  <p className="text-lg font-medium">Občianske združenie</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Adresa:</p>
                  <p className="text-lg font-medium">Cajlanská 243/A, 902 01 Pezinok</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Download className="h-6 w-6 text-green-600" />
                  Stiahnutie tlačiva
                </CardTitle>
                <CardDescription>Tlačivo na poukázanie 2 % z dane</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Stiahnite si tlačivo, vyplňte ho a odošlite správcovi dane alebo ho priložte k daňovému priznaniu.
                </p>
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg"
                  asChild
                >
                  <a 
                    href="https://www.financnasprava.sk/_img/pfsedit/Dokumenty_PFS/Zverejnovanie_dok/Tlaciva/Archiv_tlaciv/2024/2024.03.01_Tlacivo_Vyhlasenie_o_poukaz_podiel_zaplat_dane_2_proc.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Stiahnuť tlačivo (PDF)
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-green-600 to-green-800 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ako to funguje?</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Stiahnite si tlačivo</h4>
                    <p className="text-green-50">Použite tlačidlo vyššie na stiahnutie oficiálneho tlačiva.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Vyplňte údaje</h4>
                    <p className="text-green-50">Použite naše IČO a údaje uvedené vyššie.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Odošlite správcovi dane</h4>
                    <p className="text-green-50">Priložte k daňovému priznaniu alebo odošlite samostatne.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Ďakujeme za vašu podporu! Každé percento pomáha rozvíjať futbal v našom regióne.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                <a>Máte otázky? Kontaktujte nás</a>
              </Link>
            </Button>
          </div>
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
                  <Link href="/tax-donation">
                    <a className="text-gray-300 hover:text-white transition-colors">2 % z dane</a>
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
