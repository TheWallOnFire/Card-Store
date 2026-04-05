import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { BookOpen, TrendingUp, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="px-4 py-6">
        {/* Hero Section */}
        <View className="mb-8 bg-blue-600 p-6 rounded-3xl shadow-lg">
          <Text className="text-white text-3xl font-bold mb-2">TCG Marketplace</Text>
          <Text className="text-blue-100 text-lg">Your companion for on-the-go deck building and strategy.</Text>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-between mb-8">
            <QuickAction icon={<Zap color="#2563eb" />} label="Quick Add" onPress={() => router.push('/decks')} />
            <QuickAction icon={<TrendingUp color="#16a34a" />} label="Market" onPress={() => router.push('/search')} />
            <QuickAction icon={<BookOpen color="#9333ea" />} label="Guides" onPress={() => router.push('/blog')} />
        </View>

        {/* Featured Content */}
        <Text className="text-xl font-bold mb-4 text-gray-800">Latest Insights</Text>
        <MockInsightCard 
            title="Meta Report: April 2026" 
            author="Dave 'Magician' Smith" 
            category="Strategy"
        />
        <MockInsightCard 
            title="Standard Rotation Guide" 
            author="TCG Team" 
            category="News"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-white p-4 rounded-2xl shadow-sm items-center flex-1 mx-1 border border-gray-100">
      <View className="mb-2">{icon}</View>
      <Text className="text-gray-600 font-medium">{label}</Text>
    </TouchableOpacity>
  );
}

function MockInsightCard({ title, author, category }: { title: string; author: string; category: string }) {
  return (
    <View className="bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-blue-600 font-bold uppercase text-xs">{category}</Text>
        <Text className="text-gray-400 text-xs">2h ago</Text>
      </View>
      <Text className="text-lg font-bold text-gray-800 mb-1">{title}</Text>
      <Text className="text-gray-500 text-sm">By {author}</Text>
    </View>
  );
}
