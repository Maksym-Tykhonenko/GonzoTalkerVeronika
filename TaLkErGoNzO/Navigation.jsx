import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navigation = () => {
    const navigation = useNavigation();
    const [current, setCurrent] = useState('Home');

    const currentScreen = (screen) => {
        setCurrent(screen);
        navigation.navigate(screen)
    };    

    useEffect(() => {
        const unfollow = navigation.addListener('focus', () => {
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;
            setCurrent(currentRoute);
        });

        return unfollow;
    }, [navigation]);

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.button} onPress={() => currentScreen('Topics')}>
                <Image source={require('./merch/navigation/home.png')} style={[styles.icon, current==='Topics' && {tintColor: '#fb7401'}]} />
                <Text style={[styles.buttonText, current==='Topics' && {color: '#fb7401'}]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => currentScreen('FavoriteTopics')}>
                <Image source={require('./merch/navigation/lovely.png')} style={[styles.icon, current==='FavoriteTopics' && {tintColor: '#fb7401'}]} />
                <Text style={[styles.buttonText, current==='FavoriteTopics' && {color: '#fb7401'}]}>Lovely</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => currentScreen('Records')}>
                <Image source={require('./merch/navigation/records.png')} style={[styles.icon, current==='Records' && {tintColor: '#fb7401'}]} />
                <Text style={[styles.buttonText, current==='Records' && {color: '#fb7401'}]}>Records</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => currentScreen('Quiz')}>
                <Image source={require('./merch/navigation/quiz.png')} style={[styles.icon, current==='Quiz' && {tintColor: '#fb7401'}]} />
                <Text style={[styles.buttonText, current==='Quiz' && {color: '#fb7401'}]}>Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => currentScreen('Settings')}>
                <Image source={require('./merch/navigation/settings.png')} style={[styles.icon, current==='Settings' && {tintColor: '#fb7401'}]} />
                <Text style={[styles.buttonText, current==='Settings' && {color: '#fb7401'}]}>Settings</Text>
            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        width: '100%',
        backgroundColor: '#2e3a1e',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 34,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    button: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8
    },

    icon: {
        width: 32,
        height: 32,
        marginBottom: 8
    },

    buttonText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#999'
    }


})

export default Navigation;
