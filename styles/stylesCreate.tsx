//stylesCreate.tsx

import { StyleSheet } from "react-native";

export default function stylesCreate() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 20,
      borderRadius: 12,
    },
    headerText: {
      fontSize: 26, // slightly bigger
      fontWeight: 'bold',
      color: '#000',
    },
    content: {
      padding: 16,
    },
    postCateg: {
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 16,
    },
    imageUploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#007BFF',
      borderRadius: 12,
      paddingVertical: 12,
      marginVertical: 10, // add vertical space
      backgroundColor: '#f0f8ff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    imageUploadText: {
      color: '#007BFF',
      fontWeight: '600',
      fontSize: 16,
      marginLeft: 8,
    },
    previewImage: {
      width: '100%',
      height: 200, // slightly bigger
      borderRadius: 12,
      marginVertical: 16,
      resizeMode: 'cover',
    },
    titleInput: {
      fontSize: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginBottom: 20,
      paddingVertical: 10,
      color: '#333',
    },
    textInput: {
      flex: 1,
      minHeight: 160,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#fff',
      padding: 16,
      marginVertical: 16, // adds nice breathing room
      textAlignVertical: 'top',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    categoriesBox: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginVertical: 16,
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    categoriesTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    categoriesBox2: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
    },
    categoriesWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryChip: {
      borderWidth: 1.5,
      borderColor: '#007BFF',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 50,
      backgroundColor: '#fff',
    },
    categoryChipSelected: {
      backgroundColor: '#007BFF',
    },
    categoryText: {
      color: '#007BFF',
      fontWeight: '500',
    },
    categoryTextSelected: {
      color: '#fff',
    },
    submitButton: {
      backgroundColor: '#007BFF',
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      alignSelf: 'center',
      paddingHorizontal: 36,
      marginVertical: 24,
      shadowColor: '#007BFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    submitText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
}
