import {
  Package, DollarSign, Clock, SearchSlash,
  Heart
} from 'lucide-react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from '../../AuthContext';

import LoadingSpinner from '../LoadingSpinner';
const salesStats = [
    { 
      label: 'TOTAL LISTINGS', 
      value: '89', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200', 
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      icon: Heart
    },
    { 
      label: 'LIVE', 
      value: '67', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200', 
      textColor: 'text-green-600',
      iconBg: 'bg-green-100',
      icon: CheckCircle
    },
    { 
      label: 'DRAFT', 
      value: '22', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200', 
      textColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      icon: Clock
    },
    { 
      label: 'VIEWS TODAY', 
      value: '12', 
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200', 
      textColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      icon: TrendingUp
    }
  ];

const SalesStats = () => {
  // const { user } = useAuth();
  const user = { userId: 603 };

  const fetchSalesStats = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-stats/regularInventory/${user.userId}`);
      return response.data;
    }
    catch {
      console.error("Axios Error: ", err);
    }
  }

  const { data: salesStats, isPending, error } = useQuery({
    queryKey: ["salesStats", user?.userId],
    queryFn: fetchSalesStats,
    staleTime: 10 * 60 * 1000,
    enabled: !!user?.userId,
  });

  const salesStatEnhanced = useMemo(() => {
    if (!salesStats) return []; // return empty until data is ready

        // private long totalBooks;
        // private long activeListings;
        // private long inInventory;
        // private long soldCount;

        // private long avgSellPrice;
    return [
      {
        label: 'TOTAL SALE BOOKS', value: salesStats.totalBooks, icon: Package,
        bgColor: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-600'
      },
      {
        label: 'ACTIVE LISTINGS', value: salesStats.activeListings, icon: DollarSign,
        bgColor: 'bg-green-50', border: 'border-green-200', textColor: 'text-green-600'
      },
      {
        label: 'IN INVENTORY', value: salesStats.inInventory, icon: Clock,
        bgColor: 'bg-amber-50', border: 'border-amber-200', textColor: 'text-amber-600'
      },
      {
        label: 'NOT-SET DRAFTS', value: salesStats.soldCount, icon: SearchSlash,
        bgColor: 'bg-purple-50', border: 'border-purple-200', textColor: 'text-purple-600'
      },
      {
        label: 'NOT-SET DRAFTS', value: salesStats.avgSellPrice, icon: SearchSlash,
        bgColor: 'bg-purple-50', border: 'border-purple-200', textColor: 'text-purple-600'
      }
    ];
  }, [salesStats]);

  return (
    <>
		{ isPending ? (
			<div className='bg-red-50 border-red-200 border-2 border-opacity-20 rounded-xl p-6 my-5'>
				<LoadingSpinner />
			</div>
		) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {salesStatEnhanced.map((stat, index) => {
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
export default SalesStats;