import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Create = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Casual');
  const [image, setImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera roll permissions to pick an image.'
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim() || !category) return;

    await addDoc(collection(db, 'goals'), {
      title: name,
      price: parseFloat(price),
      category,
      imageUrl: image || '',
      isFavorite: false,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setName('');
    setPrice('');
    setCategory('Casual');
    setImage(null);
    Keyboard.dismiss();
    router.push('/goals');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Icon */}
      <MaterialCommunityIcons
        name="tshirt-crew"
        size={72}
        color="#F5F5F5"
        style={styles.icon}
      />

      <Text style={styles.title}>Add New T-Shirt</Text>

      <TextInput
        style={styles.input}
        placeholder="T-Shirt Brand"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#A9A9A9"
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        placeholderTextColor="#A9A9A9"
      />

      <View style={styles.dropdown}>
        <Picker
          selectedValue={category}
          dropdownIconColor="#F5F5F5"
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={{ color: '#F5F5F5' }}
        >
          <Picker.Item label="Casual" value="Casual" />
          <Picker.Item label="Graphic" value="Graphic" />
          <Picker.Item label="Oversized" value="Oversized" />
          <Picker.Item label="Sportswear" value="Sportswear" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      <Pressable onPress={pickImage} style={styles.imageButton}>
        <Text style={styles.imageButtonText}>
          {image ? 'Change Image' : 'Upload T-Shirt Image'}
        </Text>
      </Pressable>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Add T-Shirt</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0C', // night black
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5F5F5', // smokewhite
    marginBottom: 24,
    letterSpacing: 1,
  },
  input: {
    width: '90%',
    backgroundColor: '#1A1A1C',
    padding: 15,
    borderRadius: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    color: '#F5F5F5',
    fontSize: 16,
  },
  dropdown: {
    width: '90%',
    backgroundColor: '#1A1A1C',
    borderRadius: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  imageButton: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: '#2E2E2E',
    borderRadius: 14,
    alignItems: 'center',
    width: '90%',
  },
  imageButtonText: {
    color: '#F5F5F5',
    fontWeight: '600',
    fontSize: 15,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#444444',
  },
  button: {
    marginTop: 20,
    padding: 18,
    backgroundColor: '#3C3C3C',
    borderRadius: 14,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#F5F5F5',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
