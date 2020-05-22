import tags from './tags.json'

const src = '/assets/03-06-11_STS-133_FD11_Mission_Status_Briefing.mp3'

const parsedAudio = {
  artist: 'NASA',
  title: 'STS-133 FD11 Mission Status Briefing',
  src: src,
  duration: 666,
  'chapters': [
    {
      'id': 'chp0',
      'startTime': 0,
      'endTime': 16,
      'title': 'Introduction',
    },
    {
      'id': 'chp1',
      'startTime': 16,
      'endTime': 285,
      'title': 'Mission Status Briefing by Bryan Lunney',
    },
    {
      'id': 'chp2',
      'startTime': 285,
      'endTime': 348,
      'title': 'Elaboration on the Shuttle\'s Status',
    },
    {
      'id': 'chp3',
      'startTime': 348,
      'endTime': 444,
      'title': 'Explaining the Crew\'s Schedule',
    },
    {
      'id': 'chp4',
      'startTime': 444,
      'endTime': 503,
      'title': 'What the Atmosphere Is Like at ISS and Discovery',
    },
    {
      'id': 'chp5',
      'startTime': 503,
      'endTime': 556,
      'title': 'Explaining Cryo Margins',
    },
    {
      'id': 'chp6',
      'startTime': 556,
      'endTime': 637,
      'title': 'Final Q&A',
    },
    {
      'id': 'chp7',
      'startTime': 637,
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
  chapters: [
    { title: '1', startTime: 0, endTime: 500 },
    { title: '2', startTime: 500, endTime: 1000 },
  ],
}

export default {
  src,
  customAudio,
  parsedAudio,
  tags,
}
