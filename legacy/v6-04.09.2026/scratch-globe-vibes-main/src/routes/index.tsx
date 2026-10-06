import { createFileRoute } from "@tanstack/react-router";
import { ScratchRail } from "@/components/ScratchRail";
import { ScratchTile } from "@/components/ScratchTile";
import { ScratchTreasure } from "@/components/ScratchTreasure";
import { WorldMap } from "@/components/WorldMap";
import { useScrollProgress } from "@/components/useScrollProgress";
import { scratchRegions } from "@/data/scratch-regions";
import { treasures } from "@/data/treasures";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scratchmap — Travel Community, Spots & Hobby Matching" },
      {
        name: "description",
        content:
          "Scratch the map, uncover local dishes, music and surf spots, share your favourite places and meet travellers who match your hobbies.",
      },
      { property: "og:title", content: "Scratchmap — Travel Community & Hobby Matching" },
      {
        property: "og:description",
        content:
          "A scratch-map travel community: uncover countries, share local spots, swap tips and arrange meetups.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    title: "Spots teilen",
    body: "Dein Lieblings-Café, der Sunset-Felsen, die Bar ohne Namen. Pin setzen, Story dazu, fertig.",
  },
  {
    title: "Hobby Matching",
    body: "Surfen, Kochen, Plattenläden, Bouldern — finde Leute, die vor Ort dasselbe suchen.",
  },
  {
    title: "Reise-Tipps",
    body: "Ehrliche Hinweise von Locals und Langzeitreisenden statt Top-10-Listen.",
  },
  {
    title: "Treffen vereinbaren",
    body: "Kleine Meetups: Markt-Rundgang, Jam Session, Morning Paddle. Ohne Algorithmus-Zirkus.",
  },
];

function Index() {
  const progress = useScrollProgress();

  return (
    <div className="relative min-h-screen">
      <ScratchRail side="left" progress={progress} />
      <ScratchRail side="right" progress={progress} />

      <div
        className="fixed left-0 top-0 z-40 h-1 bg-primary transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
        aria-hidden="true"
      />

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-32 pt-20 xl:max-w-4xl">
        <section className="hero-glow rounded-4xl px-6 py-16 text-center sm:px-12">
          <span className="font-mono text-xs uppercase tracking-[0.32em] text-muted-foreground">
            Travel community · Blog · Hobby matching
          </span>
          <h1 className="mt-5 text-balance font-display text-5xl leading-[0.95] sm:text-6xl">
            Kratz die Welt frei.
            <br />
            Darunter liegen Leute, Gerichte und Gitarren.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Jedes Land ist eine Rubbelfläche. Nimm eine Münze oder deinen Cursor, kratz die Folie
            weg und du findest heraus, wonach es dort schmeckt, klingt und riecht — geteilt von
            Menschen, die dort leben oder gerade hängen geblieben sind.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg">Community beitreten</Button>
            <Button size="lg" variant="outline">
              Spots entdecken
            </Button>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span className="animate-coin inline-block">🪙</span> scrollen kratzt automatisch — oder
            selbst über eine Fläche wischen
          </p>
        </section>

        <section className="mt-24">
          <h2 className="font-display text-3xl">Rubbel-Fragmente</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Keine Kärtchen, sondern Ausschnitte der Weltkarte: Umrisse von Ländern, Küsten und
            Inselketten. Darunter Küche, Musik, Surf-Sprache und Stimmungswörter.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {scratchRegions.slice(0, 6).map((region, i) => {
              const local = (progress - 0.06 - i * 0.03) / 0.16;
              return (
                <div key={region.id} className="flex flex-col items-center gap-2">
                  <ScratchTile
                    region={region}
                    progress={Math.min(Math.max(local, 0), 1)}
                    size={180}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {region.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-24 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <article key={f.title} className="paper rounded-2xl border p-6">
              <h3 className="font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-24">
          <h2 className="font-display text-3xl">Die Karte</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Alle Kontinente als SVG — Northern Eurasia in der 2030 Free-Nations-Aufteilung statt als
            ein Block.
          </p>
          <div className="mt-8">
            <WorldMap />
          </div>
        </section>

        <section className="mt-24">
          <h2 className="font-display text-3xl">Mehr Fragmente</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {scratchRegions.slice(6, 15).map((region, i) => {
              const local = (progress - 0.5 - i * 0.02) / 0.14;
              return (
                <div key={region.id} className="flex flex-col items-center gap-2">
                  <ScratchTile
                    region={region}
                    progress={Math.min(Math.max(local, 0), 1)}
                    size={180}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {region.kicker}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-24">
          <h2 className="font-display text-3xl">Nationale Schätze</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Keine Länderumrisse, sondern das, was ein Land unverkennbar macht: Kuppeln, Bauwerke,
            Embleme, Rituale. Kratz die Goldfolie weg.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {treasures.map((t, i) => {
              const local = (progress - 0.62 - i * 0.02) / 0.14;
              return (
                <ScratchTreasure
                  key={t.id}
                  treasure={t}
                  progress={Math.min(Math.max(local, 0), 1)}
                  size={200}
                  className="w-full max-w-[200px]"
                />
              );
            })}
          </div>
        </section>


        <section className="mt-24 rounded-4xl border bg-card p-10 text-center">
          <h2 className="font-display text-3xl">Was hast du freigekratzt?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Schreib einen Spot auf, lade jemanden auf einen Kaffee ein oder frag nach der besten
            Welle bei Nordswell. Die Community antwortet.
          </p>
          <Button className="mt-6" size="lg">
            Ersten Spot teilen
          </Button>
        </section>
      </main>
    </div>
  );
}
