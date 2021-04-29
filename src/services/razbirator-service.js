export default class RazbiratorService {

  _apiBase = 'http://test.tt/';

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify()
    });

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` +
        `, received ${res.status}`)
    }
    return await res.json();
  }

  async getQuestions() {
    const questions = await this.getResource(`index.php`);
    return questions;
  }

  async addQuestions(question) {
    const res = await fetch(`${this._apiBase}add-question.php`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question
      })
    });

    return await res.json();
  }

  async deleteQuestion(questionId) {
    const res = await fetch(`${this._apiBase}delete-question.php`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId
      })
    });

    return await res.json();
  }
}
