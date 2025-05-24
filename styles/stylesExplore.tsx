//stylesExplore.tsx

import { StyleSheet } from "react-native";

export default function stylesCreate() {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#f5f5f5',
      paddingTop: 0,
    },
    
    categoryWrapper: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    categoryContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    categoryButtonWrapper: {
      marginRight: 20,
    },
    categoryInner: {
      alignItems: 'center',
    },
    categoryText: {
      fontSize: 14,
      color: '#555',
    },
    categoryTextActive: {
      fontWeight: 'bold',
      color: '#000',
    },
    underline: {
      marginTop: 4,
      height: 2,
      width: 16,
      backgroundColor: '#000',
      borderRadius: 2,
    },

    blogCard: {
      backgroundColor: '#fff',
      marginTop: 20,
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: 180,
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
      backgroundColor: 'rgba(0,0,0,0.5)',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    author: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    date: {
      color: '#ccc',
      fontSize: 12,
    },
    categoryBadge: {
      backgroundColor: '#00000088',
      color: '#fff',
      fontSize: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      overflow: 'hidden',
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      marginHorizontal: 16,
      marginTop: 12,
    },
    snippet: {
      fontSize: 14,
      color: '#444',
      marginHorizontal: 16,
      marginTop: 8,
    },
    readPost: {
      color: '#000',
      fontWeight: '500',
      fontSize: 14,
      marginTop: 12,
      marginBottom: 16,
      marginHorizontal: 16,
    },

    // ✨ NEW styles for Explore section
    blogMeta: {
      fontSize: 12,
      color: '#777',
      marginTop: 8,
      marginHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: 12,
    },
    commentCard: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    commentBlogTitle: {
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#000',
    },
    commentText: {
      color: '#555',
      fontSize: 14,
    },
    commenter: {
      fontWeight: 'bold',
      color: '#000',
    },
  });
}
