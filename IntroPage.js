import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdvancedPagerView = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  const handlePageChange = (event) => {
    setCurrentPage(event.nativeEvent.position);

-    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.90,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(translateAnim, {
        toValue: 0,
        friction: 3,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageChange}
        transitionStyle="scroll"
      >
        {[{
          icon: "rocket",
          title: "Welcome to Our App!",
          subtitle: "Experience the future of mobile technology with us."
        }, {
          icon: "feature-search-outline",
          title: "Advanced Features",
          subtitle: "Discover all the powerful tools at your fingertips."
        }, {
          icon: "shield-lock-outline",
          title: "Top-notch Security",
          subtitle: "Your data is safe with our high-level security."
        }, {
          icon: "star-outline",
          title: "Get Started",
          subtitle: "Join us today and explore endless possibilities!",
          button: true
        }].map((page, index) => (
          <Animated.View
            key={index}
            style={[
              styles.page,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateX: translateAnim }
                ],
              },
            ]}
          >
            <Icon name={page.icon} size={80} color="#4F8EF7" />
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.subtitle}>{page.subtitle}</Text>
            {page.button && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.startButtonText}>Sign Up Now</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ))}
      </PagerView>
      <View style={styles.indicatorContainer}>
        {[0, 1, 2, 3].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.indicator,
              currentPage === index ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerView: {
    flex: 1,
    width: '100%',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginHorizontal: 20,
  },
  startButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#4F8EF7',
  },
});

export default AdvancedPagerView;
