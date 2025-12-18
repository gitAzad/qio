import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight, Zap, Moon, Info } from 'lucide-react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

export const SettingsScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [vibrate, setVibrate] = React.useState(true);

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: theme.colors.background }}>
      <View className="px-5 py-4 border-b border-gray-800">
        <Text className="text-3xl font-[Inter_700Bold]" style={{ color: theme.colors.text }}>Settings</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6">
        <View className="rounded-2xl overflow-hidden mb-6" style={{ backgroundColor: theme.colors.surface }}>
          {/* Theme Toggle */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
             <View className="flex-row items-center gap-3">
               <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center">
                 <Moon size={20} color="#00E5FF" />
               </View>
               <View>
                 <Text className="text-lg font-[Inter_600SemiBold]" style={{ color: theme.colors.text }}>Theme</Text>
                 <Text className="text-sm font-[Inter_400Regular]" style={{ color: theme.colors.textSecondary }}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
               </View>
             </View>
             <Switch 
               value={isDark} 
               onValueChange={toggleTheme}
               trackColor={{ false: '#333', true: '#00E5FF' }}
               thumbColor="#fff"
             />
          </View>

          {/* Vibrate Toggle */}
          <View className="flex-row items-center justify-between p-4">
             <View className="flex-row items-center gap-3">
               <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center">
                 <Zap size={20} color="#00E5FF" />
               </View>
               <View>
                 <Text className="text-lg font-[Inter_600SemiBold]" style={{ color: theme.colors.text }}>Vibrate on Scan</Text>
               </View>
             </View>
             <Switch 
               value={vibrate} 
               onValueChange={setVibrate}
               trackColor={{ false: '#333', true: '#00E5FF' }}
               thumbColor="#fff"
             />
          </View>
        </View>

        <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.colors.surface }}>
           <TouchableOpacity 
             className="flex-row items-center justify-between p-4 active:bg-gray-800"
             onPress={() => navigation.navigate('About')}
           >
             <View className="flex-row items-center gap-3">
               <View className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center">
                 <Info size={20} color="#00E5FF" />
               </View>
               <Text className="text-lg font-[Inter_600SemiBold]" style={{ color: theme.colors.text }}>About Qio</Text>
             </View>
             <ChevronRight size={20} color="#666" />
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
