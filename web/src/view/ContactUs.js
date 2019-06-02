import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import {CircularProgress} from "@material-ui/core";


const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

const sendContactUs = async function (yourName, yourEmail, message) {
    try {
        const json = {yourName, yourEmail, message};
        const url = `${process.env.REACT_APP_PROXY_URL}/sendcontactus`;
        const result = await axios.post(url, json);
        if (result.data.messageId) {
            return;
        } else {
            throw("Error");
        }
    } catch (e) {
        throw("Unknown error please try again");
    }
};

export class ContactUs extends React.Component {

    state = {
        yourEmail: '',
        yourName: '',
        message: '',
        loadSending: false
    };

    componentDidMount = () => {
        this.props.onPageLoadingEnd();
    };


    handleYourNameChange = (event) => {
        const yourName = event.target.value;
        this.setState({
            yourName
        })
    };


    handleYourEmailChange = (event) => {
        const yourEmail = event.target.value;
        this.setState({
            yourEmail
        })
    };


    handleMessageChange = (event) => {
        const message = event.target.value;
        this.setState({
            message
        })
    };

    handleOnSend = () => {

        try {
            this.validateForm();
        } catch (e) {
            alert(e);
            return;
        }

        const {yourName, yourEmail, message} = this.state;

        sendContactUs(yourName, yourEmail, message).then(() => {
            alert('Thank your for contacting us!');
            this.setState({
                loadSending: false,
                yourName: '',
                yourEmail: '',
                message: ''
            })
        }).catch(reason => {
            alert(reason);
            this.setState({
                loadSending: false
            })
        });

        this.setState({
            loadSending: true
        })
    };

    validateForm = () => {
        const {yourName, yourEmail, message} = this.state;

        if (!yourName) {
            throw("please enter your name");
        }

        if (!yourEmail) {
            throw("please enter your email");
        }

        if (!message) {
            throw("please enter message");
        }

    };

    render = () => {

        const {classes} = this.props;
        const {yourName, yourEmail, message, loadSending} = this.state;

        return (
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Contact Us
                    </Typography>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="yourName"
                                    label="Your Name"
                                    id="yourName"
                                    value={yourName}
                                    onChange={this.handleYourNameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Your Email Address"
                                    name="yourEmail"
                                    value={yourEmail}
                                    autoComplete="email"
                                    onChange={this.handleYourEmailChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="message"
                                    label="Message"
                                    value={message}
                                    required
                                    multiline
                                    rows={10}
                                    fullWidth={true}
                                    margin="normal"
                                    variant="outlined"
                                    onChange={this.handleMessageChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleOnSend}
                            disabled={loadSending}>
                            {loadSending ?
                                <CircularProgress size={25}/>
                                :
                                "Send"
                            }
                        </Button>
                    </form>
                </div>
            </Container>
        );
    };

}

export default withStyles(styles)(ContactUs);
