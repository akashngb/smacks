import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const GEMINI_API_KEY = 'yeah nice try buddy ;)';

const SYSTEM_PROMPT = `You are MouthWatch Assistant, a friendly and knowledgeable dental health AI. 
Your role is to help patients understand their oral health, answer questions about dental conditions, 
and guide them on when to seek professional care. Always recommend seeing a dentist for serious concerns.
Never provide a definitive diagnosis. Keep responses concise, warm, and non-alarming.
If asked about anything unrelated to oral/dental health, politely redirect to your area of expertise.`;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your MouthWatch dental assistant. I can answer questions about oral health, explain your scan results, or help you understand what to expect at your next dentist visit. What's on your mind?",
    },
    {
      role: 'user',
      content: "My scan came back high risk. Should I be worried?",
    },
    {
      role: 'assistant',
      content: "I understand that's concerning to see. A high risk result means our screening detected some indicators worth taking seriously — but it's important to remember this is a screening tool, not a diagnosis. Many high risk flags turn out to be benign conditions like canker sores or minor irritation. That said, I'd strongly recommend booking a dental appointment within the next 1-2 weeks so a professional can take a proper look. Would you like me to help you find a clinic nearby?",
    },
    {
      role: 'user',
      content: "What are the main signs of oral cancer I should watch for?",
    },
    {
      role: 'assistant',
      content: "Great question to ask. The key warning signs include: a sore or ulcer that hasn't healed after 2-3 weeks, a red or white patch inside your mouth, unexplained bleeding, numbness or pain in your mouth or lips, and difficulty swallowing or chewing. If you notice any of these persisting, especially alongside your current scan result, that's a strong signal to see a dentist promptly. Early detection makes an enormous difference in outcomes.",
    },
    {
      role: 'user',
      content: "I smoke occasionally. Does that increase my risk?",
    },
    {
      role: 'assistant',
      content: "Yes — tobacco use is one of the strongest known risk factors for oral cancer, even occasional use. Combined with your current scan result, it's worth being extra vigilant. The good news is that risk decreases significantly after quitting. In the meantime, more frequent oral screenings like the ones MouthWatch provides are a great way to stay on top of any changes. Is there anything else you'd like to know about your results?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const conversationHistory = newMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: conversationHistory,
          }),
        }
      );

      const raw = await response.text();
      console.log('RAW GEMINI RESPONSE:', raw);
      const data = JSON.parse(raw);
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm having trouble connecting right now. Please try again.";
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.log('GEMINI FETCH ERROR:', err);
      setMessages([...newMessages, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0f1e', '#0d1f3c']} style={styles.gradient}>

        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.subtitle}>Powered by Gemini · Not a substitute for professional care</Text>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={90}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((msg, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {msg.role === 'assistant' && (
                  <View style={styles.assistantAvatar}>
                    <Feather name="cpu" size={12} color="#00c2ff" />
                  </View>
                )}
                <View
                  style={[
                    styles.bubbleContent,
                    msg.role === 'user' ? styles.userContent : styles.assistantContent,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      msg.role === 'user' ? styles.userText : styles.assistantText,
                    ]}
                  >
                    {msg.content}
                  </Text>
                </View>
              </View>
            ))}

            {loading && (
              <View style={[styles.bubble, styles.assistantBubble]}>
                <View style={styles.assistantAvatar}>
                  <Feather name="cpu" size={12} color="#00c2ff" />
                </View>
                <View style={styles.assistantContent}>
                  <ActivityIndicator size="small" color="#00c2ff" />
                </View>
              </View>
            )}

            <View style={{ height: 16 }} />
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your oral health..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={send}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={send}
              disabled={!input.trim() || loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={input.trim() ? ['#00c2ff', '#0072ff'] : ['#1a2a3a', '#1a2a3a']}
                style={styles.sendGradient}
              >
                <Feather name="send" size={18} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1e' },
  gradient: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  keyboardView: { flex: 1 },
  messageList: { flex: 1 },
  bubble: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  userBubble: { justifyContent: 'flex-end' },
  assistantBubble: { justifyContent: 'flex-start' },
  assistantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,194,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,194,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleContent: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 14,
  },
  userContent: {
    backgroundColor: '#0072ff',
    borderBottomRightRadius: 4,
  },
  assistantContent: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#ffffff' },
  assistantText: { color: 'rgba(255,255,255,0.85)' },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxHeight: 100,
  },
  sendButton: { borderRadius: 14, overflow: 'hidden' },
  sendButtonDisabled: { opacity: 0.4 },
  sendGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});