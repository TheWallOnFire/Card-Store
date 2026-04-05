import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Layout, Settings, LogOut, Bell, Shield, CreditCard } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        {/* Profile Header */}
        <View className="items-center mt-6 mb-10">
          <View className="w-24 h-24 bg-gray-200 rounded-full mb-4 items-center justify-center border-4 border-white shadow-lg shadow-gray-200">
            <Text className="text-gray-400 text-3xl font-bold">JD</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">John Doe</Text>
          <Text className="text-gray-400">john.doe@example.com</Text>
          <View className="bg-blue-100 px-4 py-1 rounded-full mt-3">
            <Text className="text-blue-600 font-bold text-xs uppercase">Pro Collector</Text>
          </View>
        </View>

        {/* Settings Groups */}
        <SettingsGroup label="Account Settings">
          <SettingsItem icon={<CreditCard size={20} color="#374151" />} label="Payment Methods" />
          <SettingsItem icon={<Shield size={20} color="#374151" />} label="Security" />
          <SettingsItem icon={<Bell size={20} color="#374151" />} label="Notifications" />
        </SettingsGroup>

        <SettingsGroup label="Preferences">
          <SettingsItem icon={<Layout size={20} color="#374151" />} label="Appearance" />
          <SettingsItem icon={<Settings size={20} color="#374151" />} label="App Settings" />
        </SettingsGroup>

        <TouchableOpacity className="mt-6 flex-row items-center justify-center p-4 bg-red-50 rounded-2xl border border-red-100">
          <LogOut size={20} color="#ef4444" className="mr-2" />
          <Text className="text-red-500 font-bold ml-2">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-gray-400 font-bold text-xs uppercase px-2 mb-3">{label}</Text>
      <View className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
        {children}
      </View>
    </View>
  );
}

function SettingsItem({ icon, label }: { icon: any; label: string }) {
  return (
    <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100 last:border-b-0 active:bg-gray-100">
      <View className="mr-4">{icon}</View>
      <Text className="flex-1 text-gray-800 font-medium">{label}</Text>
    </TouchableOpacity>
  );
}
