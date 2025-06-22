// src/config/menuConfig.js
import { Home, LifeBuoy, Bell, MapPin, User, Settings, BookOpen, Truck, Building, ShieldCheck, Calendar, FileText, BarChart2 } from 'lucide-react';

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
    { label: 'Content Review', icon: ShieldCheck, path: '/moderator/review' },
  ],
  bookstore: [
    { label: 'Dashboard', icon: Home, path: '/bookstore' },
    { label: 'Inventory', icon: BookOpen, path: '/bookstore/inventory' },
    { label: 'Orders', icon: Truck, path: '/bookstore/orders' },
  ],
  'delivery-hub': [
    { label: 'Dashboard', icon: Home, path: '/delivery-hub' },
    { label: 'Shipments', icon: Truck, path: '/delivery-hub/shipments' },
  ],
  'delivery-agent': [
    { label: 'Dashboard', icon: Home, path: '/agent' },
    { label: 'Delivery', icon: BookOpen, path: '/agent/delivery' },
    { label: 'Hub', icon: MapPin, path: '/agent/hub' },
    { label: 'Notification', icon: Bell, path: '/agent/notification' },
    { label: 'Support', icon: LifeBuoy, path: '/agent/support' },
  ],
  organization: [
    { label: 'Dashboard', icon: Home, path: '/organization' },
    { label: 'Reports', icon: Building, path: '/organization/reports' },
  ],
  user: [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Profile', icon: User, path: '/dashboard/profile' },
    { label: 'Orders', icon: Truck, path: '/dashboard/orders' },
  ],
  guest: [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Login', icon: User, path: '/login' },
    { label: 'Signup', icon: User, path: '/signup' },
  ],
};