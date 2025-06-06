import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Default from '../Default';

const { height } = Dimensions.get('window');

const steps = [
    require('../merch/steps/1.png'),
    require('../merch/steps/2.png'),
    require('../merch/steps/3.png'),
    require('../merch/steps/4.png'),
    require('../merch/steps/5.png'),
];

const IntroSteps = () => {
    const navigation = useNavigation();
    const [index, setIndex] = useState(0)

    return (
        <Default>
            <View style={styles.container}>

                <View style={{ width: '100%', height: '100%' }}>

                    <View style={{width: '100%', paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', top: 22, zIndex: 12}}>
                        <View style={{ width: '85%', alignItems: 'center', zIndex: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            {steps.map((_, i) => (
                                <View
                                key={i}
                                style={{
                                    width: '18%',
                                    height: 4,
                                    marginHorizontal: 3,
                                    backgroundColor: i <= index ? '#fb7401' : '#999',
                                    borderRadius: 10,
                                }}
                                />
                            ))}
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Topics')}
                        >
                            <Image source={require('../merch/icons/close.png')} style={{width: 28, height: 28}} />
                        </TouchableOpacity>
                    </View>

                    <Image source={steps[index]} style={{ width: '100%', height: '100%', resizeMode: 'cover', zIndex: 10 }} />
                    
                    <View style={{ width: '100%', paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', bottom: 50, zIndex: 10 }}>
                        {
                            index !== 0 && (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => setIndex((prev) => prev - 1)}
                                >
                                    <Image source={require('../merch/icons/back.png')} style={{width: 28, height: 28, marginRight: 12}} />
                                    <Text style={{fontSize: 20, lineHeight: 22, fontWeight: '700', color: '#999'}}>Back</Text>
                                </TouchableOpacity>
                            )
                        }
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => index !== 4 ? setIndex((prev) => prev + 1) : navigation.navigate('Topics')}
                        >
                            <Text style={{fontSize: 20, lineHeight: 22, fontWeight: '700', color: '#fb7401'}}>Next</Text>
                            <Image source={require('../merch/icons/next.png')} style={{width: 28, height: 28, marginLeft: 12}} />
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        </Default>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingTop: height * 0.08,
        justifyContent: 'flex-end'
    },


})

export default IntroSteps;
