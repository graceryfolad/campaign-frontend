export type DonationStatus = 'Pending' | 'Completed' | 'Failed';

export interface RecentDonation {
  donorName: string;
  amount: number;
  currency: string;
  completedAt: string;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  amountRaised: number;
  percentageRaised: number;
  totalDonors: number;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  recentDonations: RecentDonation[];
}

export interface CreateDonationRequest {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  currency?: string;
  bankAccountNumber?: string;
  bankName?: string;
  accountName?: string;
  narration?: string;
}

export interface BankTransferDetails {
  bankName: string;
  bankAccountNumber: string;
  accountName: string;
  paymentReference: string;
  amount: number;
  currency: string;
  expiresAt: string;
  expiresInSeconds: number;
  instructions: string;
}

export interface CreateDonationResponse {
  donationId: string;
  campaignId: number;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  status: DonationStatus;
  paymentReference: string;
  bankAccountNumber: string;
  bankName: string;
  accountName?: string;
  bankTransferDetails: BankTransferDetails;
}

export interface DonationStatusResponse {
  donationId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  status: DonationStatus;
  paymentReference: string;
  bankAccountNumber?: string;
  bankName?: string;
  accountName?: string;
  createdAt: string;
  completedAt?: string | null;
  bankTransferDetails?: BankTransferDetails | null;
}

export interface AdminLoginResponse {
  token: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface AdminDonationItem {
  id: string;
  campaignId: number;
  campaignTitle: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;
  status: DonationStatus;
  paymentReference: string;
  bankAccountNumber: string;
  bankName: string;
  accountName?: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminStats {
  totalRaised: number;
  goalAmount: number;
  percentageRaised: number;
  totalDonationsCount: number;
  completedDonationsCount: number;
  pendingDonationsCount: number;
  averageDonation: number;
}
