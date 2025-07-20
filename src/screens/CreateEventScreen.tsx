import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Switch,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
// Remove DateTimePicker import
// import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { FeedItem, User } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const steps = [
  'Invite Participants',
  'Event Details',
  'Payment',
  'Description',
];

type CreateEventScreenProps = StackScreenProps<any> & {
  route: { params: { idea: FeedItem } };
};

/**
 * @param {{ route: any, navigation: any }} props
 */
function CreateEventScreen({ route, navigation }: { route: any; navigation: any }) {
  const { idea } = route.params;
  // Use idea.idea for the actual Idea object
  const ideaData = idea.idea;
  const [step, setStep] = useState<number>(0);
  // Step 1: Invitees
  const [selectedInvitees, setSelectedInvitees] = useState<string[]>(ideaData.interestedUsersPreview.map((user: User) => user.id));
  // Step 2: Date & Visibility
  const [date, setDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  // Set default visibility tags based on ideaData.visibilityOption
  let defaultVisibility: string[] = ['invited', 'followers'];
  switch (ideaData.visibilityOption) {
    case 'followers-share':
      defaultVisibility = ['invited', 'followers', 'link'];
      break;
    case 'public':
      defaultVisibility = ['invited', 'followers', 'link', 'nearby'];
      break;
    // 'followers' is the default
  }
  const [visibility, setVisibility] = useState<string[]>(defaultVisibility);
  // Step 3: Payment
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [price, setPrice] = useState<string>('');
  // Step 4: Description
  const [description, setDescription] = useState<string>(ideaData.description || '');
  // Initialize tickets with 'Standard Ticket' as the first name
  const [tickets, setTickets] = useState([{ name: 'Standard Ticket', price: '', nameError: '', priceError: '' }]);

  // Validation
  const canProceed = () => {
    if (step === 0) return selectedInvitees.length > 0;
    if (step === 1) return !!date && !!visibility;
    if (step === 2) return !isPaid || (isPaid && parseFloat(price) > 0);
    if (step === 3) return description.trim().length > 0;
    return true;
  };

  // Validation helper
  function validateTickets(tickets: { name: string; price: string; nameError?: string; priceError?: string }[]): { name: string; price: string; nameError: string; priceError: string }[] {
    const names = tickets.map((t: { name: string }) => t.name.trim());
    const nameCounts = names.reduce((acc: Record<string, number>, n: string) => { acc[n] = (acc[n] || 0) + 1; return acc; }, {});
    return tickets.map((ticket: { name: string; price: string }, idx: number) => {
      let nameError = '';
      let priceError = '';
      if (!ticket.name.trim()) nameError = 'Required';
      else if (nameCounts[ticket.name.trim()] > 1) nameError = 'Duplicate';
      if (isNaN(Number(ticket.price)) || Number(ticket.price) < 0) priceError = 'Invalid';
      return { ...ticket, nameError, priceError };
    });
  }
  const validatedTickets = validateTickets(tickets);
  const ticketsValid = validatedTickets.every((t: { nameError: string; priceError: string }) => !t.nameError && !t.priceError);

  const handleInviteeToggle = (userId: string) => {
    setSelectedInvitees((prev: string[]) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateEvent = () => {
    // TODO: Implement event creation logic
    navigation.goBack();
  };

  // Step content renderers
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <FlatList
              data={ideaData.interestedUsersPreview}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isInvited = selectedInvitees.includes(item.id);
                return (
                  <View style={styles.userItem}>
                    <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userDisplayName}>{item.displayName}</Text>
                      <Text style={styles.userUsername}>@{item.username}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.inviteButton,
                        isInvited && styles.inviteButtonActive,
                      ]}
                      onPress={() => {
                        if (isInvited) {
                          setSelectedInvitees(selectedInvitees.filter(id => id !== item.id));
                        } else {
                          setSelectedInvitees([...selectedInvitees, item.id]);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      {isInvited ? (
                        <>
                          <Ionicons name="checkmark" size={16} color="#333" style={{ marginRight: 4 }} />
                          <Text style={[styles.inviteButtonText, { color: '#333' }]}>Invited</Text>
                        </>
                      ) : (
                        <>
                          <Ionicons name="close" size={16} color="#aaa" style={{ marginRight: 4 }} />
                          <Text style={styles.inviteButtonText}>Not Invited</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        );
      case 1:
        return (
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={[styles.stepLabel, { marginBottom: 4 }]}>Start Date & Time:</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="e.g. 2024-08-01 18:00"
              placeholderTextColor="#888"
            />
            <View style={[styles.inputGroup, { marginTop: 24 }]}>
              <Text style={styles.label}>Who can see the event?</Text>
              <View style={styles.tagContainer}>
                {[
                  { key: 'invited', label: 'Invited people' },
                  { key: 'followers', label: 'Followers' },
                  { key: 'link', label: 'Anyone with link' },
                  { key: 'nearby', label: 'People nearby' },
                ].map(option => {
                  const selected = visibility.includes(option.key);
                  const isInvited = option.key === 'invited';
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.tag,
                        !selected && styles.tagUnselected,
                        selected && (isInvited ? styles.tagSelectedActive : styles.tagSelected),
                      ]}
                      onPress={() => {
                        if (!isInvited) {
                          setVisibility(v =>
                            v.includes(option.key)
                              ? v.filter(val => val !== option.key)
                              : [...v, option.key]
                          );
                        }
                      }}
                      activeOpacity={isInvited ? 1 : 0.7}
                      disabled={isInvited}
                    >
                      <View style={styles.tagContent}>
                        {selected ? (
                          <Ionicons name="checkmark" size={16} color={"#333"} style={{ marginRight: 4 }} />
                        ) : (
                          <Ionicons name="close" size={16} color="#aaa" style={{ marginRight: 4 }} />
                        )}
                        <Text style={[
                          styles.tagText,
                          selected && (isInvited ? styles.tagTextSelectedActive : styles.tagTextSelected),
                        ]}>
                          {option.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <View style={styles.paymentRow}>
              <Text style={styles.stepLabel}>Is paid?</Text>
              <Switch
                value={isPaid}
                onValueChange={setIsPaid}
                thumbColor={isPaid ? '#22c55e' : '#888'}
                trackColor={{ true: '#bbf7d0', false: '#444' }}
              />
            </View>
            {isPaid && (
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
                {validatedTickets.map((ticket: { name: string; price: string; nameError: string; priceError: string }, idx: number) => (
                  <View key={idx} style={styles.ticketCard}>
                    <View style={styles.ticketRow}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <TextInput
                          style={[styles.input, styles.ticketNameInput, ticket.nameError && styles.inputError]}
                          value={ticket.name}
                          onChangeText={text => {
                            const newTickets = [...tickets];
                            newTickets[idx].name = text;
                            setTickets(newTickets);
                          }}
                          placeholder="Ticket name"
                          placeholderTextColor="#888"
                        />
                        <Text style={styles.inputErrorText}>
                          {ticket.nameError ? ticket.nameError : ' '}
                        </Text>
                      </View>
                      <View style={styles.ticketPriceInputContainer}>
                        <TextInput
                          style={[styles.input, styles.ticketPriceInput, ticket.priceError && styles.inputError]}
                          value={formatBRL(ticket.price)}
                          onChangeText={text => {
                            // Only keep digits, update the raw value in state
                            const digits = text.replace(/\D/g, '');
                            const newTickets = [...tickets];
                            newTickets[idx].price = digits;
                            setTickets(newTickets);
                          }}
                          placeholder="Price"
                          placeholderTextColor="#888"
                          keyboardType="numeric"
                        />
                        <Text style={styles.inputErrorText}>
                          {ticket.priceError ? ticket.priceError : ' '}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.trashButton,
                          tickets.length === 1 && styles.trashButtonDisabled,
                        ]}
                        onPress={() => tickets.length > 1 && setTickets(tickets.filter((_, i) => i !== idx))}
                        disabled={tickets.length === 1}
                      >
                        <Ionicons name="trash" size={20} color={tickets.length === 1 ? '#555' : '#999'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addTicketButton}
                  onPress={() => setTickets([
                    ...tickets,
                    { name: '', price: '', nameError: '', priceError: '' }
                  ])}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        );
      case 3:
        return (
          <View style={{ flex: 1, padding: 20 }}>
            <Text style={styles.stepLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#18181b' }}>
      {/* Header with back arrow, image, and title */}
      <View style={{ position: 'relative' }}>
        <ImageBackground
          source={{ uri: ideaData.imageUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay} />
          {/* Back Arrow */}
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" style={{ textShadowColor: '#000', textShadowRadius: 4 }} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{ideaData.title}</Text>
          </View>
        </ImageBackground>
      </View>
      {/* Stepper indicator */}
      <View style={styles.stepperRow}>
        <Text style={styles.stepperText}>Step {step + 1} of 4</Text>
        <Text style={styles.stepperText}>{steps[step]}</Text>
      </View>
      {/* Step content */}
      <View style={{ flex: 1}}>{renderStep()}</View>
      {/* Navigation buttons */}
      <SafeAreaView edges={['bottom']}>
        <View style={styles.footer}>
          <TouchableOpacity
            disabled={step === 0}
            onPress={() => setStep(step - 1)}
            style={[styles.secondaryButton, step === 0 && styles.secondaryButtonDisabled]}
          >
            <Text style={[styles.secondaryButtonText, step === 0 && styles.secondaryButtonTextDisabled]}>Back</Text>
          </TouchableOpacity>
          {step < steps.length - 1 ? (
            <TouchableOpacity
              onPress={() => setStep(step + 1)}
              style={styles.primaryButton}
              disabled={isPaid && !ticketsValid}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleCreateEvent}
              style={styles.createButton}
              disabled={isPaid && !ticketsValid}
            >
              <Text style={styles.primaryButtonText}>Create Event</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

function formatBRL(value: string) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  // Parse to integer (cents)
  const intVal = parseInt(digits || '0', 10);
  // Format as R$ 0,00
  const cents = (intVal / 100).toFixed(2).replace('.', ',');
  return `R$ ${cents}`;
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 160,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerTitleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  backArrow: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#23232b',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  stepperText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inviteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#23232b',
    marginBottom: 10,
  },
  inviteeRowSelected: {
    borderColor: '#22c55e',
    borderWidth: 2,
    backgroundColor: '#1e293b',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inviteeName: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  datePickerText: {
    color: '#fff',
    fontSize: 15,
  },
  visibilityRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  visibilityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#23232b',
    marginRight: 8,
    alignItems: 'center',
  },
  visibilityOptionSelected: {
    backgroundColor: '#22c55e',
  },
  visibilityOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#23242a',
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 4,
    height: 40,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#23242a',
    height: 56,
  },
  primaryButton: {
    backgroundColor: 'rgba(37, 174, 248, 1)', // vibrant blue
    flex: 0.6,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#22c55e', // vibrant green
    flex: 0.6,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    marginRight: 0,
    flex: 0.4,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonDisabled: {
    opacity: 0.4,
  },
  secondaryButtonTextDisabled: {
    color: '#aaa',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#18181b',
  },
  navButton: {
    backgroundColor: '#23232b',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    marginLeft: 10,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  inviteButton: {
    backgroundColor: '#18181b',
    borderRadius: 7,
    paddingHorizontal: 17,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#777',
  },
  inviteButtonActive: {
    backgroundColor: '#90e0ac',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#90e0ac',
  },
  inviteButtonText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  radioContainer: {
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  radioTextContainer: {
    flex: 1,
  },
  radioLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  radioDescription: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  inputGroup: {
    marginTop: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 16,
  },
  tag: {
    backgroundColor: '#23242a',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagUnselected: {
    borderWidth: 1,
    borderColor: '#777',
  },
  tagSelected: {
    backgroundColor: '#90e0ac',
    borderColor: '#90e0ac',
    borderWidth: 1,
  },
  tagSelectedActive: {
    backgroundColor: '#C5E3F6',
    borderColor: '#C5E3F6',
    borderWidth: 1,
  },
  tagText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: '#333',//'#1e6b3a',
    fontWeight: '700',
  },
  tagTextSelectedActive: {
    color: '#333',
    fontWeight: '700',
  },
  ticketCard: {
    backgroundColor: '#23242a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#181a20',
    height: 100,
  },
  addTicketButton: {
    backgroundColor: '#23242a',
    borderRadius: 8,
    width: 60,
    height: 60,
    marginTop: 12,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  descriptionInput: {
    height: 220,
    textAlignVertical: 'top'
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  inputErrorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ticketNameInput: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#181a20'
  },
  ticketPriceInputContainer: {
    width: 100
  },
  ticketPriceInput: {
    width: 100,
    backgroundColor: '#181a20'
  },
  trashButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181a20',
    borderRadius: 7,
    width: 40,
    height: 40,
    marginLeft: 12,
    marginTop: 6,
  },
  trashButtonDisabled: {
    backgroundColor: '#23242a',
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default CreateEventScreen; 