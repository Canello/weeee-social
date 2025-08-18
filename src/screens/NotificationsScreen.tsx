import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';

interface Notification {
  id: string;
  type: 'event' | 'idea' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'event',
    title: 'Local Food Festival',
    message: 'Your event "Local Food Festival" starts in 2 hours',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100',
  },
  {
    id: '2',
    type: 'idea',
    title: 'Tech Meetup Series',
    message: 'Alice Developer is interested in your "Tech Meetup Series" idea',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'Bob Creator started following you',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome to Weeee!',
    message: 'Your account has been successfully created. Start exploring ideas and events!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: '6',
    type: 'event',
    title: 'Event Reminder',
    message: 'Don\'t forget! "Weekend Hiking Adventure" is tomorrow at 9:00 AM',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=100',
  },
];

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'event':
        return 'calendar';
      case 'idea':
        return 'bulb';
      case 'follow':
        return 'person-add';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'event':
        return '#667eea';
      case 'idea':
        return '#f39c12';
      case 'follow':
        return '#2ecc71';
      case 'mention':
        return '#e74c3c';
      case 'system':
        return '#95a5a6';
      default:
        return '#667eea';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return dayjs(timestamp).format('MMM D');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification,
      ]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.notificationContent}>
                 <View style={styles.notificationHeader}>
           {notification.avatar ? (
             <Image source={{ uri: notification.avatar }} style={styles.notificationAvatar} />
           ) : (
             <View style={styles.notificationAvatarPlaceholder}>
               <Ionicons name="settings" size={20} color="#999" />
             </View>
           )}
          <View style={styles.notificationText}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>{formatTimeAgo(notification.timestamp)}</Text>
          </View>
        </View>
        {!notification.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
      </View>

      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          notifications.map(renderNotification)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={64} color="#666" />
            <Text style={styles.emptyStateTitle}>No notifications yet</Text>
            <Text style={styles.emptyStateMessage}>
              When you get notifications, they'll appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111216',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#23242a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  markAllReadButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#667eea',
    borderRadius: 20,
  },
  markAllReadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#23242a',
  },
  unreadNotification: {
    backgroundColor: 'rgba(37, 174, 248, 0.1)',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#23242a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
     notificationAvatar: {
     width: 40,
     height: 40,
     borderRadius: 20,
     marginRight: 12,
   },
   notificationAvatarPlaceholder: {
     width: 40,
     height: 40,
     borderRadius: 20,
     marginRight: 12,
     backgroundColor: '#23242a',
     justifyContent: 'center',
     alignItems: 'center',
   },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#25aef8',
    marginLeft: 12,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
