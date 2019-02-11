import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { SocialIcon, Button, Avatar, Card } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { StackRouter } from 'react-navigation';

import TicketList from './ticket-list';

const styles = require('../../styles/styles');

export default class TicketScreen extends Component {
    constructor(props) {
        super(props);

        this.params = this.props.navigation.state.params;
        this.eventDoc = this.params.eventDoc;
        this.user = props.screenProps.user;
    }

    render() {
        return (
            <View style={[styles.baseStyle, { padding: 10 }]}>
                <Button
                    raised
                    title='Post Ticket For Sale'
                    onPress={this.postTicketForSale}
                />
                <TicketList
                    user={this.user}
                    eventDoc={this.eventDoc}
                />
            </View>
        )
    }

    postTicketForSale = () => {

    }
};
