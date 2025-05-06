import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { NotificationProps } from "pages/notification";
import { useNavigate } from "react-router-dom";
import styles from "./Notitication.module.scss";

export default function NotificationBox({
  notification,
}: {
  notification: NotificationProps;
}) {
  const navigate = useNavigate();
  const onClickNotification = async (url: string) => {
    console.log("url", url);
    //isRead 업데이트
    const ref = doc(db, "notifications", notification.id);
    await updateDoc(ref, {
      isRead: true,
    });

    navigate(url);
  };

  return (
    <div className={styles.notification} onClick={() => onClickNotification(notification?.url)}>
        <div className={styles.notification__flex}>
          <div>
            <div className={styles.notification__createdAt}>
              {notification?.createdAt}
            </div>
            <div className="notification__content">{notification.content}</div>
          </div>
          {!notification?.isRead && (
            <div className={styles.notification__unread} />
          )}
        </div>
    </div>
  );
}
