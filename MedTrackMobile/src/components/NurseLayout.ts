import { Ionicons } from '@expo/vector-icons';

export const NURSE_MENU_ITEMS = [
    { key: 'Dashboard', label: 'Dashboard', icon: 'home-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'DrawerSchedule', label: 'My Schedule', icon: 'calendar-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'DrawerShiftRequests', label: 'Shift Requests', icon: 'swap-horizontal-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'DrawerDailyChecking', label: 'Daily Checking', icon: 'fitness-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'RoomList', label: 'Rooms & Beds', icon: 'bed-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'TestResult', label: 'Test Results', icon: 'flask-outline' as keyof typeof Ionicons.glyphMap },
];
