//record logic
import { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert, Share } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Default from '../Default';

const { height, width } = Dimensions.get('window');

const TopicFull = ({ route }) => {
    const { topic } = route.params;
    const navigation = useNavigation();
    
    const [record, setRecord] = useState(null); 
    const [isRecording, setIsRecording] = useState(false);
    const [recordSecs, setRecordSecs] = useState(0);
    const [recordTime, setRecordTime] = useState('00:00');
    const audioRecorderPlayer = new AudioRecorderPlayer();
    const [isPlaying, setIsPlaying] = useState(false);


    const shareTopic = async () => {
        try {
            await Share.share(
                {
                    title: topic.title,
                    message: `${topic.title}\n\n${topic.text}`,
                }
            );
        } catch (error) {
            Alert.alert("Sharing Failed", "Unable to share this topic.");
        }
    };

    const deleteRecord = async () => {
        try {
            const existing = await AsyncStorage.getItem('personalRecords');
            if (!existing) return;

            const records = JSON.parse(existing).filter(t => t.title !== topic.title);
            await AsyncStorage.setItem('personalRecords', JSON.stringify(records));
            topic.record = null;
            setRecord(null);
            setIsRecording(false);
            setRecordSecs(0);
            setRecordTime('00:00');
            Alert.alert('Deleted', 'Recording has been deleted.');
            navigation.goBack();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const toggleRecord = () => {
        if (!topic.record) {
            navigation.navigate('RecordTalk', { topic });
        } else {
            if (isPlaying) {
            audioRecorderPlayer.stopPlayer();
            setIsPlaying(false);
            } else {
            audioRecorderPlayer.startPlayer(topic.record);
            audioRecorderPlayer.addPlayBackListener(() => {});
            setIsPlaying(true);
            }
        }
    };

    return (
        <Default>
            <View style={styles.container}>

                <View style={[styles.row, {width: '100%', justifyContent: 'space-between'}]}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={require('../merch/icons/return.png')} style={styles.backIcon} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Recordings</Text>
                    <TouchableOpacity onPress={shareTopic}>
                        <Image source={require('../merch/icons/share.png')} style={styles.shareIcon} />
                    </TouchableOpacity>
                </View>

                <Image
                    source={typeof topic.imageName === 'string'
                        ? { uri: topic.imageName }
                        : topic.imageName}
                    style={styles.topicImg}
                />

                <ScrollView style={{width: '100%'}}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicText}>{topic.text || topic.description}</Text>

                    <View style={{height: 100}} />
                </ScrollView>

                <View style={styles.stickyFooter}>
                    <TouchableOpacity
                        style={styles.trashBtn}
                        onPress={deleteRecord}
                    >
                        <Image
                            source={require('../merch/icons/trash.png')}
                            style={styles.trashIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.listenBtn}
                        onPress={toggleRecord}
                    >
                        <Image
                            source={require('../merch/icons/listen.png')}
                            style={styles.listenIcon}
                        />
                        <Text style={styles.listenText}>
                            {topic.record
                            ? (isPlaying ? 'Stop' : 'Listen')
                            : (isRecording ? recordTime : 'Record')}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Default>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        paddingTop: height * 0.08
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center'
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

    shareIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },

    topicImg: {
        width: '100%',
        height: 270,
        borderRadius: 32,
        resizeMode: 'cover',
        marginVertical: 24,
    },

    topicTitle: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16
    },

    topicText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 24
    },

    stickyFooter: {
        width: width,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: 24,
        backgroundColor: '#2E3A1E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopColor: '#fff',
        borderTopWidth: 0.33
    },

    trashBtn: {
        width: 56,
        height: 56,
        backgroundColor: '#6E7F4D',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },

    trashIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain'
    },

    listenBtn: {
        width: '80%',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fb7401',
        alignSelf: 'center',
        flexDirection: 'row'
    },

    listenText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginLeft: 10
    },

    listenIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
        marginRight: 5
    }


})

export default TopicFull;
