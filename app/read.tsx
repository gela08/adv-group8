// read.tsx

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from '@/firebase/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import DropDownMenu from '@/components/dropDownMenu';
import stylesCreate from '@/styles/stylesRead';
import { deletePost, updatePost, deleteComment } from '@/firebase/crud/crud';
import CommentMenu from '@/components/deleteComment';

const styles = stylesCreate();

type Comment = {
  id?: string;
  content: string;
  postId: string;
  userId: string;
  username: string;
  timestamp: any;
  fullName?: string;
};

export default function BlogPostScreen() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState<string | null>(null);

  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    if (!postId) return;

    try {
      const postDoc = await getDoc(doc(db, 'posts', String(postId)));
      if (postDoc.exists()) {
        const postData = { id: postDoc.id, ...postDoc.data() };


        if (postData.userId) {
          const userDoc = await getDoc(doc(db, 'users', postData.userId));
          if (userDoc.exists()) {
            const postUserData = userDoc.data();
            postData.fullName = postUserData.fullName || postUserData.displayName || 'Guest User';
            postData.username = postUserData.username || postUserData.displayName || 'Anonymous';
          }
        }

        setPost(postData);
      } else {
        Alert.alert('Error', 'Post not found.');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchComments = async () => {
    if (!postId) return;
    try {
      const q = query(collection(db, 'comments'), where('postId', '==', String(postId)));
      const snapshot = await getDocs(q);

      const userCache: Record<string, { username: string; fullName: string }> = {};

      const fetchedComments: Comment[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const comment = { id: docSnap.id, ...(docSnap.data() as Comment) };

          if (comment.userId && !userCache[comment.userId]) {
            const userDoc = await getDoc(doc(db, 'users', comment.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userCache[comment.userId] = {
                username: userData.username || userData.displayName || 'Anonymous',
                fullName: userData.fullName || userData.displayName || 'Guest User',
              };
            } else {
              userCache[comment.userId] = {
                username: 'Anonymous',
                fullName: 'Guest User',
              };
            }
          }

          return {
            ...comment,
            username: userCache[comment.userId]?.username || 'Anonymous',
            fullName: userCache[comment.userId]?.fullName || 'Guest User',
          };
        })
      );

      fetchedComments.sort((a, b) => {
        const aTime = a.timestamp?.toDate?.() || new Date(0);
        const bTime = b.timestamp?.toDate?.() || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });

      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const fetchUserUserName = async (uid: string): Promise<string> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.username || userData.displayName || 'Anonymous';
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return 'Anonymous';
  };

  const handleAddComment = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to comment.');
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const commentName = await fetchUserUserName(user.uid);

      await addDoc(collection(db, 'comments'), {
        content: commentText,
        postId: post?.id,
        userId: user.uid,
        username: commentName,
        fullName: user.displayName || 'Anonymous',
        timestamp: serverTimestamp(),
      });

      if (user.uid !== post?.userId) {
        await addDoc(collection(db, 'notifications'), {
          commenter: commentName,
          comment: commentText,
          postTitle: post?.title,
          postId: post?.id,
          recipientId: post?.userId,
          timestamp: serverTimestamp(),
        });
      }

      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deletePost(post.id);
      Alert.alert('Success', 'Post deleted.');
      router.back();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : timestamp;
      return moment(date).fromNow();
    } catch {
      return 'Just now';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.postContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{post?.title || 'Blog Title'}</Text>
            {post?.userId === user?.uid && (
              <TouchableOpacity
                style={styles.menuIcon}
                onPress={() => setMenuVisible(!menuVisible)}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="#000" />
              </TouchableOpacity>
            )}
          </View>
          <DropDownMenu
            visible={menuVisible && post?.userId === user?.uid}
            onDelete={handleDelete}
          />
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: post?.photoUrl || 'https://via.placeholder.com/600x300.png' }}
              style={styles.image}
            />
          </View>

          <Text>By {post?.fullName || post?.username || 'Unknown Author'}</Text>
          <Text style={styles.content}>{post?.content || 'Loading post content...'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.commentHeader}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id || item.content}
            renderItem={({ item }) => {
              const canDelete =
                user && post && (item.userId === user.uid || post.userId === user.uid);

              return (
                <View style={styles.comment}>
                  <View style={styles.commentHeaderRow}>
                    <Text style={styles.commentAuthor}>{item.username}</Text>

                    {canDelete && (
                      <TouchableOpacity
                        onPress={() =>
                          setActiveCommentMenu(activeCommentMenu === item.id ? null : item.id!)
                        }
                      >
                        <Ionicons name="ellipsis-vertical" size={16} color="#333" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.commentText}>{item.content}</Text>
                  <Text style={styles.commentTime}>{formatRelativeTime(item.timestamp)}</Text>

                  
                    <CommentMenu
                      visible={activeCommentMenu === item.id && canDelete}
                      onDelete={() => handleDeleteComment(item.id!)}
                    />
                

                </View>
              );
            }}
          />
          {user ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Write your comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                <Text style={styles.buttonText}>Post Comment</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ padding: 10, fontStyle: 'italic' }}>
              You must be logged in to comment.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}