import React, { Component } from 'react';
import './app.css';
import RazbiratorService from '../../services/razbirator-service';

export default class App extends Component {
  RazbiratorService = new RazbiratorService();
  state = {
    questions: null,
  }

  componentDidMount() {
    this.updateQuestions();
  }

  // удаление вопроса
  deleteQuestion = (id) => {
    this.setState(({ questions }) => {
      const idx = questions.findIndex((el) => el.id === id);

      const newArray = [...questions.slice(0, idx), ...questions.slice(idx + 1)];

      return {
        questions: newArray
      }
    });
  };
  
  onRemoveBtnClick = (id) => {
    this.RazbiratorService
    .deleteQuestion(id)
    .then((id) => {
      this.deleteQuestion(id);
    });
  };

  // добавление вопроса
  onSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const questionObj = {};
    const formData = new FormData(form);

    for (var pair of formData.entries()) {
      questionObj[pair[0]] = pair[1];
    }

    this.RazbiratorService
      .addQuestions(questionObj)
      .then((questionNew) => {
        this.setState(({ questions }) => {
          const newArr = [
            ...questions,
            questionNew
          ];

          return {
            questions: newArr
          };
        });
      });
  }

  // инициализация вопросов
  onQuestionsLoaded = (questions) => {
    this.setState({
      questions
    });
  }

  updateQuestions = () => {
    return this.RazbiratorService
      .getQuestions()
      .then(this.onQuestionsLoaded);
  }

  renderQuestions = (arr) => {
    return arr.map((question) => {
      return (
        <li className="questions__li" key={question.id}>
          <article className="questions__card">
            <div className="questions__header">{question.question}</div>
            <div className="questions__header">Ответ:</div>
            <span className="questions__answer">{question.answer}</span>
            <div className="questions__header">Комментарий:</div>
            <span>{question.comment}</span>
            <div className="questions__btn-col">
              <button onClick={() => {this.onRemoveBtnClick(question.id)}} className="questions__btn" type="button">Delete</button>
            </div>
          </article>
        </li>
      )
    });
  }

  render() {
    const { questions } = this.state;

    if (!questions) {
      return (
        <h1>Loading</h1>
      );
    }

    const items = this.renderQuestions(questions);

    return (
      <div className="container">
        <section className="questions">
          <ul className="questions__list">
            {items}
          </ul>
        </section>
        <form className="form" onSubmit={this.onSubmit}>
          <h4>Добавление вопроса</h4>
          <input className="field" name="question" type="text" placeholder="Вопрос" required />
          <input className="field" name="answer" type="text" placeholder="Ответ" required />
          <textarea className="field field--textarea" name="comment" placeholder="Комментарий"></textarea>
          <button type="submit">Добавить</button>
        </form>
      </div>
    )

  }
}