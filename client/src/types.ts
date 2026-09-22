export type Role = "USER" | "ADMIN";
export type SubscriptionPlan = "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt?: string;
}

export interface AuthResult {
  token: string;
  user: {
    userId: string;
    role: Role;
  };
}

export interface Score {
  _id: string;
  user: string;
  score: number;
  scoreDate: string;
  createdAt?: string;
}

export interface Charity {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  website?: string;
  active: boolean;
}

export interface CharitySelection {
  charityId: string;
  charityName?: string;
  contributionPercentage: number;
}

export interface Subscription {
  _id: string;
  user: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  startDate?: string;
  renewalDate?: string;
  cancelledAt?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface Plan {
  plan: SubscriptionPlan;
  name: string;
  amount: number;
  currency: string;
  interval: string;
  features: string[];
}

export interface Draw {
  _id: string;
  drawDate: string;
  numbers: number[];
  status: "DRAFT" | "SIMULATED" | "PUBLISHED";
  prizePoolAmount: number;
  publishedAt?: string;
  createdAt?: string;
}

export interface Winner {
  _id: string;
  draw: string | Draw;
  entry: string;
  user: string | User;
  matchCount: number;
  prizeAmount: number;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  paymentStatus: "PENDING" | "PAID";
  proofUrl?: string;
  rejectionReason?: string;
  paidAt?: string;
  createdAt?: string;
}

export interface AdminDashboard {
  totalUsers: number;
  activeSubscriptions: number;
  totalDraws: number;
  pendingWinners: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details?: unknown;
  };
}

export interface ApiErrorShape {
  response?: {
    data?: {
      message?: string;
      error?: {
        code?: string;
        details?: unknown;
      };
    };
  };
}
