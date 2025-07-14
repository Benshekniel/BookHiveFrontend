// src/config/menuConfig.js
import {
  Home, User, Settings, BookOpen, Users, Warehouse, MessageSquare, Calendar, Headphones,
  Truck, Building, HeartHandshake, BookHeart, Trophy, UsersRound, Headset, MessageCircleMore, MapPin, Bell,
  ShieldCheck, FileText, BarChart2, ArrowRightLeft, DollarSign, Box,
  LineChart, LayoutDashboard, ClipboardList, CalendarCheck2, Route,FlaskConical, CircleDashed,MessageSquareText,MessageCircle,UserCog
} from 'lucide-react';

export const sidebarMenuConfig = {
  admin: [
    { label: 'Dashboard', icon: Home, path: '/admin' },
    { label: 'Moderators', icon: User, path: '/admin/moderator' }, // Same as Manage Users, as it deals with user roles
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
    { label: 'Testing', icon: FlaskConical, path: '/moderator/test' },
    { label: 'Settings', icon: Settings, path: '/moderator/settings' },

  ],
  bookstore: [
    { label: 'Dashboard', icon: Home, path: '/bookstore' },
    { label: 'Inventory', icon: Box, path: '/bookstore/inventory' },
    { label: 'Listings', icon: FileText, path: '/bookstore/listings' },
    { label: 'Transactions', icon: ArrowRightLeft, path: '/bookstore/transactions' },
    { label: 'Finances', icon: DollarSign, path: '/bookstore/finances' },
    { label: 'Support', icon: Headset, path: '/bookstore/support' }
  ],
  'delivery-manager': [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/manager' },
    { label: 'Delivery Agents', icon: Users, path: '/manager/agents' },
    { label: 'Delivery', icon: Truck, path: '/manager/delivery' },
    { label: 'Hubs', icon: Warehouse, path: '/manager/hubs' },
    { label: 'Messages', icon: MessageSquare, path: '/manager/messages' },
    { label: 'Support', icon: Headphones, path: '/manager/support' },
    { label: 'Settings', icon: Settings, path: '/manager/schedule' },
  ],
  'delivery-agent': [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/agent' },
    { label: 'Tasks', icon: ClipboardList, path: '/agent/tasks' },
    { label: 'Delivery', icon: Truck, path: '/agent/delivery' },
    { label: 'Notification', icon: Bell, path: '/agent/notification' },
    { label: 'Performance', icon: LineChart, path: '/agent/performance' },
    { label: 'Support', icon: Headset, path: '/agent/support' },
  ],
  'hub-manager': [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/hubmanager' },
    { label: 'Delivery', icon: Truck, path: '/hubmanager/deliveries' },
    { label: 'Agents', icon: Users, path: '/hubmanager/agents' },
    { label: 'Messages', icon: MessageSquare, path: '/hubmanager/messages' },
    { label: 'Routes', icon: Route, path: '/hubmanager/routes' },
    { label: 'Performance', icon: LineChart, path: '/hubmanager/performance' },
    { label: 'Support', icon: Headset, path: '/hubmanager/support' },
    { label: 'Hub Settings', icon: Settings, path: '/hubmanager/settings' },
  ]
  ,
   organization : [
    { label: 'Dashboard', icon: Home, path: '/organization' },
    { label: 'Book Request', icon: BookOpen, path: '/organization/request' },
    { label: 'Donations', icon: HeartHandshake, path: '/organization/received' },
    { label: 'Messages', icon: MessageSquareText, path: '/organization/messages' },
    { label: 'Notifications', icon: Bell, path: '/organization/notifications' },
    { label: 'Feedback', icon: MessageCircle, path: '/organization/feedback' },
    { label: 'Profile', icon: UserCog, path: '/organization/settings' },
  ],
  
  

  user: [
    { label: 'Dashboard', icon: Home, path: '/user' },
    { label: 'SellerDashboard', icon: Home, path: '/user/seller-dashboard' },
    { label: 'Browse Books', icon: BookOpen, path: '/user/browse-books' },
    { label: 'Orders', icon: Truck, path: '/user/orders' },
    { label: 'Competitions', icon: Trophy, path: '/user/competitions' },
    { label: 'Messages', icon: MessageSquare, path: '/user/messages' },
    { label: 'Profile Settings', icon: User, path: '/user/profile-settings' },
    { label: 'Book Circle', icon: CircleDashed, path: '/user/book-circles' },
    { label: 'Notifications', icon: Bell, path: '/user/notifications' },
    
  ],
  // guest: [
  //   { label: 'Home', icon: Home, path: '/' },
  //   { label: 'Login', icon: User, path: '/login' },
  //   { label: 'Signup', icon: User, path: '/signup' },
  // ],
};