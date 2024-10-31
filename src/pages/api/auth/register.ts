import type { APIRoute } from 'astro'
import { getAuth } from 'firebase-admin/auth'
import { app } from '../../../firebase/server'

// TODO Finalize this POST function to register a new user in the Firebase Authentication service
// A new user can be created with an email and password
// The new user object should have the following properties:
// - email: string
// - password: string
// - name: string
// Verifiy that all three properties are present in the request body, otherwise return a 400 status
// The POST function should redirect user back to the signin page upon successful creation


export const POST: APIRoute = async ({ request }) => {
    const auth = getAuth(app);
    const contentType = request.headers.get('content-type');

    if (!contentType?.includes('application/json') && !contentType?.includes('application/x-www-form-urlencoded')) {
        return new Response('Invalid content type. Expected application/json or application/x-www-form-urlencoded', { status: 400 });
    }

    let email: string | undefined;
    let password: string | undefined;
    let name: string | undefined;

    let data: { email?: string; password?: string; name?: string } = {};

    if (contentType?.includes('application/x-www-form-urlencoded')) {
        const urlEncodedBody = await request.text();
        data = Object.fromEntries(new URLSearchParams(urlEncodedBody));
    } else {
        const rawBody = await request.text();
        try {
            data = JSON.parse(rawBody);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return new Response('Invalid JSON format.', { status: 400 });
        }
    }

    email = data.email;
    password = data.password;
    name = data.name;

    if (!email || !password || !name) {
        return new Response('All fields are required.', { status: 400 });
    }

    try {
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        console.log('Successfully created new user:', userRecord.uid);
        return Response.redirect('/signin', 303); 
        return new Response(JSON.stringify({ message: 'User created successfully!' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating user:', error.message);
            return new Response(`Failed to create user: ${error.message}`, {
                status: 400,
            });
        } else {
            console.error('Unknown error creating user:', error);
            return new Response('Failed to create user due to an unknown error.', {
                status: 500,
            });
        }
    }
    
};


// Finalize this POST function to register a new user in the Firebase Authentication service
// export const POST: APIRoute = async ({ request, redirect }) => {
//     const auth = getAuth(app);

//     // Check if the request's content type is application/json
//     if (!request.headers.get('content-type')?.includes('application/json')) {
//         return new Response('Invalid content type. Expected application/json', { status: 400 });
//     }

//     let email: string | undefined;
//     let password: string | undefined;
//     let name: string | undefined;

//     // Get the raw request body
//     const rawBody = await request.text();
//     console.log('Raw request body:', rawBody); // Log for debugging

//     // Try to parse the request body as JSON
//     try {
//         const data = JSON.parse(rawBody); // Parse the raw body
//         email = data.email;
//         password = data.password;
//         name = data.name;
//     } catch (error) {
//         console.error('Error parsing JSON:', error);
//         return new Response('Invalid JSON format.', { status: 400 });
//     }

//     // Check if all required fields are present
//     if (!email || !password || !name) {
//         return new Response('All fields are required.', { status: 400 });
//     }

//     try {
//         // Create the user in Firebase Authentication
//         const userRecord = await auth.createUser({
//             email,
//             password,
//             displayName: name,
//         });

//         console.log('Successfully created new user:', userRecord.uid);

//         // Redirect to sign-in page upon successful creation
//         return redirect('/signin', 303); // 303 for "See Other" to redirect

//     } catch (error: unknown) { // Specify the type as unknown
//         if (error instanceof Error) {
//             console.error('Error creating user:', error.message);
//             return new Response(`Failed to create user: ${error.message}`, {
//                 status: 400,
//             });
//         } else {
//             console.error('Unknown error creating user:', error);
//             return new Response('Failed to create user due to an unknown error.', {
//                 status: 500,
//             });
//         }
//     }
// };
