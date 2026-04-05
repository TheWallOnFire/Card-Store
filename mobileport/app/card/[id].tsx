import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Camera, ChevronLeft, Maximize, ShoppingCart, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function CardDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Add logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-2 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowScanner(!showScanner)} className="p-2 bg-gray-100 rounded-full">
            <Camera size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Camera Overlay Placeholder */}
        {showScanner && (
          <View className="mx-4 mt-4 h-64 bg-black rounded-3xl overflow-hidden justify-center items-center">
            <View className="border-2 border-white/50 w-48 h-48 rounded-2xl border-dashed items-center justify-center">
                <Text className="text-white/50 text-xs">Align card here for OCR</Text>
            </View>
            <View className="absolute bottom-4 left-4 right-4 items-center">
                <Text className="text-white text-xs font-bold uppercase tracking-widest">Scanning Active...</Text>
            </View>
          </View>
        )}

        {/* Card Image with Caching */}
        <View className="items-center py-8">
          <View className="shadow-2xl shadow-blue-200">
            <Image
              source={`https://picsum.photos/seed/${id}/400/600`}
              style={{ width: width * 0.7, height: width * 0.7 * 1.5, borderRadius: 20 }}
              contentFit="cover"
              transition={300}
            />
            <TouchableOpacity className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full">
                <Maximize size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View className="px-6">
          <Text className="text-gray-400 font-bold uppercase tracking-widest mb-1 text-xs">Super Rare • MTG</Text>
          <Text className="text-3xl font-bold text-gray-800 mb-4">Mythic Dragon Lord</Text>
          
          <View className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-6">
            <Text className="text-gray-500 leading-6">
                This powerful card allows you to discard your entire hand to deal massive damage to all opponents. 
                Legend says it's forged in the heart of a dying star.
            </Text>
          </View>

          <View className="flex-row items-center justify-between mb-10">
            <View>
              <Text className="text-gray-400 text-sm">Market Price</Text>
              <Text className="text-3xl font-bold text-green-600">$142.50</Text>
            </View>
            <TouchableOpacity 
              onPress={handleAddToCart}
              className="bg-blue-600 flex-row items-center px-6 py-4 rounded-2xl shadow-lg shadow-blue-300"
            >
              <ShoppingCart size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold ml-2">Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
