import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <span className="text-sm font-extrabold tracking-tighter">SO</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                Saheed <span className="text-emerald-400">Oladele</span>
              </span>
              <span className="hidden md:inline-block text-[10px] font-extrabold uppercase bg-orange-500 text-slate-950 px-2 py-0.5 rounded-full">
                AAC &bull; Oyo 2027
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Youth O&apos;clock in Oyo</div>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors hidden md:block"
          >
            Campaign Manifesto
          </Link>
          <a
            href="/#designated-accounts"
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors hidden sm:block"
          >
            Designated Accounts
          </a>
          <Link
            to="/donate"
            className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-orange-400 hover:from-emerald-300 hover:to-orange-300 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Donate Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
