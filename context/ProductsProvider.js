import { createContext, useState } from "react";
import { getProducts, deleteProduct } from "../services/auth";

import { useRouter } from "next/router";

export const ProductContext = createContext();

function ProductsProvider({ children }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [addProduct, setAddProduct] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 100));
      const response = await getProducts({ page, limit, name: search });
      const newProducts = response.data.data;
      const total = response.data.totalPages;
      console.log(response.data.limit);

      if (newProducts.length === 0 && page > 1) {
        setPage(page - 1);
        router.push({ pathname: "/products", query: { page: page - 1 } });
        return;
      }
      setProducts(newProducts);
      setTotalPages(total);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setProducts([]);
        setTotalPages(1);
      } else {
        console.error("Error fetching products:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        productToDelete,
        setProductToDelete,
        fetchProducts,
        page,
        setPage,
        limit,
        setLimit,
        totalPages,
        setTotalPages,
        search,
        setSearch,
        productToEdit,
        setProductToEdit,
        addProduct,
        setAddProduct,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductsProvider;
