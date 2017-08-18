import * as Cookies from 'js-cookie';

export const VALIDATE_USER_SUCCESS = 'VALIDATE_USER_SUCCESS';
export const validateUserSuccess = data => ({
  type: VALIDATE_USER_SUCCESS,
  currentUser: data
});

export const VALIDATE_USER_FAILURE = 'VALIDATE_USER_FAILURE';
export const validateUserFailure = error => ({
  type: VALIDATE_USER_FAILURE,
  currentUser: error
});

export const FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS';
export const fetchQuestionSuccess = data => ({
  type: FETCH_QUESTION_SUCCESS,
  question: data
});

export const FETCH_QUESTION_FAILURE = 'FETCH_QUESTION_FAILURE';
export const fetchQuestionFailure = error => ({
  type: FETCH_QUESTION_FAILURE,
  question: error
});

export const VALIDATE_ANSWER_SUCCESS = 'VALIDATE_ANSWER_SUCCESS';
export const validateAnswerSuccess = data => ({
  type: VALIDATE_ANSWER_SUCCESS,
  isCorrect: data
});

export const validateUser = () => dispatch => {
  const accessToken = Cookies.get('accessToken');
  if (accessToken) {
    fetch('/api/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            // Unauthorized, clear the cookie and go to
            // the login page
            Cookies.remove('accessToken');
            return;
          }
            throw new Error(res.statusText);
        }
        return res.json();
    }).then(currentUser => {
        dispatch(validateUserSuccess(currentUser));
    });
  }
};

export const fetchQuestion = () => dispatch => {
  const accessToken = Cookies.get('accessToken');
  fetch('/api/fetch-questions', {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
      }).then(res => {
          if (!res.ok) {
              throw new Error(res.statusText);
          }
          return res.json();
  })
  .then(question => {
    dispatch(fetchQuestionSuccess(question));
  })
  .catch(error => {
    dispatch(fetchQuestionFailure(error));
  });
};

export const validateAnswer = (answer) => dispatch => {
  const accessToken = Cookies.get('accessToken');
  fetch('/api/check-answers', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
      method: 'PUT',
      body: JSON.stringify(answer)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then(isCorrect => {
      dispatch(validateAnswerSuccess(isCorrect));
    });
};
