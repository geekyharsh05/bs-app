import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/auth-store";
import { createBook } from "@/lib/book-api";
import { CreateBookPayload, BookResponse } from "@/types/book-type";

interface UseCreateBookProps {
  resetFields: () => void;
}

export const useCreateBook = ({ resetFields }: UseCreateBookProps) => {
  const { token } = useAuthStore();
  const router = useRouter();

  return useMutation<BookResponse, any, CreateBookPayload>({
    mutationFn: (payload) => createBook(payload, token as string),

    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Book Shared Successfully",
        text2: data.message || "Your book has been posted! 🎉",
      });

      resetFields();
      router.push("/");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || "Something went wrong on the server.";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });
};

export const useGetBook = () => {}
