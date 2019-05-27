import React from 'react';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import logo from './../assets/img/logo.png';
import {AppBar, CircularProgress, withStyles} from "@material-ui/core";
import {SimpleShareButtons} from "react-simple-share";
import Link from "@material-ui/core/Link";
import ContentRouter from "../router/ContentRouter";

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
    topMenuLink: {
        margin: theme.spacing(1, 1.5),
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
    }
});

class AppContainer extends React.Component {

    state = {
        pageLoading: true
    };

    handlePageLoadingEnd = () => {
        this.setState({
            pageLoading: false
        });
    };

    render = () => {

        const {classes} = this.props;
        const {pageLoading} = this.state;

        return (
            <React.Fragment>
                <CssBaseline/>
                <AppBar position={"sticky"} color={"inherit"}>
                    <Toolbar>
                        <div className={classes.toolbarTitle}>
                            <a href={'/'} className={classes.toolbarTitle}>
                                <img alt="Speako" src={logo} className={classes.logoAvatar}/>
                            </a>
                        </div>
                        <div>
                            <Link variant="button" color="textPrimary" href="/"
                                  className={classes.topMenuLink}>
                                Home
                            </Link>
                            <Link variant="button" color="textPrimary" href="/ContactUs"
                                  className={classes.topMenuLink}>
                                Contact Us
                            </Link>
                            <Link variant="button" color="textPrimary" href="/PrivacyAndTerms"
                                  className={classes.topMenuLink}>
                                PRIVACY & TERMS
                            </Link>
                        </div>
                    </Toolbar>
                </AppBar>
                <React.Fragment>
                    {pageLoading ? <CircularProgress className={classes.loading}/> : <React.Fragment/>}
                    <main className={classes.layout}>
                        <ContentRouter onPageLoadingEnd={this.handlePageLoadingEnd}/>
                    </main>
                    {pageLoading ? <React.Fragment/> :
                        <footer className={classNames(classes.footer, classes.layout)}>
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
                </React.Fragment>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(AppContainer);
