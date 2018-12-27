import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { SocialIcon, Button, Avatar } from 'react-native-elements';

import logo from '../images/logo.png';

const styles = require('../styles/styles');

export default class LoginScreen extends Component {
    render() {
        return (
            <View style={[styles.baseStyle, styles.container]}>
                <Image
                    source={logo}
                    style={{
                        resizeMode: 'contain',
                        width: 300,
                        height: 160
                    }}
                >
                </Image>
                <SocialIcon
                    style={{
                        width: 225
                    }}
                    title='Sign In With Facebook'
                    button
                    type='facebook'
                    onPress={this.props.facebookLogin}
                />
            </View>
        )
    }
};
