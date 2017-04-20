import * as actions from '../actions/actions-index';

const initialState = {
    currentUser: null,
    id: null,
    definition: ''

}

export const qReducer = (state=initialState, action) => {

    if (action.type === actions.VALIDATE_USER_SUCCESS) {
        return {...state, currentUser: action.currentUser};
    }
    if (action.type === actions.FETCH_QUESTION_SUCCESS) {
        return {...state, id: action.question.id,
                definition: action.question.definition};
    }
    return state;
}
