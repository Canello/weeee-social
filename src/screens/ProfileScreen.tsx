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
import { getCurrentUser, mockIdeas } from '../utils/mockData';
import { BlurView } from 'expo-blur';

interface ProfileScreenProps {
  navigation: any;
}

interface FilterTagProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.filterTag,
      selected && styles.filterTagSelected
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.filterTagContent}>
      {selected ? (
        <Ionicons name="checkmark" size={16} color="#90e0ac" style={{ marginRight: 4 }} />
      ) : (
        <Ionicons name="close" size={16} color="#aaa" style={{ marginRight: 4 }} />
      )}
      <Text style={[styles.filterTagText, selected && styles.filterTagTextSelected]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const currentUser = getCurrentUser();

  const [selectedIdea, setSelectedIdea] = useState<FeedItem | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioShouldCollapse, setBioShouldCollapse] = useState(false);
  const [selectedCreated, setSelectedCreated] = useState(true);
  const [selectedInterested, setSelectedInterested] = useState(true);
  const [activeTab, setActiveTab] = useState<'ideas' | 'events'>('ideas');

  // Event tab tag states
  const [selectedInvited, setSelectedInvited] = useState(true);
  const [selectedAttendee, setSelectedAttendee] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(true);
  const [selectedPast, setSelectedPast] = useState(false);

  const userIdeas = mockIdeas.filter(idea => idea.creatorId === currentUser.id);
  const userFeedItems: FeedItem[] = userIdeas.map(idea => ({
    idea,
    interestCount: idea.interestedUsers.length,
    isInterested: false,
  }));

  // Mock interested ideas - in real app this would come from user data
  const interestedIdeas = mockIdeas.filter(idea => 
    idea.interestedUsers.includes(currentUser.id)
  );
  const interestedFeedItems: FeedItem[] = interestedIdeas.map(idea => ({
    idea,
    interestCount: idea.interestedUsers.length,
    isInterested: true,
  }));

  // Combine user ideas and interests, removing duplicates (by idea id)
  const combinedFeedItems: FeedItem[] = [
    ...userFeedItems,
    ...interestedFeedItems.filter(
      (item) => !userFeedItems.some((u) => u.idea.id === item.idea.id)
    ),
  ];

  // Filter according to tag selection
  let filteredFeedItems: FeedItem[] = [];
  if (selectedCreated && selectedInterested) {
    filteredFeedItems = combinedFeedItems;
  } else if (selectedCreated) {
    filteredFeedItems = userFeedItems;
  } else if (selectedInterested) {
    filteredFeedItems = interestedFeedItems;
  } // else remains empty

  const handleInterest = (ideaId: string) => {
    // Handle interest logic
  };

  const handleIdeaPress = (ideaId: string, from: 'ideas' | 'interests') => {
    const source = from === 'ideas' ? userFeedItems : interestedFeedItems;
    const found = source.find(item => item.idea.id === ideaId);
    if (found) setSelectedIdea(found);
  };

  const renderHeader = () => (
    <View style={styles.background}>
      <View style={{ height: 48 }} />

      <View style={styles.profileRow}>
        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
        <View style={styles.countersColumn}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.followers.length}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('FollowersList', { 
                userId: currentUser.id, 
                type: 'following' 
              })}
            >
              <Text style={styles.statNumber}>{currentUser.following.length}</Text>
              <Text style={styles.statLabel}>following</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.displayName}>{currentUser.displayName}</Text>
      <Text style={styles.username}>@{currentUser.username}</Text>
      {currentUser.bio && (
        <>
          <Text
            style={styles.bio}
            numberOfLines={bioExpanded ? undefined : 4}
            ellipsizeMode="tail"
            onTextLayout={e => {
              if (!bioShouldCollapse && e.nativeEvent.lines.length > 4) {
                setBioShouldCollapse(true);
              }
            }}
          >
            {currentUser.bio}
          </Text>
          {bioShouldCollapse && (
            <Text
              style={styles.seeMore}
              onPress={() => setBioExpanded(exp => !exp)}
            >
              {bioExpanded ? 'See less' : 'See more'}
            </Text>
          )}
          <View style={{ marginBottom: 20 }} />
        </>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
          <Ionicons name="logo-instagram" size={24} color="#eee" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={24} color="#eee" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
          <Ionicons name="pencil-outline" size={22} color="#eee" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCarousel = (items: FeedItem[], title: string, emptyComponent: React.ReactNode, from: 'ideas' | 'interests') => (
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
                onPress={() => handleIdeaPress(item.idea.id, from)}
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
        Share your first idea with your followers
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateIdea')}
      >
        <Text style={styles.createButtonText}>Create Idea</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyInterests = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No interests yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring ideas and show your interest
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          {/* Tab bar */}
          <View style={styles.tabBarProfile}>
            <TouchableOpacity
              style={[styles.tabProfile, activeTab === 'ideas' && styles.tabProfileActive]}
              onPress={() => setActiveTab('ideas')}
            >
              <Text style={[styles.tabProfileText, activeTab === 'ideas' && styles.tabProfileTextActive]}>My Ideas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabProfile, activeTab === 'events' && styles.tabProfileActive]}
              onPress={() => setActiveTab('events')}
            >
              <Text style={[styles.tabProfileText, activeTab === 'events' && styles.tabProfileTextActive]}>My Events</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'ideas' ? (
            <View style={styles.filterTagContainer}>
              <FilterTag
                label="Created by me"
                selected={selectedCreated}
                onPress={() => setSelectedCreated((prev: boolean) => !prev)}
              />
              <FilterTag
                label="Interested"
                selected={selectedInterested}
                onPress={() => setSelectedInterested((prev: boolean) => !prev)}
              />
            </View>
          ) : (
            <View style={styles.filterTagContainer}>
              <FilterTag
                label="Invited"
                selected={selectedInvited}
                onPress={() => setSelectedInvited((prev: boolean) => !prev)}
              />
              <FilterTag
                label="Attendee"
                selected={selectedAttendee}
                onPress={() => setSelectedAttendee((prev: boolean) => !prev)}
              />
              <FilterTag
                label="Admin"
                selected={selectedAdmin}
                onPress={() => setSelectedAdmin((prev: boolean) => !prev)}
              />
              <FilterTag
                label="Past events"
                selected={selectedPast}
                onPress={() => setSelectedPast((prev: boolean) => !prev)}
              />
            </View>
          )}
          {activeTab === 'ideas' ? (
            filteredFeedItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="bulb-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No ideas or interests yet</Text>
                <Text style={styles.emptySubtitle}>
                  Share your first idea or show interest in others!
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => navigation.navigate('CreateIdea')}
                >
                  <Text style={styles.createButtonText}>Create Idea</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.exploreButton, { marginTop: 12 }]}
                  onPress={() => navigation.navigate('Explore')}
                >
                  <Text style={styles.exploreButtonText}>Explore Ideas</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {filteredFeedItems.map((item, idx) => (
                  <View
                    key={item.idea.id}
                    style={{
                      width: '32%', // 3 per row with gap
                      marginBottom: 8,
                      marginRight: (idx + 1) % 3 === 0 ? 0 : '2%',
                    }}
                  >
                    <MiniIdeaCard
                      item={item}
                      onPress={() => setSelectedIdea(item)}
                    />
                  </View>
                ))}
              </View>
            )
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No events yet</Text>
              <Text style={styles.emptySubtitle}>
                Your events will appear here soon.
              </Text>
            </View>
          )}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <Modal
        visible={!!selectedIdea}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedIdea(null)}
      >
        <View style={styles.overlayModal}>
          <BlurView
            experimentalBlurMethod='dimezisBlurView'
            intensity={15}
            tint='dark'
            style={styles.overlayTint}
            pointerEvents="none"
          />
          <TouchableWithoutFeedback onPress={() => setSelectedIdea(null)}>
            <View style={{...StyleSheet.absoluteFillObject}} />
          </TouchableWithoutFeedback>
          <View style={styles.overlayCardContainer}>
            {selectedIdea && (
              <IdeaCard
                item={selectedIdea}
                onInterest={handleInterest}
                navigation={navigation}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedIdea(null)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111216',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 20,
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
  },
  activeTab: {
    borderBottomWidth: 2,
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
  createButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  followButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  username: {
    fontSize: 16,
    color: '#eee',
    paddingHorizontal: 24,
    marginBottom: 6,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
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
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'left',
    lineHeight: 18,
    paddingHorizontal: 24,
  },
  seeMore: {
    color: '#fff',
    marginLeft: 24,
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 0,
  },
  filterTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 16,
  },
  filterTag: {
    backgroundColor: '#181a20',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTagSelected: {
    backgroundColor: '#23242a',
  },
  filterTagText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTagTextSelected: {
    color: '#90e0ac',
    fontWeight: '700',
  },
  filterTagContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBarProfile: {
    flexDirection: 'row',
    backgroundColor: '#181a20',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
  },
  tabProfile: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabProfileActive: {
    backgroundColor: '#23242a',
  },
  tabProfileText: {
    color: '#aaa',
    fontWeight: '700',
    fontSize: 16,
  },
  tabProfileTextActive: {
    color: '#90e0ac',
  },
}); 