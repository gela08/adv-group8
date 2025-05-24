// home.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import stylesCreate from '@/styles/stylesHome';
import { useRouter } from 'expo-router';
import PostCard from '@/components/postCard';

const styles = stylesCreate();

const BlogHomeContent = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([]);
  const [popularBlogs, setPopularBlogs] = useState<any[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const postsRef = collection(db, 'posts');

      const [featuredSnap, popularSnap, latestSnap] = await Promise.all([
        getDocs(query(postsRef, where('featured', '==', true), limit(5))),
        getDocs(query(postsRef, orderBy('comments', 'desc'), limit(5))),
        getDocs(query(postsRef, orderBy('timestamp', 'desc'), limit(5))),
      ]);

      setFeaturedBlogs(featuredSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPopularBlogs(popularSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLatestBlogs(latestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const ensurePostProps = (blog: any) => ({
    ...blog,
    fullName: blog.fullName || 'Guest',
    username: blog.username || 'anonymous',
    createdAt: blog.createdAt || blog.timestamp || { toDate: () => new Date() },
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#6c63ff" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Featured */}
      {featuredBlogs.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>📸 Featured</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {featuredBlogs.map((blog) => (
                <View key={blog.id} style={{ width: 300 }}>
                  <PostCard post={ensurePostProps(blog)} />
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {/* Popular Blogs */}
      {popularBlogs.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🔥 Popular Blogs</Text>
          {popularBlogs.map((blog) => (
            <PostCard key={blog.id} post={ensurePostProps(blog)} />
          ))}
        </>
      )}

      {/* Latest Blogs */}
      {latestBlogs.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🕒 Latest Posts</Text>
          {latestBlogs.map((blog) => (
            <PostCard key={blog.id} post={ensurePostProps(blog)} />
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default BlogHomeContent;
