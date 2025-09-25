import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
  Keyboard,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const categories = ["Casual", "Graphic", "Oversized", "Sportswear", "Others"];

const EditGoal = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Casual");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch goal data
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setPrice(String(data.price || ""));
          setCategory(data.category || "Casual");
          setImage(data.image || null);
        }
      } catch (error) {
        console.log("Error fetching goal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  // ✅ Update item
  const handleUpdate = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert("Validation", "Title and price are required.");
      return;
    }

    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        title,
        price: parseFloat(price),
        category,
        image,
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating goal:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F5F5F5" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="tshirt-crew" size={28} color="#F5F5F5" />
        <Text style={styles.headerTitle}>E D I T</Text>
      </View>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      {/* Price */}
      <TextInput
        style={styles.input}
        placeholder="Price"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Category tabs */}
      <View style={styles.chipContainer}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.chip, category === cat && styles.chipActive]}
          >
            <Text
              style={[styles.chipText, category === cat && styles.chipTextActive]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Image Preview (no picker btn anymore) */}
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      {/* Update Button */}
      <Pressable onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update Item</Text>
      </Pressable>
    </ScrollView>
  );
};

export default EditGoal;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#0B0B0C",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F5F5F5",
    marginLeft: 8,
    letterSpacing: 4,
  },
  input: {
    width: "100%",
    backgroundColor: "#1A1A1C",
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    fontSize: 16,
    color: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 16,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  chipActive: {
    backgroundColor: "#2E2E2E",
    borderColor: "#2E2E2E",
  },
  chipText: {
    fontSize: 14,
    color: "#A9A9A9",
  },
  chipTextActive: {
    color: "#F5F5F5",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 220,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1A1A1C",
  },
  button: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#2E2E2E",
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#F5F5F5",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0B0C",
  },
});
