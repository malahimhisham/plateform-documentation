import { NextResponse } from 'next/server'
 
export function middleware(request) {

    const token = request.cookies.get('authToken');

    if (!token) {
        // If no token, redirect to home page
        console.log("No token found, redirecting to home.");
        return NextResponse.redirect(new URL('/', request.url));
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/admin', '/howto'],
}