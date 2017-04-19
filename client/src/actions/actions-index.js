import * as Cookies from 'js-cookie';

export const FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS';
export const fetchQuestionSuccess = data => ({
    type: FETCH_QUESTION_SUCCESS
    question: data
})

export const FETCH_QUESTION_FAILURE = 'FETCH_QUESTION_FAILURE';
export const fetchQuestionFailure = error => ({
    type: FETCH_QUESTION_FAILURE
    question: error
})

export const fetchQuestion = () => dispatch => {
    const accessToken = Cookies.get('accessToken');
    fetch('/api/questions', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(question => {
        dispatch(fetchQuestionSuccess(question));
    })
    .catch(error => {
        dispatch(fetchQuestionFailure(error));
    })
}
