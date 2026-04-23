import type { FeedPost } from './types';

const AUTHORS = [
  { name: 'Maya Chen', handle: 'mayac', color: '#FF7A90' },
  { name: 'Jordan Park', handle: 'jpark', color: '#7C5CFF' },
  { name: 'Sasha Ivanov', handle: 'sashai', color: '#3DDC97' },
  { name: 'Priya Rao', handle: 'priyar', color: '#FFB454' },
  { name: 'Alex Kim', handle: 'akim', color: '#5EC2FF' },
  { name: 'Noah Patel', handle: 'noahp', color: '#FF8A4C' },
  { name: 'Lena Ortiz', handle: 'lenao', color: '#C86EFF' },
  { name: 'Sam Nguyen', handle: 'samng', color: '#FF5A6B' },
];

const CONTENTS = [
  'hot take: if your morning routine has more than 4 steps it is a lifestyle brand',
  'the algorithm fed me a 43 minute video essay about a fictional airline that went bankrupt in 1987 and i watched every second',
  'remember when we used to be bored. that was a skill. i think i am losing it.',
  'things that will not fix your life: a new notebook. things that might: closing this app.',
  'me: i will check my phone for one second\nalso me: *watches 37 minutes of dog rescues*',
  'tried to read a book today. my brain literally tried to swipe the page up to skip it.',
  'new conspiracy: every feed is designed by someone who hates your sleep schedule personally',
  'spent 20 min looking at apartments i cannot afford in cities i will not move to',
  'the dopamine is fake. the headache is real.',
  'stop saving infographics. you will never read them. just close the app.',
  'my screen time report this week is a threat, not a statistic',
  'guy on here just said "i went outside and the graphics are insane" and honestly same',
  'unsubscribed from 14 newsletters today and i feel like i just bathed',
  'nobody: \nme at 1am: just one more scroll then i will sleep i promise',
  'breaking: local man discovers that putting phone in another room makes him smarter',
  'the feed is a slot machine with worse odds and no free drinks',
  'read a whole chapter of a book and my attention span threw a small parade',
  'everyone is hustling, healing, or doomscrolling. there is no in between apparently.',
  'just watched 9 clips of people reviewing water. why am i like this.',
  'plot twist: the most radical thing you can do this year is be bored on purpose',
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateFeed(count: number = 60, seed: number = 42): FeedPost[] {
  const shuffledContents = seededShuffle(CONTENTS, seed);
  const posts: FeedPost[] = [];
  for (let i = 0; i < count; i++) {
    const author = AUTHORS[i % AUTHORS.length];
    const content = shuffledContents[i % shuffledContents.length];
    const hasImage = (i % 3) === 1;
    posts.push({
      id: `post-${i}`,
      author: author.name,
      handle: author.handle,
      avatarColor: author.color,
      timeAgo: `${Math.max(1, (i * 7) % 59)}m`,
      content,
      imageHue: hasImage ? (i * 53) % 360 : undefined,
      likes: ((i * 131) % 4800) + 12,
      comments: ((i * 17) % 320) + 1,
      reposts: ((i * 29) % 180) + 1,
    });
  }
  return posts;
}
