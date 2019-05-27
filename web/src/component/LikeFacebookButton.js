import React, {Component} from 'react';
import {FacebookProvider, Like} from 'react-facebook';

class LikeFacebookButton extends Component {
    render() {
        return (
            <FacebookProvider appId="2271321562982439">
                    <Like href="http://www.speako.io" layout="button_count" size="large"/>
            </FacebookProvider>
        );
    }
}

export default LikeFacebookButton;
