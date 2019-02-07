import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, Animated } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';

const styles = require('../../../styles/styles');

export default class Reaction extends Component {
    constructor(props) {
        super(props);

        this.db = firebase.firestore();
    }

    render() {
        return (
            <Text style={styles.reaction}>{this.props.children}</Text>
        )
    }
};
