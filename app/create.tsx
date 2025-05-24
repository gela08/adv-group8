//create.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { uploadFullPost } from '@/firebase/crud/crud';
import { auth, db } from '@/firebase/firebase';
import stylesCreate from '@/styles/stylesCreate';

const categories = [
  'Food', 'Travel', 'Health', 'Fitness', 'Lifestyle', 'Fashion', 'Beauty',
  'Technology', 'Education', 'Finance', 'Parenting', 'Entertainment', 'DIY',
  'Personal Growth', 'Career', 'Home Decor', 'Relationships', 'Pets',
  'Photography', 'Books'
];

const CreatePostScreen = () => {
  const styles = stylesCreate();

  const [postTitle, setPostTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [postText, setPostText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUserFullName = async (uid: string): Promise<string> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data.fullName || data.displayName || 'Guest User';
      }
    } catch (error) {
      console.error('Failed to fetch user name:', error);
    }
    return 'Guest User';
  };

  const handleSubmit = async () => {
    if (!postTitle.trim() || !postText.trim() || !imageUri.trim()) {
      Alert.alert('Incomplete Fields', 'Please fill in all fields and provide a valid image URL.');
      return;
    }

    if (!imageUri.startsWith('http')) {
      Alert.alert('Invalid Image URL', 'Image URL should start with "http".');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Authentication Error', 'Please log in to submit a post.');
        return;
      }

      const fullName = await fetchUserFullName(user.uid);
      const post = {
        id: uuidv4(),
        fullName,
        title: postTitle.trim(),
        content: postText.trim(),
        category: selectedCategory ? [selectedCategory] : ['Uncategorized'],
        authorName: fullName,
        userId: user.uid,
        comments: '',
        photoUrl: imageUri,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await uploadFullPost(post);

      Alert.alert('Post Created', 'Your post has been successfully submitted!');
      setPostTitle('');
      setPostText('');
      setImageUri('');
      setSelectedCategory(null);
    } catch (error) {
      console.error('Post submission failed:', error);
      Alert.alert('Submission Failed', 'An error occurred while submitting your post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Post</Text>
        </View>

        <TextInput
          placeholder="Post Title"
          value={postTitle}
          onChangeText={setPostTitle}
          style={styles.titleInput}
          placeholderTextColor="#aaa"
        />

        <TextInput
          placeholder="Image URL (https://...)"
          value={imageUri}
          onChangeText={setImageUri}
          style={styles.titleInput}
          placeholderTextColor="#aaa"
        />

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : null}

        <TextInput
          placeholder="Write your blog content here..."
          multiline
          value={postText}
          onChangeText={setPostText}
          style={styles.textInput}
          placeholderTextColor="#aaa"
        />

        <View style={styles.categoriesBox}>
          <Text style={styles.categoriesTitle}>Choose Category</Text>
          <View style={styles.categoriesWrap}>
            {categories.map((category) => {
              const selected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() =>
                    setSelectedCategory(selected ? null : category)
                  }
                  style={[
                    styles.categoryChip,
                    selected && styles.categoryChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selected && styles.categoryTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
