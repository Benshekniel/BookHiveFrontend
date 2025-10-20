import axios from 'axios';
import { Package, DollarSign, Clock, SearchSlash } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '../../AuthContext';
import LoadingSpinner from '../CommonStuff/LoadingSpinner';

const RegularStats = () => {
  const { user } = useAuth();

  const fetchRegularStats = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-inventory/stats/regular/${user.userId}`);
      return response.data;
    }
    catch (err) {
      console.error("Axios Error: ", err);
    }
  }

  const { data: regularStats, isPending, error } = useQuery({
    queryKey: ["regularStats", user?.userId],
    queryFn: fetchRegularStats,
    staleTime: 10 * 60 * 1000,
    enabled: !!user?.userId,
  });

  const regularStatEnhanced = useMemo(() => {
    if (!regularStats) return []; // return empty until data is ready

    return [
      {
        label: 'TOTAL INVENTORY DRAFTS', value: regularStats.totalBooks, icon: Package,
        bgColor: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-600'
      },
      {
        label: 'SALE DRAFTS', value: regularStats.sellInventory, icon: DollarSign,
        bgColor: 'bg-green-50', border: 'border-green-200', textColor: 'text-green-600'
      },
      {
        label: 'LEND DRAFTS', value: regularStats.lendInventory, icon: Clock,
        bgColor: 'bg-amber-50', border: 'border-amber-200', textColor: 'text-amber-600'
      },
      {
        label: 'NOT-SET DRAFTS', value: regularStats.notSetInventory, icon: SearchSlash,
        bgColor: 'bg-purple-50', border: 'border-purple-200', textColor: 'text-purple-600'
      }
    ];
  }, [regularStats]);

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
        {regularStatEnhanced.map((stat, index) => {
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
    </>);
};
export default RegularStats;