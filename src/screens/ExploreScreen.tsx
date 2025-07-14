import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../types';
import { mockUsers, getCurrentUser } from '../utils/mockData';

interface ExploreScreenProps {
  navigation: any;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = getCurrentUser();

  // Filter out current user and users they already follow
  const suggestedUsers = mockUsers.filter(user => 
    user.id !== currentUser.id && 
    !currentUser.following.includes(user.id)
  );

  const filteredUsers = suggestedUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const handleFollow = (userId: string) => {
    // Handle follow logic
    console.log('Follow user:', userId);
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const renderUserCard = ({ item, index }: { item: User, index: number }) => (
    <TouchableOpacity
      style={[styles.userCard, index === 0 && styles.firstUserCard]}
      onPress={() => handleUserPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.userDisplayName}>{item.displayName}</Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
        <View style={styles.userStats}>
          <Text style={styles.userStat}>
            {item.followers.length} followers
          </Text>
          <Text style={styles.userStat}>
            {item.following.length} following
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.followButton}
        onPress={() => handleFollow(item.id)}
      >
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search people..."
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No users found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderUserCard({ item, index })}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a20',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#23242a',
    borderBottomWidth: 1,
    borderBottomColor: '#23242a',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242a',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },

  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242a',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  firstUserCard: {
    marginTop: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userDisplayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  userUsername: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  userBio: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  userStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  userStat: {
    fontSize: 12,
    color: '#888',
    marginRight: 15,
  },
  followButton: {
    backgroundColor: '#3a3b47',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 