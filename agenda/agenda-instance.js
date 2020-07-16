const Agenda = require('agenda');
const mongoConnectionString = 'mongodb://127.0.0.1:27017/agenda';


const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    options: { useUnifiedTopology: true, }
    //  collection: 'agendaJobs'
  }
});

module.exports = agenda;