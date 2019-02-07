import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { SocialIcon, Button, Avatar, Card } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { StackRouter } from 'react-navigation';

const styles = require('../../styles/styles');

export default class TicketScreen extends Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore();

        // this.user = props.screenProps.user;
        // this.fbUser = this.user.fbUser;

        this.state ={
            loading: true
        };
    }

    render() {
        if (this.state.loading) {
            // this.fetchEvents();
        }

        return (
            <View style={[styles.baseStyle, { padding: 10 }]}>
                <Button
                    raised
                    title='Post Ticket For Sale'
                    onPress={this.postTicketForSale}
                />
            </View>
        )
    }

    postTicketForSale = () => {
        
    }
};
