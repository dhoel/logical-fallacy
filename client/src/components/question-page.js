import React from 'react';
import * as actions from '../actions/actions-index';
import {connect} from 'react-redux';
//import * as Cookies from 'js-cookie';

export class QuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(actions.fetchQuestion())
    }
    onSubmit(e) {
        e.preventDefault();
        let answerData = {
            qID: this.props.id,
            answer: this.answer.value.toLowerCase()
        }
        this.props.dispatch(actions.validateAnswer(answerData))
        this.props.dispatch(actions.fetchQuestion())
    }

    render() {

        const question = this.props.definition;

        return (
            <div>
                <div className='user'>
                    <h3>{this.props.currentUser}</h3>
                </div>
                <div className='total-correct'>
                    <span>Total: {this.props.totalQs}</span>
                    <span>Correct: {this.props.correctQs}</span>
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
            </div>

        );
    }
}

const mapStateToProps = (state, props) => ({
    currentUser: state.currentUser,
    definition: state.definition,
    id: state.id,
    isCorrect: state.isCorrect,
    totalQs: state.totalQs,
    correctQs: state.correctQs
});

export default connect(mapStateToProps)(QuestionPage)
