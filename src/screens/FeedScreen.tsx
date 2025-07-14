import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IdeaCard } from '../components/IdeaCard';
import { FeedItem } from '../types';
import { mockFeedItems, getCurrentUser } from '../utils/mockData';

interface FeedScreenProps {
  navigation: any;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ navigation }) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [feedType, setFeedType] = useState<'following' | 'nearby'>('following');
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadFeed();
  }, [feedType]);

  const loadFeed = () => {
    // In a real app, this would fetch from API
    let filteredItems: FeedItem[];
    
    if (feedType === 'following') {
      // Show ideas from people the current user follows
      const followingIds = currentUser.following;
      filteredItems = mockFeedItems.filter(item =>
        followingIds.includes(item.idea.creatorId)
      );
    } else {
      // Show ideas from nearby locations
      // For demo purposes, we'll show ideas that have a location set
      // In a real app, this would use actual location services
      filteredItems = mockFeedItems.filter(item =>
        item.idea.location && item.idea.location.trim() !== ''
      );
    }
    
    setFeedItems(filteredItems);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      loadFeed();
      setRefreshing(false);
    }, 1000);
  };

  const handleInterest = (ideaId: string) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.idea.id === ideaId
          ? {
              ...item,
              isInterested: !item.isInterested,
              interestCount: item.isInterested
                ? item.interestCount - 1
                : item.interestCount + 1,
            }
          : item
      )
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Your Feed</Text>
    </View>
  );

  const renderToggle = () => (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleOption, feedType === 'following' && styles.activeToggleOption]}
        onPress={() => setFeedType('following')}
      >
        <Ionicons 
          name="people" 
          size={16} 
          color={feedType === 'following' ? '#fff' : '#666'} 
        />
        <Text style={[styles.toggleText, feedType === 'following' && styles.activeToggleText]}>
          Following
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleOption, feedType === 'nearby' && styles.activeToggleOption]}
        onPress={() => setFeedType('nearby')}
      >
        <Ionicons 
          name="location" 
          size={16} 
          color={feedType === 'nearby' ? '#fff' : '#666'} 
        />
        <Text style={[styles.toggleText, feedType === 'nearby' && styles.activeToggleText]}>
          Nearby
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name={feedType === 'following' ? 'people-outline' : 'location-outline'} 
        size={64} 
        color="#ccc" 
      />
      <Text style={styles.emptyTitle}>
        {feedType === 'following' ? 'No ideas from following' : 'No nearby ideas'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {feedType === 'following' 
          ? 'Follow some creators to see their ideas in your feed'
          : 'No ideas with location data found nearby'
        }
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <Text style={styles.exploreButtonText}>Explore Ideas</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={feedItems}
        keyExtractor={(item) => item.idea.id}
        renderItem={({ item }) => (
          <IdeaCard
            item={item}
            onInterest={handleInterest}
            navigation={navigation}
          />
        )}
        ListHeaderComponent={renderToggle}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111216',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#23242a',
    borderBottomWidth: 1,
    borderBottomColor: '#23242a',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#23242a',
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeToggleOption: {
    backgroundColor: '#3a3b47',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginLeft: 6,
  },
  activeToggleText: {
    color: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
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
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#2ed573',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 