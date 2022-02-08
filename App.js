import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity, UIManager, LayoutAnimation
} from 'react-native';

import { Icon } from 'react-native-elements';
import EmptyPlaceHolder from './src/components/EmptyPlaceHolder';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [followList, setFollowList] = useState([]);
  const [bloquedList, setBLoquedList] = useState([]);

  const onFollow = user => {
    setFollowList([...followList, user]);
  };

  const onBloquedUser = user => {
    setBLoquedList([...bloquedList, user]);
  };

  const ifFollow = user => {
    if (followList.filter(item => item.account_id === user.account_id).length > 0) {
      return true;
    }
    return false;
  };

  const ifBloquedUser = user => {
    if (bloquedList.filter(item => item.account_id === user.account_id).length > 0) {
      return true;
    }
    return false;
  };

  const getUsers = async () => {
    try {
      const response = await fetch('http://api.stackexchange.com/2.2/users?pagesize=20&order=desc&sort=reputation&site=stackoverflow');
      const json = await response.json();
      setData(json.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);


  const ExpandableComponent = ({ item }) => {
    const [open, setopen] = useState(false);
    const onPress = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setopen(!open);
    };

    return (
      <TouchableOpacity
        style={[!open && !ifBloquedUser(item) ? { height: 80 } : { height: 120 }]}
        onPress={onPress}
        activeOpacity={1}>

        <View
          style={{ flex: 1, flexDirection: 'row', backgroundColor: (ifBloquedUser(item)) ? 'gray' : 'white' }}>
          {ifFollow(item) &&
            <Icon name='favorite' />
          }

          <Text style={{ paddingHorizontal: 20 }}>{item.display_name}</Text>

        </View>

        {!(ifBloquedUser(item)) && open && (
          <View style={{ flex: 1, flexDirection: 'row', padding: 20 }}>

            <Icon
              onPress={() => onFollow(item)}
              name='favorite' />

            <Icon
              onPress={() => onBloquedUser(item)}
              name='lock' />
          </View>

        )}

      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          data={data}
          keyExtractor={({ account_id }, index) => account_id}
          renderItem={({ item }) => <ExpandableComponent item={item} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
