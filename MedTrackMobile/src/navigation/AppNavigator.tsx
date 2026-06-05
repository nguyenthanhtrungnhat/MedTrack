import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import PatientTabNavigator from './PatientTabNavigator';

import LoginScreen from '../screens/auth/LoginScreen';
import DoctorDrawerNavigator from './DoctorDrawerNavigator';
import NurseDrawerNavigator from './NurseDrawerNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { userToken, roleID, isLoading } = useContext(AuthContext);

    if (isLoading) {
        // Render màn hình loading hoặc Splash Screen tại đây
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken == null ? (
                    // Chưa đăng nhập
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    // Đã đăng nhập -> Phân luồng theo roleID
                    <>
                        {roleID === 1 && (
                            <Stack.Screen name="DoctorStack" component={DoctorDrawerNavigator} />
                        )}
                        {roleID === 2 && (
                            <Stack.Screen name="NurseStack" component={NurseDrawerNavigator} />
                        )}
                        {roleID === 3 && (
                            <Stack.Screen name="PatientStack" component={PatientTabNavigator} />
                        )}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}