import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartHandshake, 
  Target, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Building2,
  Receipt,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  Globe,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getActiveCampaign } from '@/lib/api';
import { Campaign } from '@/types';

export default function HomePage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideHovered, setIsSlideHovered] = useState(false);

  const heroSlides = [
    {
      src: '/images/candidate-saheed-oladele.jpg',
      alt: 'Oloye Saheed Oladele - AAC Guber Candidate Oyo State',
      tag: 'Joy is Coming',
      caption: 'A Breath of Fresh Air — A departure from the old order in Oyo State'
    },
    {
      src: '/images/youth-oclock.jpg',
      alt: "It's Youth O'clock in Oyo State - Saheed Oladele Campaign",
      tag: "Youth O'clock in Oyo",
      caption: 'Grassroots Crowdfunding & Civic Reform for Oyo State Youths'
    }
  ];

  useEffect(() => {
    if (isSlideHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSlideHovered, heroSlides.length]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveCampaign();
      setCampaign(data);
    } catch (err: any) {
      console.error('Failed to load campaign data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatCurrency = (val: number, currency: string = 'NGN') => {
    if (currency === 'NGN' || currency === '₦') {
      return `₦${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(val)}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-GB', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return 'Recently';
    }
  };

  const designatedAccounts = [
    {
      id: 'gtb-naira',
      bank: 'GTBank (Guaranty Trust Bank)',
      currencyLabel: 'Naira Account',
      accountNumber: '3000837123',
      accountName: 'Saheed Oladele Support Foundation',
      badge: 'Local (NGN ₦)',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'gtb-dollar',
      bank: 'GTBank (Guaranty Trust Bank)',
      currencyLabel: 'Dollar Account',
      accountNumber: '3000837178',
      accountName: 'Saheed Oladele Support Foundation',
      badge: 'USD ($)',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200'
    },
    {
      id: 'zenith-pounds',
      bank: 'Zenith Bank',
      currencyLabel: 'Pounds Account',
      accountNumber: '5061559276',
      accountName: 'Saheed Oladele Support Foundation',
      badge: 'GBP (£)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'zenith-euro',
      bank: 'Zenith Bank',
      currencyLabel: 'Euro Account',
      accountNumber: '5081282455',
      accountName: 'Saheed Oladele Support Foundation',
      badge: 'EUR (€)',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-10 pb-20 border-b border-emerald-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* First Row: Campaign Organization & Candidate Titles */}
          <div className="mb-8 lg:mb-10 text-center lg:text-left space-y-2">
            <h1 className="text-3xl sm:4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Saheed Oladele Campaign Organization
            </h1>

            <div className="text-lg sm:text-xl font-bold text-orange-400">
              Oloye Saheed Oladele <span className="text-slate-300 font-normal">| Baàmèkó of Ibadanland | Oyo State AAC Guber Candidate</span>
            </div>
          </div>

          {/* Second Row: Image + Text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Image Slideshow Column (Shows first on mobile and on desktop left) */}
            <div className="lg:col-span-5 space-y-4">
              <div
                className="relative h-[360px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 group bg-slate-900"
                onMouseEnter={() => setIsSlideHovered(true)}
                onMouseLeave={() => setIsSlideHovered(false)}
              >
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.src}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5 sm:p-6">
                      <span className="text-orange-400 font-extrabold text-xs uppercase tracking-wider">{slide.tag}</span>
                      <h3 className="text-white text-base sm:text-lg font-black leading-snug mt-1">
                        {slide.caption}
                      </h3>
                    </div>
                  </div>
                ))}

                {/* Arrow Controls */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition opacity-80 hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition opacity-80 hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 gap-3">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`relative rounded-2xl overflow-hidden border transition-all text-left group p-2 flex items-center gap-3 ${
                      idx === currentSlide
                        ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-500/30'
                        : 'border-white/10 bg-slate-900/80 hover:border-white/25'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 pr-1">
                      <span className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider truncate">
                        {slide.tag}
                      </span>
                      <span className="block text-xs font-semibold text-slate-200 truncate">
                        {idx === 0 ? 'Candidate' : 'Youth Movement'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Column: Manifesto & Action (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* The User's Core Campaign Statement Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl space-y-5 text-left">
                <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
                  Financing elections has been a major hurdle for every aspiring Nigerian youth.
                </p>

                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-sm sm:text-base leading-relaxed">
                  <span className="font-bold text-rose-400">Some choose GODFATHERISM</span> and live with the consequences of repaying with public funds.
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-100 text-sm sm:text-base font-semibold leading-relaxed shadow-inner">
                  <span className="font-extrabold text-emerald-300 uppercase tracking-wide">We choose CROWDFUNDING</span> — making us accountable only to the masses we pledge to serve.
                </div>

                <p className="text-sm sm:text-base text-slate-300 font-medium">
                  Support the <strong className="text-white">Saheed Oladele Campaign Organization</strong> by donating through the designated accounts.
                </p>

                <div className="pt-3 border-t border-white/10 text-xs sm:text-sm text-slate-300 space-y-1">
                  <p>
                    For enquiries, please contact{' '}
                    <a href="mailto:greatsaheed2004@gmail.com" className="text-emerald-400 font-bold hover:underline">
                      greatsaheed2004@gmail.com
                    </a>
                    ,{' '}
                    <a href="tel:08062211125" className="text-orange-400 font-bold hover:underline">
                      08062211125
                    </a>
                    .
                  </p>
                  <p className="text-slate-400 font-medium">Thank you.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="#designated-accounts"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-orange-400 hover:from-emerald-300 hover:to-orange-300 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] text-sm text-center"
                  >
                    <Building2 className="w-4 h-4 text-slate-950" />
                    <span>View Designated Accounts</span>
                  </a>

                  <Link
                    to="/donate"
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-sm transition"
                  >
                    <span>I Have Paid &bull; Submit Slip &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress & Live Campaign Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                People&apos;s Crowdfunding Meter
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Oyo State Grassroots Campaign Fund
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero godfather funding. Every transfer powers genuine youth-driven civic reform and town-hall campaigns across Oyo state.
              </p>
            </div>
            <button
              onClick={fetchCampaign}
              disabled={loading}
              className="self-start lg:self-center inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition"
              title="Refresh live campaign numbers"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Total Raised</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {campaign ? formatCurrency(campaign.amountRaised, 'NGN') : '₦16,450,000'}
              </div>
              <p className="text-xs text-emerald-700 mt-1 font-semibold">Reconciled via Designated Accounts</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <Target className="w-5 h-5 text-brand-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Goal Target</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {campaign ? formatCurrency(campaign.goalAmount, 'NGN') : '₦50,000,000'}
              </div>
              <p className="text-xs text-slate-500 mt-1">Statewide Grassroots Mobilization</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <Users className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Grassroots Donors</span>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {campaign?.totalDonors ?? 6}
              </div>
              <p className="text-xs text-slate-500 mt-1">Youths, market leaders & diaspora</p>
            </div>

            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-3 text-slate-500 mb-2">
                <Award className="w-5 h-5 text-orange-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-orange-800">Target Reached</span>
              </div>
              <div className="text-3xl font-black text-orange-600">
                {campaign?.percentageRaised ?? 32.9}%
              </div>
              <p className="text-xs text-orange-700 mt-1 font-medium">Of initial mobilization fund</p>
            </div>
          </div>

          {/* Large Progress Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-700">Fundraising Milestone</span>
              <span className="text-emerald-700">{campaign?.percentageRaised ?? 32.9}% achieved</span>
            </div>
            <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden p-1 border border-slate-200">
              <div
                className="bg-gradient-to-r from-emerald-600 via-teal-500 to-orange-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${Math.min(100, Math.max(3, campaign?.percentageRaised ?? 32.9))}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>₦0</span>
              <span>Target: {campaign ? formatCurrency(campaign.goalAmount, 'NGN') : '₦50,000,000'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Official Designated Accounts Showcase Section */}
      <section id="designated-accounts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-12 text-white border-2 border-emerald-500/30 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Official Foundation Accounts
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Saheed Oladele Support Foundation Designated Accounts
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                You can transfer directly from your mobile banking app using the accounts below, then click <strong>&quot;I have paid&quot;</strong> to submit your confirmation.
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs text-slate-400 uppercase font-semibold">Beneficiary Account Name</span>
              <div className="text-base sm:text-lg font-black text-emerald-300">
                Saheed Oladele Support Foundation
              </div>
            </div>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {designatedAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white/5 border border-white/10 hover:border-emerald-500/50 rounded-2xl p-5 space-y-4 backdrop-blur-sm transition-all hover:bg-white/10 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                      {acc.badge}
                    </span>
                    <Building2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-extrabold text-base text-white">{acc.bank}</h4>
                  <p className="text-xs text-slate-400">{acc.currencyLabel}</p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-white/10 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Account Number</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-black text-emerald-300 tracking-wider">
                      {acc.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(acc.accountNumber, acc.id)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                      title="Copy Account Number"
                    >
                      {copiedKey === acc.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </div>
                </div>

                <Link
                  to={`/donate?currency=${acc.id.includes('dollar') ? 'USD' : acc.id.includes('pounds') ? 'GBP' : acc.id.includes('euro') ? 'EUR' : 'NGN'}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold text-center transition flex items-center justify-center gap-1.5"
                >
                  <span>I Have Paid &rarr;</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Foundation Statement Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                All accounts are officially registered to <strong>Saheed Oladele Support Foundation</strong> for total financial transparency and accountability to the people of Oyo State.
              </span>
            </div>
            <Link
              to="/donate"
              className="whitespace-nowrap px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl font-bold transition text-xs shadow-md"
            >
              I Have Paid &bull; Submit Slip &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Official Enquiries & Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Direct Contact
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
              Campaign Enquiries & Engagement
            </h3>
            <p className="text-slate-600 text-sm mt-1">
              Have questions regarding our policies, civic volunteer groups, or transfer reconciliation? Reach out directly to the campaign team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Email */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Contact</h4>
                <a
                  href="mailto:greatsaheed2004@gmail.com"
                  className="text-base font-bold text-emerald-700 hover:underline block break-all"
                >
                  greatsaheed2004@gmail.com
                </a>
                <p className="text-xs text-slate-400">Official campaign correspondence</p>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Enquiries</h4>
                <a
                  href="tel:08062211125"
                  className="text-base font-bold text-slate-900 hover:text-orange-600 block"
                >
                  08062211125
                </a>
                <p className="text-xs text-slate-400">+234 813 754 6313</p>
              </div>
            </div>

            {/* Website */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Portal</h4>
                <a
                  href="https://www.saheedoladelefoundation.org"
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-bold text-sky-700 hover:underline block truncate"
                >
                  saheedoladelefoundation.org
                </a>
                <p className="text-xs text-slate-400">Foundation initiatives & vision</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Donations Feed (Donor Wall) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Community Wall
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Recent Grassroots Contributions</h2>
            </div>
            <Link
              to="/donate"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Join the donor wall <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {campaign && campaign.recentDonations && campaign.recentDonations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaign.recentDonations.map((donation, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-400 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      {donation.donorName.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="text-base font-black text-slate-900">
                      {formatCurrency(donation.amount, donation.currency)}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {donation.donorName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatDate(donation.completedAt)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Bank Transfer</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>Be the first citizen to donate to this movement!</p>
              <Link
                to="/donate"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
              >
                Make First Donation
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Prominent Footer CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-400/30">
              Join the People&apos;s Movement
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Together, We Free Oyo State from Godfatherism
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Every donation makes us accountable only to the masses we pledge to serve. Generate your unique transfer reference now and be part of history.
            </p>
          </div>
          <Link
            to="/donate"
            className="whitespace-nowrap px-8 py-4 bg-orange-500 hover:bg-orange-400 text-slate-950 rounded-2xl font-black text-base shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2"
          >
            <span>Proceed to Donate</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
