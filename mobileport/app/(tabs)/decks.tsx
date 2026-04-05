import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clipboard, Plus, Trash2, Copy, Zap } from 'lucide-react-native';
import * as ClipboardExpo from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

interface Deck {
  id: string;
  name: string;
  count: number;
  game: string;
}

export default function DecksScreen() {
  const [decks, setDecks] = useState<Deck[]>([
    { id: '1', name: 'Standard Meta Brew', count: 60, game: 'MTG' },
    { id: '2', name: 'Casual Fun Deck', count: 40, game: 'Pokemon' },
  ]);
  const [hasClipboardData, setHasClipboardData] = useState(false);

  useEffect(() => {
    checkClipboard();
  }, []);

  const checkClipboard = async () => {
    const text = await ClipboardExpo.getStringAsync();
    // Simple regex for [gameid]_[cardid]_[count]
    if (/^[a-zA-Z0-9]+_[a-fA-F0-9-]+_\d+$/.test(text.trim())) {
      setHasClipboardData(true);
    }
  };

  const handlePaste = async () => {
    const text = await ClipboardExpo.getStringAsync();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Bulk Import Detected", `Format detected: ${text}. Processing...`);
    setHasClipboardData(false);
  };

  const handleDelete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDecks(prev => prev.filter(d => d.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        {hasClipboardData && (
          <TouchableOpacity 
            onPress={handlePaste}
            className="bg-blue-50 p-4 rounded-2xl mb-6 flex-row items-center border border-blue-100 shadow-sm"
          >
            <View className="bg-blue-500 p-2 rounded-full mr-3">
              <Zap size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-800 font-bold">Import from Clipboard</Text>
              <Text className="text-blue-600 text-xs">Deck string detected on your clipboard.</Text>
            </View>
            <Copy size={20} color="#3b82f6" />
          </TouchableOpacity>
        )}

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">Your Decks</Text>
          <TouchableOpacity className="bg-blue-600 p-2 rounded-full">
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        {decks.map(deck => (
          <View key={deck.id} className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm flex-row items-center">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-blue-600 font-bold text-xs mr-2">{deck.game}</Text>
                <Text className="text-gray-400 text-xs">{deck.count} Cards</Text>
              </View>
              <Text className="text-lg font-bold text-gray-800">{deck.name}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(deck.id)} className="p-3">
              <Trash2 size={24} color="#f87171" />
            </TouchableOpacity>
          </View>
        ))}

        {decks.length === 0 && (
          <View className="items-center py-20">
            <Library size={64} color="#e5e7eb" />
            <Text className="text-gray-400 mt-4 text-lg">No decks found. Build one today!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
