import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { SocialIcon, Button, Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';

const styles = require('../../styles/styles');

export default class CreateCommentContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.screenProps = this.props.screenProps;
    }

    componentDidMount() {
        if (!this.props.user.picture) {
            this.setState({ picture: this.props.user.facebookPicture || '' });
            return;
        }

        const imageRef = firebase.storage().ref('users/' + this.props.user.fbUser.id).child(this.props.user.picture);
        imageRef.getDownloadURL().then((uri) => {
            this.setState({ picture: uri });
        });
    }

    render() {
        let avatarProps = {
            containerStyle: {
                marginRight: 20
            },
            medium: true,
            rounded: true
        };
        let picture = this.state.picture || '';

        if (picture) {
            avatarProps.source = { uri: picture };
        }

        return (
            <TouchableOpacity style={{
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 10
                }}
                onPress={this.onPress}>
                <Avatar {...avatarProps} />
                <View style={{
                    borderColor: 'white',
                    borderBottomWidth: 1,
                    height: 40,
                    padding: 10,
                    paddingLeft: 5,
                    flex: 1,
                    marginTop: 5
                }}>
                    <TextInput style={[styles.bodyText, {
                        padding: 0,
                        paddingTop: 10,
                        fontSize: this.state.fontSize
                    }]}
                        placeholder="Add Comment"
                        value={this.state.text}
                        multiline={true}
                        onChangeText={this.onChangeText}
                        placeholderTextColor="#9a9ba0"
                        underlineColorAndroid="transparent"
                        maxLength={1000}>
                    </TextInput>
                </View>
            </TouchableOpacity>
        )
    }

    onPress = () => {
        console.log('post comment: ', this.state.text);
    }
};
