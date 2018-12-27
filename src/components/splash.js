import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SocialIcon, Button, Avatar } from 'react-native-elements';

import logo from '../images/logo.png';

const styles = require('../styles/styles');

export default class SplashScreen extends Component {
    render() {
        return (
            <View style={[styles.baseStyle, styles.container]}>
                <Image
                    source={logo}
                >
                </Image>
            </View>
        )
    }
};
