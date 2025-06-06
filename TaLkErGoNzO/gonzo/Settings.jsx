//change privacy link
import { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Linking, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import Default from '../Default';

const { height } = Dimensions.get('window');

const Settings = () => {
    const navigation = useNavigation();
    const [editing, setEditing] = useState(false);
    const [userImg, setUserImg] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        loadUserData();
    }, [editing]);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                setUsername(parsedData.username || '');
                setUserImg(parsedData.userImg || null);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    const saveUserChanges = async () => {
        if (username.trim() === '') {
            alert('Username cannot be empty');
            return;
        }

        try {
            const userData = {
                username: username.trim(),
                userImg: userImg || null,
            };
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            setEditing(false);
        } catch (error) {
            console.error('Error saving user data:', error);
            alert('Failed to save changes. Please try again.');
        }
    }

    return (
        <Default navigation={true}>
            <View style={styles.container}>

                {
                    editing ? (
                        <View style={styles.header}>

                            <View style={[styles.row, {width: '100%', justifyContent: 'space-between', marginBottom: 28}]}>
                                <TouchableOpacity
                                    style={styles.row}
                                    onPress={() => setEditing(false)}
                                >
                                    <Image source={require('../merch/icons/return.png')} style={styles.backIcon} />
                                    <Text style={styles.backText}>Back</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>Profile</Text>
                                <TouchableOpacity
                                    style={styles.row}
                                    onPress={saveUserChanges}
                                >
                                    <Text style={styles.backText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.uploaderBox}
                                onPress={() => {
                                    launchImageLibrary({
                                        mediaType: 'photo',
                                        includeBase64: false,
                                        quality: 0.5,
                                    }, (response) => {
                                        if (!response.didCancel && !response.error && response.assets) {
                                            setUserImg(response.assets[0].uri);
                                        }
                                    });
                                }}
                            >
                                <Image
                                    source={userImg ?
                                        { uri: userImg }
                                        : require('../merch/icons/user.png')}
                                    style={[userImg ? styles.cover : styles.decorIcon]}
                                />
                            </TouchableOpacity>

                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                                autoFocus
                                placeholderTextColor='#999999'
                            />
                        </View>
                    ) : (
                            <View style={[styles.header, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                                <View style={styles.row}>
                                    <View style={[styles.uploaderBox, {width: 66, height: 66, marginBottom: 0, marginRight: 16, borderRadius: 20}]}>
                                        <Image
                                            source={userImg ?
                                                { uri: userImg }
                                                : require('../merch/icons/user.png')}
                                            style={[userImg ? styles.cover : {width: 44, height: 44, resizeMode: 'contain'}]}
                                        />
                                    </View>
                                    <Text style={styles.name}>{username || 'Username'}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setEditing(true)}
                                >
                                    <Image source={require('../merch/icons/edit.png')} style={[styles.backIcon, {width: 32, height: 32}]} />
                                </TouchableOpacity>
                            </View>  
                    )
                }

                <Text style={[styles.name, { marginBottom: 20, marginLeft: 16 }]}>Settings</Text>
                <TouchableOpacity
                    style={[styles.policyBox, { marginLeft: 16 }]}
                    onPress={() => Linking.openURL('https://gonzo-talker.com/privacy-policy')}
                >
                    <Text style={[styles.title, {marginLeft: 0}]}>Privacy Policy</Text>
                    <Image
                        source={require('../merch/icons/policy.png')}
                        style={{ width: 105, height: 105, resizeMode: 'contain', alignSelf: 'flex-end' }}
                    />
                </TouchableOpacity>


            </View>
        </Default>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    header: {
        width: '100%',
        backgroundColor: '#2E3A1E',
        paddingTop: height * 0.08,
        paddingHorizontal: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        marginBottom: 32
    },

    backIcon: {
        width: 17,
        height: 22,
        marginRight: 6,
        resizeMode: 'contain'
    },

    backText: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '600',
        color: '#FB7401'
    },

    title: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '700',
        color: '#fff',
        marginLeft: -20
    },

    name: {
        fontSize: 24,
        lineHeight: 26,
        fontWeight: '700',
        color: '#fff',
    },

    input: {
        width: '100%',
        backgroundColor: '#6E7F4D',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 14,
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '400',
        color: '#fff',
        alignSelf: 'center',
    },

    uploaderBox: {
        height: 100,
        width: 100,
        backgroundColor: '#6E7F4D',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        overflow: 'hidden',
        alignSelf: 'center',
    },

    decorIcon: {
        width: 66,
        height: 66,
        resizeMode: 'contain',
    },

    cover: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        resizeMode: 'cover'
    },

    policyBox: {
        height: 177,
        width: 171,
        backgroundColor: '#2E3A1E',
        borderRadius: 20,
        padding: 16,
        justifyContent: 'space-between',
    },

})

export default Settings;
