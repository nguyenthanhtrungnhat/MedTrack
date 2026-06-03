import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenWrapper({ children, style }: { children: React.ReactNode, style?: StyleProp<ViewStyle> }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }} />
            <SafeAreaView edges={['left', 'right', 'bottom']} style={[style, { flex: 1, paddingTop: 0 }]}>
                {children}
            </SafeAreaView>
        </View>
    );
}
