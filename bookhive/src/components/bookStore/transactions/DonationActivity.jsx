import axios from "axios";
import { Clock, CheckCircle, Heart, Truck } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../AuthContext";
import ContributePopup from "../Forms/ContributePopup";
import LoadingSpinner from "../CommonStuff/LoadingSpinner";

const getStatusBadge = (status) => {
  const statusConfigs = {
    'SHIPPED': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Clock },
    'IN_TRANSIT': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', icon: Truck },
    'APPROVED': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: Heart },
    'RECEIVED': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircle }
  };

  const config = statusConfigs[status]
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <IconComponent className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
};

const DonationActivity = () => {
  const { user } = useAuth();

  const getCurrentDonations = async () => {
    try {
      const response = await axios.get(`http://localhost:9090/api/bs-donation/current-donations`);
      if (response.data.length === 0) return [];
      else return response.data;
    } catch (err) {
      console.error("Axios Error: ", err);
      throw err;
    }
  };

  const { data: currentDonations = [], isPending, error } = useQuery({
    queryKey: ["currentDonations", user?.userId],
    queryFn: getCurrentDonations,
    staleTime: 5 * 60 * 1000,       // cache considered fresh for 5 minutes
    enabled: !!user?.userId
  });

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">REQUEST ID</th>
                <th className="text-left p-4 font-semibold text-slate-700">REQUEST DETAILS</th>
                <th className="text-left p-4 font-semibold text-slate-700">STATUS</th>
                <th className="text-left p-4 font-semibold text-slate-700">PROGRESS</th>
                <th className="text-left p-4 font-semibold text-slate-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    <LoadingSpinner />
                  </td>
                </tr>) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-red-500">
                      Server unreachable. Please try again later.
                    </td>
                  </tr>) : currentDonations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-400">
                        No items found.
                      </td>
                    </tr>) :
                (currentDonations.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-100 hover:bg-slate-50 transition-colors duration-150" >
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                        {req.id}
                      </span>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="text-slate-800 font-medium">
                          <span className="font-semibold text-blue-600">{req.orgName}</span> is requesting books of{" "}
                          <span className="font-semibold text-slate-700">{req.category}</span> category.
                        </p>
                        {req.notes && (
                          <p className="text-sm text-slate-600 mt-1 italic">“{req.notes}”</p>
                        )}
                      </div>
                    </td>

                    <td className="p-4">{getStatusBadge(req.status)}</td>

                    <td className="p-4">
                      <div className="w-full max-w-xs">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>{req.quantityCurrent} / {req.quantity}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${req.quantityCurrent >= req.quantity ? "bg-green-500" : "bg-blue-500"}`}
                            style={{ width: `${Math.min((req.quantityCurrent / req.quantity) * 100, 100)}%`, }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <ContributePopup category={req.category} donationId={req.id} contributable={req.quantity - req.quantityCurrent} />
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>
    </>)
};
export default DonationActivity;
