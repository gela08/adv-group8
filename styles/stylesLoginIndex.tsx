import { StyleSheet } from 'react-native';

export default function stylesCreate() {
  return StyleSheet.create({
    errorText: {
      color: "red",
      fontSize: 10,
      marginBottom: 10,
      marginTop: 0,
  },
    screen: {
      flex: 1,
    },
    container: {
      backgroundColor: '#ffffff',
      padding: 24,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 6,
      margin: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 24,
      color: '#222',
    },
    label: {
      marginBottom: 8,
      fontWeight: '600',
      color: '#444',
      fontSize: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      backgroundColor: '#f5f5f5',
      color: '#000',
      outlineStyle: 'none',
    },
    inputWithIcon: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      backgroundColor: '#f5f5f5',
      color: '#000',
      outlineStyle: 'none',
    },
    inputFlex: {
      flex: 1,
      color: '#000',
      outlineStyle: 'none',
    },
    button: {
      backgroundColor: '#000',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
  });
}
