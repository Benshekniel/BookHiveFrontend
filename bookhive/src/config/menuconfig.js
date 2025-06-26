// src/config/menuConfig.js
import {
  Home, User, Settings, BookOpen, Users, Warehouse, MessageSquare, Calendar, Headphones,
  Truck, Building, HeartHandshake, BookHeart, Trophy, UsersRound, Headset, MessageCircleMore, MapPin, Bell,
  ShieldCheck, FileText, BarChart2, LineChart, LayoutDashboard, ClipboardList, CalendarCheck2, Route

} from 'lucide-react';

export const sidebarMenuConfig = {
  admin: [
    { label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { label: 'Manage Users', icon: User, path: '/admin/users' },
    { label: 'Moderators', icon: User, path: '/admin/moderator' }, // Same as Manage Users, as it deals with user roles
    { label: 'Events', icon: Calendar, path: '/admin/events' },
    { label: 'Contents', icon: FileText, path: '/admin/content' },
    { label: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
    { label: 'Notification', icon: Bell, path: '/admin/notification' },
    { label: 'Security', icon: ShieldCheck, path: '/admin/security' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  moderator: [
    { label: 'Dashboard', icon: Home, path: '/moderator' },
    { label: 'Charity', icon: HeartHandshake, path: '/moderator/charity' },
    { label: 'BookCircle', icon: BookHeart, path: '/moderator/bookcircle' },
    { label: 'Competitions', icon: Trophy, path: '/moderator/competitions' },
    { label: 'Users', icon: UsersRound, path: '/moderator/users' },
    { label: 'Hub', icon: Truck, path: '/moderator/hub' },
    { label: 'Compliance', icon: MessageCircleMore, path: '/moderator/compliance' },
    { label: 'Support', icon: Headset, path: '/moderator/support' },
  ],
  bookstore: [
    { label: 'Dashboard', icon: Home, path: '/bookstore' },
    { label: 'Inventory', icon: BookOpen, path: '/bookstore/inventory' },
    { label: 'Orders', icon: Truck, path: '/bookstore/orders' },
  ],
  'delivery-manager': [
    { label: 'Dashboard', icon: Home, path: '/manager' },
    { label: 'Agents', icon: Users, path: '/manager/Agents' },
    { label: 'Delivery', icon: Truck, path: '/manager/Delivery' },
    { label: 'Hubs', icon: Warehouse, path: '/manager/Hubs' },
    { label: 'Messages', icon: MessageSquare, path: '/manager/Messages' },
    { label: 'Schedule', icon: Calendar, path: '/manager/Schedule' },
    { label: 'Support', icon: Headphones, path: '/manager/Support' },
  ],
  'delivery-agent': [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/agent' },
    { label: 'Tasks', icon: ClipboardList, path: '/agent/tasks' },
    { label: 'Active Delivery', icon: Truck, path: '/agent/delivery' },
    { label: 'Hub', icon: MapPin, path: '/agent/hub' },
    { label: 'Notification', icon: Bell, path: '/agent/notification' },
    { label: 'Performance', icon: LineChart, path: '/agent/performance' },
    { label: 'Support', icon: Headset, path: '/agent/support' },
  ],
  'hub-manager': [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/hubmanager' },
    { label: 'Agents', icon: Users, path: '/hubmanager/agents' },
    { label: 'Delivery', icon: Truck, path: '/hubmanager/deliveries' },
    { label: 'Hub Settings', icon: Settings, path: '/hubmanager/settings' },
    { label: 'Messages', icon: MessageSquare, path: '/hubmanager/messages' },
    { label: 'Routes', icon: Route, path: '/hubmanager/routes' },
    { label: 'Schedules', icon: CalendarCheck2, path: '/hubmanager/schedules' },
    { label: 'Performance', icon: LineChart, path: '/hubmanager/performance' },
    { label: 'Support', icon: Headset, path: '/hubmanager/support' },
  ]
  ,
  organization: [
    { label: 'Dashboard', icon: Home, path: '/organization' },
    { label: 'Reports', icon: Building, path: '/organization/reports' },
  ],
  user: [
    { label: 'Dashboard', icon: Home, path: '/user' },
    { label: 'Browse Books', icon: BookOpen, path: '/user/browse-books' },
    { label: 'Orders', icon: Truck, path: '/user/orders' },
    { label: 'Competitions', icon: Trophy, path: '/user/competitions' },
    { label: 'Messages', icon: MessageSquare, path: '/user/messages' },
    { label: 'Profile Settings', icon: User, path: '/user/profile-settings' },
  ],
  // guest: [
  //   { label: 'Home', icon: Home, path: '/' },
  //   { label: 'Login', icon: User, path: '/login' },
  //   { label: 'Signup', icon: User, path: '/signup' },
  // ],
};