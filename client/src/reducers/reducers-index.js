import * as actions from '../actions/actions-index';

const initialState = {
    userName: null,
    question: '',
    answers: [],
    isCorrect: false,
    totalQs: 0,
    showResponse: false,
    correctQs: 0
};

export const qReducer = (state=initialState, action) => {

    if (action.type === actions.VALIDATE_USER_SUCCESS) {
      return {...state, userName: action.currentUser};
    }
    if (action.type === actions.FETCH_QUESTION_SUCCESS) {
      return {...state, question: action.question, showResponse: false};
    }
    if (action.type === actions.FETCH_ANSWERS_SUCCESS) {
      return {...state, answers: action.answers};
    }
    if (action.type === actions.VALIDATE_ANSWER_SUCCESS) {
      if (action.isCorrect) {
        return {...state, isCorrect: action.isCorrect,
          showResponse: true, totalQs: state.totalQs+=1,
          correctQs: state.correctQs+=1};
      } else {
        return {...state, isCorrect: action.isCorrect,
          showResponse: true, totalQs: state.totalQs+=1};
      }

    }
    return state;
};
