import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { MapPin, Phone, Mail, LogOut, User, ArrowLeft, Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "wouter";
import { MapView } from "@/components/Map";

export default function Contact() {
  const { user, loading, isAuthenticated, logout } = useAuth();

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
                <a className="text-sm font-medium text-primary">Kontakt</a>
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
        <div className="container max-w-5xl">
          <Link href="/">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na domov
            </a>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Kontaktujte nás</h1>
            <p className="text-lg text-muted-foreground">Sme tu pre vás. Neváhajte nás kontaktovať.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <Card className="hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  Adresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Cajlanská 243/A<br />
                  902 01 Pezinok<br />
                  Slovensko
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Phone className="h-6 w-6 text-primary" />
                  Telefón
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  +421 XXX XXX XXX
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  info@cfkpezinok.sk
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-2xl">Sociálne siete</CardTitle>
                <CardDescription>Sledujte nás na sociálnych sieťach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://facebook.com/cfkpezinokcajla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-blue-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Facebook className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Facebook</p>
                      <p className="text-sm text-muted-foreground">@cfkpezinokcajla</p>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/cfkpezinokcajla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-pink-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Instagram className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Instagram</p>
                      <p className="text-sm text-muted-foreground">@cfkpezinokcajla</p>
                    </div>
                  </a>

                  <a
                    href="https://youtube.com/@cfkpezinokcajla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-red-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Youtube className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">YouTube</p>
                      <p className="text-sm text-muted-foreground">@cfkpezinokcajla</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Kde nás nájdete</CardTitle>
              <CardDescription>Naše tréningové centrum v Pezinku - Cajlanská 243/A</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-96">
                <MapView
                  initialCenter={{ lat: 48.293, lng: 17.273 }}
                  initialZoom={16}
                  onMapReady={(map) => {
                    // Add marker for CFK Pezinok - Cajla football field
                    const position = { lat: 48.293, lng: 17.273 };
                    new google.maps.marker.AdvancedMarkerElement({
                      map,
                      position: position,
                      title: "CFK Pezinok - Cajla",
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>
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
