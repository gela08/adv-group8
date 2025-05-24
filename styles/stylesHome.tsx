//stylesHome.tsx
 
import { StyleSheet } from "react-native";

export default function stylesCreate() {
  return StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingBottom: 24,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 16,
        marginBottom: 8,
      },
      featuredCard: {
        marginRight: 16,
      },
      featuredImageWrapper: {
        width: 240,
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
      },
      featuredImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
      },
      featuredText: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontWeight: '600',
        fontSize: 14,
      },
      blogCard: {
        backgroundColor: '#f3f3f3',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
      },
      latestCard: {
        backgroundColor: '#fafafa',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
      },
      blogTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
      },
      blogSnippet: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
      },
      blogMeta: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
      },
  });
}