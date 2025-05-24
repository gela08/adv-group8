// /app/explore.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '@/firebase/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  where,
  getCountFromServer,
} from 'firebase/firestore';
import Styles from '@/styles/stylesExplore';
import { Post as PostType, Comment } from '@/firebase/crud/crud';
import moment from 'moment';

interface ExplorePost extends PostType {
  fullName: string;
  username: string;
  commentCount: number;
}

const exploreTabs = ['Trending', 'Most Commented', 'Newest', 'Recommended'];

export default function ExplorePage() {
  const styles = Styles();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(exploreTabs[0]);
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState({ posts: true, comments: true });
  const [refreshing, setRefreshing] = useState(false);
  const [tsToggles, setTsToggles] = useState<Record<string, boolean>>({});

  // Fetch posts *and* comment counts
  const subscribePosts = useCallback(() => {
    setLoading((l) => ({ ...l, posts: true }));
    const postsQ = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      postsQ,
      async snap => {
        const userCache: Record<string, { fullName: string; username: string }> = {};
        const data = await Promise.all(
          snap.docs.map(async d => {
            const p = { id: d.id, ...(d.data() as Omit<PostType, 'id'>) } as PostType;
            // --- user info ---
            let fullName = 'Guest User';
            let username = 'Anonymous';
            if (p.userId) {
              if (!userCache[p.userId]) {
                const udoc = await getDoc(doc(db, 'users', p.userId));
                const u = udoc.exists() ? udoc.data() : {};
                userCache[p.userId] = {
                  fullName: (u.fullName || u.displayName) as string || 'Guest User',
                  username: (u.username || u.displayName) as string || 'Anonymous',
                };
              }
              ({ fullName, username } = userCache[p.userId]);
            }
            // --- comment count ---
            const countSnap = await getCountFromServer(
              query(collection(db, 'comments'), where('postId', '==', p.id))
            );
            return {
              ...p,
              fullName,
              username,
              commentCount: countSnap.data().count,
            } as ExplorePost;
          })
        );
        setPosts(data);
        setLoading(l => ({ ...l, posts: false }));
      },
      err => {
        console.error('Explore: posts', err);
        setLoading(l => ({ ...l, posts: false }));
      }
    );
    return unsub;
  }, []);

  // Fetch latest comments
  const subscribeComments = useCallback(() => {
    setLoading(l => ({ ...l, comments: true }));
    const cQ = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(
      cQ,
      snap => {
        const arr = snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Comment, 'id'>),
        }));
        setComments(arr.slice(0, 5));
        setLoading(l => ({ ...l, comments: false }));
      },
      err => {
        console.error('Explore: comments', err);
        setLoading(l => ({ ...l, comments: false }));
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsubPosts = subscribePosts();
    const unsubComments = subscribeComments();
    return () => {
      unsubPosts();
      unsubComments();
    };
  }, [subscribePosts, subscribeComments]);

  // Pull-to-refresh: simply re-fire subscriptions
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // unsub & re-sub:
    subscribePosts();
    subscribeComments();
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, [subscribePosts, subscribeComments]);

  const filtered = posts.slice().sort((a, b) => {
    switch (selectedTab) {
      case 'Trending':
      case 'Recommended':
        return (b.commentCount) - (a.commentCount);
      case 'Most Commented':
        return (b.commentCount) - (a.commentCount);
      case 'Newest':
        return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);
      default:
        return 0;
    }
  });

  const toggleTs = (id: string) =>
    setTsToggles(t => ({ ...t, [id]: !t[id] }));

  const fmt = (c: Comment) => {
    if (!c.timestamp) return 'Just now';
    const d = c.timestamp.toDate?.() ?? c.timestamp;
    const isRecent = moment().diff(d, 'hours') < 24;
    if (isRecent && tsToggles[c.id!]) {
      return moment(d).format('h:mm a, MM-DD-YY');
    }
    return moment(d).fromNow();
  };

  const renderTabs = () => (
    <View style={styles.categoryWrapper}>
      <FlatList
        horizontal
        data={exploreTabs}
        keyExtractor={t => t}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
        renderItem={({ item: t }) => {
          const active = t === selectedTab;
          return (
            <TouchableOpacity onPress={() => setSelectedTab(t)} style={styles.categoryButtonWrapper}>
              <View style={styles.categoryInner}>
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {t}
                </Text>
                {active && <View style={styles.underline} />}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  const renderPost = ({ item }: { item: ExplorePost }) => (
    <View style={styles.blogCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.photoUrl || 'https://via.placeholder.com/300x200.png?text=No+Image' }}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <View>
            <Text style={styles.author}>{item.fullName}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate().toLocaleDateString() ?? ''}
            </Text>
          </View>
          <Text style={styles.categoryBadge}>
            {Array.isArray(item.category) ? item.category[0] : item.category}
          </Text>
        </View>
      </View>

      <View style={{ padding: 8, paddingTop: 12 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.snippet}>{item.content.slice(0, 80)}…</Text>
        <Text style={styles.blogMeta}>{item.commentCount} comments</Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/read', params: { postId: item.id } })}
        >
          <Text style={styles.readPost}>Read post ➜ </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComments = () => (
    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
      <Text style={styles.sectionTitle}>💬 Latest Comments</Text>
      {loading.comments
        ? <Text style={{ padding: 10 }}>Loading comments…</Text>
        : comments.map(c => (
          <View key={c.id} style={styles.commentCard}>
            <Text style={styles.commentText}>
              <Text style={styles.commenter}>{c.username}:</Text> {c.content}
            </Text>
            <TouchableOpacity onPress={() => toggleTs(c.id!)}>
              <Text style={styles.date}>{fmt(c)}</Text>
            </TouchableOpacity>
          </View>
        ))
      }
    </View>
  );

  return (
    <FlatList
      data={filtered}
      keyExtractor={i => i.id}
      renderItem={renderPost}
      ListHeaderComponent={renderTabs}
      ListFooterComponent={renderComments}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
