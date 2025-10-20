import axios from "axios";
import { Trash2 } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { useAuth } from "../../AuthContext";

const DeleteBook = ({bookId}: {bookId: number}) => {
  const queryClient = useQueryClient();
    // const { user } = useAuth();
  const user = { userId: 603 };

  const deleteItem = async (bookId: number) => {
    const response = await axios.delete(`http://localhost:9090/api/bs-book/${bookId}`);
    return response.data;
  }

  const deleteMutation = useMutation({
    mutationFn: ({ bookId }: { bookId: number }) => deleteItem(bookId),
    onMutate: () => {
      toast.loading("Deleting...", { id: "deleteToast" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regularInventory", user?.userId] });
      toast.success("Successfully deleted!", { id: "deleteToast" });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong! Please try again later!", { id: "deleteToast" })
    },
  })


  const deleteItemConfirm = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }
    ).then((result) => {
      if (result.isConfirmed && bookId !== null) {
        deleteMutation.mutate({ bookId: bookId });
      }
    });
  }

  return (
    <button className="p-2 bg-red-100 border border-red-200 hover:bg-red-200 rounded-lg transition-colors duration-200"
      onClick={deleteItemConfirm} title="Delete book">
      <Trash2 className="w-5 h-5 text-slate-600" />
    </button>
  )
}
export default DeleteBook;