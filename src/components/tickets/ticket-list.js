import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';

import Ticket from './ticket';

const colors = require('../../styles/colors');
const styles = require('../../styles/styles');


export default class TicketList extends Component {
    constructor(props) {
        super(props);

        this.screenProps = this.props.screenProps;
        this.eventDoc = this.props.eventDoc;
        this.user = this.props.user;
        this.fbUser = this.user.fbUser;

        this.state = {
            loading: false,
            ticketCount: 0,
            tickets: null,
            ticketTypes: [],
            orderBy: 'postDate'
        };
    }

    componentDidMount() {
        this.fetchTicketTypes(()=> {
            this.fetch();
        });
    }

    render() {
        console.log('render', this.state);
        const count = this.state.ticketCount || '0';
        let ticketCountString = (' ticket' + (count === 1 ? '' : 's') + ' available').toUpperCase();
        let content = (
            <FlatList containerStyle={{flex: 1}}
                data={this.state.tickets}
                extraData={this.state}
                onRefresh={this.fetch}
                refreshing={this.state.loading}
                renderItem={(item) => {
                    return (
                        <Ticket
                            item={item}
                            ticketTypes={this.state.ticketTypes}
                        />
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        );

        if (this.state.loading) {
            content = (
                <View style={[styles.baseStyle, styles.container]}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <View>
                <Text style={[styles.bodyText, styles.subheaderText, {paddingTop: 10, paddingBottom: 10}]}>
                    <Text style={{fontSize: 20, color: 'white'}}>{count}</Text>{ticketCountString}
                </Text>
                {content}
            </View>
        )
    }

    rerender = (params) => {
        this.setState({
            orderBy: params.orderBy,
            viewType: params.viewType
        });
    }

    fetch = () => {
        this.onFilterChange({
            orderBy: this.state.orderBy,
            viewType: this.state.viewType
        });
    }

    onFilterChange = (data) => {
        this.setState({
            loading: true
        });

        this.fetchTickets(data, (params) => {
            this.setState({
                loading: false,
                orderBy: params.orderBy,
                viewType: params.viewType
            });
        });
    }

    fetchTickets = (params, callback) => {
        let filtering = false;

        if (params) {
            this.params = params;
        } else {
            params = this.params;
        }
        if (callback) {
            this.callback = callback;
        } else {
            callback = this.callback;
        }

        let ticketsDb = this.eventDoc.ref.collection('tickets');

        ticketsDb = ticketsDb.orderBy(params && params.orderBy || 'postDate');

        ticketsDb.get().then((ticketsData) => {
            let tickets = ticketsData.docs;

            this.setState({
                loading: false,
                tickets: tickets,
                ticketCount: tickets.length
            });

            if (callback) {
                callback(params);
            }
        });
    }

    fetchTicketTypes = (callback) => {
        let ticketTypesDb = this.eventDoc.ref.collection('ticketTypes');

        ticketTypesDb.get().then((ticketTypesData) => {
            let ticketTypes = ticketTypesData.docs;

            console.log(ticketTypes);

            this.setState({
                ticketTypes: ticketTypes
            });

            if (callback) {
                callback();
            }
        });
    }
};
