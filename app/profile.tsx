// /app/profile.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { auth, db } from '@/firebase/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getCountFromServer,
} from 'firebase/firestore';
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';
import { Post } from '@/firebase/crud/crud';
import { useRouter } from 'expo-router';
import stylesCreate from '@/styles/stylesProfile';

type PostWithCount = Post & { commentCount: number };

const ProfileScreen = () => {
  const styles = stylesCreate();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostWithCount[]>([]);
  const [editing, setEditing] = useState(false);

  // Password-modal state
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  // Fetch basic user info
  const fetchUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setEmail(user.email || '');
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUsername(data.username || '');
        setFullName(data.fullName || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
    setLoading(false);
  };

  // Subscribe to user's posts + fetch comment counts
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    fetchUserProfile();

    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      async snapshot => {
        // map raw posts
        const raw: Post[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Post, 'id'>),
        }));

        // fetch count for each
        const withCount: PostWithCount[] = await Promise.all(
          raw.map(async post => {
            try {
              const countSnap = await getCountFromServer(
                query(
                  collection(db, 'comments'),
                  where('postId', '==', post.id)
                )
              );
              return { ...post, commentCount: countSnap.data().count };
            } catch (err) {
              console.error(`Count error for ${post.id}:`, err);
              return { ...post, commentCount: 0 };
            }
          })
        );

        setPosts(withCount);
      },
      err => {
        console.error('Error fetching posts:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      await updateDoc(doc(db, 'users', user.uid), {
        fullName,
        username,
        email,
      });
      setEditing(false);
      fetchUserProfile();
      Alert.alert('Success', 'Profile updated.');
    } catch (error: any) {
      console.error('Update error:', error);
      let msg = 'Failed to update.';
      if (error.code === 'auth/requires-recent-login') {
        msg = 'Please re-login to update email.';
      } else if (error.message) {
        msg = error.message;
      }
      Alert.alert('Error', msg);
    }
  };

  const handlePasswordChange = async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill out both passwords.');
      return;
    }

    setPasswordUpdating(true);
    try {
      const cred = EmailAuthProvider.credential(user.email || '', currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated.', [
        { text: 'OK', onPress: () => {
            setPasswordModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
          }
        }
      ]);
    } catch (error: any) {
      console.error('Password error:', error);
      let msg = 'Failed to update password.';
      if (error.code === 'auth/wrong-password') {
        msg = 'Current password is incorrect.';
      } else if (error.code === 'auth/requires-recent-login') {
        msg = 'Please re-login to update password.';
      } else if (error.message) {
        msg = error.message;
      }
      Alert.alert('Error', msg);
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>

        {/* My Posts */}
        <View style={styles.myPostsContainer}>
          <Text style={styles.title}>My Posts</Text>
          {posts.length > 0 ? (
            <FlatList
              data={posts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.postItem}
                  onPress={() => router.push({ pathname: '/read', params: { postId: item.id } })}
                >
                  <Text style={styles.postTitle}>{item.title}</Text>
                  <Text style={styles.postDate}>
                    {item.createdAt?.toDate().toLocaleDateString() ?? 'Unknown'}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
                    {item.commentCount} Comments
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noPostsText}>You have no posts yet.</Text>
          )}
        </View>

        {/* Profile Settings */}
        <View style={styles.profContainer}>
          <Text style={styles.title}>Profile Settings</Text>

          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              editable={editing}
              placeholder="Enter full name"
            />
          </View>

          {/* Username */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              editable={editing}
              placeholder="Enter username"
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={editing}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter email"
            />
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value="********"
              editable={false}
              secureTextEntry
            />
            {editing && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => setPasswordModalVisible(true)}
              >
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Edit / Save */}
          {editing ? (
            <>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#aaa', marginTop: 10 }]}
                onPress={() => {
                  fetchUserProfile();
                  setEditing(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              auth.signOut();
              router.push('/');
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Password Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={passwordModalVisible}
        onRequestClose={() => {
          setPasswordModalVisible(false);
          setCurrentPassword('');
          setNewPassword('');
        }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Change Password
            </Text>

            <TextInput
              style={[styles.input, { marginBottom: 10 }]}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { marginBottom: 20 }]}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, { marginBottom: 10 }]}
              onPress={handlePasswordChange}
              disabled={passwordUpdating}
            >
              {passwordUpdating
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Update Password</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPasswordModalVisible(false);
                setCurrentPassword('');
                setNewPassword('');
              }}
            >
              <Text style={{ color: '#007bff', textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;
