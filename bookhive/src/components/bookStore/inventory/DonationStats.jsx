import {
	Package, Heart, Award, HandHeart
} from 'lucide-react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuth } from '../../AuthContext';

import LoadingSpinner from '../LoadingSpinner';

const DonationStats = () => {
  // const { user } = useAuth();
  const user = { userId: 603 };

  const fetchDonationStats = async () => {
    if (!user?.userId) return [];
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-stats/donationInventory/${user.userId}`);
      return response.data;
    }
    catch {
      console.error("Axios Error: ", err);
    }
  }

  const { data: donationStats, isPending, error } = useQuery({
    queryKey: ["donationStats", user?.userId],
    queryFn: fetchDonationStats,
    staleTime: 10 * 60 * 1000,
    enabled: !!user?.userId,
  });

  const donationStatEnhanced = useMemo(() => {
    if (!donationStats) return []; // return empty until data is ready

    return [
      {
        label: 'TOTAL INVENTORY DRAFTS', value: donationStats.totalBooks, icon: Package,
        bgColor: 'bg-blue-50', border: 'border-blue-200', textColor: 'text-blue-600'
      },
      {
        label: 'DONATION INVENTORY', value: donationStats.donationStock, icon: Heart,
        bgColor: 'bg-green-50', border: 'border-green-200', textColor: 'text-green-600'
      },
      {
        label: 'TOTAL DONATIONS', value: donationStats.donated, icon: HandHeart,
        bgColor: 'bg-pink-50', border: 'border-pink-200', textColor: 'text-pink-600'
      },
      {
        label: 'IMPACT SCORE', value: donationStats.impactScore, icon: Award,
        bgColor: 'bg-purple-50', border: 'border-purple-200', textColor: 'text-purple-600'
      }
    ];
  }, [donationStats]);

	return (
		<>
		{ isPending ? (
			<div className='bg-red-50 border-red-200 border-2 border-opacity-20 rounded-xl p-6 my-5'>
				<LoadingSpinner />
			</div>
		) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {donationStatEnhanced.map((stat, index) => {
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
export default DonationStats;