// screens/NotificationsScreen.tsx

import { useEffect, useState } from 'react';
import { db, auth } from '@/firebase/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { FlatList, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';


type Notification = {
  id: string;
  commenter: string;
  comment: string;
  postTitle: string;
  timestamp: {
    toDate: () => Date;
  };
};


import { onAuthStateChanged } from 'firebase/auth';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          commenter: data.commenter || 'Someone',
          comment: data.comment || '',
          postTitle: data.postTitle || 'your post',
          timestamp: data.timestamp,
        } as Notification;
      });
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [userId]);


  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Feather name="message-circle" size={18} color="#fff" />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>
          <Text style={styles.bold}>{item.commenter}</Text> commented on your post{' '}
          <Text style={styles.italic}>"{item.postTitle}"</Text>
        </Text>
        <Text style={styles.comment}>{item.comment}</Text>
        <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
      </View>
    </View>
  );

  const formatTime = (timestamp: any) => {
    try {
      const time = timestamp?.toDate?.();
      if (!time) return 'Just now';

      const diffSec = Math.floor((Date.now() - time.getTime()) / 1000);
      const mins = Math.floor(diffSec / 60);
      const hrs = Math.floor(diffSec / 3600);
      const days = Math.floor(diffSec / 86400);

      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${mins} min${mins === 1 ? '' : 's'} ago`;
      if (diffSec < 86400) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } catch {
      return 'Just now';
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="bell" size={24} color="#000" />
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
          No notifications yet.
        </Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  comment: {
    fontSize: 13,
    color: '#444',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
});
