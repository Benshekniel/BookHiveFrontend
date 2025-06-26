import {
  Bell,
  Package,
  MapPin,
  Clock,
  TrendingUp,
  Car,
  DollarSign,
  CloudRain,
  AlertTriangle
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

export default function AgentDashboard() {
  const stats = [
    { name: 'Pending Deliveries', value: '12', icon: Package, color: 'text-[#3B82F6]' },
    { name: 'Active Notifications', value: '3', icon: Bell, color: 'text-[#EF4444]' },
    { name: 'Delivered Today', value: '18', icon: TrendingUp, color: 'text-[#22C55E]' },
    { name: 'Hours Today', value: '6.5', icon: Clock, color: 'text-[#FBBF24]' },
  ]

  const weeklyPerformance = [
    { day: 'Mon', deliveries: 15, distance: 45 },
    { day: 'Tue', deliveries: 18, distance: 52 },
    { day: 'Wed', deliveries: 12, distance: 38 },
    { day: 'Thu', deliveries: 22, distance: 61 },
    { day: 'Fri', deliveries: 19, distance: 48 },
    { day: 'Sat', deliveries: 25, distance: 67 },
    { day: 'Sun', deliveries: 16, distance: 43 },
  ]

  const monthlyData = [
    { month: 'Jan', deliveries: 420, earnings: 2100 },
    { month: 'Feb', deliveries: 380, earnings: 1900 },
    { month: 'Mar', deliveries: 450, earnings: 2250 },
    { month: 'Apr', deliveries: 520, earnings: 2600 },
    { month: 'May', deliveries: 485, earnings: 2425 },
    { month: 'Jun', deliveries: 510, earnings: 2550 },
  ]

  const paymentBreakdown = [
    { name: 'Base Pay', value: 1200, color: '#3B82F6' },
    { name: 'Tips', value: 450, color: '#22C55E' },
    { name: 'Bonuses', value: 200, color: '#FBBF24' },
    { name: 'Fuel Allowance', value: 150, color: '#8B5CF6' },
  ]

  const ongoingDeliveries = [
    { id: 1, address: '456 Oak Avenue', status: 'In Transit', eta: '15 min', priority: 'high' },
    { id: 2, address: '789 Pine Street', status: 'Pickup', eta: '8 min', priority: 'medium' },
    { id: 3, address: '123 Maple Ave', status: 'Delivered', eta: 'Complete', priority: 'low' },
  ]

  const pendingTasks = [
    { id: 1, address: '456 Oak Avenue', priority: 'high', time: '11:30 AM' },
    { id: 2, address: '789 Pine Street', priority: 'medium', time: '2:15 PM' },
    { id: 3, address: '321 Elm Drive', priority: 'low', time: '4:00 PM' },
  ]

  const weatherPrediction = [
    { time: '12 PM', temp: '22°C', condition: 'Sunny' },
    { time: '3 PM', temp: '24°C', condition: 'Cloudy' },
    { time: '6 PM', temp: '20°C', condition: 'Rain' },
  ]

  const weatherAlerts = [
    { type: 'warning', message: 'Light rain expected at 6 PM', icon: CloudRain },
    { type: 'alert', message: 'Strong winds after 8 PM', icon: AlertTriangle },
  ]

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180
    const radius = 25 + innerRadius + (outerRadius - innerRadius)
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text x={x} y={y} fill="#0F172A" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${paymentBreakdown[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0F172A]">
          Welcome back, John!
        </h1>
        <div className="text-sm text-[#0F172A]/60">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#0F172A]/60">{stat.name}</p>
                <p className="text-2xl font-semibold text-[#0F172A]">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Row - Performance and Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance Graph */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Weekly Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyPerformance}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="deliveries" stroke="#3B82F6" name="Deliveries" />
              <Line type="monotone" dataKey="distance" stroke="#22C55E" name="Distance (km)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weather Widget */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center">
            <CloudRain className="mr-2 text-blue-500" size={20} />
            Weather
          </h2>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-[#0F172A] mb-2">22°C</div>
            <div className="text-sm text-[#0F172A]/60 mb-4">Partly Cloudy</div>
          </div>
          
          {/* Weather Prediction */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-2">Today's Forecast</h3>
            <div className="space-y-2">
              {weatherPrediction.map((forecast, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-[#0F172A]/60">{forecast.time}</span>
                  <div className="text-right">
                    <span className="font-medium">{forecast.temp}</span>
                    <span className="ml-2 text-[#0F172A]/60">{forecast.condition}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Alerts */}
          <div>
            <h3 className="text-sm font-semibold text-[#0F172A] mb-2">Alerts</h3>
            <div className="space-y-2">
              {weatherAlerts.map((alert, index) => (
                <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg ${
                  alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                }`}>
                  <alert.icon size={14} />
                  <span className="text-xs">{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row - Map and Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ongoing Deliveries Map */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Ongoing Deliveries
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-green-100/20"></div>
            <div className="text-center z-10">
              <MapPin className="mx-auto mb-2 text-blue-500" size={48} />
              <p className="text-gray-600 mb-4">Interactive Map View</p>
              <div className="space-y-2">
                {ongoingDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        delivery.priority === 'high' ? 'bg-red-500' :
                        delivery.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="font-medium">{delivery.address}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{delivery.status}</div>
                      <div className="text-gray-500 text-xs">{delivery.eta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Distance & Deliveries Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center">
              <Car className="mr-2 text-blue-500" size={20} />
              Today's Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#0F172A]/60">Kilometers Traveled</span>
                <span className="text-xl font-bold text-[#0F172A]">47.2 km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#0F172A]/60">Packages Delivered</span>
                <span className="text-xl font-bold text-[#22C55E]">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#0F172A]/60">Avg. Time per Delivery</span>
                <span className="text-xl font-bold text-[#FBBF24]">21 min</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4">
              Pending Deliveries
            </h3>
            <div className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-[#EF4444]' :
                      task.priority === 'medium' ? 'bg-[#FBBF24]' : 'bg-[#22C55E]'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{task.address}</p>
                      <p className="text-xs text-[#0F172A]/60">Scheduled: {task.time}</p>
                    </div>
                  </div>
                  <button className="text-[#3B82F6] hover:text-[#1E3A8A] transition-colors">
                    <MapPin size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Monthly Report and Payment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Report */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">
            Monthly Report
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deliveries" fill="#3B82F6" name="Deliveries" />
              <Bar dataKey="earnings" fill="#22C55E" name="Earnings ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4 flex items-center">
            <DollarSign className="mr-2 text-green-500" size={20} />
            Payment Details
          </h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={250} height={250}>
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={CustomPieLabel}
                  labelLine={false}
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {paymentBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">${item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}