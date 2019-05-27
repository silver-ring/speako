import React from "react";
import ContactUs from "../view/ContactUs";
import HomePage from "../view/HomePage";
import {Route, Switch} from "react-router";
import PrivacyAndTerms from "../view/PrivacyAndTerms";

const ContentRouter = (props) => {

    let appRouter = [];

    appRouter.push({path: "/PrivacyAndTerms", component: PrivacyAndTerms});
    appRouter.push({path: "/ContactUs", component: ContactUs});
    appRouter.push({path: "/", component: HomePage});

    return (
        <Switch>
            {appRouter.map((router) => (<Route path={router.path} render={(routeProps) => (
                <router.component {...routeProps} {...props} />
            )}/>))}

        </Switch>
    )

};

export default ContentRouter;
