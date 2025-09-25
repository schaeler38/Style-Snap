import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GoalsProvider } from "../../contexts/GoalsContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function GoalsLayout() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      }
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B0B0C" }}>
        <ActivityIndicator size="large" color="#F5F5F5" />
      </View>
    );
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#F5F5F5", // smokewhite active
          tabBarInactiveTintColor: "#777", // muted grey inactive
          tabBarStyle: {
            backgroundColor: "#0B0B0C", // soft black
            borderTopWidth: 0,
            elevation: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            letterSpacing: 0.5,
          },
        }}
      >
        {/* View all tees */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Tees",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={22}
                name={focused ? "shirt" : "shirt-outline"}
                color={color}
              />
            ),
          }}
        />

        {/* Add tee */}
        <Tabs.Screen
          name="create"
          options={{
            title: "Add Tee",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                size={26}
                name={focused ? "add-circle" : "add-circle-outline"}
                color={color}
              />
            ),
          }}
        />

        {/* Edit tee → hidden */}
        <Tabs.Screen
          name="edit/[id]"
          options={{
            href: null, // hidden
          }}
        />
      </Tabs>
    </GoalsProvider>
  );
}
