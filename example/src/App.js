import React, { Component } from 'react'

import ScrollForm from 'react-scroll-form'

export default class App extends Component {
  state = {
    currentQuestionIndex: 1,

    question1: "",
    question2: "",
    question3: "",
  }

  setAnswer = (value, questionIndex) => {
    const questionsCopy = this.state.questions.slice(0)
    questionsCopy[questionIndex].value = value
    this.setState({questions: questionsCopy})
  }

  onScrollEndCallback = (questionIndex) => {
    console.log("questionIndex",questionIndex, questionIndex+1)
    if(this["question"+(questionIndex+1).toString()]) {
      this["question"+(questionIndex+1).toString()].focus()
    }
  }


  render () {
    const questions = [
      {
        canMoveOn: this.state.question1.length > 0,
        element: (
          <div>
            <label>Question 1</label>
            <input ref={input => this.question1=input} value={this.state.question1} onChange={e => this.setState({question1: e.target.value})}/>
          </div>
        ),
        showCanMoveOnButton: true,
      },
      {
        canMoveOn: this.state.question2.length > 0,
        element: (
          <div>
            <label>Question 2</label>
            <input ref={input => this.question2=input} value={this.state.question2} onChange={e => this.setState({question2: e.target.value})}/>
          </div>
        ),
        showCanMoveOnButton: true,
      },
      {
        canMoveOn: this.state.question3.length > 0,
        element: (
          <div>
            <label>Question #</label>
            <input ref={input => this.question3=input} value={this.state.question3} onChange={e => this.setState({question3: e.target.value})}/>
          </div>
        ),
        showCanMoveOnButton: true,
      },
    ]

    return (
      <div>
        <ScrollForm
          onScrollEndCallback={this.onScrollEndCallback}
          questions={questions}
        />
      </div>
    )
  }
}
