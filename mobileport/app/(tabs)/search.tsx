import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Filter, Search as SearchIcon } from 'lucide-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const MOCK_CARDS = Array.from({ length: 50 }).map((_, i) => ({
  id: `card-${i}`,
  name: `Epic Card #${i}`,
  rarity: i % 3 === 0 ? 'Rare' : 'Common',
  image: `https://picsum.photos/seed/${i}/200/300`,
  price: (Math.random() * 100).toFixed(2),
}));

export default function SearchScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleOpenFilters = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Search Header */}
      <View className="px-4 py-4 flex-row items-center border-b border-gray-100">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
          <SearchIcon size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search cards..." 
            className="flex-1 ml-2 text-gray-800"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity onPress={handleOpenFilters} className="ml-3 p-2 bg-gray-100 rounded-xl">
          <Filter size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Optimized Card Grid */}
      <FlashList
        data={MOCK_CARDS}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        estimatedItemSize={250}
        contentContainerStyle={{ padding: 12 }}
      />

      {/* Faceted Filters Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetView className="p-6">
          <Text className="text-xl font-bold mb-4">Filter Products</Text>
          <FilterOption label="Rarity" values={['Common', 'Uncommon', 'Rare', 'Mythic']} />
          <FilterOption label="Game" values={['MTG', 'Pokemon', 'Yu-Gi-Oh']} />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

function CardItem({ item }: { item: any }) {
  return (
    <View className="flex-1 p-2">
      <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Image
          source={item.image}
          style={{ width: '100%', height: 180 }}
          contentFit="cover"
          transition={200}
        />
        <View className="p-3">
          <Text className="font-bold text-gray-800 mb-1" numberOfLines={1}>{item.name}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-green-600 font-bold">${item.price}</Text>
            <Text className="text-gray-400 text-xs">{item.rarity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function FilterOption({ label, values }: { label: string, values: string[] }) {
  return (
    <View className="mb-4">
      <Text className="text-gray-500 font-medium mb-2">{label}</Text>
      <View className="flex-row flex-wrap">
        {values.map(v => (
          <View key={v} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
            <Text className="text-gray-600 text-sm">{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
