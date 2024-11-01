import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/FatihArslan-cmd/mockjson/main/db.json');
      const json = await response.json();
      setData(json.products);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image 
        source={{ uri: item.image || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAALVBMVEXz9Pa5vsq2u8j29/jN0dno6u7V2N++ws3w8fTf4efi5OnFydPY2+HJztbR1txPmUB/AAAC0klEQVR4nO3b55aqMBiFYUoioXn/l3ukKSVBJGH4ctb7/JxRVrYbCDVJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArPLQ7g60YnSjwmoqc3eouarOwmsrOT026TXKu4NNyosCioloissSFndn6+VlNgwn6EY4LrKUsCnm7TCaNuiudFqoiIT9Spo9Ak+Hj77GWsKUMSasAi+2lJMwIeE5JPxLtoRGa8+xiU5YqX5urBuf4UlO+Eyn+br2OHaWm9DU2eeoK2tOL1Vuwucs4Is+u1SxCctlwLQ4O0SpCfN6fXpw9thZakK9qjDN1MmlSk24Xkm/jdG9sxWaMG82CXc3ROXe2UpN+PgpYbffbRwtCk3421qqug+7WpSa0Pywp5lmTnuLUhNaZgvHt4yafgx7i1ITbq4sOoeoZm3bWhSbcDHyF8d0YNRiVba0KDdhMj/yTl2Twep3sLQoOOGrnmn4hePEf9mg/acQnDDJK1V013Trh3HMdesGbS1KTpj0FzG0cQ3O0qClReEJd9ka3LYYb0LzdARcRYw3oavB9YoabUJ3g6sWY0241+CyxUgSmtWFqP0GFy3GkVCnhZ7vPdqvAT8txpAw10WazYf4vcFZizEk1P3fPy0eabD7xnC+JT9h12D/j3o8djvWYH83ufu4/IT6PeKhxYMNdqdSUSScGny3eLTBaBLqxaAL/W0ejC3hvMEh4uF8kSTU+xmiT7hp8L9L6NVgBAk9G4wgoWeD4hN6Nyg+oXeD0hPmxw9dYk24vX9IQhLem21AQhKS8H6hE8q+TtPdVvM1hJKaMBwS/iUSnpILSji+FaTCvgk83oer707XmR70uuTdNSXh3bX384hXvH8Yeus+x2ye1gtGxjukSVJdllBGhUn3QKL/wdpWJmQd7em2CLoV9ltiq0XsZia6fITVCCoQAAAAAAAAAAAAAAAAAAAAAAAAAAAAuMU/B0kslFd7c1EAAAAASUVORK5CYII=' }} 
        style={styles.itemImage} 
      />
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
    </View>
  );

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollToTop(offsetY > 500);
  };

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <BlurView style={styles.header} blurType="light" blurAmount={2}>
        <TouchableOpacity onPress={() => alert('Back Pressed')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 60 }}
          ref={flatListRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}

      {showScrollToTop && (
        <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
          <MaterialIcons name="arrow-upward" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 1,
  },
  backButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,

  },
  clearButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemImage: {
    width: 75,
    height: 75,
    borderRadius: 10,
    marginRight: 30,
  },
  itemText: {
    fontSize: 18,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#000',
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default App;
