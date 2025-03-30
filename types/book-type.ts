export interface CreateBookPayload {
    title: string;
    caption: string;
    rating: number;
    image: string; 
}
  
export interface BookResponse {
    success: boolean;
    message: string;
    bookId?: string; // optional: returned if backend sends the created book's ID
}
  