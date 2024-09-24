import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const generateRandomNumber = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString(); 
};

export default function Index() {
  const [username, setUsername] = useState<string>('');
  const [randomNumber, setRandomNumber] = useState<string>(generateRandomNumber());
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setRandomNumber(generateRandomNumber());
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 10000); 

    return () => {
      clearInterval(timer);
    };
  }, [fadeAnim]);

  useFocusEffect(
    React.useCallback(() => {
      setUsername('');
      setUserInput('');
      setRandomNumber(generateRandomNumber());
    }, [])
  );

  const handleLogin = () => {
    Keyboard.dismiss();
    setLoading(true);

    if (userInput.trim() === randomNumber) {
      setTimeout(() => {
        setLoading(false);
        router.replace('/home'); 
      }, 2000);
    } else {
      alert('The random number is incorrect. Please try again.');
      setLoading(false);
    }
  };

  const isLoginEnabled = username.trim() !== '' && userInput.trim() !== '';

  return (
    <View style={styles.container}>
      <View style={styles.animatedView}>
        <Text style={styles.title}>Expense Tracker</Text>
        <View style={styles.randomNumberContainer}>
          <Animated.Text style={[styles.randomNumber, { opacity: fadeAnim }]}>
            {`Security Code: ${randomNumber}`}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#777"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter the security code"
          placeholderTextColor="#777"
          value={userInput}
          onChangeText={setUserInput}
          keyboardType="numeric"
          maxLength={4}
        />

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin} 
          disabled={loading || !isLoginEnabled}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7', 
  },
  animatedView: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#333', 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  randomNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  randomNumber: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom:20
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderTopColor: 'transparent',
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    elevation: 3, 
  },
  loginButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#4CAF50', 
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
