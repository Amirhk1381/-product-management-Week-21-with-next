import { set, useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useContext } from "react";
import { createProduct, getProducts } from "../services/auth";
import { getCookie } from "../services/cookie";
// import { useNavigate } from "react-router-dom";
// import { useSearchParams } from "react-router-dom";
import { ProductContext } from "../context/ProductsProvider";

import styles from "../styles/AddProduct.module.css";

function AddProduct({ onConfirm, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { name: "", quantity: "", price: "" },
  });
  const { products, setProducts, fetchProducts, page, setPage } =
    useContext(ProductContext);
  const navigate = useNavigate();
  const close = () => {
    navigate("/products");
    reset();
  };

  const onSubmit = async (data) => {
    // handleAddProduct(data, close);
    await onConfirm(data);
    // close();
  };

  return (
    <div className={styles.container} dir="rtl">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="add-product-title" className={styles.title}>
          ایجاد محصول جدید
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputContainer}>
            <label>نام کالا</label>
            <input
              className={styles.input}
              placeholder="نام کالا"
              {...register("name", { required: "نام کالا الزامی است" })}
              autoFocus
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label>تعداد موجودی</label>
            <input
              className={styles.input}
              placeholder="تعداد موجودی"
              inputMode="numeric"
              {...register("quantity", {
                required: "تعداد الزامی است",
                pattern: { value: /^\d+$/, message: "فقط رقم وارد کنید" },
              })}
            />
            {errors.quantity && (
              <p className={styles.error}>{errors.quantity.message}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.price}>قیمت</label>
            <input
              className={styles.input}
              placeholder="قیمت"
              inputMode="numeric"
              {...register("price", {
                required: "قیمت الزامی است",
                pattern: { value: /^\d+$/, message: "فقط رقم وارد کنید" },
              })}
            />
            {errors.price && (
              <p className={styles.error}>{errors.price.message}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submit}
                disabled={isSubmitting}
              >
                ایجاد
              </button>
              <button
                type="button"
                className={styles.cancel}
                onClick={onCancel}
                disabled={isSubmitting}
              >
                انصراف
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
