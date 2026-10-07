import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Filter, 
  Mail, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  LogOut, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Check,
  Copy,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getAdminDonations, getAdminStats, resendThankYouEmail, confirmAdminDonation } from '@/lib/api';
import { AdminDonationItem, AdminStats, DonationStatus } from '@/types';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Auth State
  const [adminEmail, setAdminEmail] = useState<string>('');

  // Dashboard Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [donations, setDonations] = useState<AdminDonationItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Selected Donation Modal
  const [selectedDonation, setSelectedDonation] = useState<AdminDonationItem | null>(null);

  // Notifications State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Auth Guard
  useEffect(() => {
    const token = localStorage.getItem('fundhope_admin_token');
    const email = localStorage.getItem('fundhope_admin_email');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    setAdminEmail(email || 'Administrator');
  }, [navigate]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, pagedResult] = await Promise.all([
        getAdminStats(),
        getAdminDonations({
          status: statusFilter || undefined,
          search: searchTerm || undefined,
          page: currentPage,
          pageSize,
        }),
      ]);

      setStats(statsData);
      setDonations(pagedResult.items);
      setTotalCount(pagedResult.totalCount);
      setTotalPages(pagedResult.totalPages);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('fundhope_admin_token');
        navigate('/admin/login');
      } else {
        showToast('Failed to load dashboard data. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, currentPage, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('fundhope_admin_token');
    localStorage.removeItem('fundhope_admin_email');
    navigate('/admin/login');
  };

  const handleResendEmail = async (donationId: string) => {
    try {
      setActionLoadingId(donationId);
      const res = await resendThankYouEmail(donationId);
      showToast(res.message || 'Receipt email dispatched to donor!');
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to resend email.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDonation = async (donation: AdminDonationItem) => {
    try {
      setActionLoadingId(donation.id);
      const res = await confirmAdminDonation(donation.id);
      showToast(res.message || 'Donation confirmed! Receipt email dispatched.');
      await fetchDashboardData();
      if (selectedDonation && selectedDonation.id === donation.id) {
        setSelectedDonation({
          ...selectedDonation,
          status: 'Completed',
          completedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || 'Failed to confirm donation.', 'error');
    } finally {
      setActionLoadingId(null);
    }
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
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
              : 'bg-rose-950 text-rose-100 border-rose-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header / User Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs font-medium text-slate-500">{adminEmail}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Donations Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Standalone Mode</span>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Campaign Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Raised */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Total Raised</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats ? formatCurrency(stats.totalRaised) : '...'}
          </div>
          <div className="text-xs text-slate-500">
            Goal: <strong className="text-slate-700">{stats ? formatCurrency(stats.goalAmount) : '...'}</strong> ({stats ? stats.percentageRaised : 0}%)
          </div>
        </div>

        {/* Completed Transfers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Completed Payments</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.completedDonationsCount ?? 0}
          </div>
          <div className="text-xs text-slate-500">
            Total records: <strong className="text-slate-700">{stats?.totalDonationsCount ?? 0}</strong>
          </div>
        </div>

        {/* Pending Reconciliations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending Transfers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats?.pendingDonationsCount ?? 0}
          </div>
          <div className="text-xs text-slate-500">
            Awaiting bank statement confirmation
          </div>
        </div>

        {/* Average Donation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Average Gift</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats ? formatCurrency(stats.averageDonation) : '...'}
          </div>
          <div className="text-xs text-slate-500">
            Across all verified contributors
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by donor name, email or reference..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter donations by status"
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Donor</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4">Bank Account</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-600 mb-2" />
                    <span>Loading donations registry...</span>
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600">No donations found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filter.</p>
                  </td>
                </tr>
              ) : (
                donations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.donorName}</div>
                      <div className="text-slate-400 text-[11px]">{item.donorEmail}</div>
                      {item.donorPhone && (
                        <div className="text-emerald-700 font-mono text-[10px]">{item.donorPhone}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      {formatCurrency(item.amount, item.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800">
                        <span>{item.paymentReference}</span>
                        <button
                          onClick={() => handleCopy(item.paymentReference, item.id)}
                          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
                          title="Copy reference"
                        >
                          {copiedKey === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{item.bankName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{item.bankAccountNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {item.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'Pending' && <Clock className="w-3 h-3" />}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDonation(item)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {item.status === 'Completed' && (
                          <button
                            onClick={() => handleResendEmail(item.id)}
                            disabled={actionLoadingId === item.id}
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-700 hover:text-emerald-900 transition"
                            title="Resend Receipt Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}

                        {item.status === 'Pending' && (
                          <button
                            onClick={() => handleConfirmDonation(item)}
                            disabled={actionLoadingId === item.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition shadow-sm"
                            title="Confirm Payment Received"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Confirm</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({totalCount} total)
            </div>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedDonation(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                  Donation Record
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedDonation.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {selectedDonation.donorName}
              </h3>
              <p className="text-xs text-slate-500">{selectedDonation.donorEmail}</p>
              {selectedDonation.donorPhone && (
                <p className="text-xs font-mono font-semibold text-emerald-700 mt-0.5">
                  SMS / Phone: {selectedDonation.donorPhone}
                </p>
              )}
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Amount:</span>
                <span className="font-extrabold text-slate-900 text-emerald-700">
                  {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-slate-900">{selectedDonation.status}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Payment Reference:</span>
                <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                  <code>{selectedDonation.paymentReference}</code>
                  <button
                    onClick={() => handleCopy(selectedDonation.paymentReference, 'modal-ref')}
                    className="p-1 hover:bg-slate-200 rounded text-slate-500"
                  >
                    {copiedKey === 'modal-ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Designated Bank Account:</span>
                <span className="text-slate-800 text-right">
                  {selectedDonation.bankName} ({selectedDonation.bankAccountNumber})
                  <span className="block text-[11px] text-slate-500">Saheed Oladele Support Foundation</span>
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Initiated At:</span>
                <span className="text-slate-800">
                  {new Date(selectedDonation.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Reconciled At:</span>
                <span className="text-slate-800">
                  {selectedDonation.completedAt ? new Date(selectedDonation.completedAt).toLocaleString() : 'Pending Confirmation'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {selectedDonation.status === 'Completed' && (
                <button
                  onClick={() => handleResendEmail(selectedDonation.id)}
                  disabled={actionLoadingId === selectedDonation.id}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Resend Thank-You Email</span>
                </button>
              )}

              {selectedDonation.status === 'Pending' && (
                <button
                  onClick={() => handleConfirmDonation(selectedDonation)}
                  disabled={actionLoadingId === selectedDonation.id}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Bank Transfer Received</span>
                </button>
              )}

              <button
                onClick={() => setSelectedDonation(null)}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
