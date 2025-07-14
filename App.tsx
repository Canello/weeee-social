import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';

// Import screens
import { FeedScreen } from './src/screens/FeedScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { CreateIdeaScreen } from './src/screens/CreateIdeaScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { FollowersListScreen } from './src/screens/FollowersListScreen';
import { InterestedPeopleScreen } from './src/screens/InterestedPeopleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
function TabNavigator({ navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'CreateIdeaTab') {
            iconName = 'add';
          } else if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#23242a',
          borderTopWidth: 1,
          borderTopColor: '#23242a',
          paddingBottom: Math.max(insets.bottom, 5),
          paddingTop: 5,
          height: 60 + Math.max(insets.bottom, 5),
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="CreateIdeaTab"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarButton: (props) => {
            const { children, ...rest } = props;
            // Remove any props with null values (e.g., delayLongPress)
            const filteredProps = Object.fromEntries(
              Object.entries(rest).filter(([_, v]) => v !== null)
            );
            return (
              <TouchableOpacity
                {...filteredProps}
                onPress={() => navigation.navigate('CreateIdea')}
              >
                {children}
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Search" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main stack navigator
function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="CreateIdea"
        component={CreateIdeaScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FollowersList"
        component={FollowersListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InterestedPeople"
        component={InterestedPeopleScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
