export interface Charge {
  id: string;
  balance: number;
  billing_cycle_day: number;
  monthly_plan: number;
  used: number;
  start_at: string;
  end_at: string;
  created: string;
  updated: string;
}

export interface BillingBucket {
  included: number;
  consumed: number;
  exceeded: number;
  exceeded_amount?: number;
}

export interface CurrentBillingPeriod {
  start_at: string;
  end_at: string;
}

export interface Billing {
  available_zaps: number;
  monthly_plan: number;
  zaps_sent: number;
  charges: Charge[];
  current_billing: CurrentBillingPeriod;
  tier_name?: string;
  utility?: BillingBucket;
  marketing?: BillingBucket;
}
