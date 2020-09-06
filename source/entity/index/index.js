import Mentors from '@/blocks/mentors/mentors';
import PastEvent from '@/blocks/past-event/past-event';

require('./index.scss');

const mentors = document.querySelector('.mentors');

if (mentors) {
  new Mentors(mentors);
}

const pastEvent = document.querySelector('.past-event');

if (mentors) {
  new PastEvent(pastEvent);
}
