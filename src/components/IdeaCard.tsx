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
  Modal,
  findNodeHandle,
  UIManager,
} from 'react-native';
import type { View as ViewType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedItem } from '../types';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentUser } from '../utils/mockData';
import { BlurView } from 'expo-blur';

interface IdeaCardProps {
  item: FeedItem;
  onInterest: (ideaId: string) => void;
  navigation?: any;
}

const { width } = Dimensions.get('window');

// Helper to serialize all Date objects in FeedItem
function serializeIdeaForNavigation(feedItem: FeedItem) {
  const { idea, ...rest } = feedItem;
  return {
    ...rest,
    idea: {
      ...idea,
      createdAt: idea.createdAt instanceof Date ? idea.createdAt.toISOString() : idea.createdAt,
      updatedAt: idea.updatedAt instanceof Date ? idea.updatedAt.toISOString() : idea.updatedAt,
      expirationDate: idea.expirationDate instanceof Date ? idea.expirationDate.toISOString() : idea.expirationDate,
      creator: {
        ...idea.creator,
        createdAt: idea.creator.createdAt instanceof Date ? idea.creator.createdAt.toISOString() : idea.creator.createdAt,
      },
      interestedUsersPreview: idea.interestedUsersPreview.map(user => ({
        ...user,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
      })),
    },
  };
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  item,
  onInterest,
  navigation,
}) => {
  const { idea, interestCount, isInterested } = item;
  const [expanded, setExpanded] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const threeDotsRef = useRef<ViewType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showMinimumNotMetModal, setShowMinimumNotMetModal] = useState(false);
  const [showRemoveInterestModal, setShowRemoveInterestModal] = useState(false);

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

  const MENU_WIDTH = 140;

  const handleThreeDotsPress = () => {
    if (threeDotsRef.current) {
      const handle = findNodeHandle(threeDotsRef.current);
      if (handle) {
        UIManager.measure(handle, (fx, fy, width, height, px, py) => {
          // Align right side of menu with right side of icon
          setMenuPosition({ x: px + width - MENU_WIDTH, y: py + height + 8 });
          setMenuVisible(true);
        });
      }
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

  const currentUser = getCurrentUser();
  const isCreator = currentUser.id === idea.creatorId;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: idea.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }} 
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0.3 }}
          style={StyleSheet.absoluteFill}
        />
        

        <View style={styles.bottomContent}>
          <ScrollView
            style={[styles.content, { flexGrow: 0 }]}
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >

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
            <TouchableOpacity
              onPress={handleThreeDotsPress}
              style={styles.headerIconButton}
            >
              <View ref={threeDotsRef} collapsable={false} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="ellipsis-vertical" size={20} color="#eee" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

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
            <View style={styles.divider} />
            <Text style={styles.description}>
              {idea.description}
            </Text>
          </ScrollView>

          <View style={styles.actions}>
            {isCreator ? (
              <TouchableOpacity
                style={[
                  styles.createEventButton,
                  idea.interestedUsers.length < idea.minimumInterested && styles.createEventButtonDisabled
                ]}
                onPress={() => {
                  if (idea.interestedUsers.length < idea.minimumInterested) {
                    setShowMinimumNotMetModal(true);
                  } else {
                    setShowCreateEventModal(true);
                  }
                }}
              >
                <Text style={[
                  styles.createEventButtonText,
                  idea.interestedUsers.length < idea.minimumInterested && styles.createEventButtonTextDisabled
                ]}>
                  {idea.interestedUsers.length < idea.minimumInterested
                    ? 'Create Event (minimum not met)'
                    : 'Create Event'}
                </Text>
              </TouchableOpacity>
            ) : (
            <TouchableOpacity
              style={[styles.confirmButton, isInterested && styles.confirmButtonActive]}
              onPress={() => {
                if (isInterested) {
                  setShowRemoveInterestModal(true);
                } else {
                  onInterest(idea.id);
                }
              }}
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
            )}
          </View>
        </View>
      </View>
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View />
        </TouchableOpacity>
        <View
          style={[
            styles.menuPopover,
            {
              position: 'absolute',
              left: menuPosition.x,
              top: menuPosition.y,
              zIndex: 1000,
              width: MENU_WIDTH,
            },
          ]}
        >
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); /* TODO: handle report */ }}>
            <View style={styles.menuItemRow}>
              <Ionicons name="flag-outline" size={18} color="#fff" style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Report</Text>
            </View>
          </TouchableOpacity>
          {isCreator && (
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); /* TODO: handle edit */ }}>
              <View style={styles.menuItemRow}>
                <Ionicons name="create-outline" size={18} color="#fff" style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>Edit</Text>
              </View>
            </TouchableOpacity>
          )}
          {isCreator && (
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); setShowDeleteModal(true); }}>
              <View style={styles.menuItemRow}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, { color: '#ef4444' }]}>Delete</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
      {showDeleteModal && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 2000 }]}> 
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' }} />
          <View style={styles.modalContent}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTitle}>Delete Idea?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this idea? This action cannot be undone.
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonDanger]} onPress={() => { setShowDeleteModal(false); /* TODO: handle delete idea */ }}>
                <Text style={[styles.modalButtonText, styles.modalButtonDangerText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* Create Event Confirmation Modal */}
      {showCreateEventModal && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 2000 }]}> 
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' }} />
          <View style={styles.modalContent}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTitle}>Create Event?</Text>
              <Text style={styles.modalMessage}>
                Once you finished creating the event, this idea will disappear.
                <Text style={{ fontWeight: 'bold' }}>
                </Text>
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowCreateEventModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#22c55e' }]}
                onPress={() => {
                  setShowCreateEventModal(false);
                  if (navigation) {
                    const serializableItem = serializeIdeaForNavigation(item);
                    navigation.navigate('CreateEvent', { idea: serializableItem });
                  }
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* Minimum Not Met Modal */}
      {showMinimumNotMetModal && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 2000 }]}> 
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' }} />
          <View style={styles.modalContent}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTitle}>Create Event?</Text>
              <Text style={styles.modalMessage}>
                <Text style={{ color: '#e66a6f'}}>
                  The minimum number of people was not met yet!{"\n\n"}
                </Text>
                Once you finished creating the event, this idea will disappear.
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowMinimumNotMetModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonBorderLeft]}
                onPress={() => {
                  setShowMinimumNotMetModal(false);
                  if (navigation) {
                    const serializableItem = serializeIdeaForNavigation(item);
                    navigation.navigate('CreateEvent', { idea: serializableItem });
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* Remove Interest Confirmation Modal */}
      {showRemoveInterestModal && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 2000 }]}> 
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)' }} />
          <View style={styles.modalContent}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTitle}>Remove Interest?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to remove your interest from this idea?
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowRemoveInterestModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonDanger]} onPress={() => { 
                setShowRemoveInterestModal(false); 
                onInterest(idea.id);
              }}>
                <Text style={[styles.modalButtonText, styles.modalButtonDangerText]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    paddingTop: 0,
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
    marginBottom: 180,
    marginTop: 16,
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
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  createEventButtonDisabled: {
    backgroundColor: 'rgba(15,15,15,0.7)', // neutral grey
    borderWidth: 1,
    borderColor: '#777',
  },
  createEventButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  createEventButtonTextDisabled: {
    color: '#aaa', // dark grey for disabled
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuPopover: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
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
  modalButtonBorderLeft: {
    borderLeftWidth: 1, borderLeftColor: '#555'
  },
}); 