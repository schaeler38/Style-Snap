import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E5E5E5" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#0B0B0C", "#1A1A1C", "#0B0B0C"]}
      style={styles.bg}
    >
      <SafeAreaView style={styles.container}>
        {/* Brand */}
        <Text style={styles.title}>
          Style <Text style={styles.accent}>Snap</Text>
        </Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Flex your fits. Snap your style.</Text>

        {user && (
          <Text style={styles.welcome}>Welcome back, {user.email}</Text>
        )}

        {/* Buttons */}
        <Pressable onPress={() => router.push("/goals")} style={styles.card}>
          <LinearGradient
            colors={["#2E2E2E", "#3C3C3C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Ionicons name="shirt-outline" size={26} color="#F5F5F5" />
            <Text style={styles.cardText}>Browse Tees</Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={() => router.push("/goals/create")} style={styles.card}>
          <LinearGradient
            colors={["#444444", "#5A5A5A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Ionicons name="add-circle-outline" size={26} color="#F5F5F5" />
            <Text style={styles.cardText}>Add Your Style</Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0B0C",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#F5F5F5",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  accent: {
    color: "#BFBFBF", // soft grey accent, masculine neutral
  },
  tagline: {
    fontSize: 16,
    color: "#A9A9A9",
    fontWeight: "400",
    marginBottom: 50,
    textAlign: "center",
  },
  welcome: {
    fontSize: 14,
    color: "#D6D6D6",
    marginBottom: 25,
    fontWeight: "500",
  },
  card: {
    width: "100%",
    marginVertical: 12,
  },
  gradientBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 50,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  cardText: {
    color: "#F5F5F5",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
});

export default Home;
