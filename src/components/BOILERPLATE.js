import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';

const colors = require('../styles/colors');
const styles = require('../styles/styles');


export default class EditProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.screenProps = this.props.screenProps;
        this.user = this.screenProps.user;
        this.fbUser = this.user.fbUser;

        this.state = {
            loading: false
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={[styles.baseStyle, {padding: 20, flexDirection: 'column'}]}>
                <Text style={{color: 'white'}}>edit profile screen</Text>
            </View>
        )
    }
};
