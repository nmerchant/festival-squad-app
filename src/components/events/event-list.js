import React, { Component } from 'react';
import { Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SocialIcon, Button, Avatar, Card } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';

import EventCard from './event-card';
import EventListFilter from './event-list-filter';

const colors = require('../../styles/colors');
const styles = require('../../styles/styles');

export default class EventListScreen extends Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore();

        this.state = {
            loading: false,
            orderBy: this.props.orderBy || 'startDate',
            viewType: this.props.viewType || 'thumbnail'
        };
    }

    render() {
        const count = this.props.eventCount || '0';
        let festivalCountString = (' upcoming event' + (count === 1 ? '' : 's')).toUpperCase();
        let content = (
            <FlatList containerStyle={{flex: 1}}
                data={this.props.events}
                extraData={this.state}
                onRefresh={this.fetch}
                refreshing={this.state.loading}
                renderItem={(item) => {
                    return (
                        <EventCard
                            navigation={this.props.navigation}
                            data={item}
                            user={this.props.user}
                            viewType={this.state.viewType}
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

        return(
            <View style={[styles.baseStyle, { padding: 10 }]}>
                <EventListFilter
                    orderBy={this.state.orderBy}
                    onFilterChange={this.onFilterChange}
                    viewType={this.state.viewType}
                    rerender={this.rerender}
                />
                <Text style={[styles.bodyText, styles.subheaderText, {padding: 10, paddingTop: 0}]}>
                    <Text style={{fontSize: 20, color: 'white'}}>{count}</Text>{festivalCountString}
                </Text>
                {content}
            </View>
        );
    }

    rerender = (params) => {
        this.setState({
            orderBy: params.orderBy,
            viewType: params.viewType,
            favorites: params.favorites,
            attending: params.attending
        });
    }

    fetch = () => {
        this.onFilterChange({
            orderBy: this.state.orderBy,
            viewType: this.state.viewType,
            favorites: this.state.favorites,
            attending: this.state.attending
        });
    }

    onFilterChange = (data) => {
        this.setState({
            loading: true
        });

        this.props.fetchEvents(data, (params) => {
            console.log('done loading');
            this.setState({
                loading: false,
                orderBy: params.orderBy,
                viewType: params.viewType,
                favorites: params.favorites,
                attending: params.attending
            });
        });
    }
};
