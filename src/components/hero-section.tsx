import { RocketIcon } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-[60vh] flex items-center overflow-hidden">
      <div className="relative z-10 max-w-7xl pt-20 pb-12 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-border bg-background/50 backdrop-blur-sm">
            <RocketIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Next Generation DApp
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
            Stylish
            <br />
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ethereum
            </span>
            <br />
            DApp
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Build faster. Ship prettier.
          </p>
        </div>
      </div>
    </div>
  );
}
