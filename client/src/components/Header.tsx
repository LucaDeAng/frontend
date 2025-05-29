import { Terminal, Cog, Search, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 whitespace-nowrap w-full bg-black/90 border-b border-primary/20">
      {/* Left */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Terminal className="w-6 h-6" />
        <span className="font-medium text-lg whitespace-nowrap">Luca De Angelis</span>
      </div>
      {/* Center */}
      <nav className="flex items-center gap-6">
        <a href="/" className="flex items-center gap-1 whitespace-nowrap">Home</a>
        <div className="relative">
          <button className="flex items-center gap-1 whitespace-nowrap">Articles <ChevronDown className="w-4 h-4" /></button>
          {/* dropdown */}
        </div>
        <a href="/playground" className="whitespace-nowrap">Prompts</a>
      </nav>
      {/* Right */}
      <div className="flex items-center gap-4">
        <a href="/about" className="whitespace-nowrap">About Me</a>
        <a href="/build-in-public" className="whitespace-nowrap">Build in Public</a>
        <Cog className="w-5 h-5 flex-shrink-0" />
        <Search className="w-5 h-5 flex-shrink-0" />
      </div>
    </header>
  );
}
