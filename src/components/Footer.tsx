import { Shield, Lock, Award, Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-auto border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                SO
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Saheed Oladele Campaign Organization
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs sm:text-sm leading-relaxed">
              We choose crowdfunding over godfatherism — remaining accountable solely to the masses we pledge to serve across Oyo State.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-400/80">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 100% People Funded</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Designated Accounts</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> AAC Oyo State</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-emerald-400 transition">Campaign Manifesto</Link></li>
              <li><a href="/#designated-accounts" className="hover:text-emerald-400 transition">Designated Bank Accounts</a></li>
              <li><Link to="/donate" className="hover:text-emerald-400 transition">Online Donation & Receipt</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Campaign Enquiries</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <a href="mailto:greatsaheed2004@gmail.com" className="hover:underline">greatsaheed2004@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <a href="tel:08062211125" className="hover:underline">08062211125</a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <a href="https://www.saheedoladelefoundation.org" target="_blank" rel="noreferrer" className="hover:underline">saheedoladelefoundation.org</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Saheed Oladele Campaign Organization &bull; Saheed Oladele Support Foundation. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Baàmèkó of Ibadanland</span>
            <span>&bull;</span>
            <span>Youth O&apos;clock in Oyo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
