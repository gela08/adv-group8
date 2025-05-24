// components/CommentMenu.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CommentMenuProps {
  visible: boolean;
  onDelete: () => void;
}

const CommentMenu: React.FC<CommentMenuProps> = ({ visible, onDelete }) => {
  if (!visible) return null;

  return (
    <View style={styles.menuDropdown}>
      <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color="#f00" />
        <Text style={[styles.menuText, { color: "#f00" }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuDropdown: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
    width: 100,
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default CommentMenu;
