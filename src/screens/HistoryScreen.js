import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Keyboard, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Search, Wifi, FileText, Trash2, QrCode, ExternalLink, AlignLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getHistory, clearHistory, removeFromHistory } from '../utils/storage';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTheme } from '../theme';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const HistoryScreen = () => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // State for search and data
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);

  const loadHistory = async () => {
      const items = await getHistory();
      setHistoryItems(items);
  };

  useFocusEffect(
      useCallback(() => {
          loadHistory();
      }, [])
  );

  const filteredItems = historyItems.filter(item => 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleClearAll = async () => {
      Alert.alert(
          "Clear History",
          "Are you sure you want to delete all history?",
          [
              { text: "Cancel", style: "cancel" },
              { 
                  text: "Delete", 
                  style: "destructive", 
                  onPress: async () => {
                      await clearHistory();
                      setHistoryItems([]);
                  }
              }
          ]
      );
  };

  const handleDeleteItem = async (id) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
      // Delete from storage in background
      await removeFromHistory(id);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'link': return ExternalLink;
      case 'text': return AlignLeft;
      case 'wifi': return Wifi;
      default: return QrCode;
    }
  };

  const renderRightActions = (progress, dragX) => {
    return (
        <View className="items-center justify-center w-[70px] h-full mb-3 ml-2">
             <View className="bg-red-500 w-full h-[72px] rounded-2xl items-center justify-center">
                 <Trash2 color="white" size={24} />
             </View>
        </View>
    );
  };

  const renderItem = ({ item }) => {
    const IconComponent = getIcon(item.type);
    
    return (
      <Swipeable 
          renderRightActions={renderRightActions}
          onSwipeableOpen={() => handleDeleteItem(item.id)}
          friction={2}
          overshootRight={false}
      >
          <View className="rounded-2xl p-4 mb-3 flex-row items-center" style={{ backgroundColor: theme.colors.surface, height: 72 }}>
              <View className="w-10 h-10 bg-[#00E5FF]/10 rounded-full items-center justify-center mr-4">
                  <IconComponent color="#00E5FF" size={20} />
              </View>
              <View className="flex-1">
                  <Text className="font-[Inter_600SemiBold] text-base mb-0.5" style={{ color: theme.colors.text }}>{item.title}</Text>
                  <Text className="text-xs" style={{ color: theme.colors.textSecondary }} numberOfLines={1}>{item.subtitle}</Text>
                  <Text className="text-[10px] mt-1" style={{ color: theme.colors.textSecondary }}>{item.time}</Text>
              </View>
          </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View className="flex-1 pt-[50px] px-5">
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
                    <View className="flex-row gap-4 items-center">
                        <TouchableOpacity onPress={() => setIsSearching(true)}>
                            <Search color={theme.colors.text} size={24} />
                        </TouchableOpacity>
                        
                        {historyItems.length > 0 && (
                            <TouchableOpacity onPress={handleClearAll} className="w-8 h-8 items-center justify-center bg-red-500/10 rounded-full">
                                <Trash2 color="#EF4444" size={18} />
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}
        </View>

        <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
                <View className="items-center justify-center mt-20">
                    <Text className="text-gray-600 font-[Inter_500Medium]">No history found</Text>
                </View>
            }
        />
        </View>
    </GestureHandlerRootView>
  );
};
