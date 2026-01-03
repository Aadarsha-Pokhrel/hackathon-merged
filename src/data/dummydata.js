// data.js

export const members = [
  { id: 1, name: 'सरिता देवी (Sarita Devi)', phone: '9841234567', totalDeposits: 12000, joinDate: '2024-01-01', status: 'active' },
  { id: 2, name: 'गीता श्रेष्ठ (Gita Shrestha)', phone: '9841234568', totalDeposits: 15000, joinDate: '2024-01-01', status: 'active' },
  { id: 3, name: 'लक्ष्मी तामाङ (Laxmi Tamang)', phone: '9841234569', totalDeposits: 8000, joinDate: '2024-03-01', status: 'active' },
  { id: 4, name: 'राधा गुरुङ (Radha Gurung)', phone: '9841234570', totalDeposits: 10000, joinDate: '2024-02-01', status: 'active' },
];

export const loans = [
  { id: 1, memberId: 1, memberName: 'सरिता देवी', amount: 40000, purpose: 'Small Business - Tailoring Shop', interestRate: 10, duration: 12, approvedDate: '2024-11-01', dueDate: '2025-11-01', paidAmount: 5000, status: 'active', repaymentType: 'monthly' },
  { id: 2, memberId: 3, memberName: 'लक्ष्मी तामाङ', amount: 25000, purpose: 'Education - Children School Fees', interestRate: 8, duration: 6, approvedDate: '2024-12-01', dueDate: '2025-06-01', paidAmount: 0, status: 'active', repaymentType: 'lumpsum' },
];

export const loanRequests = [
  { id: 3, memberId: 2, memberName: 'गीता श्रेष्ठ', amount: 30000, purpose: 'Medical Emergency - Family Treatment', requestDate: '2025-01-01', status: 'pending' },
];

export const deposits = [
  { id: 1, memberId: 1, amount: 1000, date: '2025-01-01', month: 'January 2025' },
  { id: 2, memberId: 2, amount: 1000, date: '2025-01-01', month: 'January 2025' },
  { id: 3, memberId: 3, amount: 1000, date: '2025-01-01', month: 'January 2025' },
  { id: 4, memberId: 4, amount: 1000, date: '2025-01-01', month: 'January 2025' },
];
// Loan history for members
export const loanHistory = [
  {
    id: 101,
    memberId: 1,
    memberName: 'सरिता देवी',
    amount: 20000,
    purpose: 'Business Expansion - Grocery Shop',
    interestRate: 10,
    duration: 12,
    approvedDate: '2023-01-01',
    dueDate: '2024-01-01',
    paidAmount: 20000,
    status: 'paid',
    repaymentType: 'monthly',
  },
  {
    id: 102,
    memberId: 1,
    memberName: 'सरिता देवी',
    amount: 15000,
    purpose: 'Education - Children Fees',
    interestRate: 8,
    duration: 6,
    approvedDate: '2022-06-01',
    dueDate: '2022-12-01',
    paidAmount: 15000,
    status: 'paid',
    repaymentType: 'lumpsum',
  },
  {
    id: 103,
    memberId: 2,
    memberName: 'गीता श्रेष्ठ',
    amount: 30000,
    purpose: 'Medical Emergency - Family Treatment',
    interestRate: 12,
    duration: 12,
    approvedDate: '2023-03-01',
    dueDate: '2024-03-01',
    paidAmount: 30000,
    status: 'paid',
    repaymentType: 'monthly',
  },
  {
    id: 104,
    memberId: 3,
    memberName: 'लक्ष्मी तामाङ',
    amount: 10000,
    purpose: 'Small Business - Handicrafts',
    interestRate: 10,
    duration: 6,
    approvedDate: '2022-01-01',
    dueDate: '2022-07-01',
    paidAmount: 10000,
    status: 'paid',
    repaymentType: 'monthly',
  },
];

// Dummy contacts for members
export const contacts = [
  {
    id: 1,
    name: 'सरिता देवी (Sarita Devi)',
    phone: '9841234567',
    email: 'sarita.devi@example.com',
    role: 'Member',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'गीता श्रेष्ठ (Gita Shrestha)',
    phone: '9841234568',
    email: 'gita.shrestha@example.com',
    role: 'Member',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 3,
    name: 'लक्ष्मी तामाङ (Laxmi Tamang)',
    phone: '9841234569',
    email: 'laxmi.tamang@example.com',
    role: 'Member',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 4,
    name: 'राधा गुरुङ (Radha Gurung)',
    phone: '9841234570',
    email: 'radha.gurung@example.com',
    role: 'Member',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 5,
    name: 'राम कुमार (Ram Kumar)',
    phone: '9841234571',
    email: 'ram.kumar@example.com',
    role: 'Member',
    status: 'inactive',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
];

export const notices = [
  {
    id: 1,
    title: 'Monthly Meeting Reminder',
    description: 'Our monthly group meeting is scheduled for January 15th at 2 PM. Please ensure all members attend. We will discuss loan disbursements and savings collection.',
    postedBy: 'Admin',
    createdAt: new Date('2025-01-01T10:00:00'),
    priority: 'high',
    category: 'Meeting'
  },
  {
    id: 2,
    title: 'Interest Rate Update',
    description: 'Starting from February 2025, the interest rate for new loans will be 11% per annum. Existing loans will continue at their original rates.',
    postedBy: 'Admin',
    createdAt: new Date('2024-12-28T14:30:00'),
    priority: 'medium',
    category: 'Policy'
  },
  {
    id: 3,
    title: 'Savings Collection',
    description: 'Reminder: Monthly savings collection is due by January 10th. Please deposit NPR 500 to the group account.',
    postedBy: 'Treasurer',
    createdAt: new Date('2025-01-03T09:00:00'),
    priority: 'high',
    category: 'Finance'
  },
  {
    id: 4,
    title: 'New Member Welcome',
    description: 'We are pleased to welcome Sunita Rai as a new member of our group. Please make her feel welcome at our next meeting.',
    postedBy: 'Admin',
    createdAt: new Date('2024-12-20T11:00:00'),
    priority: 'low',
    category: 'Announcement'
  },
];

