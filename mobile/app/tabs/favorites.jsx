import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import { favoritesStyles } from "../../assets/styles/favorites.style";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import RecipeCard from "../../components/RecipeCard";

const FavoritesScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to load favorites");
        }

        const favoriteData = await response.json();

        //Transform the data to our app format
        const transformedFavorites = favoriteData.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));
        setFavoriteRecipes(transformedFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        Alert.alert("Error", "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user.id]);

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };

  if (loading) return <LoadingSpinner message="Loading favorites..." />;

  return (
    <ScrollView style={favoritesStyles.container}>
      <View style={favoritesStyles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={favoritesStyles.header}>
            <Text style={favoritesStyles.title}>Favorites</Text>
            <TouchableOpacity
              style={favoritesStyles.logoutButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={favoritesStyles.recipesSection}>
            {favoriteRecipes.length === 0 ? (
              <NoFavoritesFound />
            ) : (
              <FlatList
                data={favoriteRecipes}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={favoritesStyles.row}
                contentContainerStyle={favoritesStyles.recipesGrid}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default FavoritesScreen;
