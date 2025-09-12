import { X } from "lucide-react";

interface BookViewProps {
	bookId: number;
	onClose: () => void;
}

const AddToListings = ({ bookId, onClose }) => {


	
	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

					<div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-100">
						<h2 className="text-2xl font-bold text-gray-900"> Add to Listings </h2>
						<button onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
							<X className="w-5 h-5 text-gray-500" />
						</button>
					</div>



				</div>
			</div>

		</>);
};
export default AddToListings;

