import NotificationBox from "components/notifications/NotificationBox";
import AuthContext from "context/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";

export interface NotificationProps {
  createdAt: string;
  uid: string;
  content: string;
  id: string;
  url: string;
  isRead: boolean;
}

export default function NotificationPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    if (user) {
      let ref = collection(db, "notifications");
      let notificationQuery = query(
        ref,
        where("uid", "==", user?.uid),
        orderBy("createdAt", "desc")
      );
      onSnapshot(notificationQuery, (snapshot) => {
        const notificationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NotificationProps[];
        setNotifications(notificationsData);
      });
    }
  }, [user]);
  console.log("notifications", notifications);
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">Notification</div>
        </div>
      </div>
      <div className="post">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <NotificationBox key={item.id} notification={item}/>
          ))
        ) : (
          <div className="post__no-posts">
            <div className="post__text">알림이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}
