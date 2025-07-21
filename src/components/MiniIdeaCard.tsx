import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedItem } from '../types';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';

interface MiniIdeaCardProps {
  item: FeedItem;
  onPress?: () => void;
}

// Removed fixed cardWidth; parent should control width for responsiveness

export const MiniIdeaCard: React.FC<MiniIdeaCardProps> = ({
  item,
  onPress,
}) => {
  const { idea, interestCount, isInterested } = item;

  // Calculate time left
  const now = new Date();
  const diffMs = idea.expirationDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timeLeftText = '';
  let timeLeftStyle = styles.timeLeftDefault;
  if (diffDays >= 2) {
    timeLeftText = `${diffDays}d`;
  } else if (diffDays >= 1) {
    timeLeftText = `${diffDays}d`;
    timeLeftStyle = styles.timeLeftYellow;
  } else if (diffHours >= 1) {
    timeLeftText = `${diffHours}h`;
    timeLeftStyle = styles.timeLeftRed;
  } else if (diffMinutes > 0) {
    timeLeftText = `${diffMinutes}m`;
    timeLeftStyle = styles.timeLeftRed;
  } else {
    timeLeftText = 'Exp';
    timeLeftStyle = styles.timeLeftRed;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: idea.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }} 
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0.3 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.timeLeftContainer}>
            <View style={[styles.timeLeftPill, timeLeftStyle]}>
              <Text style={styles.timeLeftText}>{timeLeftText}</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={2}>
            {idea.title}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.interestedContainer}>
              <View style={styles.interestedAvatarsRow}>
                {idea.interestedUsersPreview.slice(0, 2).map((user, idx) => (
                  <Image
                    key={user.id}
                    source={{ uri: user.avatar }}
                    style={[
                      styles.interestedAvatar,
                      idx > 0 && { marginLeft: -6 },
                      idea.interestedUsers.length >= idea.minimumInterested && styles.interestedAvatarMet,
                    ]}
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.interestedCount,
                  idea.interestedUsers.length >= idea.minimumInterested && styles.interestedCountMet,
                ]}
              >
                {idea.interestedUsers.length}
              </Text>
            </View>
            {isInterested && (
              <Ionicons name="checkmark-circle" size={16} color="#2ed573" />
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 0.83, // ~5:6 ratio, similar to previous
    borderRadius: 4,
    // marginHorizontal removed; parent should handle spacing
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  timeLeftContainer: {
    alignItems: 'flex-end',
  },
  timeLeftPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  timeLeftDefault: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  timeLeftYellow: {
    backgroundColor: '#e6b800',
  },
  timeLeftRed: {
    backgroundColor: '#ff6b6b',
  },
  timeLeftText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interestedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestedAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  interestedAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  interestedCount: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  interestedAvatarMet: {
    borderColor: '#4ed164', // green tone
  },
  interestedCountMet: {
    color: '#4ed164', // green tone
  },
}); 