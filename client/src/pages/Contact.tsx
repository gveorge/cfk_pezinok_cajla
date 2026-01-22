import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container">
        <div className="mb-8">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-primary">&larr; Späť na domov</a>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Kontakt</h1>
            <p className="text-lg text-muted-foreground">
              Máte otázky? Radi vám pomôžeme!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="mb-2">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Adresa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  CFK Pezinok Cajla<br />
                  Pezinok<br />
                  Slovensko
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Telefón</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  +421 XXX XXX XXX
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  info@cfkpezinok.sk
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Tréningové časy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pondelok - Piatok: 16:00 - 19:00<br />
                  Sobota: 9:00 - 12:00
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Napíšte nám</CardTitle>
              <CardDescription>
                Máte záujem o registráciu dieťaťa alebo máte otázky? Kontaktujte nás!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Pre registráciu nových hráčov alebo akékoľvek otázky nás prosím kontaktujte
                telefonicky alebo emailom. Radi vám poskytneme všetky potrebné informácie
                o našom klube, tréningoch a podmienkach členstva.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
