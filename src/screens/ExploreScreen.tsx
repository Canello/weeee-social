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

  const renderUserCard = ({ item, index }: { item: User, index: number }) => {
    const isCurrentUser = item.id === currentUser.id;
    const isFollowing = currentUser.following.includes(item.id);
    return (
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
        {!isCurrentUser && (
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing && styles.followButtonActive,
            ]}
            onPress={isFollowing ? undefined : () => handleFollow(item.id)}
            disabled={isFollowing}
            activeOpacity={isFollowing ? 1 : 0.7}
          >
            {isFollowing && (
              <Ionicons name="checkmark" size={16} color="#fff" style={{ marginRight: 4 }} />
            )}
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

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
    backgroundColor: 'rgba(37, 174, 248, 1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButtonActive: {
    backgroundColor: '#181a20',
    opacity: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 