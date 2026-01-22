import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";

const categories = [
  { value: "all", label: "Všetky" },
  { value: "U8-U9", label: "Mladšia prípravka" },
  { value: "U10-U11", label: "Staršia prípravka" },
  { value: "U13", label: "Mladší žiaci" },
  { value: "U15", label: "Starší žiaci" },
  { value: "A", label: "A mužstvo" },
  { value: "general", label: "Všeobecné" },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: galleryItems = [], isLoading } = trpc.gallery.list.useQuery(
    selectedCategory === "all" ? {} : { category: selectedCategory }
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container">
        <div className="mb-8">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-primary">&larr; Späť na domov</a>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Galéria</h1>
            <p className="text-lg text-muted-foreground">
              Fotografie z tréningov, zápasov a klubových podujatí
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
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

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="text-center text-muted-foreground">Načítavam galériu...</div>
          ) : galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item: any) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square w-full overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title || "Fotografia"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {item.title && (
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground line-clamp-2">
                          {item.title}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Zatiaľ nie sú žiadne fotografie.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
