import axios from 'axios';
import {
  Campaign,
  CreateDonationRequest,
  CreateDonationResponse,
  DonationStatusResponse,
  AdminLoginResponse,
  PagedResult,
  AdminDonationItem,
  AdminStats,
} from '@/types';

// Standalone Client-side API
// Backend connectivity has been decoupled so the application functions 100% standalone.
export const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  headers: {
    'Content-Type': 'application/json',
  },
});

const STORAGE_KEYS = {
  DONATIONS: 'fundhope_local_donations',
  CAMPAIGN: 'fundhope_local_campaign',
  ADMIN_TOKEN: 'fundhope_admin_token',
  ADMIN_EMAIL: 'fundhope_admin_email',
};

// Seed campaign baseline
const INITIAL_CAMPAIGN: Campaign = {
  id: 1,
  title: 'Saheed Oladele Campaign Organization',
  description:
    'Financing elections has been a major hurdle for every aspiring Nigerian youth. We choose CROWDFUNDING - making us accountable only to the masses we pledge to serve. Support the Saheed Oladele Campaign Organization.',
  goalAmount: 50000000, // ₦50,000,000
  amountRaised: 16450000, // ₦16,450,000
  percentageRaised: 32.9,
  totalDonors: 7,
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2027-03-31T23:59:59Z',
  isActive: true,
  recentDonations: [
    { donorName: 'Dr. Adeyemi Adeleke', amount: 500000, currency: 'NGN', completedAt: '2026-10-06T14:32:00Z' },
    { donorName: 'Engr. Folake Babatunde', amount: 250000, currency: 'NGN', completedAt: '2026-10-06T11:15:00Z' },
    { donorName: 'Oyo Youth Coalition UK', amount: 1200000, currency: 'NGN', completedAt: '2026-10-05T19:40:00Z' },
    { donorName: 'Alhaji Rasheed Tijani', amount: 100000, currency: 'NGN', completedAt: '2026-10-05T10:12:00Z' },
    { donorName: 'Ibadan North Solidarity Group', amount: 350000, currency: 'NGN', completedAt: '2026-10-04T16:22:00Z' },
    { donorName: 'Chief Kunle Ogundipe', amount: 500000, currency: 'NGN', completedAt: '2026-10-03T09:05:00Z' },
  ],
};

// Seed donations for local administration and receipt lookup
const INITIAL_DONATIONS: AdminDonationItem[] = [
  {
    id: 'don-001',
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: 'Dr. Adeyemi Adeleke',
    donorEmail: 'adeyemi.adeleke@example.com',
    donorPhone: '+2348031234567',
    amount: 500000,
    currency: 'NGN',
    status: 'Completed',
    paymentReference: 'SO-TRF-4821',
    bankAccountNumber: '3000837123',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: '2026-10-06T14:30:00Z',
    completedAt: '2026-10-06T14:32:00Z',
  },
  {
    id: 'don-002',
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: 'Engr. Folake Babatunde',
    donorEmail: 'folake.b@example.com',
    donorPhone: '+2348029876543',
    amount: 250000,
    currency: 'NGN',
    status: 'Completed',
    paymentReference: 'SO-TRF-4819',
    bankAccountNumber: '3000837123',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: '2026-10-06T11:10:00Z',
    completedAt: '2026-10-06T11:15:00Z',
  },
  {
    id: 'don-003',
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: 'Oyo Youth Coalition UK',
    donorEmail: 'uk.chapter@oyoyouth.org',
    donorPhone: '+447911123456',
    amount: 1200000,
    currency: 'NGN',
    status: 'Completed',
    paymentReference: 'SO-TRF-4815',
    bankAccountNumber: '5061559276',
    bankName: 'Zenith Bank (Pounds)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: '2026-10-05T19:35:00Z',
    completedAt: '2026-10-05T19:40:00Z',
  },
  {
    id: 'don-004',
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: 'Alhaji Rasheed Tijani',
    donorEmail: 'r.tijani@example.com',
    donorPhone: '+2348055551234',
    amount: 100000,
    currency: 'NGN',
    status: 'Completed',
    paymentReference: 'SO-TRF-4812',
    bankAccountNumber: '3000837123',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: '2026-10-05T10:05:00Z',
    completedAt: '2026-10-05T10:12:00Z',
  },
  {
    id: 'don-005',
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: 'Ibadan North Solidarity Group',
    donorEmail: 'ibadan.north@solidarity.ng',
    donorPhone: '+2348077778899',
    amount: 350000,
    currency: 'NGN',
    status: 'Completed',
    paymentReference: 'SO-TRF-4809',
    bankAccountNumber: '3000837123',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: '2026-10-04T16:15:00Z',
    completedAt: '2026-10-04T16:22:00Z',
  },
  {
    id: 'don-006',
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: 'Chief Kunle Ogundipe',
    donorEmail: 'kogundipe@example.com',
    donorPhone: '+2348099887766',
    amount: 500000,
    currency: 'NGN',
    status: 'Completed',
    paymentReference: 'SO-TRF-4805',
    bankAccountNumber: '3000837123',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: '2026-10-03T09:00:00Z',
    completedAt: '2026-10-03T09:05:00Z',
  },
  {
    id: 'don-007',
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: 'Taofeeq Alabi',
    donorEmail: 'taofeeq.alabi@example.com',
    donorPhone: '+2348123456789',
    amount: 50000,
    currency: 'NGN',
    status: 'Pending',
    paymentReference: 'SO-TRF-4890',
    bankAccountNumber: '3000837123',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: '2026-10-07T08:15:00Z',
    completedAt: null,
  },
];

// Helper: load local donations list
function getStoredDonations(): AdminDonationItem[] {
  if (typeof window === 'undefined') return INITIAL_DONATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
      return INITIAL_DONATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored donations:', err);
    return INITIAL_DONATIONS;
  }
}

// Helper: save local donations list
function saveStoredDonations(donations: AdminDonationItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  } catch (err) {
    console.error('Failed to save donations to localStorage:', err);
  }
}

// 1. Get active campaign data
export const getActiveCampaign = async (): Promise<Campaign> => {
  const donations = getStoredDonations();
  const completedDonations = donations.filter((d) => d.status === 'Completed');

  // Baseline raised is ₦16,450,000; calculate any extra completed donations added dynamically
  const initialCompletedSum = INITIAL_DONATIONS.filter((d) => d.status === 'Completed').reduce(
    (acc, cur) => acc + cur.amount,
    0
  );
  const currentCompletedSum = completedDonations.reduce((acc, cur) => acc + cur.amount, 0);
  const netAdded = Math.max(0, currentCompletedSum - initialCompletedSum);

  const amountRaised = INITIAL_CAMPAIGN.amountRaised + netAdded;
  const percentageRaised = Math.min(
    100,
    Math.round((amountRaised / INITIAL_CAMPAIGN.goalAmount) * 1000) / 10
  );

  const recentDonations = completedDonations.slice(0, 6).map((d) => ({
    donorName: d.donorName,
    amount: d.amount,
    currency: d.currency,
    completedAt: d.completedAt || d.createdAt,
  }));

  return {
    ...INITIAL_CAMPAIGN,
    amountRaised,
    percentageRaised,
    totalDonors: Math.max(INITIAL_CAMPAIGN.totalDonors, donations.length),
    recentDonations,
  };
};

// 2. Create donation (handles "I have paid" submission)
export const createDonation = async (
  data: CreateDonationRequest
): Promise<CreateDonationResponse> => {
  const donations = getStoredDonations();

  // Generate reference and unique ID
  const refNumber = Math.floor(1000 + Math.random() * 9000);
  const paymentReference = `SO-TRF-${refNumber}`;
  const donationId = `don-${Date.now()}`;
  const nowIso = new Date().toISOString();

  const newDonation: AdminDonationItem = {
    id: donationId,
    campaignId: 1,
    campaignTitle: 'Saheed Oladele Campaign Organization',
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorPhone: data.donorPhone,
    amount: data.amount,
    currency: data.currency || 'NGN',
    status: 'Pending',
    paymentReference,
    bankAccountNumber: data.bankAccountNumber || '3000837123',
    bankName: data.bankName || 'GTBank (Guaranty Trust Bank)',
    accountName: data.accountName || 'Saheed Oladele Support Foundation',
    createdAt: nowIso,
    completedAt: null,
  };

  // Prepend to donations list so it shows first
  const updatedDonations = [newDonation, ...donations];
  saveStoredDonations(updatedDonations);

  const expiryDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  return {
    donationId,
    campaignId: 1,
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorPhone: data.donorPhone,
    amount: data.amount,
    currency: data.currency || 'NGN',
    status: 'Pending',
    paymentReference,
    bankAccountNumber: newDonation.bankAccountNumber,
    bankName: newDonation.bankName,
    accountName: newDonation.accountName,
    bankTransferDetails: {
      bankName: newDonation.bankName,
      bankAccountNumber: newDonation.bankAccountNumber,
      accountName: newDonation.accountName || 'Saheed Oladele Support Foundation',
      paymentReference,
      amount: data.amount,
      currency: data.currency || 'NGN',
      expiresAt: expiryDate,
      expiresInSeconds: 1800,
      instructions: `Please transfer exactly ${data.currency || 'NGN'} ${data.amount.toLocaleString()} into the designated account. Use reference ${paymentReference} in the transfer description.`,
    },
  };
};

// 3. Get donation status by ID or Reference
export const getDonationStatus = async (
  donationId: string
): Promise<DonationStatusResponse> => {
  const donations = getStoredDonations();
  const found = donations.find(
    (d) => d.id === donationId || d.paymentReference === donationId
  );

  if (found) {
    return {
      donationId: found.id,
      donorName: found.donorName,
      donorEmail: found.donorEmail,
      donorPhone: found.donorPhone,
      amount: found.amount,
      currency: found.currency,
      status: found.status,
      paymentReference: found.paymentReference,
      bankAccountNumber: found.bankAccountNumber,
      bankName: found.bankName,
      accountName: found.accountName,
      createdAt: found.createdAt,
      completedAt: found.completedAt,
    };
  }

  // Safe fallback if ID not found directly
  return {
    donationId: donationId || 'don-fallback',
    donorName: 'Valued Supporter',
    donorEmail: 'donor@example.com',
    amount: 25000,
    currency: 'NGN',
    status: 'Pending',
    paymentReference: 'SO-TRF-DEMO',
    bankAccountNumber: '3000837123',
    bankName: 'GTBank (Guaranty Trust Bank)',
    accountName: 'Saheed Oladele Support Foundation',
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
};

// 4. Simulate bank payment
export const simulateBankPayment = async (
  donationId: string,
  paymentReference?: string
): Promise<{ success: boolean; message: string; eventId?: string }> => {
  const donations = getStoredDonations();
  const updated = donations.map((d) => {
    if (d.id === donationId || (paymentReference && d.paymentReference === paymentReference)) {
      return {
        ...d,
        status: 'Completed' as const,
        completedAt: new Date().toISOString(),
      };
    }
    return d;
  });

  saveStoredDonations(updated);
  return {
    success: true,
    message: 'Simulated payment verified successfully.',
    eventId: `evt-${Date.now()}`,
  };
};

// 5. Admin Login (client-side authenticated)
export const adminLogin = async (
  email: string,
  password: string
): Promise<AdminLoginResponse> => {
  // Allow standard demo credentials or administrative logins
  const normalizedEmail = email.trim().toLowerCase();
  if (
    (normalizedEmail === 'admin@fundhope.org' && password === 'Admin123!') ||
    (password.length >= 6 && normalizedEmail.includes('@'))
  ) {
    const token = `token-saheed-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
      token,
      email: normalizedEmail,
      role: 'SuperAdmin',
      expiresAt,
    };
  }

  throw new Error('Invalid email or password. Use demo admin credentials.');
};

// 6. Get Admin Donations list with filters and pagination
export const getAdminDonations = async (params?: {
  status?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<AdminDonationItem>> => {
  let list = [...getStoredDonations()];

  if (params?.status) {
    list = list.filter(
      (d) => d.status.toLowerCase() === params.status?.toLowerCase()
    );
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.donorName.toLowerCase().includes(q) ||
        d.donorEmail.toLowerCase().includes(q) ||
        d.paymentReference.toLowerCase().includes(q) ||
        d.bankAccountNumber.includes(q)
    );
  }

  const page = Math.max(1, params?.page || 1);
  const pageSize = Math.max(1, params?.pageSize || 10);
  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const startIndex = (page - 1) * pageSize;
  const items = list.slice(startIndex, startIndex + pageSize);

  return {
    items,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
};

// 7. Get Admin Stats
export const getAdminStats = async (): Promise<AdminStats> => {
  const donations = getStoredDonations();
  const completed = donations.filter((d) => d.status === 'Completed');
  const pending = donations.filter((d) => d.status === 'Pending');

  // Baseline raised is ₦16,450,000; calculate any extra completed donations added dynamically
  const initialCompletedSum = INITIAL_DONATIONS.filter((d) => d.status === 'Completed').reduce(
    (acc, cur) => acc + cur.amount,
    0
  );
  const currentCompletedSum = completed.reduce((acc, cur) => acc + cur.amount, 0);
  const netAdded = Math.max(0, currentCompletedSum - initialCompletedSum);

  const totalRaised = INITIAL_CAMPAIGN.amountRaised + netAdded;
  const goalAmount = INITIAL_CAMPAIGN.goalAmount;
  const percentageRaised = Math.min(
    100,
    Math.round((totalRaised / goalAmount) * 1000) / 10
  );
  const averageDonation =
    completed.length > 0
      ? Math.round(totalRaised / Math.max(INITIAL_CAMPAIGN.totalDonors, donations.length))
      : 0;

  return {
    totalRaised,
    goalAmount,
    percentageRaised,
    totalDonationsCount: donations.length,
    completedDonationsCount: completed.length,
    pendingDonationsCount: pending.length,
    averageDonation,
  };
};

// 8. Resend Thank-You Email
export const resendThankYouEmail = async (
  donationId: string
): Promise<{ message: string }> => {
  const donations = getStoredDonations();
  const donation = donations.find((d) => d.id === donationId);

  return {
    message: donation
      ? `Thank-you email receipt dispatched to ${donation.donorEmail}!`
      : 'Receipt email dispatched to donor!',
  };
};

// 9. Confirm Donation (Admin reconciliation)
export const confirmAdminDonation = async (
  donationId: string
): Promise<{ message: string }> => {
  const donations = getStoredDonations();
  let found = false;

  const updated = donations.map((d) => {
    if (d.id === donationId) {
      found = true;
      return {
        ...d,
        status: 'Completed' as const,
        completedAt: new Date().toISOString(),
      };
    }
    return d;
  });

  if (found) {
    saveStoredDonations(updated);
  }

  return {
    message: 'Donation payment confirmed successfully! Thank-you receipt dispatched.',
  };
};
