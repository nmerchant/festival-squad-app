import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SocialIcon, Button, Avatar } from 'react-native-elements';

import Post from './post';

const styles = require('../../styles/styles');

export default class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            posts: null
        };

        this.eventDocRef = this.props.eventDocRef;
    }

    componentDidMount() {
        this.fetchPosts();
    }

    render() {
        if (this.state.loading) {
            return(
                <View style={[styles.baseStyle, styles.container]}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <View style={[styles.baseStyle]}>
                {this.state.posts.map((doc) => {
                    const data = doc;
                    return <Post key={data.id} doc={data} user={this.props.user} />
                })}
            </View>
        )
    }

    fetchPosts() {
        this.setState({ loading: true });

        this.eventDocRef.collection('posts').orderBy('createdDate', 'desc').get().then((data) => {
            const docs = data.docs;

            this.setState({
                loading: false,
                posts: docs
            });
        });
    }
};
