import React from 'react';
import * as actions from '../actions/actions-index';
import {connect} from 'react-redux';
//import * as Cookies from 'js-cookie';

export class QuestionPage extends React.Component {
    // constructor(props) {
    //     super(props);
    //
    // }

    componentDidMount() {
        this.props.dispatch(actions.fetchQuestion())
    }



    render() {
        const question = this.props.definition;


        return (
            <div className="question">
                {question}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    definition: state.definition
});

export default connect(mapStateToProps)(QuestionPage)
