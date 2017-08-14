import React from 'react';
import * as actions from '../actions/actions-index';
import {connect} from 'react-redux';
import Dropdown from 'react-accessible-dropdown';

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
    console.log(this.answer)
    let answer = {
        answer: this.answer.state.selected.value.toLowerCase()
    };
    this.props.dispatch(actions.validateAnswer(answer));
    this.answer.value='';
  }

  render() {

    const question = this.props.definition;

    const answerOptions = [
      'Appeal to Authority', 'Strawman', 'Ad Hominem', 'False Dilemma',
      'Appeal to Popularity', 'Red Herring'
    ];

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
            <form onSubmit={this.onSubmit}>
              <Dropdown options={answerOptions} onChange={this._onSelect}
                ref={ref => this.answer = ref} placeholder='Select an answer' />
              <button type='submit'
                className='btn btn-submit'>Submit</button>
            </form>
          </div>
          <div className='totals'>
            <span className='num num-questions' >Questions Attempted: {this.props.totalQs}</span>
            <span className='num num-correct'>Correct Answers: {this.props.correctQs}</span>
          </div>
        </section>
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
