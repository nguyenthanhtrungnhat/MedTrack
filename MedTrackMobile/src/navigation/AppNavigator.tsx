import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import PatientTabNavigator from './PatientTabNavigator';

// Import các file screen (tạo file trống trước để test luồng)
import LoginScreen from '../screens/auth/LoginScreen';
// import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
// import DoctorHomeScreen from '../screens/doctor/DoctorHomeScreen';
// import NurseHomeScreen from '../screens/nurse/NurseHomeScreen';

// Dummy components để test
const DummyScreen = ({ title }: { title: string }) => (
    <></> // Tạm thời để trống
);

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
                            <Stack.Screen name="DoctorStack">
                                {(props) => <DummyScreen {...props} title="Doctor Home" />}
                            </Stack.Screen>
                        )}
                        {roleID === 2 && (
                            <Stack.Screen name="NurseStack">
                                {(props) => <DummyScreen {...props} title="Nurse Home" />}
                            </Stack.Screen>
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