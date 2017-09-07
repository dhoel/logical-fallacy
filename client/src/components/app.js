import React from 'react';
import * as actions from '../actions/actions-index';
import { connect } from 'react-redux';
import QuestionPage from './question-page';
import LoginPage from './login-page';

export class App extends React.Component {

  componentDidMount() {
    this.props.dispatch(actions.validateUser());
}

  render() {
    if (!this.props.userName) {
      return <LoginPage />;
    } else {
      return <QuestionPage selectAnswer={'Select an Answer'}/>;
    }
  };
};

const mapStateToProps = (state, props) => ({
  userName: state.userName
});

export default connect(mapStateToProps)(App);
