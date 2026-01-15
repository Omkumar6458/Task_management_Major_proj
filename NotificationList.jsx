import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

function NotificationList({ token }) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications(token)
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="notification-box">
      <h3>Notifications</h3>

      {notifications.length === 0 && (
        <p>No notifications</p>
      )}

      <ul>
        {notifications.map(n => (
          <li key={n.id}>
            <strong>{n.message}</strong>
            <br />
            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationList;
