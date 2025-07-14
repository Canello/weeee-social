import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../types';
import { mockUsers, getCurrentUser } from '../utils/mockData';

interface FollowersListScreenProps {
  navigation: any;
  route: any;
}

export const FollowersListScreen: React.FC<FollowersListScreenProps> = ({ navigation, route }) => {
  const { userId, type } = route.params; // type: 'followers' or 'following'
  const currentUser = getCurrentUser();
  const profileUser = mockUsers.find(user => user.id === userId);

  if (!profileUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={64} color="#ccc" />
          <Text style={styles.errorTitle}>User not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const userIds = type === 'followers' ? profileUser.followers : profileUser.following;
  const users = mockUsers.filter(user => userIds.includes(user.id));

  const handleUserPress = (targetUserId: string) => {
    if (targetUserId === currentUser.id) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('UserProfile', { userId: targetUserId });
    }
  };

  const handleFollow = (targetUserId: string) => {
    // Handle follow logic
    console.log('Follow user:', targetUserId);
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const isCurrentUser = item.id === currentUser.id;
    const isFollowing = currentUser.following.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleUserPress(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userDisplayName}>{item.displayName}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {type === 'followers' ? 'Followers' : 'Following'}
      </Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        No {type === 'followers' ? 'followers' : 'following'} yet
      </Text>
      <Text style={styles.emptySubtitle}>
        {type === 'followers' 
          ? 'When people follow this user, they will appear here'
          : 'When this user follows people, they will appear here'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        ListHeaderComponent={renderHeader}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#181a20',
    borderBottomWidth: 1,
    borderBottomColor: '#23242a',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#181a20',
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
    fontWeight: '600',
    color: '#fff',
  },
  userUsername: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
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
  followingButtonText: {
    color: '#667eea',
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
    color: '#aaa',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 