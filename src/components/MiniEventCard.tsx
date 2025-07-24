import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';

interface MiniEventCardProps {
  event: Event;
  currentUserId: string;
  onPress?: () => void;
}

export const MiniEventCard: React.FC<MiniEventCardProps> = ({
  event,
  currentUserId,
  onPress,
}) => {
  // Format date and time
  const formatDateTime = (date: Date) => {
    const now = dayjs();
    const eventDate = dayjs(date);
    
    if (eventDate.isSame(now, 'day')) {
      return `Today • ${eventDate.format('h:mm A')}`;
    } else if (eventDate.isSame(now.add(1, 'day'), 'day')) {
      return `Tomorrow • ${eventDate.format('h:mm A')}`;
    } else {
      return `${eventDate.format('MMM D')} • ${eventDate.format('h:mm A')}`;
    }
  };

  const isAttending = event.attendees.some(attendee => attendee.id === currentUserId);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }} 
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0.3 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.overlay}>
        <View style={styles.bottomContent}>
          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>
          
          <Text style={styles.dateTime}>
            {formatDateTime(event.startDate)}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.attendeesContainer}>
              <View style={styles.attendeesAvatarsRow}>
                {event.attendees.slice(0, 2).map((attendee, idx) => (
                  <Image
                    key={attendee.id}
                    source={{ uri: attendee.avatar }}
                    style={[
                      styles.attendeeAvatar,
                      idx > 0 && { marginLeft: -6 },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.attendeesCount}>
                {event.attendees.length}
              </Text>
            </View>
            {isAttending && (
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
    aspectRatio: 0.83, // Same ratio as MiniIdeaCard
    borderRadius: 4,
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
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 18,
  },
  dateTime: {
    fontSize: 12,
    color: '#ddd',
    marginBottom: 8,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  attendeeAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },
  attendeesCount: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
}); 