import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import talkerQuiz from '../TalkerCnst/talkerQuiz';
import Default from '../Default';

const { height } = Dimensions.get('window');

const Quiz = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState({opt: null, isCorrect: null});
    const [timer, setTimer] = useState(20);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    useEffect(() => {
        if (!quizStarted || quizCompleted) return;

        const interval = setInterval(() => {
            setTimer(prev => {
            if (prev > 1) return prev - 1;
            clearInterval(interval);
            nextQ();
            return 20;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [quizStarted, quizCompleted, currentIndex]);


    const nextQ = () => {
        setSelectedOpt({ opt: null, isCorrect: null });

        if (currentIndex < talkerQuiz.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimer(20);
        } else {
            setQuizCompleted(true);
            setQuizStarted(false);
        }
    };

    const handleOptionSelect = (opt) => {
        setSelectedOpt({ opt: opt.opt, isCorrect: opt.isCorrect });

        setTimeout(() => {
            nextQ();
        }, 1000);
    };

    const resetQuiz = () => {
        setCurrentIndex(0);
        setSelectedOpt({opt: null, isCorrect: null});
        setTimer(20);
        setQuizCompleted(false);
    };

    return (
        <Default navigation={true}>
            <View style={styles.container}>

                {
                    (!quizStarted && !quizCompleted) && (
                        <ImageBackground source={require('../merch/talker_quiz/quiz_bg1.jpg')} style={{flex: 1}}>
                            <TouchableOpacity
                                onPress={() => setQuizStarted(true)}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>Play</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    )
                }

                {
                    (quizStarted && !quizCompleted) && (
                        <View style={{ width: '100%' }}>
                            
                            <View style={styles.header}>
                                <TouchableOpacity
                                    style={styles.row}
                                    onPress={resetQuiz}
                                >
                                    <Image source={require('../merch/icons/return.png')} style={styles.backIcon} />
                                    <Text style={styles.backText}>Back</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>Gonzo Quiz</Text>
                                <Text style={styles.backText}>{timer}</Text>
                            </View>

                            <Image
                                source={talkerQuiz[currentIndex].img}
                                style={{ width: '90%', height: height * 0.27, resizeMode: 'conatin', borderRadius: 16, alignSelf: 'center', marginBottom: 24 }}
                            />

                            <Text style={styles.q}>{talkerQuiz[currentIndex].q}</Text>

                            {
                                talkerQuiz[currentIndex].opts.map((opt, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={[styles.option,
                                            selectedOpt.opt === opt.opt &&
                                            { backgroundColor: selectedOpt.isCorrect ? '#FB7401' : '#FF2323' }
                                        ]}
                                        onPress={() => handleOptionSelect(opt)}
                                    >
                                        <Text style={styles.optText}>{opt.opt}</Text>
                                    </TouchableOpacity>
                                ))
                            }

                        </View>
                    )
                }

                {
                    (quizCompleted) && (
                        <ImageBackground source={require('../merch/talker_quiz/quiz_bg2.jpg')} style={{flex: 1}}>
                            <TouchableOpacity
                                onPress={resetQuiz}
                                style={styles.btn}
                            >
                                <Text style={styles.btnText}>Continue</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    )
                }

            </View>
        </Default>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    header: {
        width: '100%',
        paddingTop: height * 0.08,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#2E3A1E',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
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
        marginLeft: -40
    },

    q: {
        fontSize: 24,
        lineHeight: 26,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        width: '90%',
        alignSelf: 'center'
    },

    option: {
        width: '90%',
        backgroundColor: '#6E7F4D',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16
    },

    optText: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        color: '#fff'
    },

    btn: {
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

    btnText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginLeft: 10
    },


})

export default Quiz;
