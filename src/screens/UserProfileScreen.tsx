import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MiniIdeaCard } from '../components/MiniIdeaCard';
import { IdeaCard } from '../components/IdeaCard';
import { User, FeedItem } from '../types';
import { getCurrentUser, mockIdeas, mockUsers } from '../utils/mockData';
import { BlurView } from 'expo-blur';

interface UserProfileScreenProps {
  navigation: any;
  route: any;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ navigation, route }) => {
  const userId = route.params?.userId;
  const currentUser = getCurrentUser();
  const profileUser = mockUsers.find(user => user.id === userId);

  const [selectedIdea, setSelectedIdea] = useState<FeedItem | null>(null);

  // If user not found, show error or redirect
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

  const userIdeas = mockIdeas.filter(idea => idea.creatorId === profileUser.id);
  const userFeedItems: FeedItem[] = userIdeas.map(idea => ({
    idea,
    interestCount: idea.interestedUsers.length,
    isInterested: false,
  }));

  const handleInterest = (ideaId: string) => {
    // Handle interest logic
  };

  const handleFollow = () => {
    // Handle follow logic
    console.log('Follow user:', profileUser.id);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleIdeaPress = (ideaId: string) => {
    const found = userFeedItems.find(item => item.idea.id === ideaId);
    if (found) setSelectedIdea(found);
  };

  const renderHeader = () => (
    <View style={styles.background}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>
      {/* Wrap all profile blocks in a single View to fix adjacent JSX error */}
      <View>
        <View style={styles.profileRow}>
          <Image source={{ uri: profileUser.avatar }} style={styles.avatar} />
          <View style={styles.countersColumn}>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profileUser.followers.length}</Text>
                <Text style={styles.statLabel}>followers</Text>
              </View>
              <TouchableOpacity
                style={styles.statItem}
                onPress={() => navigation.navigate('FollowersList', { 
                  userId: profileUser.id, 
                  type: 'following' 
                })}
              >
                <Text style={styles.statNumber}>{profileUser.following.length}</Text>
                <Text style={styles.statLabel}>following</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={styles.displayName}>{profileUser.displayName}</Text>
        <Text style={styles.username}>@{profileUser.username}</Text>
        {profileUser.bio && (
          <Text style={styles.bio}>{profileUser.bio}</Text>
        )}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.followButton}
            onPress={handleFollow}
          >
            <Text style={styles.followButtonText}>
              {currentUser.following.includes(profileUser.id) ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
            <Ionicons name="logo-instagram" size={24} color="#eee" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={20} color="#eee" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCarousel = (items: FeedItem[], title: string, emptyComponent: React.ReactNode) => (
    <View style={styles.carouselSection}>
      <Text style={styles.carouselTitle}>{title}</Text>
      {items.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContentNoPad}
        >
          {items.map((item, idx) => (
            <View key={item.idea.id} style={idx === 0 ? { paddingLeft: 16 } : undefined}>
              <MiniIdeaCard
                item={item}
                onPress={() => handleIdeaPress(item.idea.id)}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        emptyComponent
      )}
    </View>
  );

  const renderEmptyIdeas = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bulb-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No ideas yet</Text>
      <Text style={styles.emptySubtitle}>
        This user hasn't shared any ideas yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        
        {renderCarousel(
          userFeedItems,
          'Ideas',
          renderEmptyIdeas()
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <Modal
        visible={!!selectedIdea}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedIdea(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedIdea(null)}>
          <View style={styles.overlayModal}>
            <BlurView
              experimentalBlurMethod='dimezisBlurView'
              intensity={15}
              tint='dark'
              style={styles.overlayTint}
              pointerEvents="none"
            />
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.overlayCardContainer}>
                {selectedIdea && (
                  <IdeaCard
                    item={selectedIdea}
                    onInterest={handleInterest}
                    navigation={navigation}
                  />
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedIdea(null)}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111216',
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
  header: {
    paddingTop: 50,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
    marginTop: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
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
  carouselSection: {
    marginTop: 24,
    paddingHorizontal: 0,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    paddingLeft: 24,
  },
  carouselContent: {
    paddingHorizontal: 8,
  },
  carouselContentNoPad: {
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  bottomSpacing: {
    height: 32,
  },
  overlayModal: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayCardContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    // Remove any fixed height/width or border radius here
  },
  closeButton: {
    marginTop: 12,
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  background: {
    backgroundColor: '#111216',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  socialIcon: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23242a',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#555'
  },
  followButton: {
    backgroundColor: 'rgba(37, 174, 248, 1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 7,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center', // ensure vertical centering
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  countersColumn: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center', // ensure vertical centering
    alignItems: 'center',
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    paddingHorizontal: 24,
  },
  username: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 6,
    paddingHorizontal: 24,
  },
  bio: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'left',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 0,
  },
}); 