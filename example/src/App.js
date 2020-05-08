import React, { Component } from 'react'

import ScrollForm from 'react-scroll-form'

export default class App extends Component {
  state = {
    question1: "",
    question2: "",
    question3: "",
  }

  passUpGoToQuestion = goToQuestion => this.goToQuestion = goToQuestion //pass up the function to go to a question

  onScrollEndCallback = (questionIndex) => { //we can use this callback to focus on an input
    const refKey = "question"+(questionIndex+1).toString() //manually get the ref key to focus on
    if(this[refKey]) { //if this ref exists
      this[refKey].focus() //focus on the element
    }
  }


  render () {
    const questions = [
      {
        element: (
          <div>
            <div><label>Question 1</label></div>
            <div><input autoFocus ref={input => this.question1=input} value={this.state.question1} onChange={e => this.setState({question1: e.target.value})}/></div>
            <br/>
            <div style={{opacity: this.state.question1.length>0?1:0}}>
              <button onClick={e => this.goToQuestion(1)}>Ok</button> <span>press Enter</span>
            </div>
          </div>
        ),
      },
      {
        element: (
          <div>
            <div><label>Question 2</label></div>
            <div><input ref={input => this.question2=input} value={this.state.question2} onChange={e => this.setState({question2: e.target.value})}/></div>
            <br/>
            <div style={{opacity: this.state.question2.length>0?1:0}}>
              <button onClick={e => this.goToQuestion(2)}>Ok</button> <span>press Enter</span>
            </div>
          </div>
        ),
      },
      {
        element: (
          <div>
            <div><label>Question #</label></div>
            <div><input ref={input => this.question3=input} value={this.state.question3} onChange={e => this.setState({question3: e.target.value})}/></div>
            <br/>
            <div style={{opacity: this.state.question3.length>0?1:0}}>
              <button onClick={e => this.goToQuestion(3)}>Ok</button> <span>press Enter</span>
            </div>
          </div>
        ),
      },
    ]

    return (
      <div>
        <ScrollForm
          enterToChangeQuestion
          goToQuestionCallback={questionindex => {}}
          onScrollEndCallback={this.onScrollEndCallback}
          passUpGoToQuestion={this.passUpGoToQuestion}
          questions={questions}
          tabToChangeQuestion
        />
      </div>
    )
  }
}
