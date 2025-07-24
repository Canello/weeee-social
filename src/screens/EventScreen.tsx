import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Event, User } from '../types';
import { getCurrentUser } from '../utils/mockData';
import dayjs from 'dayjs';

interface EventScreenProps {
  navigation: any;
  route: any;
}

interface ChatMessage {
  id: string;
  text: string;
  admin: User;
  timestamp: Date;
}

export const EventScreen: React.FC<EventScreenProps> = ({ navigation, route }) => {
  const event: Event = route.params?.event;
  const currentUser = getCurrentUser();
  
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioShouldCollapse, setBioShouldCollapse] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    // Mock messages for now
    {
      id: '1',
      text: 'Welcome everyone! We\'re excited to have you join us for this event. Please arrive 15 minutes early to check in.',
      admin: event.creator,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      text: 'Just a reminder: bring your own water bottle and comfortable shoes. The venue has limited parking, so carpooling is recommended.',
      admin: event.creator,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
  ]);

  if (!event) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.errorTitle}>Event not found</Text>
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

  const isAdmin = event.creator.id === currentUser.id || 
                  event.admins.some(admin => admin.id === currentUser.id);
  
  const isAttending = event.attendees.some(attendee => attendee.id === currentUser.id);
  const isInvited = event.invitees.some(invitee => invitee.id === currentUser.id) ||
                   event.pendingInvitees.some(invitee => invitee.id === currentUser.id);

  const formatDateTime = (date: Date) => {
    const eventDate = dayjs(date);
    return eventDate.format('dddd, MMMM D • h:mm A');
  };

  const handleAttend = () => {
    // Handle attend logic
    console.log('Attend event:', event.id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && isAdmin) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        admin: currentUser,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    // Handle share logic
    console.log('Share event:', event.id);
  };

  const handleMoreOptions = () => {
    // Handle more options
    console.log('More options for event:', event.id);
  };

  const handleAttendeesPress = () => {
    // Navigate to participants page (to be implemented later)
    console.log('Navigate to participants page');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Image source={{ uri: event.imageUrl }} style={styles.headerImage} />
      <View style={styles.headerOverlay}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton} onPress={handleShare}>
              <Ionicons name="arrow-redo-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton} onPress={handleMoreOptions}>
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEventInfo = () => (
    <View style={styles.eventInfo}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventDateTime}>{formatDateTime(event.startDate)}</Text>
      
      <TouchableOpacity style={styles.attendeesSection} onPress={handleAttendeesPress}>
        <View style={styles.attendeesAvatars}>
          {event.attendees.slice(0, 3).map((attendee, idx) => (
            <Image
              key={attendee.id}
              source={{ uri: attendee.avatar }}
              style={[
                styles.attendeeAvatar,
                idx > 0 && { marginLeft: -8 },
              ]}
            />
          ))}
        </View>
        <Text style={styles.attendeesText}>
          {event.attendees.length} attendees / {event.invitees.length + event.pendingInvitees.length} invited
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#666" />
      </TouchableOpacity>

      {event.description && (
        <>
          <Text
            style={styles.eventDescription}
            numberOfLines={bioExpanded ? undefined : 3}
            ellipsizeMode="tail"
            onTextLayout={e => {
              if (!bioShouldCollapse && e.nativeEvent.lines.length > 3) {
                setBioShouldCollapse(true);
              }
            }}
          >
            {event.description}
          </Text>
          {bioShouldCollapse && (
            <Text
              style={styles.seeMore}
              onPress={() => setBioExpanded(exp => !exp)}
            >
              {bioExpanded ? 'See less' : 'See more'}
            </Text>
          )}
        </>
      )}

      <TouchableOpacity
        style={[
          styles.attendButton,
          isAttending && styles.attendButtonActive,
        ]}
        onPress={handleAttend}
        disabled={isAttending}
      >
        {isAttending && (
          <Ionicons name="checkmark" size={18} color="#fff" style={{ marginRight: 8 }} />
        )}
        <Text style={styles.attendButtonText}>
          {isAttending ? 'I\'m Attending' : 'Attend'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderChatMessage = (message: ChatMessage) => {
    const isLongMessage = message.text.length > 100;
    const [expanded, setExpanded] = useState(false);
    
    return (
      <View key={message.id} style={styles.messageContainer}>
        <View style={styles.messageBubble}>
          <View style={styles.messageHeader}>
            <Image source={{ uri: message.admin.avatar }} style={styles.messageAvatar} />
            <Text style={styles.messageAuthor}>{message.admin.displayName}</Text>
            <Text style={styles.messageTime}>
              {dayjs(message.timestamp).format('h:mm A')}
            </Text>
          </View>
          <Text
            style={styles.messageText}
            numberOfLines={expanded ? undefined : 3}
          >
            {message.text}
          </Text>
          {isLongMessage && (
            <TouchableOpacity
              style={styles.seeMoreButton}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={styles.seeMoreText}>
                {expanded ? 'See less' : 'See more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderChat = () => (
    <View style={styles.chatSection}>
      <Text style={styles.chatTitle}>Event Updates</Text>
      <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
        {chatMessages.map(renderChatMessage)}
      </ScrollView>
      {isAdmin && (
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Send a message to attendees..."
            placeholderTextColor="#666"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={newMessage.trim() ? "#fff" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {renderHeader()}
          {renderEventInfo()}
          {renderChat()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111216',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    height: (Dimensions.get('window').width) * 1.3,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  eventInfo: {
    padding: 24,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  eventDateTime: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 16,
  },
  attendeesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  attendeesAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  attendeeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  attendeesText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  eventDescription: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 24,
    marginBottom: 8,
  },
  seeMore: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  attendButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendButtonActive: {
    backgroundColor: '#2ed573',
  },
  attendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    backgroundColor: '#23242a',
    borderRadius: 16,
    padding: 16,
    maxWidth: '85%',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  messageAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 20,
  },
  seeMoreButton: {
    marginTop: 8,
  },
  seeMoreText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#23242a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#fff',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#667eea',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
}); 