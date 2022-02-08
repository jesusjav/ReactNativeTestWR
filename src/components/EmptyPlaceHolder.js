import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
  ActivityIndicator, 
  TouchableOpacity, UIManager, LayoutAnimation
} from 'react-native';

export const EmptyPlaceHolder = () => {
    
    return (
     
        <View>

        <Text>No results</Text>

        </View>

    );
  }