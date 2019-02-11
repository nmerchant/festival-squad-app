import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { SocialIcon, Button, Avatar, Card } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { StackRouter } from 'react-navigation';

const styles = require('../../styles/styles');

export default class Ticket extends Component {
    constructor(props) {
        super(props);

        this.data = props.item.item.data();
        this.ticketTypes = [];

        props.ticketTypes.forEach((ticket) => {
            this.ticketTypes.push(ticket.data());
        });

        const ticketType = this.ticketTypes.find((ticketType) => {
            return ticketType.id === this.data.ticketTypeId;
        });
        this.name = ticketType.name;

        console.log(this.name);
    }

    render() {
        return (
            <View style={[styles.baseStyle, {
                borderWidth: 1,
                borderColor: 'white',
                padding: 10,
                marginBottom: 10
            }]}>
                <Text style={styles.bodyText}>
                    {this.name}
                </Text>
            </View>
        )
    }
};
