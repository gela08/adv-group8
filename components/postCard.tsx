//postCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Styles from '@/styles/stylesExplore';
import { Post } from '@/firebase/crud/crud';

const styles = Styles();

type PostCardProps = {
  post: Post;
};

const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

  return (
    <View style={styles.blogCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.photoUrl || 'https://via.placeholder.com/300x200.png?text=No+Image' }}
          style={styles.image}
        />
        <View style={styles.overlay}>
          <View>
            <Text style={styles.author}>{post.fullName || 'Guest'}</Text>
            <Text style={styles.date}>
              {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ''}
            </Text>
          </View>
          <Text style={styles.categoryBadge}>
            {Array.isArray(post.category) ? post.category[0] : post.category}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.snippet}>{post.content?.slice(0, 80)}...</Text>
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/read', params: { postId: post.id } })}
      >
        <Text style={styles.readPost}>Read post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostCard;
