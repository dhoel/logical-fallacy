import React from 'react';
import * as actions from '../actions/actions-index';
import {connect} from 'react-redux';
import Dropdown from 'react-accessible-dropdown';
import AnswerResponse from './answer-response';
import { CSSTransitionGroup } from 'react-transition-group';

export class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showWarning: false,
      answerValue: this.props.selectAnswer
    };
  }

  hideWarning() {
    this.setState({
      answerValue: this.answer.state.selected.value,
      showWarning: false
    });
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchQuestion());
    this.props.dispatch(actions.fetchAnswers());
  }

  onSubmit(e) {
    e.preventDefault();
    const selectAnswer = this.props.selectAnswer;
    if (this.answer.state.selected !== selectAnswer) {
      const answer = {
          answer: this.answer.state.selected.toLowerCase()
      };
      this.props.dispatch(actions.validateAnswer(answer));
      this.setState({answerValue: selectAnswer});
    } else {
      this.setState({showWarning: true});
    }
  }

  render() {

    const transitionOptions = {
      transitionName: 'fade',
      transitionEnterTimeout: 200,
      transitionLeaveTimeout: 200
    };

    const question = this.props.question;
    const answerOptions = this.props.answers;

    return (
      <div className='question-page'>
        <nav className='topnav'>
          <h2 className='user-greet' >Welcome {this.props.userName}</h2>
          <span className='title-Qpage' >Logical Fallacy X</span>
          <a className='btn btn-logout' href='/api/auth/logout'>Log Out</a>
        </nav>
        <section className='quiz-main'>
          <p>Which logical fallacy is defined as:</p>
          <div className='question'>
            {question}
          </div>
          <div className='submit-answer'>
            <form onSubmit={this.onSubmit.bind(this)}>
              <Dropdown options={answerOptions} disabled={this.props.showResponse}
                value={this.state.answerValue} ref={ref => this.answer = ref}
                onChange={() => setTimeout(this.hideWarning.bind(this), 50)} />
              <button type='submit' className='btn btn-submit'
                disabled={this.props.showResponse}>Submit</button>
            </form>
          </div>
          <div className='totals'>
            <span className='num num-questions'
              >Questions Attempted: {this.props.totalQs}</span>
            <span className='num num-correct'
              >Correct Answers: {this.props.correctQs}</span>
          </div>
        </section>
        <CSSTransitionGroup {...transitionOptions}>
          {this.props.showResponse ?
            <div className='response'>
              <AnswerResponse />
            </div> : ''}
        </CSSTransitionGroup>
        <CSSTransitionGroup {...transitionOptions}>
          {this.state.showWarning ?
            <div className='warning'>
              <span>Please select an answer</span>
            </div> : '' }
        </CSSTransitionGroup>

      </div>

    );
  }
}

const mapStateToProps = (state, props) => ({
  userName: state.userName,
  question: state.question,
  answers: state.answers,
  isCorrect: state.isCorrect,
  showResponse: state.showResponse,
  totalQs: state.totalQs,
  correctQs: state.correctQs
});

export default connect(mapStateToProps)(QuestionPage);
