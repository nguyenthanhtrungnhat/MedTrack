import React, { useRef, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Animated,
    Modal, TouchableWithoutFeedback, ScrollView, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

export type MenuItem = {
    key: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
    menuItems: MenuItem[];
    activeKey: string;
    onSelect: (key: string) => void;
};

export default function HamburgerMenu({ menuItems, activeKey, onSelect }: Props) {
    const { logout } = React.useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;

    const openMenu = () => {
        setVisible(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 260,
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0.5,
                duration: 260,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeMenu = (callback?: () => void) => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -DRAWER_WIDTH,
                duration: 220,
                useNativeDriver: true,
            }),
            Animated.timing(overlayAnim, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false);
            callback?.();
        });
    };

    const handleSelect = (key: string) => {
        closeMenu(() => onSelect(key));
    };

    return (
        <>
            {/* Hamburger Button */}
            <TouchableOpacity onPress={openMenu} style={styles.hamburgerBtn}>
                <Ionicons name="menu" size={30} color="#002677" />
            </TouchableOpacity>

            {/* Drawer Modal */}
            <Modal
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={() => closeMenu()}
            >
                {/* Overlay (dim background) */}
                <TouchableWithoutFeedback onPress={() => closeMenu()}>
                    <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
                </TouchableWithoutFeedback>

                {/* Drawer Panel */}
                <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={styles.drawerHeader}>
                            <View style={styles.drawerLogo}>
                                <Ionicons name="medical" size={28} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.drawerTitle}>MedTrack</Text>
                                <Text style={styles.drawerSubtitle}>Doctor</Text>
                            </View>
                        </View>

                        {/* Menu Items */}
                        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
                            {menuItems.map((item) => {
                                const isActive = activeKey === item.key;
                                return (
                                    <TouchableOpacity
                                        key={item.key}
                                        style={[styles.menuItem, isActive && styles.menuItemActive]}
                                        onPress={() => handleSelect(item.key)}
                                    >
                                        <Ionicons
                                            name={item.icon}
                                            size={22}
                                            color={isActive ? '#002677' : '#4a5568'}
                                        />
                                        <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        
                        {/* Logout Button */}
                        <View style={styles.logoutContainer}>
                            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                                <Ionicons name="log-out-outline" size={22} color="#e53e3e" />
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    hamburgerBtn: {
        padding: 4,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        elevation: 16,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#002677',
        padding: 24,
        paddingTop: 20,
    },
    drawerLogo: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    drawerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    drawerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.75)',
        marginTop: 2,
    },
    menuList: {
        flex: 1,
        paddingTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        marginVertical: 2,
        borderRadius: 10,
    },
    menuItemActive: {
        backgroundColor: '#ebf8ff',
    },
    menuLabel: {
        fontSize: 15,
        color: '#4a5568',
        marginLeft: 14,
        fontWeight: '500',
    },
    menuLabelActive: {
        color: '#002677',
        fontWeight: '700',
    },
    logoutContainer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#edf2f7',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoutText: {
        fontSize: 15,
        color: '#e53e3e',
        fontWeight: '600',
        marginLeft: 14,
    }
});
