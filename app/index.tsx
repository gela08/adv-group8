import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import stylesCreate from '@/styles/stylesLoginIndex';
import { signIn } from '@/firebase/auth/auth_register'; // Helper function for sign-in
import { useRouter } from 'expo-router';
import WelcomeModal from '@/modals/welcomeModal';

const styles = stylesCreate();

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [accountError, setAccountError] = useState('');


  const [fullName, setFullName] = useState(''); // State to store full name
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const router = useRouter();

  // Validate email
  useEffect(() => {
    if (!email || email.endsWith('@gmail.com')) {
      setEmailError('');
    } else {
      setEmailError('Email must end with @gmail.com');
    }
  }, [email]);

  // Validate password
  useEffect(() => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_/]/.test(password);

    if (!password || (password.length >= 8 && hasNumber && hasSpecialChar)) {
      setPasswordError('');
    } else {
      setPasswordError(
        'Password must be at least 8 characters, contain a number, and a special character.'
      );
    }
  }, [password]);

  // Handle login
  const handleLogin = async () => {
    setAccountError('');

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (email.includes('@') && emailError) {
      Alert.alert('Error', 'Invalid email address.');
      return;
    }

    if (passwordError) {
      Alert.alert('Error', 'Please correct the errors before logging in.');
      return;
    }

    try {
      const user = await signIn(email, password); // Call helper function
      const { fullName } = user;

      if (fullName) {
        setFullName(fullName);
      } else {
        setFullName('User');
      }
      setIsModalVisible(true);
      router.replace('/home');

      setIsModalVisible(true); // Show the modal


    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/user-not-found') {
        setAccountError('The email is not registered.');
      } else if (error.code === 'auth/wrong-password') {
        setAccountError('Incorrect password. Please try again.');
      } else {
        Alert.alert('Login Failed', error.message);
      }
    }
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Redirect to forgot password screen.');
  };

  // Redirect to register
  const handleGoToRegister = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { marginBottom: 10 }]}
          placeholder="Enter your email or username"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputWithIcon, { marginBottom: 10 }]}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        {!!accountError && <Text style={styles.errorText}>{accountError}</Text>}

        

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.label, { textAlign: 'right', color: '#6c63ff' }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#444' }}>
            Don't have an account?{' '}
            <Text
              style={{ color: '#6c63ff', fontWeight: '600' }}
              onPress={handleGoToRegister}
            >
              Register
            </Text>
          </Text>
        </View>
      </ScrollView>

      <WelcomeModal
        visible={isModalVisible}
        userName={fullName}
        onClose={() => setIsModalVisible(false)}
      />


    </SafeAreaView>
  );
};

export default LoginScreen;
