import { View } from 'react-native';
import Navigation from './Navigation';

const Default = ({ children, navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#242f16' }}>
            <View style={{flex: 1}}>
                {children}
            </View>
            {
                navigation && (
                    <View style={{width: '100%', position: 'absolute', bottom: 0}}>
                        <Navigation />
                    </View>
                )
            }
        </View>
    )
};

export default Default;