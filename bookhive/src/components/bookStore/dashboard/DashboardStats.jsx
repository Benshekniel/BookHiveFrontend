import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { DollarSign, Package,Book,Handshake} from 'lucide-react';

import LoadingSpinner from '../CommonStuff/LoadingSpinner';
import { useAuth } from '../../AuthContext';

const DashboardStats = () => {
  const { user } = useAuth();

  const fetchDashboardStats = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bookstore/stats/${user.userId}`);
      return response.data;
    }
    catch (err) {
      console.error("Axios Error: ", err);
    }
  }

  const { data: dashboardStats, isPending, error } = useQuery({
    queryKey: ["dashboardStats", user?.userId],
    queryFn: fetchDashboardStats,
    staleTime: 10 * 60 * 1000,
    enabled: !!user?.userId,
  });

  const dashboardStatEnhanced = useMemo(() => {
    if (!dashboardStats) return []; // return empty until data is ready

    return [
      {
        label: 'TOTAL INVENTORY ITEMS', value: dashboardStats.totalInventoryItems, icon: Package,
        bgColor: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-600'
      },
      {
        label: 'TOTAL INDIVIDUAL BOOKS', value: dashboardStats.totalBooksItems, icon: Book,
        bgColor: 'bg-green-50', border: 'border-green-200', textColor: 'text-green-600'
      },
      {
        label: 'TOTAL TRANSACTIONS COUNT', value: dashboardStats.totalTransactions, icon: Handshake,
        bgColor: 'bg-pink-50', border: 'border-pink-200', textColor: 'text-pink-600'
      },
      {
        label: 'TOTAL TRANSACTIONS\' VALUE', value: dashboardStats.totalTransactionsValue, icon: DollarSign,
        bgColor: 'bg-purple-50', border: 'border-purple-200', textColor: 'text-purple-600'
      }
    ];
  }, [dashboardStats]);

  return (
    <>
    { isPending ? (
			<div className='bg-red-50 border-red-200 border-2 border-opacity-20 rounded-xl p-6 my-5'>
				<LoadingSpinner />
			</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          Server unreachable. Please try again later.
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStatEnhanced.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index}
              className={`${stat.bgColor} ${stat.border} border-2 border-opacity-20 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group`} >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform duration-200 ${stat.bgColor.replace('50', '100')}`}>
                  <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
		)}
    </>)
}
export default DashboardStats;