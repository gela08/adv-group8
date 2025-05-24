// stylesRead.tsx

import { StyleSheet } from "react-native";

export default function stylesRead() {
  return StyleSheet.create({
    container: {
      padding: 16,
    },
    imageContainer: {
      marginBottom: 16,
      borderRadius: 16,
      overflow: "hidden",
      width: "100%",
      aspectRatio: 1.5, // Maintains a consistent aspect ratio
      backgroundColor: "#f0f0f0",
    },

    image: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    author: {
      color: "grey",
      fontWeight: "bold",
      fontSize: 14,
    },
    authorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    date: {
      color: "#ddd",
      fontSize: 12,
    },
    tag: {
      width: 70,
      alignSelf: 'flex-end',
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "600",
      alignSelf: 'center',
      color: 'white',
    },
    postContainer: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 12,
      marginBottom: 10,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    menuIcon: {
      padding: 8,
    },
    card: {
      backgroundColor: "#fff",
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      elevation: 3,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      flex: 1,
      marginRight: 12,
    },
    content: {
      fontSize: 16,
      color: "#444",
      paddingTop: 10,
      paddingLeft: 10,
    },
    commentHeader: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },
    comment: {
      backgroundColor: "#f9f9f9",
      padding: 10,
      borderRadius: 12,
      marginBottom: 8,
    },
    commentAuthor: {
      fontWeight: "600",
      fontSize: 14,
    },
    commentText: {
      fontSize: 14,
      color: "#555",
      marginBottom: 4,
    },
    commentTime: {
      fontSize: 12,
      color: "#999",
      fontStyle: "italic",
    },
    input: {
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      padding: 10,
      marginTop: 16,
      minHeight: 60,
      textAlignVertical: "top",
    },
    button: {
      marginTop: 10,
      backgroundColor: "#000",
      padding: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
    commentHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    commentDropdown: {
      position: 'absolute',
      top: 0,
      right: 10,
      backgroundColor: '#fff',
      borderRadius: 6,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 20,
    },
    commentMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
    },
    menuText: {
      fontSize: 14,
      fontWeight: '500',
    },
    titleInput: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 8,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    textInput: {
      fontSize: 16,
      minHeight: 100,
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 10,
      borderRadius: 6,
      marginVertical: 10,
    },
    imageUrlInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 10,
      borderRadius: 6,
    },
    saveButton: {
      backgroundColor: '#5A31F4',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 10,
    },
    categoriesWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 16,
      gap: 8,
    },
    categoryChip: {
      backgroundColor: "#e0e0e0",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    categoryChipSelected: {
      backgroundColor: "#000",
    },
    categoryText: {
      color: "#333",
      fontWeight: "500",
    },
    categoryTextSelected: {
      color: "#fff",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 16,
      gap: 10,
    },
    commentSection: {
      marginTop: 32,
    },
    commentItem: {
      backgroundColor: "#f9f9f9",
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
}
