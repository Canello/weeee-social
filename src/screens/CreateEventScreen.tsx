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
} from 'react-native';
// Remove DateTimePicker import
// import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { FeedItem, User } from '../types';

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
  const [selectedInvitees, setSelectedInvitees] = useState<string[]>([]);
  // Step 2: Date & Visibility
  const [date, setDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<'participants' | 'link'>('participants');
  // Step 3: Payment
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [price, setPrice] = useState<string>('');
  // Step 4: Description
  const [description, setDescription] = useState<string>(ideaData.description || '');

  // Validation
  const canProceed = () => {
    if (step === 0) return selectedInvitees.length > 0;
    if (step === 1) return !!date && !!visibility;
    if (step === 2) return !isPaid || (isPaid && parseFloat(price) > 0);
    if (step === 3) return description.trim().length > 0;
    return true;
  };

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
          <View style={{ flex: 1 }}>
            <Text style={styles.stepLabel}>Select participants to invite:</Text>
            <FlatList
              data={ideaData.interestedUsersPreview || []}
              keyExtractor={(item: User) => item.id}
              renderItem={({ item }: { item: User }) => (
                <TouchableOpacity
                  style={[
                    styles.inviteeRow,
                    selectedInvitees.includes(item.id) && styles.inviteeRowSelected,
                  ]}
                  onPress={() => handleInviteeToggle(item.id)}
                >
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{item.displayName[0]}</Text>
                  </View>
                  <Text style={styles.inviteeName}>{item.displayName}</Text>
                  {selectedInvitees.includes(item.id) && (
                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" style={{ marginLeft: 8 }} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        );
      case 1:
        return (
          <View style={{ flex: 1 }}>
            <Text style={styles.stepLabel}>Start Date & Time:</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="e.g. 2024-08-01 18:00"
              placeholderTextColor="#888"
            />
            <Text style={[styles.stepLabel, { marginTop: 24 }]}>Visibility:</Text>
            <View style={styles.visibilityRow}>
              <TouchableOpacity
                style={[
                  styles.visibilityOption,
                  visibility === 'participants' && styles.visibilityOptionSelected,
                ]}
                onPress={() => setVisibility('participants')}
              >
                <Text style={styles.visibilityOptionText}>Only participants</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.visibilityOption,
                  visibility === 'link' && styles.visibilityOptionSelected,
                ]}
                onPress={() => setVisibility('link')}
              >
                <Text style={styles.visibilityOptionText}>Anyone with link</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={{ flex: 1 }}>
            <View style={styles.paymentRow}>
              <Text style={styles.stepLabel}>Is paid?</Text>
              <Switch
                value={isPaid}
                onValueChange={setIsPaid}
                thumbColor={isPaid ? '#22c55e' : '#888'}
                trackColor={{ true: '#bbf7d0', false: '#444' }}
              />
            </View>
            <Text style={[styles.stepLabel, { marginTop: 24 }]}>Price:</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isPaid ? '#222' : '#18181b', color: isPaid ? '#fff' : '#888' }]}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              placeholderTextColor="#888"
              keyboardType="numeric"
              editable={isPaid}
            />
          </View>
        );
      case 3:
        return (
          <View style={{ flex: 1 }}>
            <Text style={styles.stepLabel}>Description:</Text>
            <TextInput
              style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
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
      {/* Header with image and title */}
      <ImageBackground
        source={{ uri: ideaData.imageUrl }}
        style={styles.headerImage}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={styles.headerOverlay} />
        <Text style={styles.headerTitle}>{ideaData.title}</Text>
      </ImageBackground>
      {/* Stepper indicator */}
      <View style={styles.stepperRow}>
        <Text style={styles.stepperText}>Step {step + 1} of 4</Text>
        <Text style={styles.stepperText}>{steps[step]}</Text>
      </View>
      {/* Step content */}
      <View style={{ flex: 1, padding: 20 }}>{renderStep()}</View>
      {/* Navigation buttons */}
      <View style={styles.navRow}>
        {step > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={() => setStep(step - 1)}>
            <Text style={styles.navButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 3 && (
          <TouchableOpacity
            style={[styles.navButton, !canProceed() && styles.navButtonDisabled]}
            onPress={() => canProceed() && setStep(step + 1)}
            disabled={!canProceed()}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
        {step === 3 && (
          <TouchableOpacity
            style={[styles.createButton, !canProceed() && styles.navButtonDisabled]}
            onPress={() => canProceed() && handleCreateEvent()}
            disabled={!canProceed()}
          >
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#23232b',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginTop: 8,
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
  createButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
    marginLeft: 10,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateEventScreen; 