export interface NewsletterDataPoint {
  date: string;
  thorMailing: number;
  nonClientMailing: number;
  emailsSent?: number | null;
  emailsDelivered?: number | null;
  openRate?: number | null; // percentage
  openCount?: number | null; // absolute count
  clickRate?: number | null; // percentage
  clickCount?: number | null; // absolute count
  browserViews?: number | null;
  optOut?: number | null;
}

export interface HotsiteDataPoint {
  period: string;
  pageViews: number;
  users: number;
  spotify?: number | null;
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
    openRate: 14.21,
    openCount: 1336,
    clickRate: 1.41,
    clickCount: 133,
    browserViews: 13,
    optOut: 6
  },
  {
    date: '13/Jun',
    thorMailing: 10268,
    nonClientMailing: 216,
    emailsSent: 9482,
    emailsDelivered: 9447,
    openRate: 13.89,
    openCount: 1312,
    clickRate: 0.76,
    clickCount: 72,
    browserViews: 10,
    optOut: 2
  },
  {
    date: '20/Jun',
    thorMailing: 10291,
    nonClientMailing: 251,
    emailsSent: null,
    emailsDelivered: null,
    openRate: null,
    openCount: null,
    clickRate: null,
    clickCount: null,
    browserViews: null,
    optOut: null
  }
];

export const HOTSITE_DATA: HotsiteDataPoint[] = [
  {
    period: '9 a 15 maio',
    pageViews: 499,
    users: 182,
    spotify: 43
  },
  {
    period: '16 a 22 maio',
    pageViews: 563,
    users: 274,
    spotify: 17
  },
  {
    period: '23 a 29 maio',
    pageViews: 342,
    users: 161,
    spotify: 6
  },
  {
    period: '30 maio a 5 jun',
    pageViews: 449,
    users: 208,
    spotify: 5
  },
  {
    period: '6 a 12 jun',
    pageViews: 376,
    users: 194,
    spotify: 1
  },
  {
    period: '13 a xx jun',
    pageViews: 218,
    users: 121,
    spotify: null
  }
];
