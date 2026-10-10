import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Loader2,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  HeartHandshake,
  Receipt,
  Printer,
  Sparkles
} from 'lucide-react';
import { createDonation } from '@/lib/api';
import { sendDonationConfirmationEmail } from '@/lib/emailService';
import { CreateDonationResponse } from '@/types';

interface DesignatedAccount {
  id: string;
  bank: string;
  currency: string;
  currencyLabel: string;
  accountNumber: string;
  accountName: string;
  badge: string;
  badgeColor: string;
}

const DESIGNATED_ACCOUNTS: DesignatedAccount[] = [
  {
    id: 'gtb-naira',
    bank: 'GTBank (Guaranty Trust Bank)',
    currency: 'NGN',
    currencyLabel: 'Naira Account',
    accountNumber: '3000837123',
    accountName: 'Saheed Oladele Support Foundation',
    badge: 'Local (NGN ₦)',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'gtb-dollar',
    bank: 'GTBank (Guaranty Trust Bank)',
    currency: 'USD',
    currencyLabel: 'Dollar Account',
    accountNumber: '3000837178',
    accountName: 'Saheed Oladele Support Foundation',
    badge: 'Domiciliary (USD $)',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'zenith-pounds',
    bank: 'Zenith Bank',
    currency: 'GBP',
    currencyLabel: 'Pounds Account',
    accountNumber: '5061559276',
    accountName: 'Saheed Oladele Support Foundation',
    badge: 'Domiciliary (GBP £)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'zenith-euro',
    bank: 'Zenith Bank',
    currency: 'EUR',
    currencyLabel: 'Euro Account',
    accountNumber: '5081282455',
    accountName: 'Saheed Oladele Support Foundation',
    badge: 'Domiciliary (EUR €)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  }
];

export default function DonatePage() {
  const [searchParams] = useSearchParams();

  const initialCurrency = (searchParams.get('currency') || 'NGN').toUpperCase();
  const matchingAcc = DESIGNATED_ACCOUNTS.find(a => a.currency === initialCurrency) || DESIGNATED_ACCOUNTS[0];
  
  // State
  const [selectedAccount, setSelectedAccount] = useState<DesignatedAccount>(matchingAcc);
  const [amount, setAmount] = useState<number | ''>(
    Number(searchParams.get('amount')) || ''
  );
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [narration, setNarration] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Success view state after clicking "I have paid"
  const [confirmedDonation, setConfirmedDonation] = useState<CreateDonationResponse | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAccountSelect = (acc: DesignatedAccount) => {
    setSelectedAccount(acc);
  };

  const formatAmount = (val: number, curr: string) => {
    if (curr === 'NGN') return `₦${val.toLocaleString()}`;
    if (curr === 'USD') return `$${val.toLocaleString()}`;
    if (curr === 'GBP') return `£${val.toLocaleString()}`;
    if (curr === 'EUR') return `€${val.toLocaleString()}`;
    return `${val.toLocaleString()} ${curr}`;
  };

  // Click "I have paid" handler
  const handleIHavePaid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) < 1) {
      setErrorMessage('Please specify the amount you transferred.');
      return;
    }
    if (!donorName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!donorEmail.trim() || !donorEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address for receipt confirmation.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const response = await createDonation({
        amount: Number(amount),
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim() || undefined,
        currency: selectedAccount.currency,
        bankAccountNumber: selectedAccount.accountNumber,
        bankName: selectedAccount.bank,
        accountName: selectedAccount.accountName,
        narration: narration.trim() || undefined,
      });

      setConfirmedDonation(response);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Send acknowledgement email via Swagger Email Service: https://emailservice.ecosystem.com.ng/swagger/index.html
      try {
        const emailResult = await sendDonationConfirmationEmail({
          toEmail: donorEmail.trim(),
          donorName: donorName.trim(),
          donorPhone: donorPhone.trim() || undefined,
          amount: Number(amount),
          currency: selectedAccount.currency,
          paymentReference: response.paymentReference,
          bankName: selectedAccount.bank,
          accountNumber: selectedAccount.accountNumber,
          accountName: selectedAccount.accountName,
          narration: narration.trim() || undefined,
        });

        if (emailResult.success) {
          setEmailSent(true);
        } else {
          console.warn('Email dispatch notice:', emailResult.error);
        }
      } catch (emailErr) {
        console.warn('Failed to dispatch confirmation email:', emailErr);
      }
    } catch (err: any) {
      console.error('Error submitting payment notification:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Unable to record payment notification. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If donor clicked "I have paid", render the dedicated confirmation page:
  // "Thanks while we confirm via email or sms."
  if (confirmedDonation) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100 text-center space-y-8">
          {/* Success Checkmark Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Payment Notification Received
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Thanks while we confirm via email or sms.
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              We have received your payment notification for <strong>{formatAmount(confirmedDonation.amount, confirmedDonation.currency)}</strong>. Our campaign finance team is reconciling your bank transfer against the account statement.
            </p>
          </div>

          {/* Confirmation Notice Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950">
                <strong className="block text-emerald-900 font-bold mb-0.5">
                  Email Confirmation {emailSent ? 'Dispatched ✓' : 'Notification'}
                </strong>
                An acknowledgement email with payment summary has been dispatched to <strong>{confirmedDonation.donorEmail}</strong>.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-start gap-3">
              <Phone className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-sky-950">
                <strong className="block text-sky-900 font-bold mb-0.5">SMS Notification</strong>
                SMS alert will be sent to <strong>{confirmedDonation.donorPhone || 'your registered phone'}</strong> upon verification.
              </div>
            </div>
          </div>

          {/* Acknowledgement Slip */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Payment Slip
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Awaiting Confirmation
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Payment Reference:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {confirmedDonation.paymentReference}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Amount:</span>
                <span className="font-black text-emerald-700 text-base">
                  {formatAmount(confirmedDonation.amount, confirmedDonation.currency)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Designated Account:</span>
                <span className="font-bold text-slate-800 text-right">
                  {confirmedDonation.bankName} &bull; {confirmedDonation.bankAccountNumber}
                  <span className="block text-[11px] font-normal text-slate-500">
                    Saheed Oladele Support Foundation
                  </span>
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Donor:</span>
                <span className="font-bold text-slate-800">{confirmedDonation.donorName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500 font-medium">Email:</span>
                <span className="text-slate-700">{confirmedDonation.donorEmail}</span>
              </div>

              {confirmedDonation.donorPhone && (
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500 font-medium">Phone for SMS:</span>
                  <span className="text-slate-700 font-mono">{confirmedDonation.donorPhone}</span>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Date & Time:</span>
                <span className="text-slate-700">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Enquiries Note */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 text-left text-xs text-orange-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-orange-900 block">Questions about your donation?</span>
              <span>For enquiries, please contact: <strong>greatsaheed2004@gmail.com</strong>, <strong>08062211125</strong></span>
            </div>
            <a
              href="tel:08062211125"
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Call 08062211125
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => window.print()}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Payment Slip</span>
            </button>

            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-orange-400 hover:from-emerald-300 hover:to-orange-300 shadow-lg shadow-emerald-500/20 transition text-sm"
            >
              <span>Back to Campaign Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Primary Direct Donation View
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation header */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Campaign</span>
      </Link>

      {/* Main Title */}
      <div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Official Crowdfunding &bull; Youth O&apos;clock in Oyo
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
          Direct Bank Transfer Donation
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Support the Saheed Oladele Campaign Organization by transferring to any of our designated foundation accounts below.
        </p>
      </div>

      {/* Currency & Designated Account Selection */}
      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Designated Currency & Account
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DESIGNATED_ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleAccountSelect(acc)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedAccount.id === acc.id
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                  {acc.currency}
                </span>
                {selectedAccount.id === acc.id && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="font-extrabold text-sm text-slate-900">{acc.bank}</div>
              <div className="text-xs text-slate-500">{acc.currencyLabel}</div>
              <div className="font-mono text-xs font-bold text-slate-800 mt-2 bg-slate-100 px-2 py-1 rounded-lg">
                {acc.accountNumber}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Designated Account Display Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border-2 border-emerald-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Designated Beneficiary Account
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
              {selectedAccount.bank}
            </h3>
            <span className="text-xs text-slate-300 font-medium">
              {selectedAccount.currencyLabel} &bull; {selectedAccount.badge}
            </span>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 uppercase font-semibold">Account Name</span>
            <div className="text-sm sm:text-base font-black text-emerald-300">
              {selectedAccount.accountName}
            </div>
          </div>
        </div>

        {/* Account Details Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Account Number Box */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Account Number
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-300 tracking-wider">
                {selectedAccount.accountNumber}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(selectedAccount.accountNumber, 'acc')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition active:scale-95"
                title="Copy Account Number"
              >
                {copiedKey === 'acc' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Account Name Box */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Beneficiary Name
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-bold text-white truncate mr-2">
                {selectedAccount.accountName}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(selectedAccount.accountName, 'name')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition active:scale-95"
                title="Copy Account Name"
              >
                {copiedKey === 'name' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transfer instructions prompt */}
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Open your mobile banking app or internet banking, transfer your donation to the details above, then complete the confirmation below.
          </span>
        </div>
      </div>

      {/* Confirmation Form: "I have paid" */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100 space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            2. Payment Confirmation Slip
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Confirm Your Bank Transfer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in the details below so we can reconcile your transfer and issue your official confirmation via email or SMS.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleIHavePaid} className="space-y-6">
          {/* Amount Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Amount Transferred ({selectedAccount.currency}) *
            </label>

            {/* Custom Amount input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold text-base">
                {selectedAccount.currency === 'NGN' ? '₦' : selectedAccount.currency === 'USD' ? '$' : selectedAccount.currency === 'GBP' ? '£' : '€'}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Enter exact amount transferred"
                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>
          </div>

          {/* Donor Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Adeyemi Adeleke"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (For Receipt Confirmation) *
              </label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="adeyemi@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (For SMS Confirmation)
              </label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="08012345678"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Transfer Narration / Note (Optional)
              </label>
              <input
                type="text"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="e.g. Campaign Support from Ibadan"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          {/* Prominent "I have paid" Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl font-black text-lg text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-orange-400 hover:from-emerald-300 hover:to-orange-300 shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Submitting Payment Notification...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6 text-slate-950" />
                <span>
                  I have paid{amount && Number(amount) > 0 ? ` (${formatAmount(Number(amount), selectedAccount.currency)})` : ''}
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Enquiries Contact Footer */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-center text-xs text-slate-600 space-y-1">
        <p className="font-semibold text-slate-800">
          Support the Saheed Oladele Campaign Organization by donating through the designated accounts.
        </p>
        <p>
          For enquiries, please contact <a href="mailto:greatsaheed2004@gmail.com" className="text-emerald-700 font-bold hover:underline">greatsaheed2004@gmail.com</a>, <a href="tel:08062211125" className="text-emerald-700 font-bold hover:underline">08062211125</a>.
        </p>
      </div>
    </div>
  );
}
