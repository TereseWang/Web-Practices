import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import './App.scss';
import Nav from './Nav';
import UsersNew from "./User/New";
import UsersView from "./User/View";
import UsersEdit from "./User/Edit";
import EventList from "./Event/List";
import EventView from "./Event/View";
import EventNew from "./Event/New";
import EventEdit from "./Event/Edit";

function App() {
  return (
    <div>
      <Container fluid className="bg">
        <Nav />
        <Switch>
        </Switch>
      </Container>
      <Container>
        <Route path="/" exact>
          <EventList />
        </Route>
        <Route path="/events/view">
          <EventView />
        </Route>
        <Route path="/events/new">
          <EventNew />
        </Route>
        <Route path="/events/edit">
          <EventEdit />
        </Route>
        <Route path="/users/new">
          <UsersNew />
        </Route>
        <Route path="/users/view">
          <UsersView />
        </Route>
        <Route path="/users/edit">
          <UsersEdit />
        </Route>
      </Container>
    </div>
  );
}

export default App;
