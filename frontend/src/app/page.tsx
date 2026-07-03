import Link from "next/link";
import { Button } from "@/components/Button";

export default function HomePage() {
  return (
    <div className="container-app">
      {/* Hero Section */}
      <section className="py-24 md:py-32 text-center max-w-2xl mx-auto">
        <div className="animate-fade-in">
          <p className="text-sm font-medium text-secondary mb-4 tracking-wide uppercase">
            AI-Powered Reactions
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-6">
            Your mood.
            <br />
            <span className="text-secondary">Cat approved.</span>
          </h1>

          <p className="text-lg text-secondary leading-relaxed mb-10 max-w-lg mx-auto">
            Look at your camera. Our AI detects your emotion instantly and
            recommends the funniest cat reaction images to match.
          </p>

          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center gap-3">
              <Link href="/camera">
                <Button size="lg">Start Camera</Button>
              </Link>
              <Link href="/favorites">
                <Button variant="secondary" size="lg">
                  View Favorites
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 w-full max-w-xs opacity-60">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-secondary text-xs font-medium uppercase tracking-wider">OR</span>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <form action="/recommendations" method="GET" className="flex w-full max-w-sm gap-2">
              <input 
                type="text" 
                name="emotion" 
                placeholder="Type your mood (e.g., happy, tired, excited)..." 
                className="flex-1 px-4 py-3 bg-card border border-border rounded-[var(--radius-button)] text-sm text-foreground focus:outline-none focus:border-button transition-colors"
                required
              />
              <Button type="submit" size="md">Get Memes</Button>
            </form>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-10 text-center">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Face the camera",
                desc: "Allow camera access and look directly at your webcam.",
              },
              {
                step: "02",
                title: "AI detects emotion",
                desc: "Our AI analyzes your expression in under a second.",
              },
              {
                step: "03",
                title: "Get cat reactions",
                desc: "Receive 5 funny cat images matching your mood.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center animate-fade-in"
                style={{
                  animationDelay: `${parseInt(item.step) * 100}ms`,
                }}
              >
                <span className="inline-block text-xs font-semibold text-secondary bg-card border border-border rounded-full w-8 h-8 leading-8 mb-4">
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported emotions */}
      <section className="py-16 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-foreground mb-8">
            Supported emotions
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { emoji: "😊", label: "Happy" },
              { emoji: "😢", label: "Sad" },
              { emoji: "😠", label: "Angry" },
              { emoji: "😨", label: "Fear" },
              { emoji: "😐", label: "Neutral" },
              { emoji: "😲", label: "Surprise" },
              { emoji: "🤢", label: "Disgust" },
            ].map((emotion) => (
              <span
                key={emotion.label}
                className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground"
              >
                <span>{emotion.emoji}</span>
                {emotion.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border text-center">
        <p className="text-secondary text-sm mb-4">Ready to try?</p>
        <Link href="/camera">
          <Button size="lg">Open Camera</Button>
        </Link>
      </section>
    </div>
  );
}
