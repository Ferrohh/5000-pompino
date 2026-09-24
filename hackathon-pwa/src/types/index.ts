export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

export interface ErrorResponse {
    status: number;
    error: string;
}