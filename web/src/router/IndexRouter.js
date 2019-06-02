import React from 'react';
import {Route, Switch} from "react-router";
import AppContainer from "../container/AppContainer";

const IndexRouter = () => {

    let appRouter = [];

    appRouter.push({path: "/", component: AppContainer});

    return (
        <Switch>
            {appRouter.map(router => (<Route path={router.path} component={router.component}/>))}
        </Switch>
    )
};

export default IndexRouter;
