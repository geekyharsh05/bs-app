import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import styles from "@/assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/Colors";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useCreateBook } from "@/hooks/use-book";
import { useBookStore } from "@/store/book-store";

export default function Create() {
  const {
    title,
    caption,
    rating,
    image,
    imageBase64,
    setTitle,
    setCaption,
    setRating,
    setImage,
    setImageBase64,
    resetFields,
  } = useBookStore();

  const { mutate: createBookMutation, isPending } = useCreateBook({
    resetFields,
  });

  async function pickImage() {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need permission to access your photos."
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        if (
          result.assets[0].fileSize &&
          result.assets[0].fileSize > 5 * 1024 * 1024
        ) {
          Alert.alert("Image too large", "Please select an image under 5MB.");
          return;
        }

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.log("Error picking up image", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  }

  async function handleSubmit() {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Missing Fields", "Please complete all fields.");
      return;
    }

    const uriParts = image!.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const imageType = fileType
      ? `image/${fileType.toLowerCase()}`
      : "image/jpeg";

    const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

    createBookMutation({
      title,
      caption,
      rating,
      image: imageDataUrl,
    });
  }

  function renderRatingPicker() {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Share a Great Read</Text>
            <Text style={styles.subtitle}>
              Your recommendation might inspire someone
            </Text>
          </View>

          <View style={styles.form}>
            {/* BOOK TITLE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/* RATING */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              {renderRatingPicker()}
            </View>

            {/* IMAGE */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to select an image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* CAPTION */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your review or thoughts about the book..."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* SUBMIT */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
