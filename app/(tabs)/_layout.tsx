import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#563D30",
                tabBarInactiveTintColor: "#A68372",
                tabBarStyle: {
                    paddingTop: 5,
                    height: Platform.OS === "ios" ? 90 : 80,
                    borderColor: "#A68372",
                },
                tabBarLabelStyle: {
                    marginTop: 2,
                    fontFamily: "NotoSerif_400Regular",
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="my-trips"
                options={{
                    title: "My trips",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "compass" : "compass-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="tools"
                options={{
                    title: "Tools",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "grid" : "grid-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="inbox"
                options={{
                    title: "Inbox",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "file-tray" : "file-tray-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
