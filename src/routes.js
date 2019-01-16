import React from "react";
import { Switch, Route } from "react-router-dom";
import Menu from "./components/Menu";
import MannWhitney from "./components/Mann-Whitney/Mann-Whitney";
import MultipleProcessing from "./components/MultipleProcessing/MultipleProcessing";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={Menu} />
      <Route path="/multiple_processing" component={MultipleProcessing} />
      <Route path="/mann-whitney" component={MannWhitney} />
    </Switch>
  );
};

export default Router;
