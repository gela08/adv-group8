import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Styles from '@/styles/styles';
import { useRouter, usePathname } from 'expo-router'; // <-- added usePathname

const styles = Styles();

const Header = ({ isSidebarVisible, onToggleSidebar }) => {
    const Router = useRouter();
    const pathname = usePathname(); // <-- new
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Search for:', searchQuery);
    };

    console.log('Current Path:', pathname); // <-- debug print

    return (
        <View style={styles.navbar}>
            {!['/register', '/'].includes(pathname) && !isSidebarVisible && (
                <TouchableOpacity onPress={onToggleSidebar}>
                    <Ionicons name="menu" size={24} color="white" />
                </TouchableOpacity>
            )}

            {!isSidebarVisible && (
                <View style={styles.navTitleContainer}>
                    <TouchableOpacity onPress={() => Router.push('/home')}>
                        <Text style={styles.navTitle}>Blog Feed</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.rightIcons}>
                {pathname === '/explore' && !isSidebarVisible && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            style={styles.searchInput}
                            returnKeyType="search"
                        />
                        <TouchableOpacity onPress={handleSearch}>
                            <Ionicons name="search" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Profile Icon */}
                {!['/register', '/'].includes(pathname) && !isSidebarVisible && (
                    <TouchableOpacity onPress={() => Router.push('/profile')}>
                        <Ionicons name="person" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default Header;
