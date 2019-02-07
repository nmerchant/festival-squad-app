import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, Animated } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';

import Reaction from './reaction';

const styles = require('../../../styles/styles');

export default class ReactionContainer extends Component {
    constructor(props) {
        super(props);

        this.db = firebase.firestore();
    }

    render() {
        return (
            <View style={[styles.reactionContainer, {
                position: 'absolute',
                width: 'auto',
                padding: 5,
                height: 30,
                left: 40,
                top: 10,
                color: 'white'
            }]}>
                <Reaction>🙂</Reaction>
                <Reaction>❤️</Reaction>
                <Reaction>🔥</Reaction>
                <Reaction>😂</Reaction>
                <Reaction>😢</Reaction>
                <Reaction>😡</Reaction>
                <Reaction>🤮</Reaction>

            </View>
        )
    }
};
