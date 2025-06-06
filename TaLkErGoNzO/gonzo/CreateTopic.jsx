import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Default from '../Default';

const { height } = Dimensions.get('window');

const CreateTopic = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedCover, setUploadedCover] = useState(null); 
    const [record, setRecord] = useState(null); 
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState('00:00');

    const audioRecorderPlayer = new AudioRecorderPlayer();

    const toggleRecording = async () => {
        if (isRecording) {
            try {
                const result = await audioRecorderPlayer.stopRecorder();
                audioRecorderPlayer.removeRecordBackListener();
                setIsRecording(false);
                setRecord(result);
                setRecordTime('00:00');
                console.log('Recording saved at:', result);
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        } else {
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
                    setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
                });

                setIsRecording(true);
            } catch (error) {
                console.error('Error starting recording:', error);
            }
        }
    };

    const savePersonalRecord = async () => {
        try {
            const recordObject = {
                title,
                description,
                imageName: uploadedCover,
                record,
                createdAt: new Date().toISOString()
            };

            const existing = await AsyncStorage.getItem('personalRecords');
            const records = existing ? JSON.parse(existing) : [];

            records.push(recordObject);

            await AsyncStorage.setItem('personalRecords', JSON.stringify(records));

            alert('Record saved successfully!');
            navigation.goBack();
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save the record.');
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

                <ScrollView style={{ width: '100%' }}>
                    
                    {step === 0 && (
                        <View style={{ width: '100%', flexGrow: 1 }}>
                            <Text style={styles.title}>Your theme</Text>

                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Heading"
                                value={title}
                                onChangeText={setTitle}
                                autoFocus
                                placeholderTextColor='#999999'
                            />

                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, { minHeight: 120 }]}
                                placeholder="Comment"
                                value={description}
                                onChangeText={setDescription}
                                placeholderTextColor='#999999'
                                multiline
                            />

                        </View>
                    )}

                    {step === 1 && (
                        <View style={{ width: '100%', flexGrow: 1 }}>
                            <Text style={styles.title}>Add cover</Text>

                            <Text style={styles.label}>Photo</Text>
                            <TouchableOpacity
                                style={styles.uploaderBox}
                                onPress={() => {
                                    launchImageLibrary({
                                        mediaType: 'photo',
                                        includeBase64: false,
                                        quality: 0.5,
                                    }, (response) => {
                                        if (!response.didCancel && !response.error && response.assets) {
                                            setUploadedCover(response.assets[0].uri);
                                        }
                                    });
                                }}
                            >
                                <Image
                                    source={uploadedCover ?
                                        { uri: uploadedCover }
                                        : require('../merch/icons/plus.png')}
                                    style={[uploadedCover ? styles.cover : styles.plusIcon]}
                                />
                            </TouchableOpacity>

                        </View>
                    )}


                </ScrollView>

                {
                    step === 0 ? (
                        <TouchableOpacity
                            style={[
                                styles.createBtn,
                                { position: 'absolute', bottom: height * 0.05 },
                                (!title || !description) && { opacity: 0.3 }
                            ]}
                            onPress={() => setStep((prev) => prev + 1)}
                            disabled={!title || !description}
                        >
                            <Text style={styles.createBtnText}>Continue</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{width: '100%', position: 'absolute', bottom: height * 0.05, alignItems: 'center', alignSelf: 'center'}}>
                            <TouchableOpacity style={styles.createBtn} onPress={toggleRecording}>
                                <Image source={require('../merch/icons/sparkles.png')} style={styles.topicBtnIcon} />
                                <Text style={styles.createBtnText}>{isRecording ? recordTime : 'Record'}</Text>
                            </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.createBtn,
                                        { backgroundColor: 'transparent', marginTop: 5 },
                                        (!title || !description || !uploadedCover) && { opacity: 0.3 }
                                    ]}
                                    onPress={savePersonalRecord}
                                    disabled={!title || !description || !uploadedCover}
                                >
                                <Text style={styles.createBtnText}>Save</Text>
                            </TouchableOpacity> 
                        </View>
                    )
                }
                
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
        fontSize: 34,
        lineHeight: 41,
        fontWeight: '700',
        color: '#fff',
        marginTop: 15,
        marginBottom: 20
    },

    label: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 11
    },

    input: {
        width: '100%',
        backgroundColor: '#2E3A1E',
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 14,
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 16,
    },

    uploaderBox: {
        height: 191,
        width: 191,
        backgroundColor: '#2E3A1E',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        overflow: 'hidden',
    },

    plusIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },

    cover: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
        resizeMode: 'cover'
    },

    createBtn: {
        width: '100%',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fb7401',
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

})

export default CreateTopic;
