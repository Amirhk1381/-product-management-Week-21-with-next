import styles from "../styles/Table.module.css";
import { useContext } from "react";
import { deleteProduct, editProduct } from "../services/auth";
import DeleteProduct from "./DeleteProduct";
import { getCookie } from "../services/cookie";
import { ProductContext } from "../context/ProductsProvider";
import EditProduct from "./EditProduct";
import { useRouter } from "next/router";

function Table() {
  const router = useRouter()
  const {
    products,
    setProducts,
    productToDelete,
    setProductToDelete,
    fetchProducts,
    productToEdit,
    setProductToEdit,
    page,
    setPage,
    search,
  } = useContext(ProductContext);

  const handleDeleteProduct = async (productId) => {
    if (getCookie("token") === null) {
      alert("لطفا وارد حساب کاربری خود شوید.");
      router.push("/login")
      return;
    }

    try {
      await deleteProduct(productId);

      setProductToDelete(null);
      if (products.length === 1 && page > 1) {
        const newPage = page - 1;
        setPage(newPage);
        
        // await fetchProducts();
      }
      await fetchProducts();

      console.log("Product deleted:", products.length);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handleEditProduct = async (productId, editedProduct) => {
    if (getCookie("token") === null) {
      alert("لطفا وارد حساب کاربری خود شوید.");
      router.push("/login")
      return;
    }
    try {
      await editProduct(productId, editedProduct);
      setProductToEdit(null);
      // setProducts((prev) =>
      //   prev.map((p) => (p.id === productId ? { ...p, ...editedProduct } : p))
      // );
      await fetchProducts();
      // console.log("sending to API:", productId, editedProduct);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };
  // console.log("products:", products);

  return (
    <div className={styles.productList}>
      <div className={styles.tableContainer}>
        {products.length === 0 ? (
          <p className={styles.empty}>محصولی یافت نشد</p>
        ) : (
          <table className={styles.table}>
            <thead className={styles.header}>
              <tr>
                <th>نام کالا</th>
                <th>موجودی</th>
                <th>قیمت</th>
                <th>شناسه کالا</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td className={styles.priceCell}>
                    {product.price} <span>هزار تومان</span>
                  </td>
                  <td className={styles.idCell}>{product.id}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => setProductToEdit(product)}
                    >
                      <img
                        src="edit.svg"
                        alt="ویرایش"
                        className={styles.editIcon}
                      />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => setProductToDelete(product)}
                    >
                      <img
                        src="trash.svg"
                        alt="حذف"
                        className={styles.deleteIcon}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {productToDelete && (
        <DeleteProduct
          product={productToDelete}
          onCancel={() => setProductToDelete(null)}
          onConfirm={(data) => handleDeleteProduct(productToDelete.id, data)}
        />
      )}
      {productToEdit && (
        <EditProduct
          product={productToEdit}
          onCancel={() => setProductToEdit(null)}
          onConfirm={(editedData) =>
            handleEditProduct(productToEdit.id, editedData)
          }
        />
      )}
    </div>
  );
}

export default Table;
