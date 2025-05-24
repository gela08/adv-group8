// crud.tsx

import { db } from '@/firebase/firebase';
import {
  collection,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  Timestamp,
  where,
  query,
  getDocs,
  getDoc,
} from 'firebase/firestore';

export type Post = {
  fullName: string;
  id: string;
  title: string;
  content: string;
  category: string[];
  userId: string;
  comments: string;
  photoUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type Comment = {
  username: string;
  id?: string;
  content: string;
  postId: string;
  postTitle: string;
  userId: string;
  timestamp: Timestamp;
  parentId?: string;
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  username: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Create a user
export const userData = async (newUser: User) => {
  try {
    const postRef = doc(db, 'users', newUser.id);
    await setDoc(postRef, newUser);
    console.log('User uploaded successfully!');
  } catch (error) {
    console.error('Error uploading user:', error);
  }
};

// Create or update a post
export const uploadFullPost = async (newPost: Post) => {
  try {
    const postRef = doc(db, 'posts', newPost.id);
    await setDoc(postRef, newPost);
    console.log('Post uploaded successfully!');
  } catch (error) {
    console.error('Error uploading post:', error);
  }
};


// Upload a comment and create a notification with username
export const uploadComment = async (comment: Omit<Comment, 'timestamp'>) => {
  try {
    const commentsCollection = collection(db, 'comments');
    const commentRef = await addDoc(commentsCollection, {
      ...comment,
      timestamp: serverTimestamp(),
    });

    // Get the post owner's user ID
    const recipientId = await getPostOwnerId(comment.postId);

    // Get the commenter's username
    const commenterUsername = await getUsername(comment.userId);

    // Create the notification
    const notificationRef = collection(db, 'notifications');
    await addDoc(notificationRef, {
      recipientId,
      commenter: commenterUsername || 'Someone',
      comment: comment.content,
      postTitle: comment.postTitle,
      timestamp: serverTimestamp(),
    });

    console.log('Comment and notification uploaded successfully!');
  } catch (error) {
    console.error('Error uploading comment and notification:', error);
  }
};



// Update a comment
export const updateComment = async (commentId: string, newContent: string) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      content: newContent,
      timestamp: serverTimestamp(),
    });
    console.log('Comment updated successfully!');
  } catch (error) {
    console.error('Error updating comment:', error);
  }
};

// Delete a post and all its comments
export const deletePost = async (postId: string) => {
  try {
    const commentsQuery = collection(db, 'comments');
    const q = query(commentsQuery, where('postId', '==', postId));
    const snapshot = await getDocs(q);

    const batchDeletes = snapshot.docs.map(async (docSnap) => {
      await deleteDoc(doc(db, 'comments', docSnap.id));
    });

    await Promise.all(batchDeletes);

    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);

    console.log('Post and related comments deleted successfully!');
  } catch (error) {
    console.error('Error deleting post and comments:', error);
  }
};

// Update a post
export const updatePost = async (postId: string, updatedData: Partial<Post>) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...updatedData,
      updatedAt: serverTimestamp(),
    });
    console.log('Post updated successfully!');
  } catch (error) {
    console.error('Error updating post:', error);
  }
};

// Delete a comment
export const deleteComment = async (commentId: string) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);
    console.log('Comment deleted successfully!');
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};

// Fetch comments for a post
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(collection(db, 'comments'), where('postId', '==', postId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

// Helper to get post owner's userId
const getPostOwnerId = async (postId: string): Promise<string> => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    const postData = postDoc.data();
    return postData?.userId || '';
  } catch (error) {
    console.error('Error fetching post owner:', error);
    return '';
  }
};

// Get username from user ID
const getUsername = async (userId: string): Promise<string | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    return userData?.username || null;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
};

