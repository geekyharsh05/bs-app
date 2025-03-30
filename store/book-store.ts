import { create } from "zustand";

interface BookFormState {
  title: string;
  caption: string;
  rating: number;
  image: string | null;
  imageBase64: string | null;

  setTitle: (title: string) => void;
  setCaption: (caption: string) => void;
  setRating: (rating: number) => void;
  setImage: (image: string | null) => void;
  setImageBase64: (base64: string | null) => void;
  resetFields: () => void;
}

export const useBookStore = create<BookFormState>((set) => ({
  title: "",
  caption: "",
  rating: 3,
  image: null,
  imageBase64: null,

  setTitle: (title) => set({ title }),
  setCaption: (caption) => set({ caption }),
  setRating: (rating) => set({ rating }),
  setImage: (image) => set({ image }),
  setImageBase64: (imageBase64) => set({ imageBase64 }),

  resetFields: () =>
    set({
      title: "",
      caption: "",
      rating: 3,
      image: null,
      imageBase64: null,
    }),
}));
