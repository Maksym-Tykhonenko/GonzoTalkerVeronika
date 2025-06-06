import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Default from '../Default';

const { height, width } = Dimensions.get('window');

const RecordTalk = ({ route }) => {
    const { topic } = route.params;
    const navigation = useNavigation();

    const audioRecorderPlayer = new AudioRecorderPlayer();
    const [recordSecs, setRecordSecs] = useState(0);
    const [recordTime, setRecordTime] = useState('00:00');
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);


    const startRecording = async () => {
        if (isRecording) return;

        try {
            const path = `${RNFS.DocumentDirectoryPath}/recordedAudio.mp4`;
            const audioSet = {
            AudioEncoderAndroid: AudioRecorderPlayer.AAC,
            AudioSourceAndroid: AudioRecorderPlayer.MIC,
            AVModeIOS: 'measurement',
            OutputFormatAndroid: 'mpeg_4',
            };

            await audioRecorderPlayer.startRecorder(path, audioSet);
            audioRecorderPlayer.addRecordBackListener((e) => {
            setRecordSecs(e.currentPosition);
            setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
            });

            setIsRecording(true);
            setIsPaused(false);
        } catch (error) {
            console.error('Start recording error:', error);
        }
    };

    const pauseRecording = async () => {
        try {
            await audioRecorderPlayer.pauseRecorder(); // only works on Android
            setIsPaused(true);
        } catch (error) {
            Alert.alert("Pause Unsupported", "Pause is only supported on Android.");
            console.warn('Pause recording error:', error);
        }
    };

    const stopAndSaveRecording = async () => {
        try {
            const result = await audioRecorderPlayer.stopRecorder();
            audioRecorderPlayer.removeRecordBackListener();
            setIsRecording(false);
            setIsPaused(false);
            setRecordSecs(0);
            setRecordTime('00:00');

            const newTopic = {
            ...topic,
            record: result,
            createdAt: new Date().toISOString()
            };

            const existing = await AsyncStorage.getItem('personalRecords');
            const records = existing ? JSON.parse(existing) : [];

            const updated = records.filter(t => t.title !== newTopic.title);
            updated.push(newTopic);
            await AsyncStorage.setItem('personalRecords', JSON.stringify(updated));

            Alert.alert('Saved', 'Recording saved!');
            navigation.goBack();
        } catch (error) {
            console.error('Stop & save error:', error);
        }
    };

    return (
      <Default>
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.row}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../merch/icons/return.png')} style={styles.backIcon} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>{topic.title}</Text>
                <Text style={styles.recordTime}>{recordTime}</Text>

                <Image
                    source={require('../merch/talker/record.png')}
                    style={styles.talkerImg}
                />

                <View style={styles.panel}>
                    {
                        Platform.OS !== 'ios' && (
                            <TouchableOpacity onPress={pauseRecording}>
                                <Image
                                    source={require('../merch/icons/record.png')}
                                    style={{width: 40, height: 40, resizeMode: 'contain'}} />
                            </TouchableOpacity>
                        )
                    }
                    <TouchableOpacity style={[styles.btn, isRecording && {backgroundColor: '#48ba36'}]} onPress={startRecording}>
                        <Image
                            source={require('../merch/icons/record.png')}
                            style={{width: 40, height: 40, resizeMode: 'contain'}} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={stopAndSaveRecording}>
                        <Image
                            source={require('../merch/icons/stop.png')}
                            style={{width: 40, height: 40, resizeMode: 'contain'}} />
                    </TouchableOpacity>
                </View>

            </View>
      </Default>
  );
};

export default RecordTalk;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 16,
        paddingTop: height * 0.08,
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
        fontSize: 34,
        lineHeight: 41,
        fontWeight: '700',
        color: '#fff',
        marginTop: 15,
        marginBottom: height * 0.04
    },

    recordTime: {
        fontSize: 44,
        fontWeight: '600',
        color: '#FB7401',
        zIndex: 10,
        alignSelf: 'center',
        textAlign: 'center',
    },

    btn: {
        backgroundColor: '#FB7401',
        padding: 16,
        width: 80,
        height: 80,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    talkerImg: {
        width: '100%',
        height: height * 0.5,
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 0
    },

    panel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        width: width,
        padding: 57,
        backgroundColor: '#2E3A1E',
        borderTopWidth: 0.33,
        borderTopColor: '#fff',
        zIndex: 10
    }


});
