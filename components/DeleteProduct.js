import { useContext, useEffect, useState } from "react";
import styles from "../styles/Products.module.css";
import Table from "../components/Table.js";
import { getProducts } from "../services/auth";
import { ProductContext } from "../context/ProductsProvider";
import { getVisiblePages } from "../constant/pagination";
import AddProduct from "../components/AddProduct";
import { getCookie } from "../services/cookie";
import { createProduct } from "../services/auth";
import { useDebounce } from "../constant/useDebounce";

function ProductsList() {
  const [username, setUsername] = useState("");

  const {
    products,
    setProducts,
    fetchProducts,
    page,
    setPage,
    limit,
    totalPages,
    search,
    setSearch,
    addProduct,
    setAddProduct,
    searchParams,
    setSearchParams,
    loading,
  } = useContext(ProductContext);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const pages = getVisiblePages(page, totalPages, 3);

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const currentSearch = searchParams.get("search") || "";
    if (currentPage !== page || currentSearch !== search) {
      setPage(currentPage);
      setSearch(currentSearch);
      // console.log(searchParams.get("page"));
    }
  }, [searchParams, page, search]);
  const handlePageChange = (p) => {
    setPage(p);
    // console.log(page);

    if (search && search.trim() !== "") {
      setSearchParams({ page: p.toString(), search });
    } else {
      setSearchParams({ page: p.toString() });
    }
  };
  useEffect(() => {
    setPage(1);
    setSearch(debouncedSearch);

    if (debouncedSearch.trim() === "") {
      setSearchParams({});
    } else {
      setSearchParams({ page: "1", search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) setUsername(user);
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [page, limit, search]);

  // fetchProducts();
  const handleAddProduct = async (data, close) => {
    if (getCookie("token") === null) {
      alert("لطفا ابتدا وارد حساب کاربری خود شوید");
      return;
    } else {
      try {
        const response = await createProduct(data);

        const res = await getProducts({ page: 1, limit: 1 });
        const total = res.data.totalProducts;
        const lastPage = Math.ceil(total / 10);
        fetchProducts();
        setPage(lastPage);
        // console.log(page);

        // console.log("Product created successfully:", response.data);
        // console.log(products);

        alert("محصول با موفقیت ایجاد شد");
        setAddProduct(null);
        navigate(`/products?page=${lastPage}`);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.productsHeader}>
        <div className={styles.searchContainer}>
          <img src="public/search-normal.svg" alt="" />
          <input
            type="text"
            placeholder="جستجو کالا"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.userInfo}>
          <img src="../public/Felix-Vogel-4.svg" alt="" />
          <div>
            <span className={styles.username}>{username}</span>
            <span className={styles.userRole}>مدیر</span>
          </div>
        </div>
      </div>
      <div className={styles.titleBar}>
        <div>
          <img src="setting-3.svg" alt="" className={styles.setting} />
          <h3>مدیریت کالا</h3>
        </div>
        <button className={styles.addButton} onClick={() => setAddProduct({})}>
          <span>افزودن محصول</span>
        </button>
      </div>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <>
          <Table />
          <div className={styles.pagination}>
            <ul>
              {page > 1 && (
                <>
                  <li>
                    <button
                      onClick={() => handlePageChange(1)}
                      className={styles.navPageButton}
                    >
                      {" "}
                      اول
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      className={styles.navPageButton}
                    >
                      قبلی
                    </button>
                  </li>
                </>
              )}

              {pages.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => handlePageChange(p)}
                    className={
                      page === p ? styles.activePageButton : styles.pageButton
                    }
                  >
                    {p}
                  </button>
                </li>
              ))}

              {page < totalPages && (
                <>
                  <li>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      className={styles.navPageButton}
                    >
                      بعدی
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={styles.navPageButton}
                    >
                      آخر
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}

      {addProduct && (
        <AddProduct
          onConfirm={handleAddProduct}
          onCancel={() => setAddProduct(null)}
        />
      )}
    </div>
  );
}

export default ProductsList;
