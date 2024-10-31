import React from 'react';
import type { Product } from '../utils/types';
import ProductCard from './ProductCard';
import '../styles/ProductList.css';

interface ProductListProps {
    products: Product[];
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    currentPage,
    //totalPages,
    setCurrentPage,
}) => {
    // Calculate the number of products per page
    const productsPerPage = 10;

    // Ensure totalPages is calculated based on products
    const calculatedTotalPages = Math.ceil(products.length / productsPerPage);

    console.log('total pages calculated::', calculatedTotalPages);

    const renderPaginationLinks = () => {
        const links = [];
        for (let i = 1; i <= calculatedTotalPages; i++) {
            links.push(
                <a
                    key={i}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        // Check if current page is valid before setting
                        if (i <= calculatedTotalPages) {
                            setCurrentPage(i);
                        }
                    }}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </a>
            );
        }
        return links;
    };

    const renderProducts = () => {
        // Calculate the index range for the current page
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const currentProducts = products.slice(startIndex, endIndex);

        return currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ));
    };

    return (
        <div className="product-list">
            <h2>Products</h2>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="product-grid">{renderProducts()}</div>
            )}
            <div className="pagination">{renderPaginationLinks()}</div>
        </div>
    );
};

export default ProductList;








// import React from 'react'
// import type { Product } from '../utils/types'
// import ProductCard from './ProductCard'
// import '../styles/ProductList.css'

// interface ProductListProps {
//     products: Product[]
//     currentPage: number
//     totalPages: number
//     setCurrentPage: (page: number) => void
// }
// const ProductList: React.FC<ProductListProps> = ({
//     products,
//     currentPage,
//     totalPages,
//     setCurrentPage,
// }) => {
//     const renderPaginationLinks = () => {
//         const links = []
//         for (let i = 1; i <= totalPages; i++) {
//             links.push(
//                 <a
//                     key={i}
//                     href="#"
//                     onClick={(e) => {
//                         e.preventDefault()
//                         setCurrentPage(i)
//                     }}
//                     className={currentPage === i ? 'active' : ''}
//                 >
//                     {i}
//                 </a>
//             )
//         }
//         return links
//     }

//     // TODO Render the products in the grid
//     // This component is given the full list of products and the current page
//     // Return a list of ProductCard components for the products on the current page
//     const renderProducts = () => {
//         // Your code here
//         // Calculate the index range for the current page
//         const startIndex = (currentPage - 1) * 10; // Assuming 10 products per page
//         const endIndex = startIndex + 10;
//         const currentProducts = products.slice(startIndex, endIndex);

//         return currentProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//         ));
//     };

//     return (
//         <div className="product-list">
//             <h2>Products</h2>
//             {products.length === 0 ? (
//                 <p>No products found.</p>
//             ) : (
//                 <div className="product-grid">{renderProducts()}</div>
//             )}
//             <div className="pagination">{renderPaginationLinks()}</div>
//         </div>
//     )
// }

// export default ProductList