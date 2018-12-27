import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SocialIcon, Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';

const styles = require('../../styles/styles');

export default class EventUser extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;

        this.state = {
            loading: false
        };

        this.onPress = this.onPress.bind(this);
    }

    componentDidMount() {
        if (!this.data.picture) {
            this.setState({ picture: this.data.facebookPicture || '' });
            return;
        }

        const imageRef = firebase.storage().ref('users/' + this.data.id).child(this.data.picture);
        imageRef.getDownloadURL().then((uri) => {
            this.setState({ picture: uri });
        });
    }

    render() {
        let avatarProps = {
            containerStyle: {
                marginRight: 10
            },
            small: true,
            rounded: true,
            onPress: this.onPress
        };
        let picture = this.state.picture || '';

        if (picture) {
            avatarProps.source = { uri: picture };
        }

        if (picture) {
            avatarProps.source = { uri: picture };
        }

        return (
            <Avatar {...avatarProps} />
        );
    }

    onPress() {
        console.log('press event user', this.data);
        this.props.onPress(this.data);
    }
};
