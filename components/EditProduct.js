import { useForm } from "react-hook-form";
import styles from "../styles/EditProduct.module.css";
import { editProduct } from "../services/auth";
import { useEffect } from "react";

function EditProduct({ product, onCancel, onConfirm }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { name: "", quantity: "", price: "" },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        quantity: product.quantity || "",
        price: product.price || "",
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    // console.log("form submitted:", data);
    onConfirm(data);
  };
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h2 className={styles.title}>ویرایش اطلاعات</h2>
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
            <div className={styles.action}>
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

export default EditProduct;
