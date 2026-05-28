import { Hotel, UtensilsCrossed, Scissors, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export interface TabPreview {
  id: string;
  label: string;
  title: string;
  badge: string;
  description: string;
  stats: { label: string; value: string }[];
  features: string[];
  preview: React.ReactNode;
}

export const tabs: TabPreview[] = [
  {
    id: 'hotel',
    label: 'Hotel PMS',
    title: 'Luxury HMS & Hourly Reservation System',
    badge: 'Hospitality Engine',
    description: 'Streamline property listings, room rates (flexible daily / 3h\u201312h hourly blocks), and housekeeping rosters. Features direct front-office calendar bookings.',
    stats: [
      { label: 'Check-ins / Min', value: '450+' },
      { label: 'Booking Sync', value: '<2.1s' },
      { label: 'Hourly Util', value: '+42%' }
    ],
    features: ['Automated room assigner', 'Dynamic seasonal pricing', 'Hourly flexible stays mapping', 'Room maintenance trackers'],
    preview: (
      <div className="space-y-3 font-sans text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Hotel size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-200 truncate">Room 402 — Premium Suite</p>
              <p className="text-[10px] text-slate-400 truncate">Guest: Dr. Dinesh K. Rana</p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-medium whitespace-nowrap">Checked In</span>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <p className="text-[10px] text-slate-400">Flexible Stay Option</p>
            <p className="text-xs font-bold text-slate-200 mt-1">6-Hour Rate</p>
            <p className="text-[10px] text-blue-400 mt-1 font-semibold">NPR 4,500 allocated</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <p className="text-[10px] text-slate-400">Housekeeping Status</p>
            <p className="text-xs font-bold text-amber-400 mt-1">Clean Pending</p>
            <p className="text-[10px] text-slate-400 mt-1">Assigned: Staff Sunita</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/40">
          <div className="flex items-center justify-between text-[10px] mb-1.5 text-blue-300">
            <span>Dynamic Occupancy Rate</span>
            <span className="font-bold">89.4%</span>
          </div>
          <div className="w-full bg-slate-850 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '89.4%' }}></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'pos',
    label: 'Restaurant POS',
    title: 'High-Performance Fine Dining POS & KOTs',
    badge: 'Active Point of Sale',
    description: 'Run robust tables management, instant kitchen order ticket (KOT) dispatches, and quick cashier checkout portals. Fully integrated with room charging capabilities.',
    stats: [
      { label: 'Avg Ticket Time', value: '4.8s' },
      { label: 'Dine-In Tables', value: '80+' },
      { label: 'Room Charge Sync', value: 'Instant' }
    ],
    features: ['KOT direct-to-kitchen routing', 'Table billing layouts', 'Custom split invoice logic', 'Waiter smartphone ordering app'],
    preview: (
      <div className="space-y-3 font-sans text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <p className="font-semibold text-slate-200">Table 12 — Order #8023</p>
            <p className="text-[10px] text-slate-400">Waiter: Prashant M.</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-medium animate-pulse">Kitchen Queue</span>
        </div>
        <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
          <div className="flex justify-between text-slate-300">
            <span>2x Thakali Mutton Set</span>
            <span className="font-bold">NPR 1,900</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>1x Fresh Mint Lemonade</span>
            <span className="font-bold">NPR 350</span>
          </div>
          <div className="text-[10px] text-slate-500 italic mt-1">
            *Note: Medium spicy, extra soup
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Consolidated Billing</p>
            <p className="text-[10px] text-slate-200 mt-0.5">Charge to Hotel Room 402</p>
          </div>
          <button className="w-full sm:w-auto px-3 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-[9px] transition-colors whitespace-nowrap">Apply Charge</button>
        </div>
      </div>
    )
  },
  {
    id: 'parlor',
    label: 'Spa & Salon',
    title: 'Precision Beauty, Parlor & Spa Scheduling',
    badge: 'Time-Slot Coordinator',
    description: 'Seamless time-slot calendar, multiple stylist allocations, spa package bookings, and comprehensive client formulas. Eliminates double bookings.',
    stats: [
      { label: 'Stylists', value: '25+' },
      { label: 'Mutex Locks', value: 'Safe' },
      { label: 'Repeat Client', value: '78%' }
    ],
    features: ['Dynamic availability matrices', 'Automated stylist commissions', 'Multi-service checkout packages', 'SMS/Email reminder triggers'],
    preview: (
      <div className="space-y-3 font-sans text-xs">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Therapist Roster</span>
            <span className="text-[9px] text-slate-400">Wednesday, May 27</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded bg-pink-500/10 border border-pink-500/20 text-pink-300">
              <span className="truncate mr-1">Massage (90 min) — Rita S.</span>
              <span className="font-bold flex-shrink-0">14:00 - 15:30</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700 text-slate-400">
              <span className="truncate mr-1">Hair Spa (45 min) — Available</span>
              <span className="font-semibold flex-shrink-0">15:45 - 16:30</span>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-800/30 text-[10px]">
          <div className="flex items-center gap-1.5 text-pink-400 mb-1">
            <Sparkles size={12} className="flex-shrink-0" />
            <span className="font-bold uppercase tracking-wider text-[9px]">Client Profile Notes</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Guest: Alina K. · Prefers Lavender Essential Oil, sensitive skin profile.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'cms',
    label: 'Web Builder',
    title: 'Sleek No-Code CMS & Domain Publisher',
    badge: 'Visual Engine',
    description: 'Allow your brand properties to build and launch custom websites directly from the CMS. Instant theme applications and live domain bindings.',
    stats: [
      { label: 'Subdomains', value: '180+' },
      { label: 'Template Load', value: '0.4s' },
      { label: 'SSL Deploy', value: '100%' }
    ],
    features: ['Drag-and-drop sections builder', 'Brand theme configurations', 'SEO metadata injectors', 'Custom hostname router maps'],
    preview: (
      <div className="space-y-3 font-sans text-xs">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <span className="text-[9px] text-slate-400 font-mono truncate">regency-hotel.kswms.cloud</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[8px] border border-emerald-500/20 flex-shrink-0">LIVE</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">CMS Builder Console</p>
          <div className="space-y-1.5 text-[9px] text-slate-300">
            <div className="p-1.5 rounded bg-slate-800 flex items-center justify-between">
              <span>⚡ Hero Section (Banner, CTA)</span>
              <span className="text-purple-400 font-bold text-[8px]">Edit</span>
            </div>
            <div className="p-1.5 rounded bg-slate-800 flex items-center justify-between">
              <span>🛌 Room Showcases (Live Sync)</span>
              <span className="text-slate-400 text-[8px]">Connected</span>
            </div>
            <div className="p-1.5 rounded bg-slate-800 flex items-center justify-between">
              <span>📞 Contact & Location Map</span>
              <span className="text-slate-400 text-[8px]">Active</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
];
