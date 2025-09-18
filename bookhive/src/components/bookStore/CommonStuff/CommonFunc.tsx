import { Clock, Award, Box } from 'lucide-react';

export const formatDateTime = (isoString: string) => {
	const date = new Date(isoString);
	const formattedDate = date.toLocaleDateString("en-GB", {
		year: "numeric", month: "short", day: "2-digit",
	});
	const formattedTime = date.toLocaleTimeString("en-GB", {
		hour: "2-digit", minute: "2-digit", hour12: true
	}).replace(/am|pm/i, match => match.toUpperCase());

	return `${formattedDate} - ${formattedTime}`;
};

type BookConditionType = 'NEW' | 'USED' | 'FAIR';
export const getConditionBadge = (condition: BookConditionType) => {
  const conditionConfigs: Record<BookConditionType, { bg: string; text: string; border: string }> = {
    'NEW': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    'USED': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    'FAIR': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
  };
  const config = conditionConfigs[condition];
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {condition}
    </span>
  );
};


type BookStatusType = 'AVAILABLE' | 'LENT' | 'AUCTION';
type StatusConfig = { bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }>; };
const customStatusConfigs: Record<BookStatusType, StatusConfig> = {
  'AVAILABLE': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: Box },
  'LENT': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: Clock },
  'AUCTION': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: Award }
};

export const getBookStatusBadge = (status: BookStatusType) => {
  const config = customStatusConfigs[status] || customStatusConfigs['AVAILABLE'];
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <IconComponent className="w-4 h-4" />
      <span>{status}</span>
    </span>
  );
};


type DonationStatusType = 'Inventory' | 'Matched' | 'Delivered';
export const getDonationStatusType = (status: DonationStatusType) => {
  const statusConfigs: Record<DonationStatusType, { bg: string; text: string; border: string }> = {
      'Inventory': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
      'Matched': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'Delivered': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
  };
  const config = statusConfigs[status];
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};