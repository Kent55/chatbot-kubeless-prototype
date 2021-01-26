const quotes = [
  'Don\'t cry because it\'s over, smile because it happened. - Dr. Seuss',
  'Be yourself; everyone else is already taken. - Oscar Wilde',
  'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe. - Albert Einstein',
  'Be who you are and say what you feel, because those who mind don\'t matter, and those who matter don\'t mind. - Bernard M. Baruch',
  'So many books, so little time. - Frank Zappa',
  'A room without books is like a body without a soul. - Marcus Tullius Cicero'
]

module.exports.webhook = event => {
  const method = event.extensions.request.method

  if (method !== 'POST') {
    return {
      error: 'Unauthorised request method'
    }
  }

  const body = event.data

  if (body && body.message) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return {
      recipient: {
        id: 'app-uid'
      },
      message: {
        text: randomQuote
      }
    }
  }
}