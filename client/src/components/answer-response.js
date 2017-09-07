import React from 'react';
import * as actions from '../actions/actions-index';
import { connect } from 'react-redux';
import CorrectYes from './correct-yes';
import CorrectNo from './correct-no';

function AnswerResponse(props) {

let response;

if (props.isCorrect) {
  response = <CorrectYes />;
} else {
  response = <CorrectNo />;
};

function handleClick(e) {
  props.dispatch(actions.fetchQuestion());
}

    return (
      <div className='answer-response'>
        <div>
          {response}
        </div>
        <div className='nextButton'>
          <button className='btn btn-next' type='button' onClick={handleClick}
            >Next Question</button>
        </div>
      </div>
    );
};

const mapStateToProps = (state, props) => ({
  isCorrect: state.isCorrect,
});
export default connect(mapStateToProps)(AnswerResponse);
