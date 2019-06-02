import React from 'react';
import ReactDOM from 'react-dom';
import IndexRouter from "./router/IndexRouter";
import {BrowserRouter} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2492EB'
        },
    },
    status: {
        danger: 'orange',
    },
});


ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <BrowserRouter><IndexRouter/></BrowserRouter>
    </MuiThemeProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
