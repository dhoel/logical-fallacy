import * as actions from '../actions/actions-index';

const initialState = {
    userName: null,
    definition: '',
    isCorrect: false,
    totalQs: 0,
    correctQs: 0

}

export const qReducer = (state=initialState, action) => {

    if (action.type === actions.VALIDATE_USER_SUCCESS) {
        return {...state, userName: action.currentUser.userName};
    }
    if (action.type === actions.FETCH_QUESTION_SUCCESS) {
        return {...state, definition: action.question.definition};
    }
    if (action.type === actions.VALIDATE_ANSWER_SUCCESS) {
        if (action.isCorrect) {

            return {...state, isCorrect: action.isCorrect,
                totalQs: state.totalQs+=1, correctQs: state.correctQs+=1}
        } else {
            return {...state, isCorrect: action.isCorrect,
                totalQs: state.totalQs+=1}
        }

    }
    return state;
}
