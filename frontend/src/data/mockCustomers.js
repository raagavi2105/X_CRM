// Realistic static demo customers. `daysAgo` is resolved to an actual
// lastActive date relative to when the demo data is first seeded, so the
// CRM always looks freshly populated.
const baseCustomers = [
  { name: 'Amit Sharma', email: 'amit.sharma@example.com', phone: '9876543210', totalSpend: 12000, visits: 5, daysAgo: 3 },
  { name: 'Priya Singh', email: 'priya.singh@example.com', phone: '9876543211', totalSpend: 8000, visits: 2, daysAgo: 20 },
  { name: 'Rahul Verma', email: 'rahul.verma@example.com', phone: '9876543212', totalSpend: 15000, visits: 7, daysAgo: 45 },
  { name: 'Sneha Patel', email: 'sneha.patel@example.com', phone: '9876543213', totalSpend: 5000, visits: 1, daysAgo: 1 },
  { name: 'Vikram Rao', email: 'vikram.rao@example.com', phone: '9876543214', totalSpend: 20000, visits: 10, daysAgo: 60 },
  { name: 'Anjali Mehta', email: 'anjali.mehta@example.com', phone: '9876543215', totalSpend: 3000, visits: 1, daysAgo: 95 },
  { name: 'Rohit Gupta', email: 'rohit.gupta@example.com', phone: '9876543216', totalSpend: 9500, visits: 3, daysAgo: 50 },
  { name: 'Kavita Joshi', email: 'kavita.joshi@example.com', phone: '9876543217', totalSpend: 11000, visits: 4, daysAgo: 7 },
  { name: 'Suresh Kumar', email: 'suresh.kumar@example.com', phone: '9876543218', totalSpend: 7000, visits: 2, daysAgo: 70 },
  { name: 'Meena Reddy', email: 'meena.reddy@example.com', phone: '9876543219', totalSpend: 4000, visits: 1, daysAgo: 88 },
  { name: 'Arjun Nair', email: 'arjun.nair@example.com', phone: '9876543220', totalSpend: 13000, visits: 6, daysAgo: 40 },
  { name: 'Pooja Desai', email: 'pooja.desai@example.com', phone: '9876543221', totalSpend: 6000, visits: 2, daysAgo: 65 },
  { name: 'Manish Jain', email: 'manish.jain@example.com', phone: '9876543222', totalSpend: 17000, visits: 8, daysAgo: 2 },
  { name: 'Divya Kapoor', email: 'divya.kapoor@example.com', phone: '9876543223', totalSpend: 9000, visits: 3, daysAgo: 25 },
  { name: 'Sanjay Das', email: 'sanjay.das@example.com', phone: '9876543224', totalSpend: 14000, visits: 7, daysAgo: 55 },
  { name: 'Neha Sethi', email: 'neha.sethi@example.com', phone: '9876543225', totalSpend: 7500, visits: 2, daysAgo: 80 },
  { name: 'Aakash Mittal', email: 'aakash.mittal@example.com', phone: '9876543226', totalSpend: 16000, visits: 9, daysAgo: 30 },
  { name: 'Ritu Agarwal', email: 'ritu.agarwal@example.com', phone: '9876543227', totalSpend: 8500, visits: 3, daysAgo: 48 },
  { name: 'Deepak Yadav', email: 'deepak.yadav@example.com', phone: '9876543228', totalSpend: 10500, visits: 4, daysAgo: 12 },
  { name: 'Shalini Menon', email: 'shalini.menon@example.com', phone: '9876543229', totalSpend: 4500, visits: 1, daysAgo: 92 },
  { name: 'Nitin Bansal', email: 'nitin.bansal@example.com', phone: '9876543230', totalSpend: 12500, visits: 5, daysAgo: 35 },
  { name: 'Swati Chawla', email: 'swati.chawla@example.com', phone: '9876543231', totalSpend: 9500, visits: 3, daysAgo: 58 },
  { name: 'Harsh Vardhan', email: 'harsh.vardhan@example.com', phone: '9876543232', totalSpend: 11500, visits: 4, daysAgo: 10 },
  { name: 'Kiran Rao', email: 'kiran.rao@example.com', phone: '9876543233', totalSpend: 7000, visits: 2, daysAgo: 75 },
  { name: 'Tarun Saini', email: 'tarun.saini@example.com', phone: '9876543234', totalSpend: 13500, visits: 6, daysAgo: 42 },
  { name: 'Payal Ghosh', email: 'payal.ghosh@example.com', phone: '9876543235', totalSpend: 8000, visits: 2, daysAgo: 68 },
  { name: 'Vivek Anand', email: 'vivek.anand@example.com', phone: '9876543236', totalSpend: 15500, visits: 8, daysAgo: 5 },
  { name: 'Rashmi Pillai', email: 'rashmi.pillai@example.com', phone: '9876543237', totalSpend: 6000, visits: 2, daysAgo: 85 },
  { name: 'Gaurav Sinha', email: 'gaurav.sinha@example.com', phone: '9876543238', totalSpend: 14500, visits: 7, daysAgo: 28 },
  { name: 'Sunita Rani', email: 'sunita.rani@example.com', phone: '9876543239', totalSpend: 5000, visits: 1, daysAgo: 90 },
];

export function buildDemoCustomers(idFactory) {
  const now = Date.now();
  return baseCustomers.map((c) => ({
    _id: idFactory(),
    name: c.name,
    email: c.email,
    phone: c.phone,
    totalSpend: c.totalSpend,
    visits: c.visits,
    lastActive: new Date(now - c.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  }));
}
