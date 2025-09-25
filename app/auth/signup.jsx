import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="create-outline"
          size={90}
          color="#F5F5F5"
          style={styles.icon}
        />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join and get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0B0B0C",
  },
  card: {
    backgroundColor: "#1A1A1C",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  icon: { marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "bold", color: "#F5F5F5" },
  subtitle: { fontSize: 14, color: "#999", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 14,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#2A2A2C",
    color: "#F5F5F5",
  },
  error: { color: "#FF4D4D", marginBottom: 10, textAlign: "center" },
  button: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#F5F5F5", fontWeight: "600", fontSize: 16 },
  link: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
