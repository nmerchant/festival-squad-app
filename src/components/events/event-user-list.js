import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SocialIcon, Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';

import EventUser from './event-user';

const styles = require('../../styles/styles');

export default class EventUserList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };

        this.onPress = this.onPress.bind(this);
    }

    render() {
        if (this.state.loading) {
            return(
                <View style={[styles.baseStyle, styles.container]}>
                    <ActivityIndicator />
                </View>
            );
        }

        const attending = this.props.attending;

        return (
            <View style={[styles.baseStyle, { marginTop: 10, marginBottom: 10 }]}>
                <Text style={styles.bodyText}><Text style={{ fontSize: 18, fontWeight: 'bold' }}>{attending && attending.length}</Text> people going</Text>
                <View style={[styles.baseStyle, { flexDirection: 'row', marginTop: 10 }]}>
                    {attending && attending.map((data) => {
                        return (
                            <EventUser
                                key={data.id}
                                data={data}
                                onPress={this.onPress}
                            />
                        );
                    })}
                </View>
            </View>
        )
    }

    onPress = (user) => {
        console.log('bubbling up', user);
        this.props.openProfileScreen(user);
    }
};
