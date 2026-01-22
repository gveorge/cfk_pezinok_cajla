import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { ArrowLeft, Clock, MapPin, User, LogOut, Mail, Phone } from "lucide-react";
import { Link, useRoute } from "wouter";

const categoryData: Record<string, {
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  trainings: { day: string; time: string; location: string }[];
  trainers: { name: string; role: string; description: string; image: string; email: string; phone: string }[];
}> = {
  "u8-u9": {
    title: "Mladšia prípravka",
    subtitle: "U8-U9",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    trainings: [
      { day: "Pondelok", time: "16:00 - 17:00", location: "Hlavné ihrisko" },
      { day: "Streda", time: "16:00 - 17:00", location: "Hlavné ihrisko" },
      { day: "Piatok", time: "16:00 - 17:00", location: "Hlavné ihrisko" },
    ],
    trainers: [
      {
        name: "Ján Novák",
        role: "Hlavný tréner",
        description: "Skúsený tréner s 10-ročnou praxou v práci s deťmi. Špecializuje sa na rozvoj základných futbalových zručností a herného myslenia.",
        image: "https://ui-avatars.com/api/?name=Jan+Novak&size=200&background=3b82f6&color=fff",
        email: "jan.novak@cfkpezinok.sk",
        phone: "+421 XXX XXX XXX"
      },
    ],
  },
  "u10-u11": {
    title: "Staršia prípravka",
    subtitle: "U10-U11",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    trainings: [
      { day: "Utorok", time: "16:30 - 18:00", location: "Hlavné ihrisko" },
      { day: "Štvrtok", time: "16:30 - 18:00", location: "Hlavné ihrisko" },
      { day: "Sobota", time: "10:00 - 11:30", location: "Hlavné ihrisko" },
    ],
    trainers: [
      {
        name: "Peter Kováč",
        role: "Hlavný tréner",
        description: "Bývalý profesionálny hráč s licenciou UEFA B. Zameriava sa na techniku, taktiku a tímovú spoluprácu.",
        image: "https://ui-avatars.com/api/?name=Peter+Kovac&size=200&background=22c55e&color=fff",
        email: "peter.kovac@cfkpezinok.sk",
        phone: "+421 XXX XXX XXX"
      },
    ],
  },
  "u13": {
    title: "Mladší žiaci",
    subtitle: "U13",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    trainings: [
      { day: "Pondelok", time: "17:00 - 18:30", location: "Hlavné ihrisko" },
      { day: "Streda", time: "17:00 - 18:30", location: "Hlavné ihrisko" },
      { day: "Piatok", time: "17:00 - 18:30", location: "Hlavné ihrisko" },
    ],
    trainers: [
      {
        name: "Martin Horváth",
        role: "Hlavný tréner",
        description: "Tréner s UEFA A licenciou. Špecializuje sa na rozvoj individuálnych schopností a hernej inteligencie mladých hráčov.",
        image: "https://ui-avatars.com/api/?name=Martin+Horvath&size=200&background=eab308&color=fff",
        email: "martin.horvath@cfkpezinok.sk",
        phone: "+421 XXX XXX XXX"
      },
      {
        name: "Tomáš Balog",
        role: "Asistent trénera",
        description: "Mladý perspektívny tréner so skúsenosťami z mládežníckych reprezentácií. Zameriava sa na kondičnú prípravu.",
        image: "https://ui-avatars.com/api/?name=Tomas+Balog&size=200&background=eab308&color=fff",
        email: "tomas.balog@cfkpezinok.sk",
        phone: "+421 XXX XXX XXX"
      },
    ],
  },
  "u15": {
    title: "Starší žiaci",
    subtitle: "U15",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    trainings: [
      { day: "Utorok", time: "17:30 - 19:00", location: "Hlavné ihrisko" },
      { day: "Štvrtok", time: "17:30 - 19:00", location: "Hlavné ihrisko" },
      { day: "Sobota", time: "11:00 - 12:30", location: "Hlavné ihrisko" },
    ],
    trainers: [
      {
        name: "Michal Szabó",
        role: "Hlavný tréner",
        description: "Tréner s bohatými skúsenosťami z profesionálneho futbalu. Pripravuje hráčov na prechod do seniorského futbalu.",
        image: "https://ui-avatars.com/api/?name=Michal+Szabo&size=200&background=f97316&color=fff",
        email: "michal.szabo@cfkpezinok.sk",
        phone: "+421 XXX XXX XXX"
      },
    ],
  },
  "a": {
    title: "A mužstvo",
    subtitle: "Seniori",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50",
    trainings: [
      { day: "Pondelok", time: "18:30 - 20:00", location: "Hlavné ihrisko" },
      { day: "Streda", time: "18:30 - 20:00", location: "Hlavné ihrisko" },
      { day: "Piatok", time: "18:30 - 20:00", location: "Hlavné ihrisko" },
    ],
    trainers: [
      {
        name: "Vladimír Weiss",
        role: "Hlavný tréner",
        description: "Skúsený tréner s UEFA Pro licenciou. Viedol niekoľko tímov v najvyšších slovenských súťažiach.",
        image: "https://ui-avatars.com/api/?name=Vladimir+Weiss&size=200&background=ef4444&color=fff",
        email: "vladimir.weiss@cfkpezinok.sk",
        phone: "+421 XXX XXX XXX"
      },
      {
        name: "Ľubomír Nagy",
        role: "Asistent trénera",
        description: "Bývalý reprezentant Slovenska. Zameriava sa na taktickú prípravu a analýzu súperov.",
        image: "https://ui-avatars.com/api/?name=Lubomir+Nagy&size=200&background=ef4444&color=fff",
        email: "lubomir.nagy@cfkpezinok.sk",
        phone: "+421 XXX XXX XXX"
      },
    ],
  },
};

export default function CategoryDetail() {
  const [match, params] = useRoute("/category/:id");
  const { user, loading, isAuthenticated, logout } = useAuth();
  
  if (!match || !params?.id) {
    return null;
  }

  const categoryId = params.id.toLowerCase();
  const category = categoryData[categoryId];

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Kategória nebola nájdená</p>
            <Button asChild>
              <Link href="/">
                <a>Späť na domov</a>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="container max-w-6xl">
          {/* Back Button */}
          <Link href="/">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na domov
            </a>
          </Link>

          {/* Category Header */}
          <div className={`${category.bgColor} rounded-2xl p-8 mb-12 border-2`}>
            <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${category.color} text-white font-bold text-lg mb-4`}>
              {category.subtitle}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{category.title}</h1>
            <p className="text-lg text-muted-foreground">Informácie o kategórii, tréningoch a tréneroch</p>
          </div>

          {/* Training Schedule */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              Tréningové časy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.trainings.map((training, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-xl">{training.day}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <Clock className="h-4 w-4" />
                      {training.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{training.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Trainers */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              Tréneri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {category.trainers.map((trainer, index) => (
                <Card key={index} className="hover:shadow-xl transition-all overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle className="text-2xl">{trainer.name}</CardTitle>
                        <CardDescription className="text-base font-semibold text-primary">
                          {trainer.role}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{trainer.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{trainer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{trainer.phone}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 text-white py-8 mt-16">
        <div className="container text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} CFK Pezinok Cajla. Všetky práva vyhradené.</p>
        </div>
      </footer>
    </div>
  );
}
