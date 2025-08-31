import styles from "../styles/DeleteModal.module.css";

function DeleteProduct({ onConfirm, onCancel }) {
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
          <img src="Close.svg" alt="اخطار" />
        </div>
        <p className={styles.text}>آیا از حذف این محصول مطمئنید؟</p>
        <div className={styles.buttons}>
          <button onClick={onConfirm} className={styles.confirm}>
            حذف
          </button>
          <button onClick={onCancel} className={styles.cancel}>
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProduct;
