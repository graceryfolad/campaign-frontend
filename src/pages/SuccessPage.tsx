import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Mail, 
  Printer, 
  Phone, 
  Receipt, 
  Loader2 
} from 'lucide-react';
import { getDonationStatus } from '@/lib/api';
import { DonationStatusResponse } from '@/types';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const donationId = searchParams.get('id');

  const [donation, setDonation] = useState<DonationStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!donationId) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await getDonationStatus(donationId);
        setDonation(data);
      } catch (err) {
        console.error('Error fetching donation receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [donationId]);

  const handlePrint = () => {
    window.print();
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-sm font-semibold text-slate-600">Retrieving official payment slip...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Celebration & Confirmation Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-100 text-center space-y-8">
        {/* Animated Checkmark Badge */}
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
            Dear <strong>{donation?.donorName || 'Supporter'}</strong>, we have received your direct bank transfer submission. Our campaign finance desk is cross-referencing your transfer against bank records.
          </p>
        </div>

        {/* Email & SMS Delivery Announcements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
            <Mail className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <strong className="block text-emerald-900 font-bold mb-0.5">Email Confirmation</strong>
              Formal receipt will be delivered to <strong>{donation?.donorEmail || 'your email'}</strong> once reconciled.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-start gap-3">
            <Phone className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-sky-950">
              <strong className="block text-sky-900 font-bold mb-0.5">SMS Notification</strong>
              SMS status update will be sent to <strong>{donation?.donorPhone || 'your registered phone'}</strong> upon bank verification.
            </div>
          </div>
        </div>

        {/* Official Receipt / Slip */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Payment Acknowledgement Slip
              </span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              donation?.status === 'Completed'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
              {donation?.status === 'Completed' ? 'Verified & Completed' : 'Awaiting Bank Confirmation'}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">Payment Reference:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {donation?.paymentReference || 'SO-TRF-DEMO'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">Amount Reported:</span>
              <span className="font-black text-emerald-700 text-base">
                {donation ? formatCurrency(donation.amount, donation.currency) : '₦25,000'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">Beneficiary Account:</span>
              <span className="font-bold text-slate-800 text-right">
                {donation?.bankName || 'GTBank'} &bull; {donation?.bankAccountNumber || '3000837123'}
                <span className="block text-[11px] font-normal text-slate-500">
                  Saheed Oladele Support Foundation
                </span>
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">Campaign:</span>
              <span className="font-semibold text-slate-700 text-right">
                Saheed Oladele Campaign Organization (Youth O&apos;clock in Oyo)
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">Donor Name:</span>
              <span className="font-bold text-slate-800">{donation?.donorName || 'Supporter'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/40">
              <span className="text-slate-500 font-medium">Email:</span>
              <span className="text-slate-700">{donation?.donorEmail || 'Not provided'}</span>
            </div>

            {donation?.donorPhone && (
              <div className="flex justify-between py-1 border-b border-slate-200/40">
                <span className="text-slate-500 font-medium">Phone for SMS:</span>
                <span className="text-slate-700 font-mono">{donation.donorPhone}</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Submitted At:</span>
              <span className="text-slate-700">
                {donation?.createdAt ? new Date(donation.createdAt).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Campaign Direct Enquiries */}
        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 text-left text-xs text-orange-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-orange-900 block">Enquiries or Urgent Reconciliation?</span>
            <span>Contact campaign finance desk: <strong>08062211125</strong> or <strong>greatsaheed2004@gmail.com</strong></span>
          </div>
          <a
            href="tel:08062211125"
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs transition whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            Call 08062211125
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Payment Slip</span>
          </button>

          <Link
            to="/donate"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm transition"
          >
            <span>Donate Again</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-orange-400 hover:from-emerald-300 hover:to-orange-300 text-slate-950 font-extrabold text-sm shadow-md transition"
          >
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
