import { useAuthStore } from "@/store/auth-store";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import styles from "@/assets/styles/home.styles";
import { Image } from "expo-image";
import { BASE_API_URL } from "@/constants/config";
import { User } from "@/types/auth-type";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { formatPublishDate } from "@/lib/utils";
import Loader from "@/components/loader";

export type BookType = {
  _id: string;
  title: string;
  caption: string;
  image: string;
  author: string;
  rating: number;
  user: User;
  createdAt: string;
};

type DataResponseType = {
  books: BookType[];
  totalPages: number;
  message?: string;
};

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  async function fetchBooks(pageNumber: number = 1, refresh: boolean = false) {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNumber === 1) {
        setLoading(true);
      }

      const response = await fetch(
        `${BASE_API_URL}/book/get-books?page=${pageNumber}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: DataResponseType = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      const uniqueBooks =
        refresh || pageNumber === 1
          ? data.books
          : (Array.from(
              new Set([...books, ...data.books].map((book) => book._id))
            ).map((id) =>
              [...books, ...data.books].find((book) => book._id === id)
            ) as BookType[]);

      setBooks(uniqueBooks);

      setHasMore(pageNumber < data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching book", error);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  async function handleLoadMore() {
    if (hasMore && !loading && !refreshing) {
      fetchBooks(page + 1);
    }
  }

  const renderItem: ListRenderItem<BookType> = ({ item }) => {
    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image source={item.user.profileImage} style={styles.avatar} />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        </View>

        <View style={styles.bookImageContainer}>
          <Image
            source={item.image}
            style={styles.bookImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.date}>
            Shared on {formatPublishDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  if (loading) {
    return <Loader size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        } 
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bookly</Text>
            <Text style={styles.headerSubtitle}>Discover great reads!</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size={"small"}
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a book!
            </Text>
          </View>
        }
      />
    </View>
  );
}
