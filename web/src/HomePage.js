import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import logo from './assets/img/logo.png';
import {AppBar, CircularProgress, TextField} from "@material-ui/core";
import DownloadIcon from '@material-ui/icons/CloudDownload';
import SpeakIcon from '@material-ui/icons/KeyboardVoice';
import {SimpleShareButtons} from "react-simple-share";
import Select from 'react-select';
import axios from 'axios';
import LikeFacebookButton from "./LikeFacebookButton";
import Button from '@material-ui/core/Button';

const styles = theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        }
    },
    appBar: {
        position: 'sticky'
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginTop: '25px',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(900 + theme.spacing(3 * 2))]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
    },
    cardHeader: {
        backgroundColor: theme.palette.common.white,
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),
    },
    cardActions: {
        [theme.breakpoints.up('sm')]: {
            paddingBottom: theme.spacing(2),
        },
    },
    footer: {
        marginTop: theme.spacing(8),
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: `${theme.spacing(6)}px 0`,
    },
    avatar: {
        margin: '5px',
        height: '10%',
    },
    logoAvatar: {
        margin: '1%',
        width: '150px',
    },
    loading: {
        marginLeft: '50%',
        marginTop: '5%'
    },
    likeButton: {
        marginTop: '5px',
        float: 'right',
    },
    controlsIcon: {
        float: 'left',
        marginLeft: '5px',
    }
});

const tiers = [
    {
        title: 'Free',
        price: '0',
        description: ['10 users included', '2 GB of storage', 'Help center access', 'Email support'],
        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
    },
    {
        title: 'Pro',
        subheader: 'Most popular',
        price: '15',
        description: [
            '20 users included',
            '10 GB of storage',
            'Help center access',
            'Priority email support',
        ],
        buttonText: 'Get started',
        buttonVariant: 'contained',
    },
    {
        title: 'Enterprise',
        price: '30',
        description: [
            '50 users included',
            '30 GB of storage',
            'Help center access',
            'Phone & email support',
        ],
        buttonText: 'Contact us',
        buttonVariant: 'outlined',
    },
];
const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: ['Cool stuff', 'Random feature', 'Team feature', 'Developer stuff', 'Another one'],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

export class HomePage extends React.Component {

    state = {
        options: [],
        text: '',
        oldText: '',
        pageLoading: false,
        speakLoading: false,
        data: null,
        languageSelection: null,
    };

    componentDidMount = () => {

        const url = `${process.env.REACT_APP_PROXY_URL}/homepage`;

        axios.get(url).then(({data}) => {

            const options = data.voices.map(item => (
                {
                    value: item.id,
                    label: `${item.country ? item.language + ' - ' + item.country : item.language} (${item.gender} - ${item.name})`
                }
            ));
            this.setState({
                options: options,
                pageLoading: false
            })
        }).catch(reason => {
            console.log(reason);
        });
        this.setState({
            pageLoading: true
        })
    };

    handleChangeText = (event) => {
        const text = event.target.value;
        if (text.length >= 1000) {
            alert("You reach the limit of 1000 character");
            return;
        }
        this.setState({
            text
        });
    };

    handleInputChange = (selectedOption) => {
        if (selectedOption) {
            this.setState({
                languageSelection: selectedOption.value
            })
        } else {
            this.setState({
                languageSelection: null
            })
        }
    };

    handleOnSpeak = () => {
        const {languageSelection, text, oldText} = this.state;
        if (!languageSelection) {
            alert("please select speako voice");
            return;
        }
        if (!text) {
            alert("please write text to be converted");
            return;
        }

        if (text === oldText) {
            this.audioPlayer.play();
            return;
        }

        const json = {
            text: this.state.text,
            languageSelection: this.state.languageSelection
        };

        const url = `${process.env.REACT_APP_PROXY_URL}/demotts`;

        axios.post(url, json)
            .then(value => {
                this.setState({
                    speakLoading: false,
                    data: value.data.audioContent,
                    oldText: text
                })
            }).catch(() => {
            alert("Unknown error please try again");
            this.setState({
                speakLoading: false
            })
        });
        this.setState({
            speakLoading: true
        })
    };

    render = () => {

        const {options, text, pageLoading, speakLoading, data} = this.state;
        const {classes} = this.props;

        return (
            <React.Fragment>
                <CssBaseline/>
                <AppBar position={"sticky"} color={"inherit"}>
                    <Toolbar>
                        <img alt="Speako" src={logo} className={classes.logoAvatar}/>
                    </Toolbar>
                </AppBar>
                {pageLoading ?
                    <CircularProgress className={classes.loading}/>
                    : <React.Fragment/>
                }
                {pageLoading ?
                    <React.Fragment/>
                    : <main className={classes.layout}>
                        {/* Hero unit */}
                        <Typography variant="h4" color="textPrimary" gutterBottom>
                            Convert Text to Speech
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" paragraph>
                            Speako Text-to-Speech converts text into human-like speech in more than 100 voices across
                            20+ languages and variants.
                            It applies machine learning and artificial intelligent algorithms to deliver high-fidelity
                            audio.
                            With this easy-to-use API, you can create lifelike interactions with your users that
                            transform customer service,
                            device interaction, and other applications.
                        </Typography>

                        <Typography variant="h4" color="textPrimary" gutterBottom>
                            Convert your text to speech for free right now
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" paragraph>
                            Type what you want, select a language then click “Speak” to convert text to mp3 audio
                            file, You can play the audio online or download the audio as mp3 file.
                            The text language must match the selected voice language: Mixing language (English text with
                            a Spanish male voice) does not produce valid results.
                        </Typography>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={''}
                            isDisabled={false}
                            isLoading={pageLoading}
                            isClearable={true}
                            isRtl={false}
                            isSearchable={true}
                            name="color"
                            placeholder={'Select Speako Voice'}
                            options={options}
                            onChange={this.handleInputChange}
                        />
                        <TextField
                            id="text"
                            multiline
                            rows={10}
                            fullWidth={true}
                            value={text}
                            onChange={this.handleChangeText}
                            margin="normal"
                            variant="outlined"
                        />
                        <Button onClick={this.handleOnSpeak} color={"primary"} size={"large"} disabled={speakLoading}>
                            {"Speak"}
                            {speakLoading ? <CircularProgress className={classes.controlsIcon} size={25}/> :
                                <SpeakIcon className={classes.controlsIcon}/>}
                        </Button>
                        {data ?
                            <a href={`data:audio/mp3;base64,${data}`} download color={"default"}
                               style={{textDecoration: 'none', margin: '5px'}}>
                                <Button color="primary" className={classes.button}>
                                    {"Download"}
                                    <DownloadIcon className={classes.controlsIcon}/>
                                </Button>
                            </a>
                            :
                            <Button color="primary" className={classes.button} disabled={true}>
                                {"Download"}
                                <DownloadIcon className={classes.controlsIcon}/>
                            </Button>
                        }
                        <div className={classes.likeButton}>
                            <LikeFacebookButton/>
                        </div>
                        <audio src={`data:audio/mp3;base64,${data}`} autoPlay={true}
                               ref={audioPlayer => this.audioPlayer = audioPlayer}/>
                    </main>
                }
                {/* Footer */}
                {pageLoading ?
                    <React.Fragment/>
                    : <footer className={classNames(classes.footer, classes.layout)}>
                        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                            Build With
                            <span role="img" aria-label="Love">❤️</span>
                            By Speako Team
                        </Typography>
                        <div align={"center"}>
                            <SimpleShareButtons url='http://www.speako.io/'/>
                        </div>
                    </footer>
                }
                {/* End footer */}
            </React.Fragment>
        );
    }
}

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
