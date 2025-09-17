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

type ConditionType = 'NEW' | 'USED' | 'FAIR';
export const getConditionBadge = (condition: ConditionType) => {
  const conditionConfigs: Record<ConditionType, { bg: string; text: string; border: string }> = {
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



type StatusType = 'Inventory' | 'Matched' | 'Delivered';
export const getStatusBadge = (status: StatusType) => {
  const statusConfigs: Record<StatusType, { bg: string; text: string; border: string }> = {
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