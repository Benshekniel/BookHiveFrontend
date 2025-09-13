import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sidebarMenuConfig } from '../../config/menuconfig';
import { LogOut, X } from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, onLogout, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/moderator')) return 'moderator';
    if (path.startsWith('/bookstore')) return 'bookstore';
    if (path.startsWith('/manager')) return 'delivery-manager';
    if (path.startsWith('/agent')) return 'delivery-agent';
    if (path.startsWith('/organization')) return 'organization';
    if (path.startsWith('/hubmanager')) return 'hub-manager';
    return 'guest';
  };

  const role = getRoleFromPath();
  const menuItems = sidebarMenuConfig[role] || sidebarMenuConfig.guest;

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    if (isMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else navigate('/');
    if (isMobileOpen) setIsMobileOpen(false);
  };

  const handleMouseEnter = () => setCollapsed(false);
  const handleMouseLeave = () => setCollapsed(true);

  console.log('Sidebar rendered - collapsed:', collapsed, 'isMobileOpen:', isMobileOpen, 'offsetHeight:', document.querySelector('.sidebar')?.offsetHeight);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Sidebar for mobile: only show when isMobileOpen, for desktop: always show */}
      <div
        className={`
          sidebar flex flex-col bg-blue-900 text-white transition-all h-full
          ${isMobileOpen
            ? 'fixed top-0 left-0 z-50 w-64 lg:hidden'
            : 'hidden lg:flex lg:fixed lg:top-0 lg:left-0 ' + (collapsed ? 'lg:w-16' : 'lg:w-64')
          }
          overflow-hidden lg:overflow-y-auto
        `}
        style={{
          transitionDuration: collapsed ? '500ms' : '300ms',
          backgroundColor: '#1E3A8A',
          height: '100vh',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{
            borderColor: 'rgba(59, 130, 246, 0.3)',
            minHeight: '65px',
          }}
        >
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="BookHive Logo"
              className="w-9 h-9 object-contain"
            />
            {(isMobileOpen || !collapsed) && (
              <h1 className="text-xl font-bold">
                Book<span style={{ color: '#FBBF24' }}>Hive</span>
              </h1>
            )}
          </div>
          {isMobileOpen && (
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center rounded-lg transition-colors py-3 min-h-[48px] ${isActive
                        ? 'bg-amber-400 text-gray-800'
                        : 'text-white hover:bg-amber-200 hover:text-gray-800'
                      }`}
                    title={item.label}
                    style={{ paddingLeft: '0.75rem', paddingRight: '0' }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {(isMobileOpen || !collapsed) && (
                      <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>
                    )}
                  </button>

                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 border-t" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg transition-colors py-3 min-h-[48px] hover:bg-red-600`}
            title={collapsed && !isMobileOpen ? 'Logout' : ''}
            style={{ paddingLeft: collapsed && !isMobileOpen ? '0.75rem' : '0.75rem', paddingRight: '0' }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(isMobileOpen || !collapsed) && <span className="ml-3 font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { sidebarMenuConfig } from '../../config/menuconfig';
// import { LogOut, X } from 'lucide-react';

// const Sidebar = ({ collapsed, setCollapsed, onLogout, isMobileOpen, setIsMobileOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const getRoleFromPath = () => {
//     const path = location.pathname;
//     if (path.startsWith('/admin')) return 'admin';
//     if (path.startsWith('/moderator')) return 'moderator';
//     if (path.startsWith('/bookstore')) return 'bookstore';
//     if (path.startsWith('/manager')) return 'delivery-manager';
//     if (path.startsWith('/agent')) return 'delivery-agent';
//     if (path.startsWith('/organization')) return 'organization';
//     if (path.startsWith('/hubmanager')) return 'hub-manager';
//     return 'guest';
//   };

//   const role = getRoleFromPath();
//   const menuItems = sidebarMenuConfig[role] || sidebarMenuConfig.guest;

//   const handleNavigation = (path) => {
//     navigate(path);
//     window.scrollTo(0, 0);
//     if (isMobileOpen) setIsMobileOpen(false);
//   };

//   const handleLogout = () => {
//     if (onLogout) onLogout();
//     else navigate('/');
//     if (isMobileOpen) setIsMobileOpen(false);
//   };

//   const handleMouseEnter = () => setCollapsed(false);
//   const handleMouseLeave = () => setCollapsed(true);

//   console.log('Sidebar rendered - collapsed:', collapsed, 'isMobileOpen:', isMobileOpen, 'offsetHeight:', document.querySelector('.sidebar')?.offsetHeight);

//   return (
//     <>
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 z-40 lg:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}
//       {/* Sidebar for mobile: only show when isMobileOpen, for desktop: always show */}
//       <div
//         className={`
//           sidebar flex flex-col bg-blue-900 text-white transition-all h-full
//           ${isMobileOpen
//             ? 'fixed top-0 left-0 z-50 w-64 lg:hidden'
//             : 'hidden lg:flex lg:fixed lg:top-0 lg:left-0 ' + (collapsed ? 'lg:w-16' : 'lg:w-64')
//           }
//           overflow-hidden lg:overflow-y-auto
//         `}
//         style={{
//           transitionDuration: collapsed ? '500ms' : '300ms',
//           backgroundColor: '#1E3A8A',
//           height: '100vh',
//         }}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         <div
//           className="p-4 border-b flex items-center justify-between"
//           style={{
//             borderColor: 'rgba(59, 130, 246, 0.3)',
//             minHeight: '65px',
//           }}
//         >
//           <div className="flex items-center space-x-2">
//             <img
//               src="/images/logo.png"
//               alt="BookHive Logo"
//               className="w-9 h-9 object-contain"
//             />
//             {(isMobileOpen || !collapsed) && (
//               <h1 className="text-xl font-bold">
//                 Book<span style={{ color: '#FBBF24' }}>Hive</span>
//               </h1>
//             )}
//           </div>
//           {isMobileOpen && (
//             <button
//               className="lg:hidden text-white"
//               onClick={() => setIsMobileOpen(false)}
//             >
//               <X className="w-6 h-6" />
//             </button>
//           )}
//         </div>

//         <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
//           <ul className="space-y-1 px-2">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;

//               return (
//                 <li key={item.path}>
//                   <button
//                     onClick={() => handleNavigation(item.path)}
//                     className={`w-full flex items-center rounded-lg transition-colors py-3 min-h-[48px] ${isActive
//                         ? 'bg-amber-400 text-gray-800'
//                         : 'text-white hover:bg-amber-200 hover:text-gray-800'
//                       }`}
//                     title={item.label}
//                     style={{ paddingLeft: '0.75rem', paddingRight: '0' }}
//                   >
//                     <Icon className="w-5 h-5 flex-shrink-0" />
//                     {(isMobileOpen || !collapsed) && (
//                       <span className="ml-3 font-medium whitespace-nowrap">{item.label}</span>
//                     )}
//                   </button>

//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         <div className="p-2 border-t" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
//           <button
//             onClick={handleLogout}
//             className={`w-full flex items-center rounded-lg transition-colors py-3 min-h-[48px] hover:bg-red-600`}
//             title={collapsed && !isMobileOpen ? 'Logout' : ''}
//             style={{ paddingLeft: collapsed && !isMobileOpen ? '0.75rem' : '0.75rem', paddingRight: '0' }}
//           >
//             <LogOut className="w-5 h-5 flex-shrink-0" />
//             {(isMobileOpen || !collapsed) && <span className="ml-3 font-medium whitespace-nowrap">Logout</span>}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;