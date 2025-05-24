import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

interface DropDownMenuProps {
  visible: boolean;
  onDelete: () => void;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({ visible, onDelete }) => {
  if (!visible) return null;

  return (


    <View style={styles.menuDropdown}>

      <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color="#f00" />
        <Text style={[styles.menuText, { color: "#f00" }]}>Delete</Text>
      </TouchableOpacity>

    </View>


  );

};

const styles = StyleSheet.create({
  menuDropdown: {
    position: "absolute",
    top: 55,
    right: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
    width: 120,
    padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default DropDownMenu;
