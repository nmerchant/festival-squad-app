import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, Animated } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';

import ReactionContainer from './reactions/reaction-container';

const styles = require('../../styles/styles');

export default class AddReactionButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showReactionContaier: false
        };
    }

    render() {
        let reactionContainer = null;

        if (this.state.showReactionContaier) {
            reactionContainer = <ReactionContainer />;
        }

        return (
            <View>
                <TouchableOpacity
                    onPress={this.onPress}
                    onLongPress={this.onLongPress}
                    onPressOut={this.onPressOut}
                    delayLongPress={200}
                    style={[styles.reactionContainer, {
                        width: 36,
                        height: 30,
                        marginTop: 10
                    }]}
                >
                     <Icon
                         name='smiley'
                         type='octicon'
                         color='#7f7f7f'
                         size={18}
                     />
                 </TouchableOpacity>
                 {reactionContainer}
            </View>
        )
    }

    onPress = () => {
        console.log('react');
    }

    onLongPress = () => {
        this.setState({showReactionContaier: true});
    }

    onPressOut = () => {
        this.setState({showReactionContaier: false});
    }
};
