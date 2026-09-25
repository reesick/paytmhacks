export const CASES = [
  {
    id: 'PT-8821', who: 'Sharma Kirana', meta: 'MID ••4821 · Hindi · Voice', issue: 'Settlement on hold',
    amount: 14200, tat: '2h 10m', conf: 0.64, state: 'approval', sentiment: 'Upset', lang: 'hi',
    msg: 'Bhaiya kal ka ₹14,200 abhi tak account mein nahi aaya.',
    c360: { since: '2021', kyc: 'Re-verify pending', device: 'Soundbox 4G · Online · 82%', gmv: '₹18.4k/day', disputes: 0 },
    steps: [
      ['done', 'Understood intent: settlement_delay', 'Jev · 180 ms', 'intent 0.91 · language hi · frustration Upset'],
      ['done', 'Fetched payout: ₹14,200 on HOLD since 24 Sep', 'Settlement', 'hold_reason = KYC_REVERIFY'],
      ['done', 'Sent document link in Hindi, PAN uploaded', 'KYC', 'OCR name match 0.93'],
      ['approval', 'Release ₹14,200 hold?', 'Gate · T3', 'Sensitive action: KYC Ops must approve'],
      ['queued', 'Notify merchant with UTR in Hindi', 'Comms', ''],
    ],
    approval: { title: 'Release ₹14,200 hold for Sharma Kirana?', why: ['PAN verified, name match 0.93', '0 disputes, 3 years on Paytm', 'Policy: KYC hold, release by KYC Ops'], effect: 'Payout today · logged as APR-2231', cta: 'Approve ₹14,200 release' },
  },
  {
    id: 'PT-8819', who: 'Gupta Medical', meta: 'MID ••2290 · Hinglish · Voice', issue: 'Soundbox silent + rent after return',
    amount: 375, tat: '21h', conf: 0.93, state: 'running', sentiment: 'Angry', lang: 'hi',
    msg: 'Dabba bol nahi raha, peeli light. Aur speaker wapas kiya tha, phir bhi ₹125 kat raha hai!',
    c360: { since: '2022', kyc: 'Verified', device: 'Soundbox 3 · Offline 19h · weak signal', gmv: '₹9.1k/day', disputes: 0 },
    steps: [
      ['done', 'Split intents: device_issue + billing_dispute', 'Jev · 210 ms', 'device 0.88 · billing 0.91'],
      ['done', 'Pinged Soundbox: offline 19 h, weak 4G', 'Device MDM', 'QR mapping OK'],
      ['done', 'Remote reboot sent, Hindi fix steps shared', 'Device MDM', 'undo 30 s'],
      ['done', 'Rent after return: 3 × ₹125 = ₹375', 'Billing · code', 'AWB delivered 3 Jul'],
      ['running', 'Refund ₹375 + stop billing', 'Gate · T2 auto', 'conf 0.93 · ≤ ₹2,000 · hazards low'],
      ['queued', 'Book FSE visit if test payment fails', 'Field', ''],
    ],
  },
  {
    id: 'PT-8820', who: 'R. Iyer', meta: 'Consumer · English · App', issue: 'UPI debited, not credited',
    amount: 1850, tat: 'T+5 · 30 Sep', conf: 0.94, state: 'resolved', sentiment: 'Calm', lang: 'en',
    msg: 'Paid ₹1,850 to a store, money got debited but merchant says not received.',
    c360: { since: '2019', kyc: 'Full KYC', device: 'UPI @ptyes', gmv: '—', disputes: 1 },
    steps: [
      ['done', 'Understood: failed_txn · P2M', 'Jev · 160 ms', 'intent 0.94'],
      ['done', 'Txn status DEEMED, check budget 1 of 3', 'UPI switch', 'RRN 624519883201'],
      ['done', 'TAT clock: auto-reversal by 30 Sep (T+5)', 'Policy · code', 'RBI TAT circular'],
      ['done', 'Raised complaint UPI-77812 with Yes Bank', 'UDIR via PSP', 'T1 auto'],
      ['done', 'Reply sent, watcher set', 'Comms', 'verifier passed'],
    ],
  },
  {
    id: 'PT-8830', who: 'A. Deshmukh', meta: 'Consumer · Hindi · Chat', issue: 'Digital arrest scam report',
    amount: 48000, tat: 'P0', conf: 0.97, state: 'human', sentiment: 'Distressed', lang: 'hi',
    msg: 'CBI wale video call pe hain, maine ₹48,000 bhej diye, aur maang rahe hain.',
    c360: { since: '2020', kyc: 'Full KYC', device: 'UPI @ptsbi', gmv: '—', disputes: 0 },
    steps: [
      ['done', 'Fraud nouls: digital_arrest 0.97', 'Jev · 150 ms', 'P0 triggered'],
      ['done', 'First report time-stamped 10:42:07 (immutable)', 'Policy', 'liability window starts'],
      ['done', 'Disabled UPI binding on this device', 'UPI', 'user-requested'],
      ['done', 'Shared 1930 + cybercrime.gov.in', 'Comms', ''],
      ['human', 'Handed to fraud desk in 9 s with note', 'Handoff', 'Priya (Fraud L2)'],
    ],
  },
  {
    id: 'PT-8833', who: 'Verma General Store', meta: 'MID ••7710 · Hinglish · WhatsApp', issue: 'Dormant device win-back',
    amount: 0, tat: '—', conf: 0.86, state: 'resolved', sentiment: 'Neutral', lang: 'hi',
    msg: 'Rent katta hai, customer PhonePe speaker pe scan karte hain.',
    c360: { since: '2023', kyc: 'Verified', device: 'Soundbox 5 · 0 txns in 9 days', gmv: '₹3.2k/day ↓60%', disputes: 0 },
    steps: [
      ['done', 'Churn cause: commercial_rental', 'Jev · 170 ms', 'win-back 0.72'],
      ['done', '2-month rent waiver from retention matrix', 'Sales · T1', 'within matrix'],
      ['done', 'Showed all matched loan offers, no steering', 'Lending', 'KFS on request'],
      ['done', 'Lead created, FSE visit booked 12:30', 'Field', 'Rahul (FSE)'],
    ],
  },
  {
    id: 'PT-8818', who: 'M. Khan Electronics', meta: 'MID ••5501 · English · Dashboard', issue: 'Chargeback, weak evidence',
    amount: 6400, tat: '45m', conf: 0.52, state: 'approval', sentiment: 'Worried', lang: 'en',
    msg: 'Customer raised chargeback but I delivered the TV. What do I do?',
    c360: { since: '2021', kyc: 'Verified', device: 'EDC POS', gmv: '₹42k/day', disputes: 3 },
    steps: [
      ['done', 'Understood: chargeback · card', 'Jev · 190 ms', 'intent 0.88'],
      ['done', 'Pulled dispute: POD_UPLOAD due in 45 min', 'Disputes', ''],
      ['done', 'Drafted evidence pack (invoice, delivery OTP)', 'gpt-oss', ''],
      ['approval', 'Low confidence 0.52: human review', 'Gate', 'delivery proof mismatch'],
    ],
    approval: { title: 'Submit evidence pack for ₹6,400 chargeback?', why: ['Invoice matches amount', 'Delivery OTP missing in logistics record', 'Deadline in 45 min'], effect: 'Representment filed · reversible until review', cta: 'Submit evidence' },
  },
]

export const KPIS = [
  ['Verified resolution', '68.4%', '+3.1 pts'],
  ['First contact resolution', '79.2%', '+14 pts'],
  ['TAT breaches avoided', '412', 'this week'],
  ['Compensation avoided', '₹41,200', 'this week'],
  ['Cost per case', '₹0.41', 'vs ₹6.5 frontier'],
  ['CSAT', '4.4 / 5', '+0.2'],
]

export const MIX = [['AI alone', 62], ['AI + approval', 16], ['Human', 22]]
export const INTENTS = [['Settlement delay', 28], ['UPI failed txn', 24], ['Soundbox issue', 19], ['Billing / rent', 12], ['Fraud report', 7], ['Sales / win-back', 10]]
export const VISITS = [
  ['12:30', 'Verma General Store', 'Win-back · loan interest · QR placement', 'Hot'],
  ['15:00', 'Gupta Medical', 'Soundbox swap if test fails · carry charger', 'Service'],
  ['17:15', 'Sharma Kirana', 'Re-KYC photo if upload fails', 'Service'],
]
