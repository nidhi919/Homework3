// import {
//     collection,
//     getDocs,
//     query,
//     where,
//     orderBy,
//     limit,
//     getCountFromServer,
//     addDoc,
//     deleteDoc,
//     doc,
// } from 'firebase/firestore';
// import type { Product } from '../../utils/types'
// import { app } from '../../firebase/client'
// import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';


// const db = getFirestore(app)
// // Connect to Firestore Emulator
// if (import.meta.env.PUBLIC_EMULATOR === '1')
//     connectFirestoreEmulator(db, 'localhost', 8080)

// // TODO Finalize this function to fetch ALL the products from Firestore
// // The function also takes the query as an argument to filter the products.
// // The query can be empty. In this case, return all the products.
// // If the query is not empty, filter the results based on the query.
// //! Order the products by ID in ascending order
// export const fetchProducts = async (
//     queryStr = '',
//     currentPage = 1,
//     pageSize = 10
// ): Promise<{ products: Product[]; totalPages: number }> => {
//     const productsRef = collection(db, 'products');
//     const products: Product[] = [];
//     let totalPages = 0;

//     // Create a Firestore query
//     let productsQuery = query(productsRef, orderBy('id')); // Order by ID

//     // If queryStr is not empty, filter the products
//     if (queryStr) {
//         productsQuery = query(productsQuery, where('name', '>=', queryStr), where('name', '<=', queryStr + '\uf8ff'));
//     }

//     // Calculate the total number of products for pagination
//     const totalCountSnapshot = await getCountFromServer(productsQuery);
//     const totalCount = totalCountSnapshot.data().count;
//     totalPages = Math.ceil(totalCount / pageSize);

//     // Limit the results for pagination
//     const paginatedQuery = query(productsQuery, limit(pageSize));

//     // Fetch the products
//     const querySnapshot = await getDocs(paginatedQuery);
//     querySnapshot.forEach((doc) => {
//         products.push({ id: doc.data().id, ...doc.data() } as Product);
//     });

//     return { products, totalPages };
// };

// // TODO Finalize this function to add a product to Firestore
// // The new product should have an ID that is one greater than the current maximum ID in the db
// export const addProduct = async (product: Omit<Product, 'id'>) => {
//     // Get a reference to the products collection
//     const productsRef = collection(db, 'products');
    
//     // Get all products to find the current maximum ID
//     const querySnapshot = await getDocs(productsRef);
//     let maxID = 0;

//     querySnapshot.forEach((doc) => {
//         const currentID = doc.data().id;
//         if (currentID > maxID) {
//             maxID = currentID;
//         }
//     });

//     const newID = maxID + 1; // Increment the maximum ID by 1

//     // Add the new product to Firestore
//     await addDoc(productsRef, { id: newID, ...product });

//     return { id: newID, ...product };
// };

// // TODO Finalize this function to delete a product from Firestore
// export const deleteProduct = async (productId: number) => {
//     const productsRef = collection(db, 'products');

//     // Query to find the product with the specified ID
//     const querySnapshot = await getDocs(productsRef);
//     let productDocId: string | null = null;

//     querySnapshot.forEach((doc) => {
//         if (doc.data().id === productId) {
//             productDocId = doc.id; // Get the document ID for deletion
//         }
//     });

//     if (productDocId) {
//         await deleteDoc(doc(productsRef, productDocId));
//         return { id: productId }; // Return the deleted product ID
//     } else {
//         throw new Error(`Product with ID ${productId} not found.`);
//     }
// };



//FROM HERE UNCOMMENT IF DOESN'T WORK

import {
    collection,
    getFirestore,
    connectFirestoreEmulator,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAt,
    addDoc,
} from 'firebase/firestore'
import type { Product } from '../../utils/types'
import { app } from '../../firebase/client'
import { doc, deleteDoc } from 'firebase/firestore'

const db = getFirestore(app)
// Connect to Firestore Emulator
if (import.meta.env.PUBLIC_EMULATOR === '1')
    connectFirestoreEmulator(db, 'localhost', 8080)

// TODO Finalize this function to fetch ALL the products from Firestore
// The function also takes the query as an argument to filter the products.
// The query can be empty. In this case, return all the products.
// If the query is not empty, filter the results based on the query.
//! Order the products by ID in ascending order
export const fetchProducts = async (
    queryStr = '',
    pageSize = 10,
    currentPage = 1
): Promise<{ products: Product[]; totalPages: number }> => {
    const productsRef = collection(db, 'products')
    let products: Product[] = []
    let totalPages = 0
    console.log(queryStr)
    if (queryStr != '') {
        // Your code here

        const querySnapshot = await getDocs(
            query(
                productsRef,
                orderBy('id', 'asc'),
                startAt((currentPage - 1) * pageSize)
            )
        )
        querySnapshot.forEach((doc) => {
            products.push(doc.data() as Product)
        })
        const filteredProducts = products.filter((product) =>
            product.name.toLowerCase().includes(queryStr.toLowerCase())
        )
        console.log(filteredProducts)
        products = filteredProducts

        totalPages = Math.ceil(products.length / pageSize)
    } else {
        const querySnapshot = await getDocs(
            query(
                productsRef,
                orderBy('id', 'asc'),
                startAt((currentPage - 1) * pageSize)
            )
        )
        querySnapshot.forEach((doc) => {
            products.push(doc.data() as Product)
        })
        totalPages = Math.ceil(querySnapshot.size / pageSize)
    }
    // Your code here

    return { products, totalPages }
}

// TODO Finalize this function to add a product to Firestore
// The new product should have an ID that is one greater than the current maximum ID in the db
export const addProduct = async (product: Omit<Product, 'id'>) => {
    let newID = 0
    const productsRef = collection(db, 'products')
    const querySnapshot = await getDocs(
        query(productsRef, orderBy('id', 'desc'), limit(1))
    )
    if (!querySnapshot.empty) {
        const lastProduct = querySnapshot.docs[0].data() as Product
        newID = lastProduct.id + 1
    } else {
        newID = 1
    }
    await addDoc(productsRef, { id: newID, ...product })
    // Your code here

    return { id: newID, ...product }
}

// TODO Finalize this function to delete a product from Firestore
export const deleteProduct = async (productId: number) => {
    // Your code here
    const productsRef = collection(db, 'products')
    const querySnapshot = await getDocs(
        query(productsRef, where('id', '==', productId))
    )
    if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id
        const productRef = doc(db, 'products', docId)
        await deleteDoc(productRef)
        return { id: productId }
    } else {
        throw new Error(`Product with ID ${productId} not found.`);
    }
    return {id: 0}
}