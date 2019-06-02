import React from 'react';
import Typography from '@material-ui/core/Typography';
import {CircularProgress, TextField, withStyles} from "@material-ui/core";
import DownloadIcon from '@material-ui/icons/CloudDownload';
import SpeakIcon from '@material-ui/icons/KeyboardVoice';
import StopIcon from '@material-ui/icons/Stop';
import Select from 'react-select';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import LikeFacebookButton from "../component/LikeFacebookButton";

const styles = theme => ({
    likeButton: {
        marginTop: '5px',
        float: 'right',
    },
    controlsIcon: {
        float: 'left',
        marginLeft: '5px',
    }
});

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
        isPlaying: false
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
            });
            this.props.onPageLoadingEnd();
        }).catch(() => {
            this.setState({
                pageLoading: false
            });
            this.props.onPageLoadingEnd();
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

    handleOnReset = () => {
        this.previewAudioPlayer.load();
        this.previewAudioPlayer.pause();
        this.audioPlayer.load();
        this.audioPlayer.pause();
        this.setState({
            isPlaying: false
        })
    };

    handleOnStop = () => {
        this.setState({
            isPlaying: false
        })
    };

    handleOnPlay = () => {
        this.setState({
            isPlaying: true
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

        const {options, text, pageLoading, convertLoading, speakLoading, downloadLoading, audioContent, isPlaying} = this.state;
        const {classes} = this.props;

        if (pageLoading) {
            return <React.Fragment/>;
        }

        return (
            <React.Fragment>
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
                {isPlaying ?
                    < Button onClick={this.handleOnReset} color={"primary"} className={classes.button}>
                        {"Stop"}
                        <StopIcon className={classes.controlsIcon}/>
                    </Button>
                    :
                    <Button onClick={this.handleOnSpeak} color={"primary"} className={classes.button}
                            disabled={speakLoading || convertLoading}>
                        {"Speak"}
                        {speakLoading ? <CircularProgress className={classes.controlsIcon} size={25}/> :
                            <SpeakIcon className={classes.controlsIcon}/>}
                    </Button>
                }
                <Button color="primary" disabled={downloadLoading || convertLoading || isPlaying}
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
                <audio src={`data:audio/mp3;base64,${audioContent}`} onPlay={this.handleOnPlay} onEnded={this.handleOnStop}
                       ref={audioPlayer => this.audioPlayer = audioPlayer}/>
                <audio src='' autoPlay={true} onPlay={this.handleOnPlay} onEnded={this.handleOnStop}
                       ref={previewAudioPlayer => this.previewAudioPlayer = previewAudioPlayer}/>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(HomePage);
