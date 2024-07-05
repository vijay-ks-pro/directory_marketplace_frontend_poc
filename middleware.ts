import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const ownerAuthToken = request.cookies.get('owner_auth_token')?.value;
    const authToken = request.cookies.get('auth_token')?.value;
    const authRole = request.cookies.get('role')?.value;

    const isOwnerAuthenticated = ownerAuthToken != null && ownerAuthToken.trim() != '';
    const isAdvertiserAuthenticated = authToken != null && authToken.trim() != '' && authRole?.toLowerCase() == 'advertiser';
    const isAuthenticated = authToken != null && authToken.trim() != '';

    if(request.nextUrl.pathname == '/owner/login' && isOwnerAuthenticated) {
        return NextResponse.redirect(new URL('/owner/template', request.url));
    }

    if(request.nextUrl.pathname.startsWith('/owner') && request.nextUrl.pathname != '/owner/login' && isOwnerAuthenticated == false) {
        return NextResponse.redirect(new URL('/owner/login', request.url));
    }

    if(request.nextUrl.pathname.startsWith('/advertiser') && isAdvertiserAuthenticated == false) {
        if(isAuthenticated == false) return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url));
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    if(request.nextUrl.pathname == '/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}