export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}
  
export interface LoginPayload {
    email: string;
    password: string;
}
  
export interface User {
    id: string;
    username: string;
    email: string;
    profileImage: string;
}
  
export interface AuthResponse {
    user: User;
    token: string;
}
  