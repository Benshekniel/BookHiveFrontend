import axios from 'axios';
import { Package, DollarSign, Handshake, ActivitySquare, PackageCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '../../AuthContext';
import LoadingSpinner from '../CommonStuff/LoadingSpinner';

const LendOnlyStats = () => {
  const { user } = useAuth();

  const fetchLendOnlyStats = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-books/stats/lendOnly/${user.userId}`);
      return response.data;
    }
    catch (err) {
      console.error("Axios Error: ", err);
    }
  }

  const { data: lendOnlyStats, isPending, error } = useQuery({
    queryKey: ["lendOnlyStats", user?.userId],
    queryFn: fetchLendOnlyStats,
    staleTime: 10 * 60 * 1000,
    enabled: !!user?.userId,
  });

  const lendingStatEnhanced = useMemo(() => {
    if (!lendOnlyStats) return []; // return empty until data is ready
    return [
      {
        label: 'TOTAL LENDING BOOKS', value: lendOnlyStats.totalBooks, icon: Package,
        bgColor: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-600'
      },
      {
        label: 'ACTIVE LISTINGS', value: lendOnlyStats.activeListings, icon: ActivitySquare,
        bgColor: 'bg-green-50', border: 'border-green-200', textColor: 'text-green-600'
      },
      {
        label: 'IN INVENTORY', value: lendOnlyStats.inInventory, icon: PackageCheck,
        bgColor: 'bg-amber-50', border: 'border-amber-200', textColor: 'text-amber-600'
      },
      {
        label: 'BOOKS LENT NOW', value: lendOnlyStats.onLoanCount, icon: Handshake,
        bgColor: 'bg-purple-50', border: 'border-purple-200', textColor: 'text-purple-600'
      },
      {
        label: 'AVERAGE LENDING FEE', value: `Rs.${(lendOnlyStats.avgLendPrice).toFixed(2)}`, icon: DollarSign,
        bgColor: 'bg-purple-50', border: 'border-purple-200', textColor: 'text-purple-600'
      }
    ];
  }, [lendOnlyStats]);

  return (
    <>
      {isPending ? (
        <div className='bg-red-50 border-red-200 border-2 border-opacity-20 rounded-xl p-6 my-5'>
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          Server unreachable. Please try again later.
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {lendingStatEnhanced.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index}
              className={`${stat.bgColor} ${stat.border} border-2 border-opacity-20 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group`} >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
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
    </>);
};
export default LendOnlyStats;