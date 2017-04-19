import * as actions from '../actions/actions-index';

const initialState = {
    id: null,
    definition: '',

}

export const qReducer = (state=initialState, action) => {
    if (action.type === actions.FETCH_QUESTION_SUCCESS)
    console.log(action)
        return {...state, id: action.question.id,
                definition: action.question.definition};
    }

}
