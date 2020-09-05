import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { Container } from "react-bootstrap";

import AuthForm from "./pages/AuthForm";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import MyUpload from "./components/MyUpload";
import "./App.scss";
import { AuthProvider } from "./context/authcontext";
import DynamicRoute from "./util/DynamicRoute";
// lazily load
const SongList = lazy(() => import("./pages/SongList"));
const SongCreate = lazy(() => import("./pages/SongCreate"));
const SongDetail = lazy(() => import("./pages/SongDetail"));
// import SongList from "./pages/SongList";
// import SongDetail from "./pages/SongDetail";
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Route path="/" component={NavBar} />
        <Container style={{ marginTop: "5rem" }}>
          <Switch>
            <DynamicRoute path="/" exact component={Home} authenticated />
            <DynamicRoute path="/auth" component={AuthForm} guest />
            <Route path="/upload" component={MyUpload} />
            {/* <Route exact path="/songs" component={SongList} />
            <Route exact path="/songs/:id" component={SongDetail} /> */}
            <Suspense fallback={<div>Loading..</div>}>
              <Route
                exact
                path="/songs"
                render={(props) => <SongList {...props} />}
              />
              <Container style={{ marginTop: "5rem" }}>
                <Switch>
                  <DynamicRoute
                    exact
                    path="/songs/create"
                    authenticated
                    render={(props) => <SongCreate {...props} />}
                  />
                  <DynamicRoute
                    path="/songs/:id"
                    authenticated
                    render={(props) => <SongDetail {...props} />}
                  />
                </Switch>
              </Container>
            </Suspense>
            <Redirect from="**" to="/auth" />
          </Switch>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
