import React from 'react';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from './assets/img/logo.png';
import {AppBar, CircularProgress, TextField, withStyles} from "@material-ui/core";
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


const convertTextToSpeech = async function (text, languageSelection) {
    try {
        const json = {text, languageSelection};
        const url = `${process.env.REACT_APP_PROXY_URL}/demotts`;
        const result = await axios.post(url, json);
        return result.data.audioContent;
    } catch (e) {
        throw("Unknown error please try again");
    }
};

export class HomePage extends React.Component {

    state = {
        options: [],
        text: '',
        oldText: '',
        pageLoading: false,
        convertLoading: false,
        speakLoading: false,
        downloadLoading: false,
        audioContent: null,
        languageSelection: null,
    };

    componentDidMount = () => {

        const url = `${process.env.REACT_APP_PROXY_URL}/homepage`;

        axios.get(url).then(({data}) => {

            const options = data.voices.map(item => (
                {
                    value: item.id,
                    label: `${item.language} - ${item.country} (${item.gender} - ${item.name})`
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

        try {
            this.validate();
        } catch (e) {
            alert(e);
            return;
        }

        if (text === oldText) {
            this.audioPlayer.play();
            return;
        }

        convertTextToSpeech(text, languageSelection).then(audioContent => {
            this.previewAudioPlayer.src = `data:audio/mp3;base64,${audioContent}`;
            this.previewAudioPlayer.load();
            this.setState({
                speakLoading: false,
                convertLoading: false,
                audioContent,
                oldText: text,
            });
        }).catch(reason => {
            alert(reason);
            this.setState({
                speakLoading: false,
                convertLoading: false
            })
        });

        this.setState({
            speakLoading: true,
            convertLoading: true
        })
    };

    handleOnDownload = () => {

        const {languageSelection, text, oldText} = this.state;

        try {
            this.validate();
        } catch (e) {
            alert(e);
            return;
        }
        if (text === oldText) {
            this.downloadLink.click();
            return;
        }

        convertTextToSpeech(text, languageSelection).then(audioContent => {
            this.downloadLink.href = `data:audio/mp3;base64,${audioContent}`;
            this.downloadLink.click();
            this.setState({
                convertLoading: false,
                downloadLoading: false,
                audioContent,
                oldText: text
            })
        }).catch(reason => {
            alert(reason);
            this.setState({
                convertLoading: false,
                downloadLoading: false,
            })
        });
        this.setState({
            convertLoading: true,
            downloadLoading: true,
        })
    };

    handleOnFilter = (option, searchText) => {
        const searchParts = searchText.split(' ');
        let matchParts = 0;
        for (let i = 0; i < searchParts.length; i++) {
            if (searchParts[i].toLowerCase() === 'male') {
                if (!option.label.toLowerCase().includes('female'.toLowerCase())) {
                    matchParts++;
                }
            } else {
                if (option.label.toLowerCase().includes(searchParts[i].toLowerCase())) {
                    matchParts++;
                }
            }
        }
        return matchParts === searchParts.length;
    };

    validate = () => {
        const {languageSelection, text} = this.state;
        if (!languageSelection) {
            throw("please select speako voice");
        }
        if (!text) {
            throw("please write text to be converted");
        }
    };

    render = () => {

        const {options, text, pageLoading, convertLoading, speakLoading, downloadLoading, audioContent} = this.state;
        const {classes} = this.props;

        return (
            <React.Fragment>
                <CssBaseline/>
                <AppBar position={"sticky"} color={"inherit"}>
                    <Toolbar>
                        <a href={"/"}>
                            <img alt="Speako" src={logo} className={classes.logoAvatar}/>
                        </a>
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
                            Speako Text-to-Speech converts text into human-like speech in more than 100 voices
                            across
                            20+ languages and variants.
                            It applies machine learning and artificial intelligent algorithms to deliver
                            high-fidelity
                            audio.
                            With this easy-to-use API, you can create lifelike interactions with your users that
                            transform customer service,
                            device interaction, and other applications.
                        </Typography>
                        <Typography variant="h4" color="textPrimary" gutterBottom>
                            Convert your text to speech for free right now
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" paragraph>
                            Type what you want, select a language then click “Speak” to convert text to speech,
                            You can play the audio online or download the audio as mp3 file.
                            The text language must match the selected voice language: Mixing language (English text
                            with a Spanish male voice) does not produce valid results.
                        </Typography>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isDisabled={false}
                            isLoading={pageLoading}
                            isClearable={true}
                            isSearchable={true}
                            name="color"
                            placeholder={'Select Speako Voice'}
                            options={options}
                            onChange={this.handleInputChange}
                            filterOption={this.handleOnFilter}
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
                        <Button onClick={this.handleOnSpeak} color={"primary"} className={classes.button}
                                disabled={speakLoading || convertLoading}>
                            {"Speak"}
                            {speakLoading ? <CircularProgress className={classes.controlsIcon} size={25}/> :
                                <SpeakIcon className={classes.controlsIcon}/>}
                        </Button>

                        <Button color="primary" disabled={downloadLoading || convertLoading}
                                className={classes.button} onClick={this.handleOnDownload}>
                            {"Download"}
                            {downloadLoading ? <CircularProgress className={classes.controlsIcon} size={25}/> :
                                <DownloadIcon className={classes.controlsIcon}/>}

                        </Button>
                        <a style={{display: 'none'}} ref={downloadLink => this.downloadLink = downloadLink}
                           download={'speako.mp3'} href={`data:audio/mp3;base64,${audioContent}`}/>
                        <div className={classes.likeButton}>
                            <LikeFacebookButton/>
                        </div>
                        <audio src={`data:audio/mp3;base64,${audioContent}`}
                               ref={audioPlayer => this.audioPlayer = audioPlayer}/>
                        <audio src='' autoPlay={true}
                               ref={previewAudioPlayer => this.previewAudioPlayer = previewAudioPlayer}/>
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

export default withStyles(styles)(HomePage);
