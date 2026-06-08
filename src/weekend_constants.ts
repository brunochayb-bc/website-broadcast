export interface NewsletterDataPoint {
  date: string;
  thorMailing: number;
  nonClientMailing: number;
  emailsSent: number;
  emailsDelivered: number;
  openRate: number; // percentage
  openCount: number; // absolute count
  clickRate: number; // percentage
  clickCount: number; // absolute count
  browserViews: number;
  optOut: number;
}

export interface HotsiteDataPoint {
  period: string;
  pageViews: number;
  users: number;
}

export const NEWSLETTER_DATA: NewsletterDataPoint[] = [
  {
    date: '09/Mai',
    thorMailing: 10450,
    nonClientMailing: 0,
    emailsSent: 9615,
    emailsDelivered: 8500,
    openRate: 13.78,
    openCount: 1172,
    clickRate: 1.14,
    clickCount: 97,
    browserViews: 15,
    optOut: 3
  },
  {
    date: '16/Mai',
    thorMailing: 10287,
    nonClientMailing: 22,
    emailsSent: 9324,
    emailsDelivered: 8327,
    openRate: 15.56,
    openCount: 1296,
    clickRate: 0.61,
    clickCount: 51,
    browserViews: 0,
    optOut: 0
  },
  {
    date: '23/Mai',
    thorMailing: 10292,
    nonClientMailing: 68,
    emailsSent: 9389,
    emailsDelivered: 7934,
    openRate: 15.65,
    openCount: 1242,
    clickRate: 1.54,
    clickCount: 122,
    browserViews: 16,
    optOut: 7
  },
  {
    date: '30/Mai',
    thorMailing: 10300,
    nonClientMailing: 120,
    emailsSent: 9424,
    emailsDelivered: 7950,
    openRate: 15.89,
    openCount: 1263,
    clickRate: 0.34,
    clickCount: 27,
    browserViews: 10,
    optOut: 5
  },
  {
    date: '06/Jun',
    thorMailing: 10284,
    nonClientMailing: 171,
    emailsSent: 9451,
    emailsDelivered: 9447,
    openRate: 12.87,
    openCount: 1210,
    clickRate: 1.30,
    clickCount: 122,
    browserViews: 37,
    optOut: 7
  }
];

export const HOTSITE_DATA: HotsiteDataPoint[] = [
  {
    period: '9 a 15 maio',
    pageViews: 499,
    users: 182
  },
  {
    period: '16 a 22 maio',
    pageViews: 563,
    users: 274
  },
  {
    period: '23 a 29 maio',
    pageViews: 342,
    users: 161
  },
  {
    period: '30 maio a 5 jun',
    pageViews: 449,
    users: 208
  }
];
