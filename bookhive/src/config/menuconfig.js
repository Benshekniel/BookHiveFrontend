// src/config/menuConfig.js
import { Home, User, Settings, BookOpen, Truck, Building, ShieldCheck } from 'lucide-react';

export const sidebarMenuConfig = {
  admin: [
    { label: 'Dashboard', icon: Home, path: '/admin' },
    { label: 'Manage Users', icon: User, path: '/admin/users' },
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
    { label: 'Deliveries', icon: Truck, path: '/agent/deliveries' },
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