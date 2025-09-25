import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { FAB } from "react-native-paper";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const categories = ["All", "Casual", "Graphic", "Oversized", "Sportswear", "Others"];

const Tshirts = () => {
  const [tshirts, setTshirts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTshirts(list);
    });

    return unsubscribe;
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Delete T-Shirt", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const docRef = doc(db, "goals", id);
            await deleteDoc(docRef);
          } catch (error) {
            console.log("Error deleting tshirt:", error);
          }
        },
      },
    ]);
  };

  const toggleFavorite = async (id, currentValue) => {
    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, { isFavorite: !currentValue });
    } catch (error) {
      console.log("Error updating favorite:", error);
    }
  };

  const filteredTshirts =
    filter === "All" ? tshirts : tshirts.filter((item) => item.category === filter);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="tshirt-crew" size={28} color="#F5F5F5" />
        <Text style={styles.headerTitle}>S T Y L E S N A P</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.chipContainer}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setFilter(cat)}
            style={[styles.chip, filter === cat && styles.chipActive]}
          >
            <Text
              style={[styles.chipText, filter === cat && styles.chipTextActive]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Grid of Products */}
      <FlatList
        data={filteredTshirts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => {
              setSelectedId(item.id);
              setModalVisible(true);
            }}
            style={styles.card}
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: "#888" }}>No Image</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title || "Unnamed Tee"}</Text>
              <Text style={styles.priceText}>₱{item.price ?? 0}</Text>
              <View style={styles.row}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Pressable onPress={() => toggleFavorite(item.id, item.isFavorite)}>
                  <MaterialIcons
                    name={item.isFavorite ? "favorite" : "favorite-border"}
                    size={20}
                    color={item.isFavorite ? "#F5F5F5" : "#777"}
                  />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No t-shirts yet. Add one!</Text>
        }
      />

      {/* Slide Up Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable
              style={[styles.modalBtn, { backgroundColor: "#2E2E2E" }]}
              onPress={() => {
                setModalVisible(false);
                router.push(`/goals/edit/${selectedId}`);
              }}
            >
              <Text style={styles.modalBtnText}>Edit</Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtn, { backgroundColor: "#3C3C3C" }]}
              onPress={() => {
                setModalVisible(false);
                handleDelete(selectedId);
              }}
            >
              <Text style={styles.modalBtnText}>Delete</Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtn, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#555" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: "#aaa" }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Logout FAB */}
      <FAB
        style={styles.fab}
        icon="logout"
        color="#F5F5F5"
        onPress={() => signOut(auth)}
      />
    </SafeAreaView>
  );
};

export default Tshirts;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0B0C" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    backgroundColor: "#0B0B0C",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2E2E2E",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F5F5F5",
    marginLeft: 8,
    letterSpacing: 3,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 12,
    gap: 10,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  chipActive: {
    backgroundColor: "#2E2E2E",
    borderRadius: 8,
  },
  chipText: {
    fontSize: 14,
    color: "#A9A9A9",
  },
  chipTextActive: {
    color: "#F5F5F5",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#1A1A1C",
    borderRadius: 12,
    marginBottom: 16,
    flex: 0.48,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: "#2E2E2E",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: { padding: 10 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#F5F5F5" },
  priceText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#BFBFBF",
    marginVertical: 2,
  },
  categoryText: { fontSize: 12, color: "#888" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
    fontStyle: "italic",
  },

  fab: {
    position: "absolute",
    margin: 16,
    right: 20,
    bottom: 20,
    backgroundColor: "#2E2E2E",
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "#1A1A1C",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 0.5,
    borderColor: "#2E2E2E",
  },
  modalBtn: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  modalBtnText: { color: "#F5F5F5", fontWeight: "600", fontSize: 15 },
});
