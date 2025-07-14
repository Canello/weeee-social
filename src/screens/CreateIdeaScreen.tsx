import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

interface CreateIdeaScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export const CreateIdeaScreen: React.FC<CreateIdeaScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [minimumInterested, setMinimumInterested] = useState('');
  const [expirationOption, setExpirationOption] = useState<'24h' | '3days' | '1week'>('3days');
  const [visibilityOption, setVisibilityOption] = useState<'followers' | 'followers-share' | 'public'>('followers');
  const [location, setLocation] = useState('');
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setMinimumInterested('');
    setExpirationOption('3days');
    setVisibilityOption('followers');
    setLocation('');
    setCurrentStep(1);
  };

  const validateAllFields = () => {
    const errors = [];

    if (!title.trim()) {
      errors.push('Title is required');
    }

    if (!description.trim()) {
      errors.push('Description is required');
    }

    if (!minimumInterested) {
      errors.push('Minimum interested is required');
    } else {
      const minInterested = parseInt(minimumInterested);
      if (isNaN(minInterested) || minInterested < 1) {
        errors.push('Minimum interested must be a positive number');
      }
    }

    if (!expirationOption) {
      errors.push('Expiration time is required');
    }

    if (!visibilityOption) {
      errors.push('Visibility option is required');
    }

    if (!imageUrl.trim()) {
      errors.push('Image URL is required');
    }

    return errors;
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const errors = validateAllFields();
    
    if (errors.length > 0) {
      Alert.alert(
        'Missing or Invalid Information',
        `Please fix the following issues:\n\n${errors.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // In a real app, this would send to API
    Alert.alert(
      'Success!',
      `Your idea has been shared with your followers!`,
      [
        {
          text: 'OK',
          onPress: () => {
            clearForm();
            // Navigate to Feed tab to show the new idea
            navigation.navigate('Feed');
          },
        },
      ]
    );
  };

  const handleBackPress = () => {
    setShowDiscardModal(true);
  };
  const handleCancelDiscard = () => setShowDiscardModal(false);
  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    clearForm();
    navigation.goBack();
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3, 4].map((step) => (
          <View key={step} style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              currentStep >= step ? styles.stepCircleActive : styles.stepCircleInactive
            ]}>
              <Text style={[
                styles.stepNumber,
                currentStep >= step ? styles.stepNumberActive : styles.stepNumberInactive
              ]}>
                {step}
              </Text>
            </View>
            {step < 4 && (
              <View style={[
                styles.stepLine,
                currentStep > step ? styles.stepLineActive : styles.stepLineInactive
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="What's your idea?"
                placeholderTextColor="#999"
                maxLength={100}
              />
              <Text style={styles.characterCount}>{title.length}/100</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Who can see the idea? *</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setVisibilityOption('followers')}
                >
                  <View style={styles.radioButton}>
                    {visibilityOption === 'followers' && <View style={styles.radioButtonSelected} />}
                  </View>
                  <View style={styles.radioTextContainer}>
                    <Text style={styles.radioLabel}>Followers</Text>
                    <Text style={styles.radioDescription}>Only followers.</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setVisibilityOption('followers-share')}
                >
                  <View style={styles.radioButton}>
                    {visibilityOption === 'followers-share' && <View style={styles.radioButtonSelected} />}
                  </View>
                  <View style={styles.radioTextContainer}>
                    <Text style={styles.radioLabel}>Followers can share</Text>
                    <Text style={styles.radioDescription}>Only followers and people they share it with.</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => setVisibilityOption('public')}
                >
                  <View style={styles.radioButton}>
                    {visibilityOption === 'public' && <View style={styles.radioButtonSelected} />}
                  </View>
                  <View style={styles.radioTextContainer}>
                    <Text style={styles.radioLabel}>Public</Text>
                    <Text style={styles.radioDescription}>Everyone.</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={[styles.inputGroup, { marginBottom: 36 }]}> 
              <Text style={[styles.label, { marginBottom: 2 }]}>Expires in *</Text>
              <Text style={[styles.helpText, { marginTop: 2 }]}>
                How long people have to show interest in your idea before it disappears.
              </Text>
              <View style={styles.tagContainer}>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    expirationOption === '24h' && styles.tagSelected
                  ]}
                  onPress={() => setExpirationOption('24h')}
                >
                  <Text style={[
                    styles.tagText,
                    expirationOption === '24h' && styles.tagTextSelected
                  ]}>
                    24h
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    expirationOption === '3days' && styles.tagSelected
                  ]}
                  onPress={() => setExpirationOption('3days')}
                >
                  <Text style={[
                    styles.tagText,
                    expirationOption === '3days' && styles.tagTextSelected
                  ]}>
                    3 days
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    expirationOption === '1week' && styles.tagSelected
                  ]}
                  onPress={() => setExpirationOption('1week')}
                >
                  <Text style={[
                    styles.tagText,
                    expirationOption === '1week' && styles.tagTextSelected
                  ]}>
                    1 week
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.inputGroup, { marginBottom: 36 }]}> 
              <Text style={[styles.label, { marginBottom: 2 }]}>Minimum Interested *</Text>
              <Text style={[styles.helpText, { marginTop: 2 }]}>
                Minimum number of people needed for the idea to happen.
              </Text>
              <TextInput
                style={styles.input}
                value={minimumInterested}
                onChangeText={setMinimumInterested}
                placeholder="e.g., 10"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location (optional)</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., New York, NY"
                placeholderTextColor="#999"
              />
              <Text style={styles.helpText}>
                Adding a location helps show your activity to users nearby. This is important if you want your idea to be discovered by people in your area.
              </Text>
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell us more about your idea..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={8}
                maxLength={5000}
              />
              <Text style={styles.characterCount}>{description.length}/5000</Text>
            </View>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Image URL *</Text>
              <TextInput
                style={styles.input}
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { backgroundColor: '#181a20' }]}> 
          <View style={styles.headerContent}>
            <TouchableOpacity 
              onPress={handleBackPress} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Text style={styles.headerTitleCentered}>Create Idea</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
          {renderStepIndicator()}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity disabled={currentStep === 1} onPress={prevStep} style={[styles.secondaryButton, currentStep === 1 && styles.secondaryButtonDisabled]}>
            <Text style={[styles.secondaryButtonText, currentStep === 1 && styles.secondaryButtonTextDisabled]}>Back</Text>
          </TouchableOpacity>
          {currentStep < 4 ? (
            <TouchableOpacity 
              onPress={nextStep} 
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={handleSubmit} 
              style={styles.createButton}
            >
              <Text style={styles.primaryButtonText}>Create</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
      <Modal
        visible={showDiscardModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDiscard}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            experimentalBlurMethod='dimezisBlurView'
            intensity={15}
            tint='dark'
            style={styles.overlayTint}
            pointerEvents="none"
          />
          <View style={styles.modalContent}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalTitle}>Discard Idea?</Text>
              <Text style={styles.modalMessage}>
                If you leave now, you will lose all the information you have entered so far.
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancelDiscard}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonDanger]} onPress={handleConfirmDiscard}>
                <Text style={[styles.modalButtonText, styles.modalButtonDangerText]}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a20',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitleCentered: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#fff',
  },
  stepCircleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: '#23242a',
  },
  stepNumberInactive: {
    color: '#fff',
  },
  stepLine: {
    width: 25,
    height: 2,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#fff',
  },
  stepLineInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  stepContent: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
    lineHeight: 20,
  },
  titleInput: {
    backgroundColor: '#23242a',
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 4,
  },
  descriptionInput: {
    backgroundColor: '#23242a',
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    marginBottom: 4,
    minHeight: 200,
    height: '85%',
    textAlignVertical: 'top',
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
  },
  characterCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
    alignSelf: 'flex-end',
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
  tagContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#23242a',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  tagSelected: {
    backgroundColor: '#e6f0fa', // very light blue
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: '#23242a', // dark text for contrast on light blue
    fontWeight: '700',
  },
  secondaryButtonDisabled: {
    opacity: 0.4,
  },
  secondaryButtonTextDisabled: {
    color: '#aaa',
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
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  radioDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
  },
}); 