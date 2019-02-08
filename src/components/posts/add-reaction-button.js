import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, Animated } from 'react-native';
import { SocialIcon, Button, Avatar, Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import Popover from 'react-native-popover-view';

import ReactionContainer from './reactions/reaction-container';

const styles = require('../../styles/styles');

export default class AddReactionButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showReactionContainer: false
        };
    }

    render() {
        let reactionContainer = null;

        if (this.state.showReactionContainer) {
            reactionContainer = <ReactionContainer />;
        }

        return (
            <View>
                <TouchableOpacity
                    ref={ref => this.touchable = ref}
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
                 <Popover
                    isVisible={this.state.showReactionContainer}
                    showInModal={false}
                    placement='auto'
                    onClose={() => this.closePopover()}>
                    <ReactionContainer />
                 </Popover>
            </View>
        )
    }

    onPress = () => {
        console.log('on press');
        this.setState({showReactionContainer: false});
    }

    onLongPress = () => {
        console.log('on long press');
        this.setState({showReactionContainer: true});
    }

    onPressOut = () => {
        console.log('on press out');
        this.setState({showReactionContaier: false});
    }

    closePopover = () => {
        console.log('close popover');
        this.setState({showReactionContaier: false});
    }
};
