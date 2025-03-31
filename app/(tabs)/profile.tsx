import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "@/assets/styles/profile.styles";
import { useRouter } from "expo-router";
import { BASE_API_URL } from "@/constants/config";
import { useAuthStore } from "@/store/auth-store";
import ProfileHeader from "@/components/profile-header";
import LogoutButton from "@/components/logout-button";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { Image } from "expo-image";
import Loader from "@/components/loader";

type BookType = {
  _id: string;
  title: string;
  image: string;
  rating: number;
  caption: string;
  createdAt: string;
};

export default function Profile() {
  const [books, setBooks] = useState<BookType[] | any>([]);
  const [isloading, setisLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const { token } = useAuthStore();

  const router = useRouter();

  const fetchData = async () => {
    try {
      setisLoading(true);

      const response = await fetch(
        `${BASE_API_URL}/book/get-books-recommendation`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching data: ", error);
      Alert.alert("Error", "Failed to load profile data, pull down to refresh");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderRatingStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      setDeleteBookId(bookId);

      const response = await fetch(
        `${BASE_API_URL}/book/delete-book/${bookId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete books");
      }

      setBooks(books.filter((book: BookType) => book._id !== bookId));
      Alert.alert("Success", "Recommendation Deleted Successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed To Delete Recommendation");
    } finally {
      setDeleteBookId(null);
    }
  };

  const confirmDelete = (bookId: string) => {
    Alert.alert(
      "Delete Recommendation",
      "Are you sure you want to delete this recommendation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteBook(bookId),
          style: "destructive",
        },
      ]
    );
  };

  const renderBookItem = ({ item }: { item: BookType }) => {
    return (
      <View style={styles.bookItem}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.bookCaption}>{item.caption}</Text>
          <Text style={styles.bookDate}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => confirmDelete(item._id)}
          style={styles.deleteButton}
        >
          {deleteBookId === item._id ? (
            <ActivityIndicator size={"small"} color={COLORS.primary} />
          ) : (
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const handleRefresh = async () => {
    await fetchData();
    setRefreshing(false)
  }

  if (isloading && !refreshing) {
    return <Loader size={"large"} />
  }

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* YOUR RECOMMENDATIONS */}
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books.length} books</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item: BookType) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
