import React from 'react';
import * as actions from '../actions/actions-index';
import {connect} from 'react-redux';

export class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchQuestion());
  }
  onSubmit(e) {
    e.preventDefault();
    let answer = {
        answer: this.answer.value.toLowerCase()
    };
    this.props.dispatch(actions.validateAnswer(answer));
    this.answer.value='';
  }

  render() {

    const question = this.props.definition;

    return (
      <div>
        <div className='user'>
          <h3>{this.props.userName}</h3>
        </div>
        <div className='num-questions'>
          <span>Questions Attempted: {this.props.totalQs}</span>
        </div>
        <div className='correct-answers'>
          <span>Correct Answers: {this.props.correctQs}</span>
        </div>
        <div className='question'>
          {question}
        </div>
        <div className='submit-answer'>
          <form onSubmit={this.onSubmit}>
            <input type="text" id='answer'
              ref={ref => this.answer = ref}
              placeholder='Answer'>
            </input>
            <button type='submit'
              className='btn submit-btn'>Submit</button>
          </form>
        </div>
        <div>
          <a href='/api/auth/logout'>Log Out</a>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state, props) => ({
  userName: state.userName,
  definition: state.definition,
  isCorrect: state.isCorrect,
  totalQs: state.totalQs,
  correctQs: state.correctQs
});

export default connect(mapStateToProps)(QuestionPage);
