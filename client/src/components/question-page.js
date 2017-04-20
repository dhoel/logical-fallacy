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
            answer: this.answer.value
        }

        this.props.dispatch(actions.submitAnswer(answerData));
    }

    render() {
        const question = this.props.definition;

        return (
            <div>
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
    definition: state.definition,
    id: state.id
});

export default connect(mapStateToProps)(QuestionPage)
