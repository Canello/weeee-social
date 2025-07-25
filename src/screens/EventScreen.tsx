import React, { useState, useRef } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
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
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionShouldCollapse, setDescriptionShouldCollapse] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isAttending, setIsAttending] = useState(event.attendees.some(attendee => attendee.id === currentUser.id));
  const [showRemoveAttendanceModal, setShowRemoveAttendanceModal] = useState(false);
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
    {
      id: '3',
      text: 'Hello everyone! I wanted to share some important updates about our upcoming event. First, let me start by saying how thrilled we are to see such great interest in this gathering. We\'ve received an overwhelming number of RSVPs and we\'re working hard to accommodate everyone. The venue has been confirmed and we\'ve secured additional space to ensure everyone has a comfortable experience. We\'ve also arranged for extra parking in the adjacent lot, so please don\'t worry about finding a spot. The catering team has been briefed on our dietary requirements and they\'re preparing a fantastic menu that should accommodate all preferences. We\'ve also set up a dedicated area for networking and mingling, complete with comfortable seating and ambient lighting. The technical team will be on-site early to test all equipment and ensure smooth presentations. We\'ve also arranged for professional photography to capture the special moments throughout the event. Please remember to bring your business cards and any materials you\'d like to share with other attendees. We\'re looking forward to an amazing day filled with learning, networking, and fun!',
      admin: event.creator,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
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
  
  const isInvited = event.invitees.some(invitee => invitee.id === currentUser.id);

  const formatDateTime = (date: Date) => {
    const eventDate = dayjs(date);
    return eventDate.format('dddd, MMMM D • h:mm A');
  };

  const handleAttend = () => {
    if (isAttending) {
      setShowRemoveAttendanceModal(true);
    } else {
      setIsAttending(true);
      // Handle attend logic
      console.log('Attend event:', event.id);
    }
  };

  const handleRemoveAttendance = () => {
    setIsAttending(false);
    setShowRemoveAttendanceModal(false);
    // Handle remove attendance logic
    console.log('Remove attendance from event:', event.id);
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
      <LinearGradient
        colors={['rgba(17, 18, 22, 0.3)', '#111216']}
        style={styles.gradientOverlay}
      />
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
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
              {event.attendees.length} attendees | {event.invitees.length + event.pendingInvitees.length} invited
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#ddd" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.attendButton,
              isAttending && styles.attendButtonActive,
            ]}
            onPress={handleAttend}
          >
            {isAttending && (
              <Ionicons name="checkmark-circle" size={18} color="#2ed573" />
            )}
            <Text style={[styles.attendButtonText, isAttending && styles.attendButtonTextActive]}>
              {isAttending ? 'Attending' : 'Attend'}
            </Text>
          </TouchableOpacity>

          <Text
            style={styles.eventDescription}
            numberOfLines={descriptionExpanded ? undefined : 3}
            ellipsizeMode="tail"
            onTextLayout={e => {
              if (!descriptionShouldCollapse && e.nativeEvent.lines.length > 3) {
                setDescriptionShouldCollapse(true);
              }
            }}
          >
            {event.description || 'No description available'}
          </Text>
          <TouchableOpacity
            style={styles.eventSeeMoreButton}
            onPress={() => setDescriptionExpanded(exp => !exp)}
          >
            <Text style={styles.eventSeeMoreText}>
              {descriptionExpanded ? 'See less' : 'See more'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderChatMessage = (message: ChatMessage) => {
    const [expanded, setExpanded] = useState(false);
    const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);
    
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
            numberOfLines={expanded ? undefined : 10}
            onTextLayout={e => {
              if (!expanded && e.nativeEvent.lines.length > 10) {
                setShouldShowSeeMore(true);
              }
            }}
          >
            {message.text}
          </Text>
          {shouldShowSeeMore && (
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
      <Text style={styles.chatTitle}>Event updates</Text>
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
        {renderHeader()}
        {renderChat()}
      </KeyboardAvoidingView>
      
      {/* Remove Attendance Confirmation Modal */}
      {showRemoveAttendanceModal && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 2000 }]}> 
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' }} />
          <View style={styles.modalContent}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTitle}>Remove Attendance?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to remove your attendance from this event?
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowRemoveAttendanceModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonDanger]} onPress={handleRemoveAttendance}>
                <Text style={[styles.modalButtonText, styles.modalButtonDangerText]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    height: Dimensions.get('window').height * 0.4,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  eventDateTime: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 12,
  },
  attendeesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  attendeesAvatars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  attendeeAvatar: {
    width: 26,
    height: 26,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  attendeesText: {
    flex: 1,
    fontSize: 14,
    color: '#ddd',
    fontWeight: '500',
  },
  attendButton: {
    backgroundColor: 'rgba(37, 174, 248, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendButtonActive: {
    backgroundColor: 'rgba(94, 142, 96, 0.7)',
    borderColor: '#2ed573',
  },
  attendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  attendButtonTextActive: {
    color: '#2ed573',
  },
  eventDescription: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 12,
    marginBottom: 8,
  },
  eventSeeMoreButton: {
    marginTop: 4,
    alignSelf: 'center',
  },
  eventSeeMoreText: {
    color: '#ebebeb',
    fontSize: 14,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingVertical: 4,
  },
  chatSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
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
    borderTopColor: '#444',
    borderTopWidth: 1,
    paddingTop: 16,
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
    color: 'rgba(37, 174, 248, 1)',
    fontSize: 14,
    fontWeight: '700',
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
  modalContent: {
    backgroundColor: '#23242a',
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  modalTextContainer: {
    padding: 28,
    paddingBottom: 8,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonDanger: {
    backgroundColor: '#b53a3d',
  },
  modalButtonDangerText: {
    color: '#fff',
  },
}); 