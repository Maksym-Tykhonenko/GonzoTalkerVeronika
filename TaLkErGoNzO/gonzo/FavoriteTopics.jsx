import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, Share, ScrollView, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Default from '../Default';

const { height } = Dimensions.get('window');

const FavoriteTopics = () => {
    const navigation = useNavigation();
    const [favoriteTopics, setFavoriteTopics] = useState([]);
    const [searchWord, setSearchWord] = useState(null);

    const shareTopic = async (item) => {
        try {
            await Share.share(
                {
                    title: item.title,
                    message: `${item.title}\n\n${item.text}`,
                }
            );
        } catch (error) {
            Alert.alert("Sharing Failed", "Unable to share this topic.");
        }
    };

    useEffect(() => {
        const loadFavorites = async () => {
            const stored = await AsyncStorage.getItem('FAV_TOPICS');
            if (stored) {
            setFavoriteTopics(JSON.parse(stored));
            }
        };
        loadFavorites();
    }, []);

    const toggleFavTopic = async (item) => {
        let updated = [];
        if (favTopic(item)) {
            updated = favoriteTopics.filter((topic) => topic.title !== item.title);
        } else {
            updated = [...favoriteTopics, item];
        }
        setFavoriteTopics(updated);
        await AsyncStorage.setItem('FAV_TOPICS', JSON.stringify(updated));
    };

    const favTopic = (item) => favoriteTopics.some((topic) => topic.title === item.title);

    const filteredTopics = favoriteTopics.filter((item) => {
        if (!searchWord || searchWord.trim() === "") return true;
        const lowerSearch = searchWord.toLowerCase();
        return item.title.toLowerCase().includes(lowerSearch) || item.text.toLowerCase().includes(lowerSearch);
    });

    return (
        <Default navigation={true}>
            <View style={styles.container}>

                <Text style={styles.mainTitle}>Favourite Topics</Text>

                <View style={{width: '100%', marginBottom: 24}}>
                    <Image
                        source={require('../merch/icons/search.png')}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        value={searchWord}
                        onChangeText={setSearchWord}
                        placeholder='Search'
                        placeholderTextColor='#999999'
                    />
                </View>

                <ScrollView style={{ width: '100%' }}>

                    {
                        filteredTopics.length > 0 ? (
                            <View style={{width: '100%', paddingHorizontal: 16}}>
                                {
                                    filteredTopics.map((item, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.topicCardContainer}
                                            onPress={() => navigation.navigate('TopicFull', { topic: item })}
                                        >
                                            <ImageBackground
                                                source={item.imageName}
                                                style={styles.topicBackImg}
                                            >
                                                <View style={styles.topicInnerTextConatiner}>
                                                    <Text style={styles.topicTitle}>{item.title}</Text>
                                                    <Text
                                                        style={styles.topicText}
                                                        numberOfLines={2}
                                                        ellipsizeMode='tail'
                                                    >
                                                        {item.text}
                                                    </Text>
                                                    <View  style={styles.row}>
                                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                            <TouchableOpacity
                                                                style={[styles.topicBtn, {marginRight: 16}]}
                                                                onPress={() => shareTopic(item)}
                                                            >
                                                                <Image
                                                                    source={require('../merch/icons/share.png')}
                                                                    style={styles.topicBtnIcon}
                                                                />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                style={styles.topicBtn}
                                                                onPress={() => toggleFavTopic(item)}
                                                            >
                                                                <Image
                                                                    source={
                                                                    favTopic(item) ?
                                                                        require('../merch/icons/fav.png')
                                                                            : require('../merch/icons/not-fav.png')}
                                                                    style={styles.topicBtnIcon}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableOpacity
                                                            style={[styles.topicBtn, {backgroundColor: '#FB7401'}]}
                                                        >
                                                            <Image
                                                                source={require('../merch/icons/play.png')}
                                                                style={styles.topicBtnIcon}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        ) : (
                                <View style={{width: '100%', flexGrow: 1}}>
                                    <View style={styles.noTopicsBox}>
                                        <Text style={styles.noTopicsText}>
                                            {favoriteTopics.length > 0 ?
                                                'There are no themes for your search, please try again.'
                                                : 'There are no favourite topics yet.. Add new and come back'}
                                        </Text>
                                    </View>
                                    <Image source={require('../merch/talker/noTopics.png')} style={styles.noTopicsImage} />
                                </View>
                        )
                    }

                    <View style={{height: 300}} />
                </ScrollView>

                <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateTopic')}>
                    <Image source={require('../merch/icons/sparkles.png')} style={styles.topicBtnIcon} />
                    <Text style={styles.createBtnText}>Start</Text>
                </TouchableOpacity>

            </View>
        </Default>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: height * 0.08
    },

    mainTitle: {
        fontSize: 34,
        lineHeight: 41,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'left',
        paddingHorizontal: 16
    },

    searchIcon: {
        width: 24,
        height: 22,
        resizeMode: 'contain',
        position: 'absolute',
        top: 8,
        left: 25,
        zIndex: 10
    },

    searchInput: {
        width: '90%',
        borderRadius: 10,
        paddingLeft: 40,
        paddingVertical: 11,
        paddingRight: 20,
        backgroundColor: '#2E3A1E',
        fontSize: 14,
        lineHeight: 16,
        fontWeight: '400',
        color: '#fff',
        alignSelf: 'center'
    },

    createBtn: {
        width: '90%',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fb7401',
        position: 'absolute',
        bottom: 130,
        alignSelf: 'center',
        flexDirection: 'row'
    },

    createBtnText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginLeft: 10
    },

    topicBtnIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },

    topicCardContainer: {
        width: '100%',
        height: 270,
        borderRadius: 32,
        marginBottom: 12,
        overflow: 'hidden'
    },

    topicBackImg: {
        flex: 1,
        borderRadius: 32,
        resizeMode: 'cover'
    },

    topicText: {
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 12
    },

    topicTitle: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
        textAlign: 'left',
    },

    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    topicBtn: {
        borderRadius: 20,
        backgroundColor: '#2E3A1E',
        width: 56,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },

    topicInnerTextConatiner: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingVertical: 16,
        paddingHorizontal: 20
    },

    noTopicsBox: {
        width: 225,
        borderRadius: 24,
        padding: 24,
        backgroundColor: '#FB7401',
        alignSelf: 'flex-end',
        marginRight: 16,
        zIndex: 10
    },

    noTopicsText: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '400',
        color: '#fff',
        textAlign: 'center'
    },

    noTopicsImage: {
        width: 500,
        height: height * 0.7,
        resizeMode: 'contain',
        position: 'absolute',
        top: height * 0.1,
        left: -120
    }


})

export default FavoriteTopics;
