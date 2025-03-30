import axios from "axios";
import { BASE_API_URL } from "@/constants/config";
import { CreateBookPayload, BookResponse } from "@/types/book-type";

export const createBook = async (
  payload: CreateBookPayload,
  token: string
): Promise<BookResponse> => {
  const { data } = await axios.post<BookResponse>(
    `${BASE_API_URL}/book/create-book`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return data;
};
