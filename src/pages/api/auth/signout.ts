import type { APIRoute } from 'astro'

// TODO Finalize this GET function to sign out a registered user
// The function should delete the session cookie and navigate to the signin page
export const GET: APIRoute = async ({ redirect, cookies }) => {
    // Your code here

    cookies.set('session', '', {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 0 // expires the cookie immediately
    });

    return redirect('/signin');
}
