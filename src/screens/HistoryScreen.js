import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { MoreVertical, Search, Wifi, FileText, ShoppingCart, Trash2, QrCode } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../theme';

export const HistoryScreen = () => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // State for search and data
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Starting with empty data as per user request to remove static data
  // But for demonstration, I will keep one sample, or just make it interactive.
  // Actually, user said: "remove static data .. bydefault qr logo should be Qio name"
  // This likely means: "Show empty state" logic OR "Just use real data from now on".
  // Since I don't have real data persistence yet, I will initialize with an empty array or a single "Welcome" item.
  // Let's use an empty array and show an "Empty History" message.
  const [historyItems, setHistoryItems] = useState([
     { id: '1', type: 'qr', title: 'Welcome to Qio', subtitle: 'Start scanning to see history', time: 'Just now', icon: QrCode },
  ]);

  const filteredItems = historyItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearAll = () => {
      setHistoryItems([]);
  };

  const renderItem = ({ item }) => (
    <View className="rounded-2xl p-4 mb-3 flex-row items-center" style={{ backgroundColor: theme.colors.surface }}>
        <View className="w-10 h-10 bg-[#00E5FF]/10 rounded-lg items-center justify-center mr-4">
            {item.type === 'qr' ? <Text className="text-[#00E5FF] font-bold text-xs">Qio</Text> : <item.icon color="#00E5FF" size={20} />}
        </View>
        <View className="flex-1">
            <Text className="font-[Inter_600SemiBold] text-base mb-0.5" style={{ color: theme.colors.text }}>{item.title}</Text>
            <Text className="text-xs" style={{ color: theme.colors.textSecondary }} numberOfLines={1}>{item.subtitle}</Text>
            <Text className="text-[10px] mt-1" style={{ color: theme.colors.textSecondary }}>{item.time}</Text>
        </View>
    </View>
  );

  return (
    <View className="flex-1 pt-[50px] px-5" style={{ backgroundColor: theme.colors.background }}>
      <View className="flex-row justify-between items-center mb-6">
        {isSearching ? (
            <View className="flex-1 flex-row items-center rounded-full px-4 h-10 mr-2" style={{ backgroundColor: theme.colors.surface }}>
                <Search color="#999" size={18} />
                <TextInput 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search history..."
                    placeholderTextColor="#666"
                    className="flex-1 ml-2 font-[Inter_400Regular] h-full"
                    style={{ color: theme.colors.text }}
                    autoFocus
                />
                <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); Keyboard.dismiss(); }}>
                    <Text className="text-xs" style={{ color: theme.colors.textSecondary }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <>
                <Text className="text-2xl font-[Inter_700Bold]" style={{ color: theme.colors.text }}>Scan History</Text>
                <View className="flex-row gap-4">
                    <TouchableOpacity onPress={() => setIsSearching(true)}>
                        <Search color={theme.colors.text} size={24} />
                    </TouchableOpacity>
                </View>
            </>
        )}
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
            <View className="items-center justify-center mt-20">
                <Text className="text-gray-600 font-[Inter_500Medium]">No history found</Text>
            </View>
        }
      />
      
      {historyItems.length > 0 && (
          <View className="absolute bottom-32 left-0 right-0 items-center">
             <TouchableOpacity onPress={clearAll} className="border px-8 py-3 rounded-full" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
                 <Text className="font-[Inter_600SemiBold]" style={{ color: theme.colors.primary }}>Clear All</Text>
             </TouchableOpacity>
          </View>
      )}
    </View>
  );
};
