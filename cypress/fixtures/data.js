import tags from './tags.json'

const src = 'public/assets/STS-133_FD11_Mission_Status_Briefing.mp3'

const parsedAudio = {
  artist: 'NASA',
  title: 'STS-133 FD11 Mission Status Briefing',
  src: src,
  duration: 667,
  duration_display: '11:07', // add data for test's sake
  chapters: [
    {
      'id': 'chp0',
      'startTime': 0,
      'time_display': '00:00', // add data for test's sake
      'endTime': 16,
      'title': 'Introduction',
    },
    {
      'id': 'chp1',
      'startTime': 16,
      'time_display': '00:16',
      'endTime': 285,
      'title': 'Mission Status Briefing by Bryan Lunney',
    },
    {
      'id': 'chp2',
      'startTime': 285,
      'time_display': '04:45',
      'endTime': 348,
      'title': 'Elaboration on the Shuttle\'s Status',
    },
    {
      'id': 'chp3',
      'startTime': 348,
      'time_display': '05:48',
      'endTime': 444,
      'title': 'Explaining the Crew\'s Schedule',
    },
    {
      'id': 'chp4',
      'startTime': 444,
      'time_display': '07:24',
      'endTime': 503,
      'title': 'What the Atmosphere Is Like at ISS and Discovery',
    },
    {
      'id': 'chp5',
      'startTime': 503,
      'time_display': '08:23',
      'endTime': 556,
      'title': 'Explaining Cryo Margins',
    },
    {
      'id': 'chp6',
      'startTime': 556,
      'time_display': '09:16',
      'endTime': 637,
      'title': 'Final Q&A',
    },
    {
      'id': 'chp7',
      'startTime': 637,
      'time_display': '10:37',
      'endTime': 666,
      'title': 'Wrap Up',
    },
  ],
}

const customAudio = {
  artist: 'XYZ',
  title: 'Shikwasa',
  src: src,
  duration: 1000,
  duration_display: '16:40',
  cover: '/assets/logo.svg',
  chapters: [
    { title: 'First Title', startTime: 0, endTime: 500, time_display: '00:00' },
    { title: 'Second Title', startTime: 500, endTime: 1000, time_display: '08:20' },
  ],
}

export default {
  src,
  customAudio,
  parsedAudio,
  tags,
}
