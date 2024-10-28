import {
    collection,
    getFirestore,
    connectFirestoreEmulator,
} from 'firebase/firestore'
import type { Product } from '../../utils/types'
import { app } from '../../firebase/client'

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
    pageSize = 10
): Promise<{ products: Product[]; totalPages: number }> => {
    const productsRef = collection(db, 'products')
    const products: Product[] = []
    let totalPages = 0

    // Your code here

    return { products, totalPages }
}

// TODO Finalize this function to add a product to Firestore
// The new product should have an ID that is one greater than the current maximum ID in the db
export const addProduct = async (product: Omit<Product, 'id'>) => {
    let newID = 0

    // Your code here

    return { id: newID, ...product }
}

// TODO Finalize this function to delete a product from Firestore
export const deleteProduct = async (productId: number) => {
    // Your code here
    return { id: 0 }
}
