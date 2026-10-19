// Every person and company here is fictional.

export type Person = {
  id: string
  name: string
  first: string
  role: string
  initials: string
  skin: string
  shirt: string
  backdrop: string
}

export const people: Record<string, Person> = {
  amara: {
    id: 'amara',
    name: 'Amara Njoroge',
    first: 'Amara',
    role: 'Finance officer',
    initials: 'AN',
    skin: '#8A5A3C',
    shirt: '#2F6B5A',
    backdrop: '#DCE6DE',
  },
  david: {
    id: 'david',
    name: 'David Otieno',
    first: 'David',
    role: 'Chief financial officer',
    initials: 'DO',
    skin: '#5E3B27',
    shirt: '#2B3A55',
    backdrop: '#D8DEE8',
  },
  wanjiru: {
    id: 'wanjiru',
    name: 'Wanjiru Kamau',
    first: 'Wanjiru',
    role: 'Head of treasury',
    initials: 'WK',
    skin: '#704A33',
    shirt: '#8C4A3B',
    backdrop: '#E8DED6',
  },
  brian: {
    id: 'brian',
    name: 'Brian Mutua',
    first: 'Brian',
    role: 'Financial controller',
    initials: 'BM',
    skin: '#4E3121',
    shirt: '#5A5F2E',
    backdrop: '#E2E4D3',
  },
}

export const company = 'Kilima Freight'
export const callApp = 'Huddle'
export const payee = 'Meridian Trade Ltd'
export const amount = 'USD 25,000,000'
