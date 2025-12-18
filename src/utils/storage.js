import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@qio_history';

export const addToHistory = async (item) => {
  try {
    const existingHistory = await getHistory();
    const newItem = {
      id: Date.now().toString(),
      type: item.type || 'qr', // 'qr' or 'barcode'
      title: item.title || item.data, // Detected text
      subtitle: item.subtitle || item.format || 'Scanned Code',
      time: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: item.icon || null, // Optional icon name if we store it
      data: item.data,
      ...item
    };
    
    const newHistory = [newItem, ...existingHistory];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newItem;
  } catch (e) {
    console.error('Error saving history:', e);
    return null;
  }
};

export const getHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error('Error loading history:', e);
    return [];
  }
};

export const removeFromHistory = async (id) => {
  try {
    const history = await getHistory();
    const newHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return true;
  } catch (e) {
    console.error('Error removing from history:', e);
    return false;
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing history:', e);
    return false;
  }
};
