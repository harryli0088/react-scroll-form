import React, { Component } from 'react'

import ScrollForm from 'react-scroll-form'

export default class App extends Component {
  state = {
    question1: "",
    question2: "",
    question3: "",
  }

  setAnswer = (value, questionIndex) => {
    const questionsCopy = this.state.questions.slice(0)
    questionsCopy[questionIndex].value = value
    this.setState({questions: questionsCopy})
  }


  render () {
    const questions = [
      {
        canMoveOn: this.state.question1.length > 0,
        element: (
          <div>
            <label>Question 1</label>
            <input value={this.state.question1} onChange={e => this.setState({question1: e.target.value})}/>
          </div>
        ),
        showCanMoveOnButton: true,
      },
      {
        canMoveOn: this.state.question2.length > 0,
        element: (
          <div>
            <label>Question 2</label>
            <input value={this.state.question2} onChange={e => this.setState({question2: e.target.value})}/>
          </div>
        ),
        showCanMoveOnButton: true,
      },
      {
        canMoveOn: this.state.question3.length > 0,
        element: (
          <div>
            <label>Question #</label>
            <input value={this.state.question3} onChange={e => this.setState({question3: e.target.value})}/>
          </div>
        ),
        showCanMoveOnButton: true,
      },
    ]

    return (
      <div>
        <ScrollForm questions={questions}/>
      </div>
    )
  }
}
