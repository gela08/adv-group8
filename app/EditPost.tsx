import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { updatePost } from '@/firebase/crud/crud';

const EditPost = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [categories, setCategories] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id || typeof id !== 'string') return;

      const postRef = doc(db, 'posts', id);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const post = postSnap.data();
        setTitle(post.title || '');
        setContent(post.content || '');
        setImageUri(post.imageUri || '');
        setCategories(post.categories?.join(', ') || '');
      } else {
        Alert.alert('Post not found');
        router.back();
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Fields', 'Title and content are required.');
      return;
    }

    try {
      setLoading(true);
      await updatePost(id as string, {
        title: title.trim(),
        content: content.trim(),
        photoUrl: imageUri.trim(),
        category: categories.split(',').map((cat) => cat.trim()),
      });
      Alert.alert('Success', 'Post updated!');
      router.back();
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error updating post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7e5bef" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Post</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        multiline
        style={[styles.input, styles.textarea]}
      />

      <TextInput
        placeholder="Image URL"
        value={imageUri}
        onChangeText={setImageUri}
        style={styles.input}
      />

      <TextInput
        placeholder="Categories (comma separated)"
        value={categories}
        onChangeText={setCategories}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#7e5bef',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditPost;
