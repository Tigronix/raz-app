import React, { Component } from 'react';
import './app.css';
import RazbiratorService from '../../services/razbirator-service';

export default class App extends Component {
  RazbiratorService = new RazbiratorService();
  state = {
    questions: null,
    questionId: null,
    currentQuestion: null
  }

  componentDidMount() {
    this.updateQuestions();
  }

  getFormData = (e) => {
    const form = e.target;
    const object = {};
    const formData = new FormData(form);

    for (var pair of formData.entries()) {
      object[pair[0]] = pair[1];
    }

    return object;
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

    const questionObj = this.getFormData(e);

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

  // редактирование вопроса
  onEditBtnClick = (id) => {
    const questions = this.state.questions;
    const idx = questions.findIndex((el) => el.id === id);
    const item = questions[idx];

    this.setState({
      questionId: id,
      currentQuestion: item
    });
  }

  onEditSubmit = (e) => {
    e.preventDefault();
    const questionObj = this.getFormData(e);
    questionObj.id = this.state.questionId;

    this.RazbiratorService
      .editQuestion(questionObj)
      .then((question) => {
        const id = question.id;

        this.setState(({ questions }) => {
          const idx = questions.findIndex((el) => el.id === id);
          const oldItem = questions[idx];
          const newItem = {...oldItem, question: question.question, answer: question.answer, comment: question.comment};

          const newArray = [
            ...questions.slice(0, idx),
            newItem,
            ...questions.slice(idx + 1)];

          return {
            questions: newArray,
            questionId: null,
            currentQuestion: null
          }
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
              <button onClick={() => { this.onRemoveBtnClick(question.id) }} className="questions__btn" type="button">Delete</button>
              <button onClick={() => { this.onEditBtnClick(question.id) }} className="questions__btn" type="button">Edit</button>
            </div>
          </article>
        </li>
      )
    });
  }

  renderEditForm = () => {
    const { currentQuestion } = this.state;
    return (
      <form className="form" onSubmit={this.onEditSubmit}>
        <h4>Редактирование вопроса</h4>
        <input className="field" name="question" type="text" placeholder="Вопрос" required defaultValue={currentQuestion.question}/>
        <input className="field" name="answer" type="text" placeholder="Ответ" required defaultValue={currentQuestion.answer} />
        <textarea className="field field--textarea" name="comment" placeholder="Комментарий" defaultValue={currentQuestion.comment}></textarea>
        <button type="submit">Редактировать</button>
      </form>
    )
  };

  render() {
    const { questions, questionId } = this.state;

    if (!questions) {
      return (
        <h1>Loading</h1>
      );
    }

    const items = this.renderQuestions(questions);
    let editForm = null;
    if (questionId) {
      editForm = this.renderEditForm();
    }

    return (
      <div className="container">
        <section className="questions">
          <ul className="questions__list">
            {items}
          </ul>
        </section>
        {editForm}
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