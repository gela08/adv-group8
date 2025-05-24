import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import Styles from '@/styles/styles';
import { useRouter } from 'expo-router';
import { usePageNavigation } from '@/Context/CurrentPageContext';

const styles = Styles();

const sidebarItems = [
  { type: Ionicons, name: 'close', label: 'Close Menu' },
  { type: Entypo, name: 'home', label: 'Home' },
  { type: FontAwesome, name: 'search', label: 'Explore' },
  { type: Ionicons, name: 'person', label: 'Profile' },
  { type: Ionicons, name: 'add-circle', label: 'Post' },
];

const Sidebar = ({ isVisible, selected, onSelect }) => {
  const Router = useRouter();
  const { currentPage, setCurrentPage } = usePageNavigation();

  const handleNavigation = (label) => {
    switch (label) {
      case 'Home':
        setCurrentPage('home');
        Router.push('/home');
        break;
      case 'Explore':
        setCurrentPage('explore');
        Router.push('/explore');
        break;
      case 'Read':
        setCurrentPage('read');
        break;
      
      case 'Profile':
        setCurrentPage('profile');
        Router.push('/profile');
        break;
      case 'Post':
        setCurrentPage('post');
        Router.push('/create');
        break;
    }
  };

  const handlePress = (label) => {
    if (label === 'Close Menu') {
      onSelect(label); // Just closes the sidebar
    } else {
      onSelect(label); // Set the selected page
      handleNavigation(label);
    }
  };

  return (
    <View style={[styles.overlaySidebar, isVisible && styles.sidebarExpanded]}>
      {sidebarItems.map((item) => {
        const IconComponent = item.type;
        const isActive = selected === item.label;

        return (
          <Pressable
            key={item.label}
            onPress={() => handlePress(item.label)}
            style={[
              styles.sidebarItem,
              isVisible && styles.sidebarItemExpanded,
              isActive && styles.activeSidebarItem,
            ]}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <IconComponent name={item.name} size={24} color={isActive ? 'white' : 'black'} />
            </View>
            <Text style={[styles.sidebarLabel, isActive && styles.activeSidebarLabel]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default Sidebar;
