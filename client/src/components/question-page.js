import React from 'react';
import * as Cookies from 'js-cookie';

export default class QuestionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                _id: '',
                definition: ''
            }
        };
    }

    componentDidMount() {
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
        }).then(question =>
            this.setState({
                question
            })
        );
    }

    render() {
        //console.log(this.state.question.definition)
        const question = this.state.question.definition;


        return (
            <div className="question">
                {question}
            </div>
        );
    }
}
