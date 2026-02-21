import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const QUESTIONS = [
  {
    id: 'tobacco',
    question: 'How often do you use tobacco products?',
    subtitle: 'Cigarettes, cigars, chewing tobacco, vaping',
    options: [
      { label: 'Never', value: 'none', icon: 'check-circle' },
      { label: 'Occasionally', value: 'occasional', icon: 'clock' },
      { label: 'Daily', value: 'daily', icon: 'alert-circle' },
    ],
  },
  {
    id: 'alcohol',
    question: 'How would you describe your alcohol consumption?',
    subtitle: 'Heavy drinking is a known risk factor',
    options: [
      { label: 'None', value: 'none', icon: 'check-circle' },
      { label: 'Occasional', value: 'occasional', icon: 'clock' },
      { label: 'Heavy', value: 'heavy', icon: 'alert-circle' },
    ],
  },
  {
    id: 'hpv',
    question: 'Have you been diagnosed with HPV?',
    subtitle: 'HPV is linked to oropharyngeal cancers',
    options: [
      { label: 'No', value: 'no', icon: 'check-circle' },
      { label: 'Yes', value: 'yes', icon: 'alert-circle' },
      { label: 'Unknown', value: 'unknown', icon: 'help-circle' },
    ],
  },
  {
    id: 'prior_cancer',
    question: 'Any prior history of oral cancer?',
    subtitle: 'Previous cancer increases recurrence risk',
    options: [
      { label: 'No', value: 'no', icon: 'check-circle' },
      { label: 'Yes', value: 'yes', icon: 'alert-circle' },
    ],
  },
  {
    id: 'symptoms',
    question: 'Are you experiencing any of these symptoms?',
    subtitle: 'Select all that apply',
    options: [
      { label: 'Pain or tenderness', value: 'pain', icon: 'activity' },
      { label: 'Bleeding', value: 'bleeding', icon: 'droplet' },
      { label: 'Numbness', value: 'numbness', icon: 'zap' },
      { label: 'Sore that won\'t heal', value: 'sore', icon: 'alert-triangle' },
      { label: 'None of these', value: 'none', icon: 'check-circle' },
    ],
    multiSelect: true,
  },
];

export default function IntakeFormScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const question = QUESTIONS[step];
  const isMulti = question.multiSelect;
  const currentAnswer = answers[question.id];

  const handleSelect = (value: string) => {
    if (isMulti) {
      const current: string[] = currentAnswer || [];
      if (value === 'none') {
        setAnswers({ ...answers, [question.id]: ['none'] });
      } else {
        const filtered = current.filter((v) => v !== 'none');
        const updated = filtered.includes(value)
          ? filtered.filter((v) => v !== value)
          : [...filtered, value];
        setAnswers({ ...answers, [question.id]: updated });
      }
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const isSelected = (value: string) => {
    if (isMulti) return (currentAnswer || []).includes(value);
    return currentAnswer === value;
  };

  const canProceed = isMulti
    ? (currentAnswer || []).length > 0
    : !!currentAnswer;

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      navigation.navigate('Camera', { riskFactors: answers });
    }
  };

  const progress = (step + 1) / QUESTIONS.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0f1e', '#0d1f3c']} style={styles.gradient}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Risk Assessment</Text>
          <Text style={styles.stepCounter}>{step + 1}/{QUESTIONS.length}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <Text style={styles.question}>{question.question}</Text>
          <Text style={styles.subtitle}>{question.subtitle}</Text>

          <View style={styles.options}>
            {question.options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.option, isSelected(opt.value) && styles.optionSelected]}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.8}
              >
                <Feather
                  name={opt.icon as any}
                  size={20}
                  color={isSelected(opt.value) ? '#00c2ff' : 'rgba(255,255,255,0.4)'}
                />
                <Text style={[styles.optionText, isSelected(opt.value) && styles.optionTextSelected]}>
                  {opt.label}
                </Text>
                {isSelected(opt.value) && (
                  <Feather name="check" size={16} color="#00c2ff" style={styles.checkmark} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.nextButton, !canProceed && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={canProceed ? ['#00c2ff', '#0072ff'] : ['#1a2a3a', '#1a2a3a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {step < QUESTIONS.length - 1 ? 'Next →' : 'Continue to Scan →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  gradient: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  stepCounter: { fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 36,
  },
  progressFill: {
    height: 3,
    backgroundColor: '#00c2ff',
    borderRadius: 2,
  },
  scroll: { flex: 1 },
  question: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 32,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 32,
    lineHeight: 20,
  },
  options: { gap: 12, paddingBottom: 32 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 14,
  },
  optionSelected: {
    backgroundColor: 'rgba(0,194,255,0.1)',
    borderColor: 'rgba(0,194,255,0.4)',
  },
  optionText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    flex: 1,
    fontWeight: '500',
  },
  optionTextSelected: { color: '#ffffff', fontWeight: '600' },
  checkmark: { marginLeft: 'auto' },
  nextButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 24, marginTop: 8 },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  nextButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});