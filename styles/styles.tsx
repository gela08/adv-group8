import { StyleSheet } from "react-native";

export default function styles() {
    return StyleSheet.create({
        sidebar: {
            width: 80,
            backgroundColor: '#fff',
            paddingVertical: 5,
            borderRightWidth: 1,
            borderRightColor: '#ddd',
            alignItems: 'center',
        },
        overlaySidebar: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 250,
            backgroundColor: '#fff',
            paddingVertical: 5,
            borderRightWidth: 1,
            borderRightColor: '#ddd',
            zIndex: 10,
        },
        sidebarExpanded: {
            width: 250,
            alignItems: 'flex-start',
            paddingLeft: 10,
            paddingRight: 20,
            justifyContent: 'space-between',
            paddingBottom: 100,
        },
        sidebarItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderRadius: 8,
        },
        sidebarItemExpanded: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
        },
        sidebarLabel: {
            fontSize: 16,
            marginLeft: 12,
            color: 'black',
        },
    
        activeSidebarItem: {
            backgroundColor: 'black',
            alignItems: 'center',
            borderRadius: 16,
            padding: 4,
        },
        activeIconContainer: {
            backgroundColor: 'black',
            padding: 10,
        },
        activeSidebarLabel: {
            color: 'white',
            fontWeight: 'bold',
        },
    
        iconContainer: {
            padding: 8,
            borderRadius: 12,
            backgroundColor: 'transparent',
            marginRight: 10,
        },
    
        navbar: {
            height: 60,
            paddingHorizontal: 16,
            backgroundColor: 'black',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        navTitle: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
        },
        navTitleContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: -1,
        },
        rightIcons: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 36,
        },
        searchInput: {
            color: 'black',
            fontSize: 14,
        },
    });
}
