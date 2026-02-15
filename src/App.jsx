import { useState, useEffect } from 'react'
import { create } from 'zustand'
import { motion } from 'framer-motion'
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MagnifyingGlassIcon, MoonIcon, SunIcon, Bars3Icon, ArrowDownTrayIcon, UserGroupIcon, CubeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const useStore = create((set) => ({
  isAuthenticated: false, currentUser: null, currentView: 'landing', darkMode: false, sidebarOpen: true,
  selectedDateRange: '30d', searchQuery: '', loading: true, kpiData: [], chartData: null, tableData: [],
  login: (user) => set({ isAuthenticated: true, currentUser: user, currentView: 'dashboard', loading: true }),
  logout: () => set({ isAuthenticated: false, currentUser: null, currentView: 'landing' }),
  setView: (view) => set({ currentView: view, loading: true }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSearch: (query) => set({ searchQuery: query }),
  generateData: () => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const chartData = { labels, revenue: labels.map(() => Math.floor(Math.random() * 100000) + 50000), orders: labels.map(() => Math.floor(Math.random() * 2000) + 500) }
    const kpiData = [
      { id: 1, title: 'Total Revenue', value: Math.floor(Math.random() * 500000) + 1000000, change: (Math.random() * 20 - 5).toFixed(1), prefix: '$', icon: '💰', color: 'from-emerald-400 to-emerald-600' },
      { id: 2, title: 'Total Orders', value: Math.floor(Math.random() * 5000) + 10000, change: (Math.random() * 15 - 3).toFixed(1), icon: '📦', color: 'from-blue-400 to-blue-600' },
      { id: 3, title: 'Active Users', value: Math.floor(Math.random() * 2000) + 5000, change: (Math.random() * 25 - 8).toFixed(1), icon: '👥', color: 'from-purple-400 to-purple-600' },
      { id: 4, title: 'Conversion Rate', value: (Math.random() * 3 + 2).toFixed(2), change: (Math.random() * 10 - 2).toFixed(1), suffix: '%', icon: '📈', color: 'from-orange-400 to-orange-600' }
    ]
    const tableData = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, orderNumber: `ORD-${10000 + i}`, customer: ['Alice', 'Bob', 'Carol', 'David'][i % 4], product: 'Sample Product', amount: 100 + i * 10, status: ['Completed', 'Processing'][i % 2], date: '2024-01-15' }))
    set({ kpiData, chartData, tableData, loading: false })
  }
}))

const mockUser = { id: 1, name: 'Demo User', role: 'admin', avatar: '👨‍💼' }

const formatNumber = (num, prefix = '', suffix = '') => num >= 1000000 ? prefix + (num / 1000000).toFixed(1) + 'M' + suffix : num >= 1000 ? prefix + (num / 1000).toFixed(1) + 'K' + suffix : prefix + Number(num).toLocaleString() + suffix

const Header = () => {
  const { darkMode, toggleDarkMode, currentUser, toggleSidebar, searchQuery, setSearch } = useStore()
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" /></button>
          <div className="relative">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary w-64" />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{darkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6 text-gray-600" />}</button>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right"><div className="font-medium text-gray-800 dark:text-white">{currentUser?.name}</div><div className="text-xs text-gray-500 capitalize">{currentUser?.role}</div></div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">{currentUser?.avatar}</div>
          </div>
        </div>
      </div>
    </header>
  )
}

const Sidebar = () => {
  const { sidebarOpen, currentView, setView, logout } = useStore()
  const navItems = [
    { id: 'dashboard', icon: ChartBarIcon, label: 'Dashboard' },
    { id: 'sales', icon: ArrowTrendingUpIcon, label: 'Sales' },
    { id: 'customers', icon: UserGroupIcon, label: 'Customers' },
    { id: 'inventory', icon: CubeIcon, label: 'Inventory' },
    { id: 'users', icon: Cog6ToothIcon, label: 'Users' }
  ]
  return (
    <aside className={`bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primaryDark flex items-center justify-center text-white font-bold text-xl flex-shrink-0">T</div>
          {sidebarOpen && <span className="font-bold text-lg text-gray-800 dark:text-white">Thummar Analytics</span>}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            <item.icon className="w-6 h-6 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
          <ArrowDownTrayIcon className="w-6 h-6 rotate-180" />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

const KPICard = ({ kpi, index }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4"><span className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</span><span className="text-2xl">{kpi.icon}</span></div>
    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{formatNumber(kpi.value, kpi.prefix || '', kpi.suffix || '')}</div>
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium flex items-center gap-1 ${parseFloat(kpi.change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {parseFloat(kpi.change) >= 0 ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}{Math.abs(kpi.change)}%
      </span>
      <span className="text-gray-400 text-sm">vs last period</span>
    </div>
  </motion.div>
)

const Dashboard = () => {
  const { loading, kpiData, chartData, tableData, darkMode, generateData, searchQuery, currentView } = useStore()
  useEffect(() => { generateData() }, [])
  const lineBarData = chartData?.labels?.map((name, i) => ({ name, revenue: chartData.revenue[i], orders: chartData.orders[i] })) || []
  const filteredData = tableData.filter(row => !searchQuery || row.customer.toLowerCase().includes(searchQuery.toLowerCase()))
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentView === 'dashboard' ? 'Dashboard Overview' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h1><p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? Array(4).fill(0).map((_, i) => (<div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div><div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div><div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div></div>)) : kpiData.map((kpi, i) => (<KPICard key={kpi.id} kpi={kpi} index={i} />))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"><h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}><LineChart data={lineBarData}><CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'} /><XAxis dataKey="name" stroke={darkMode ? '#e5e7eb' : '#374151'} /><YAxis stroke={darkMode ? '#e5e7eb' : '#374151'} tickFormatter={(v) => `$${v/1000}k`} /><Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} /><Line type="monotone" dataKey="revenue" stroke="#5ebec4" strokeWidth={3} /></LineChart></ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"><h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Orders by Month</h3>
          <ResponsiveContainer width="100%" height={280}><BarChart data={lineBarData}><CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'} /><XAxis dataKey="name" stroke={darkMode ? '#e5e7eb' : '#374151'} /><YAxis stroke={darkMode ? '#e5e7eb' : '#374151'} /><Tooltip contentStyle={{ backgroundColor: darkMode ? '#1f2937' : '#fff', border: 'none', borderRadius: '8px' }} /><Legend /><Bar dataKey="orders" fill="#5ebec4" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50"><tr><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Order</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Product</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredData.map((row) => (<tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30"><td className="px-6 py-4"><span className="font-mono text-sm font-medium text-primary">{row.orderNumber}</span></td><td className="px-6 py-4"><span className="text-gray-900 dark:text-white font-medium">{row.customer}</span></td><td className="px-6 py-4"><span className="text-gray-600 dark:text-gray-300">{row.product}</span></td><td className="px-6 py-4"><span className="font-medium text-gray-900 dark:text-white">${row.amount}</span></td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{row.status}</span></td><td className="px-6 py-4"><span className="text-gray-500 dark:text-gray-400 text-sm">{row.date}</span></td></tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const LandingPage = () => {
  const { darkMode, toggleDarkMode } = useStore()
  const handleDemoLogin = () => { useStore.getState().login(mockUser); useStore.getState().generateData() }
  return (
    <div className="min-h-full bg-gradient-to-br from-bgLight via-white to-bgDark dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primaryDark flex items-center justify-center text-white font-bold text-xl">T</div><span className="font-bold text-xl text-gray-800 dark:text-white">Thummar Analytics</span></div>
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{darkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6 text-gray-600" />}</button>
            <button onClick={handleDemoLogin} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary font-medium">Login</button>
            <button onClick={handleDemoLogin} className="px-6 py-2 bg-gradient-to-r from-primary to-primaryDark text-white rounded-lg font-medium">Get Started</button>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6"><span>🚀</span> Powered by Advanced Analytics</div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"><span className="bg-gradient-to-r from-primary to-primaryDark bg-clip-text text-transparent">Turning Data</span><br />into <span className="text-primary">Decisions</span></h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Thummar Analytics empowers your business with real-time insights, beautiful visualizations, and actionable intelligence to drive growth.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={handleDemoLogin} className="px-8 py-4 bg-gradient-to-r from-primary to-primaryDark text-white rounded-xl font-semibold text-lg">Start Free Trial →</button>
                <button onClick={handleDemoLogin} className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-primary/10">View Demo</button>
              </div>
              <div className="flex items-center gap-8 mt-10">
                <div className="text-center"><div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div><div className="text-gray-500 text-sm">Active Users</div></div>
                <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-center"><div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div><div className="text-gray-500 text-sm">Uptime</div></div>
                <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-center"><div className="text-3xl font-bold text-gray-900 dark:text-white">50M+</div><div className="text-gray-500 text-sm">Data Points</div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primaryDark/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div><div className="text-xs text-gray-400 font-mono">dashboard.thummar.com</div></div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[{ icon: '💰', value: '$1.2M', label: 'Revenue' }, { icon: '📦', value: '15.4K', label: 'Orders' }, { icon: '👥', value: '8.9K', label: 'Users' }].map((item, i) => (<div key={i} className="bg-primary/10 rounded-xl p-4"><div className="text-2xl mb-2">{item.icon}</div><div className="font-bold text-gray-800 dark:text-white">{item.value}</div><div className="text-xs text-gray-500">{item.label}</div></div>))}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 h-32 flex items-end gap-1">{Array.from({ length: 12 }, (_, i) => (<div key={i} className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t" style={{ height: `${30 + Math.random() * 70}%` }}></div>))}</div>
                  <div className="flex gap-4 text-xs text-gray-400"><span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full"></span> Revenue</span><span className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-400 rounded-full"></span> Orders</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16"><h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Powerful Features</h2><p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to make data-driven decisions</p></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{ icon: '📊', title: 'KPI Monitoring', desc: 'Track all your key performance indicators in real-time' }, { icon: '📈', title: 'Interactive Charts', desc: 'Visualize your data with dynamic charts' }, { icon: '📋', title: 'Reports & Insights', desc: 'Generate comprehensive reports' }, { icon: '📥', title: 'PDF / CSV Exports', desc: 'Export your data in multiple formats' }, { icon: '⚡', title: 'Real-time Updates', desc: 'Watch your metrics update in real-time' }, { icon: '🔒', title: 'Role-based Access', desc: 'Control who sees what with permissions' }].map((f, i) => (<motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl"><div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-3xl mb-6">{f.icon}</div><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3><p className="text-gray-600 dark:text-gray-300">{f.desc}</p></motion.div>))}
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-primaryDark rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Data?</h2>
            <p className="text-xl opacity-90 mb-8">Join thousands of businesses already using Thummar Analytics</p>
            <button onClick={handleDemoLogin} className="px-8 py-4 bg-white text-primary rounded-xl font-semibold text-lg hover:bg-gray-100">Start Free Trial</button>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">T</div><span className="font-bold text-xl">Thummar Analytics</span></div>
          <p className="text-gray-400">© 2024 Thummar Analytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

const App = () => {
  const { isAuthenticated, darkMode } = useStore()
  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode) }, [darkMode])
  return (
    <div className="h-full">
      {isAuthenticated ? (<div className="h-full flex"><Sidebar /><div className="flex-1 flex flex-col overflow-hidden"><Header /><Dashboard /></div></div>) : <LandingPage />}
    </div>
  )
}

export default App
