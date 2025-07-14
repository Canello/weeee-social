import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedItem } from '../types';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';

interface IdeaCardProps {
  item: FeedItem;
  onInterest: (ideaId: string) => void;
  navigation?: any;
}

const { width } = Dimensions.get('window');

export const IdeaCard: React.FC<IdeaCardProps> = ({
  item,
  onInterest,
  navigation,
}) => {
  const { idea, interestCount, isInterested } = item;
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const contentHeight = useRef(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: expanded ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const handleLayout = (event: any) => {
    if (expanded && event.nativeEvent.layout.height > 0) {
      contentHeight.current = event.nativeEvent.layout.height;
    }
  };

  const collapsedHeight = 44; // Approximate height for 2 lines
  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedHeight, contentHeight.current || 200],
  });
  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleUserPress = () => {
    if (navigation) {
      navigation.navigate('UserProfile', { userId: idea.creatorId });
    }
  };

  const handleInterestCounterPress = () => {
    if (navigation) {
      navigation.navigate('InterestedPeople', { 
        ideaId: idea.id, 
        ideaTitle: idea.title 
      });
    }
  };

  // Calculate time left
  const now = new Date();
  const diffMs = idea.expirationDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timeLeftText = '';
  let pillStyle = styles.timeLeftPillDefault;
  if (diffDays >= 2) {
    timeLeftText = `${diffDays} days left to join`;
  } else if (diffDays >= 1) {
    timeLeftText = `${diffDays} day${diffDays === 1 ? '' : 's'} left to join`;
    pillStyle = styles.timeLeftPillYellow;
  } else if (diffHours >= 1) {
    timeLeftText = `${diffHours} hours left to join`;
    pillStyle = styles.timeLeftPillRed;
  } else if (diffMinutes > 0) {
    timeLeftText = `${diffMinutes} minutes left to join`;
    pillStyle = styles.timeLeftPillRed;
  } else {
    timeLeftText = 'Expired';
    pillStyle = styles.timeLeftPillRed;
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: idea.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }} 
        style={styles.backgroundImage}
      />
      <View style={[styles.overlay, expanded && styles.overlayExpanded]}>
        {!expanded && (
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0.3 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.userInfoContainer}
            onPress={(e) => { e.stopPropagation && e.stopPropagation(); handleUserPress(); }}
            disabled={!navigation}
          >
            <Image source={{ uri: idea.creator.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.displayName}>{idea.creator.displayName}</Text>
              <Text style={styles.username}>@{idea.creator.username}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => { /* TODO: implement share */ }} style={styles.headerIconButton}>
              <Ionicons name="arrow-redo-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomContent}>
          {expanded ? (
            <>
              <ScrollView
                style={[styles.content, { flexGrow: 0 }]}
                contentContainerStyle={{ paddingBottom: 8 }}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View style={styles.detailRow}>
                  <View style={[styles.timeLeftPill, pillStyle]}>
                    <Text style={styles.timeLeftText}>{timeLeftText}</Text>
                  </View>
                </View>
                <Text style={styles.title}>{idea.title}</Text>
                <TouchableOpacity
                  style={styles.interestedContainer}
                  onPress={(e) => { e.stopPropagation && e.stopPropagation(); handleInterestCounterPress(); }}
                  disabled={!navigation}
                >
                  <View style={styles.interestedAvatarsRow}>
                    {idea.interestedUsersPreview.slice(0, 3).map((user, idx) => (
                      <Image
                        key={user.id}
                        source={{ uri: user.avatar }}
                        style={[
                          styles.interestedAvatar,
                          idx > 0 && { marginLeft: -8 },
                          idea.interestedUsers.length >= idea.minimumInterested && styles.interestedAvatarMet,
                        ]}
                      />
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.interestedPillText,
                        idea.interestedUsers.length >= idea.minimumInterested && styles.interestedPillTextMet
                      ]}
                    >
                      {idea.interestedUsers.length} interested
                    </Text>
                    <Text 
                      style={[
                        styles.interestedPillText,
                        idea.interestedUsers.length >= idea.minimumInterested && styles.interestedPillTextMet
                      ]}
                    >
                      {' / '}
                    </Text>
                    <Text 
                      style={[
                        styles.interestedPillText,
                        idea.interestedUsers.length >= idea.minimumInterested && styles.interestedPillTextMet
                      ]}
                    >
                      {idea.minimumInterested} minimum
                    </Text>
                  </View>
                </TouchableOpacity>
                {idea.location && idea.location.trim() !== '' && (
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={14} color="#fff" />
                    <Text style={styles.detailText}>{idea.location}</Text>
                  </View>
                )}
                <View style={styles.divider} />
                <Text style={styles.description}>
                  {idea.description}
                </Text>
                <TouchableOpacity onPress={toggleExpanded} style={styles.seeMoreButton}>
                  <Text style={styles.seeMoreText}>See Less</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          ) : (
            <View style={styles.content}>
              <View style={styles.detailRow}>
                <View style={[styles.timeLeftPill, pillStyle]}>
                  <Text style={styles.timeLeftText}>{timeLeftText}</Text>
                </View>
              </View>
              <Text style={styles.title}>{idea.title}</Text>
              <TouchableOpacity
                style={styles.interestedContainer}
                onPress={(e) => { e.stopPropagation && e.stopPropagation(); handleInterestCounterPress(); }}
                disabled={!navigation}
              >
                <View style={styles.interestedAvatarsRow}>
                  {idea.interestedUsersPreview.slice(0, 3).map((user, idx) => (
                    <Image
                      key={user.id}
                      source={{ uri: user.avatar }}
                      style={[
                        styles.interestedAvatar,
                        idx > 0 && { marginLeft: -8 },
                        idea.interestedUsers.length >= idea.minimumInterested && styles.interestedAvatarMet,
                      ]}
                    />
                  ))}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      styles.interestedPillText,
                      idea.interestedUsers.length >= idea.minimumInterested && styles.interestedPillTextMet
                    ]}
                  >
                    {idea.interestedUsers.length} interested
                  </Text>
                  <Text 
                    style={[
                      styles.interestedPillText,
                      idea.interestedUsers.length >= idea.minimumInterested && styles.interestedPillTextMet
                    ]}
                  >
                    {' / '}
                  </Text>
                  <Text 
                    style={[
                      styles.interestedPillText,
                      idea.interestedUsers.length >= idea.minimumInterested && styles.interestedPillTextMet
                    ]}
                  >
                    {idea.minimumInterested} minimum
                  </Text>
                </View>
              </TouchableOpacity>
              {idea.location && idea.location.trim() !== '' && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color="#fff" />
                  <Text style={styles.detailText}>{idea.location}</Text>
                </View>
              )}
              <View style={styles.divider} />
              <Text style={styles.description} numberOfLines={2}>
                {idea.description}
              </Text>
              <TouchableOpacity onPress={toggleExpanded} style={styles.seeMoreButton}>
                <Text style={styles.seeMoreText}>See More</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.confirmButton, isInterested && styles.confirmButtonActive]}
              onPress={() => onInterest(idea.id)}
            >
              {isInterested && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#2ed573"
                />
              )}
              <Text style={[styles.confirmButtonText, isInterested && styles.confirmButtonTextActive]}>
                {isInterested ? 'Interested' : 'Show interest'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 24,
    height: (width - 24) * 1.3,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 16,
    flexDirection: 'column',
  },
  overlayExpanded: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userInfo: {
  },
  displayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  username: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  headerIconButton: {
    marginLeft: 12,
    padding: 4,
  },

  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 8,
  },
  descriptionScrollView: {
    maxHeight: 120,
    marginBottom: 8,
  },
  descriptionScrollViewExpanded: {
    maxHeight: 200,
  },
  seeMoreButton: {
    marginTop: 4,
    alignSelf: 'center',
  },
  seeMoreText: {
    color: '#ebebeb',
    fontSize: 12,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 8,
  },
  details: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actions: {
    marginTop: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 174, 248, 0.7)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonActive: {
    backgroundColor: 'rgba(94, 142, 96, 0.7)',
    borderColor: '#2ed573',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  confirmButtonTextActive: {
    color: '#2ed573',
  },
  interestedAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
  },
  interestedAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  interestedAvatarMet: {
    borderColor: '#4ed164', // green tone
  },
  timeLeftPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  timeLeftPillDefault: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  timeLeftPillYellow: {
    backgroundColor: '#e6b800',
  },
  timeLeftPillRed: {
    backgroundColor: '#ff6b6b',
  },
  timeLeftText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  interestedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12, 
    paddingVertical: 4,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  interestedPillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 2,
  },
  interestedPillTextMet: {
    color: '#4ed164', // green tone
  },
}); 