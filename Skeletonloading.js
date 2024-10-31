import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const LoadingSkeleton = () => {
  return (
    <ContentLoader
      viewBox="0 0 400 120" 
      height={120}
      width={400}
      backgroundColor="#e0e0e0"
      foregroundColor="#ffffff"
    >
      <Circle cx="30" cy="30" r="30" /> 
      <Rect x="70" y="10" rx="5" ry="5" width="220" height="15" /> 
      <Rect x="70" y="40" rx="5" ry="5" width="150" height="10" /> 
      <Rect x="70" y="60" rx="5" ry="5" width="100" height="10" /> 
    </ContentLoader>
  );
};

const LoadingList = () => {
  const renderItem = () => {
    return <LoadingSkeleton />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[...Array(10)]} // 10 adet yükleme simülasyonu
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3e0ff', // Açık mavi arka plan
    padding: 20,
  },
});

export default LoadingList;
