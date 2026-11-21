import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyShiftsScreen } from '../screens/MyShiftsScreen';
import { AvailableShiftsScreen } from '../screens/AvailableShiftsScreen';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="MyShifts"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryBlue,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 60,
        },
        tabBarStyle: {
          height: 64,
          backgroundColor: Colors.screenBg,
          borderTopWidth: 1,
          borderTopColor: Colors.borderGrey,
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="MyShifts"
        component={MyShiftsScreen}
        options={{
          tabBarLabel: 'My shifts',
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="AvailableShifts"
        component={AvailableShiftsScreen}
        options={{
          tabBarLabel: 'Available shifts',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
};
