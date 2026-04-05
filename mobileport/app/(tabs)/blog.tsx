import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Clock, Tag } from 'lucide-react-native';

const MOCK_STRATEGIES = [
  { id: '1', title: 'Top 5 Meta Decks for April 2026', author: 'TCG Pro', category: 'Strategy' },
  { id: '2', title: 'How to Counter Red Burn Decks', author: 'Deck Master', category: 'Guide' },
  { id: '3', title: 'Understanding Standard Rotation', author: 'Admin', category: 'News' },
];

export default function BlogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800">Strategy Hub</Text>
            <Text className="text-gray-500 mt-1">Master the game with our expert guides.</Text>
        </View>

        {MOCK_STRATEGIES.map(post => (
          <View key={post.id} className="mb-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 px-3 py-1 rounded-full mr-3">
                <Text className="text-blue-600 text-xs font-bold uppercase">{post.category}</Text>
              </View>
              <Clock size={14} color="#9ca3af" />
              <Text className="text-gray-400 text-xs ml-1">10 min read</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">{post.title}</Text>
            <Text className="text-gray-500 mb-4">Learn the secrets of the meta from the top players in the industry.</Text>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-500 mr-2" />
              <Text className="text-gray-600 font-medium">By {post.author}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
