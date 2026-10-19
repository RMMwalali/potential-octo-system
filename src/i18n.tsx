import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * English / Kiswahili for the key screens: hero, the call, badges, the payment
 * step and the demo's navigation. Swahili strings should be reviewed by a
 * native speaker before any real launch.
 */
export type Lang = 'en' | 'sw'

const en = {
  'nav.proves': 'What it proves',
  'nav.privacy': 'Privacy',
  'nav.demo': 'Try the demo',
  'lang.label': 'Language',

  'hero.h1': "Know who's really on the call.",
  'hero.l1': "Know who's",
  'hero.l2': 'really on',
  'hero.l3': 'the call.',
  'hero.sub':
    'Faces and voices can be faked in minutes. Proofline checks the person, not the picture, and tells you what it found in plain words. Your ID never leaves your phone.',
  'hero.try': 'Try the demo',
  'tour.play': 'Play the {n}-second story',

  'beats.h2': 'Watch the call',
  'beats.c0': '0 of 3',
  'beats.c1': '1 of 3',
  'beats.c2': '2 of 3',
  'beats.c3': "Can't confirm",
  'beats.l0': 'Four faces join the payments call.',
  'beats.l1': 'Wanjiru is confirmed, on the phone she registered.',
  'beats.l2': 'Brian is confirmed too.',
  'beats.l3': "David looks right and sounds right. But this isn't his phone.",
  'beats.hint': 'keep scrolling ↓',

  'badge.identity': 'Identity confirmed',
  'badge.checking': 'Checking identity',
  'badge.cant': "Can't confirm identity",
  'badge.human': 'Real person',
  'badge.purchase': 'Verified purchase',
  'badge.stopped': 'Payment stopped',
  'badge.flagged': 'Flagged as fake',
  'badge.for': '{label} for {who}',
  'badge.ask': 'What does this prove?',
  'pop.proves': 'What this proves',
  'pop.doesnt': "What it doesn't share",
  'ex.identity.p': 'This is the named person, on the phone they registered when they verified.',
  'ex.identity.d': 'It never shows their ID document, address or date of birth.',
  'ex.human.p': 'A real, unique person made this account. It is not a bot or a duplicate.',
  'ex.human.d': 'It does not say who they are. Their name stays private unless they share it.',
  'ex.purchase.p': 'The person who wrote this paid for the item from this seller.',
  'ex.purchase.d': 'It does not reveal what else they bought or how they paid.',
  'ex.stopped.p': 'The person who must approve this payment said they did not ask for it.',
  'ex.stopped.d': 'No money has moved.',
  'ex.flagged.p': 'The real person, on their registered phone, said this is not them.',
  'ex.flagged.d': 'It does not reveal anything about the real person to the caller.',

  'reason.notPhone': "Not on David's registered phone",
  'reason.denied': "David says this isn't him",
  'reason.noAnswer': 'No answer from David',

  'call.title': 'Q4 payments sync',
  'call.onCall': '4 on call',
  'call.you': '{name} (you)',
  'call.caption': 'Amara, I need the Meridian transfer out before three. Keep it between us for now.',
  'call.checking': "Proofline is checking who's on this call…",
  'call.nOf3': '{n} of 3 confirmed',
  'call.cant.b': "We can't confirm that this is David Otieno.",
  'call.cant.r': 'The other two are confirmed.',
  'call.asking.b': 'Asking David on his registered phone…',
  'call.asking.r': "Not on this call, so the impostor can't see it.",
  'call.denied.b': "The real David says he isn't on this call.",
  'call.denied.r': 'This person is pretending to be him.',
  'call.reported.b': 'Reported to Kilima Freight security.',
  'call.reported.r': "They have the call details. Don't act on anything this person asked for.",
  'call.yes.b': "David says it's him.",
  'call.yes.r': "In this story the real David is in a meeting across town, so he'd tap No. Try again to see that.",
  'call.ask': 'Ask David to confirm',
  'call.advice': 'What should I do?',
  'call.hideAdvice': 'Hide advice',
  'call.advice.p':
    "Faces and voices can be faked. Until David is confirmed, don't act on requests from this call to move money or share passwords.",
  'call.advice.1': 'Ask David to confirm in Proofline. The request goes to his own phone.',
  'call.advice.2': 'Or call him on a number you already have, not one given on this call.',
  'call.report': 'Report this call',
  'call.phone.who': "The real David's phone, in a meeting across town",
  'call.phone.q': 'Are you on the "Q4 payments sync" call with Amara right now?',
  'call.phone.no': "No, that's not me",
  'call.phone.yes': "Yes, it's me",
  'call.continue': 'David asks Amara to send the payment',
  'call.continueDenied': 'See what happens if she skips the check',

  'demo.s1': 'Verify once',
  'demo.s2': 'Her wallet',
  'demo.s3': 'The call',
  'demo.s4': 'The payment',
  'demo.s5': 'Everywhere else',
  'demo.persona': 'Amara Njoroge is a finance officer at Kilima Freight in Nairobi.',
  'demo.persona5': 'Beyond the office, the same badges protect everyday life online.',
  'demo.stepOf': 'Step {n} of {total}',
  'demo.overview': 'Overview',
  'demo.keys': 'Use {l} {r} to move',
  'demo.call.h': 'The CFO looks and sounds exactly like David',
  'demo.call.p':
    'It isn\'t him. Proofline confirms the two colleagues on their own phones, and can\'t confirm "David", because the call is coming from a device David never registered.',

  'wire.h': 'The payment needs the real David',
  'wire.p':
    "The fake David pushes Amara to send the money now. When she presses approve, Proofline asks the real David on his registered phone. A copied face can't answer that.",
  'wire.bank': '{company} payments',
  'wire.signedIn': 'Signed in as Amara Njoroge',
  'wire.kicker': 'Outgoing transfer',
  'wire.to': 'To',
  'wire.by': 'Requested by',
  'wire.byValue': 'David Otieno, on a Huddle call',
  'wire.needs': 'Needs approval from',
  'wire.needsValue': 'David Otieno, Chief financial officer',
  'wire.flag': "The person who asked for this on the call wasn't confirmed as David.",
  'wire.approve': 'Approve payment',
  'wire.wait.b': 'Waiting for David to confirm on his own phone.',
  'wire.wait.r': 'Proofline sent the request to the phone he registered, not to anyone on the call.',
  'wire.countdown': '{t} left to answer. The payment stays on hold until then.',
  'wire.skip': 'Demo: skip ahead 5 minutes',
  'wire.timeout.b': "David didn't answer, so nothing has moved.",
  'wire.timeout.r': 'A payment this size never goes out without him. It stays on hold, and Amara can ask again or cancel it.',
  'wire.askAgain': 'Ask David again',
  'wire.cancel': 'Cancel payment',
  'wire.cancelled.b': 'Payment cancelled.',
  'wire.cancelled.r': "No money moved. The request and the call are saved for {company}'s security team.",
  'wire.startOver': 'Start over',
  'wire.next': 'See Proofline everywhere else',
  'wire.stopped.b': "David says he didn't ask for this. No money has moved.",
  'wire.stopped.r': "{company}'s security team has been alerted and the call has been flagged.",
  'wire.approved.b': 'David confirmed on his phone.',
  'wire.approved.r': 'In the real story, this is the step that never happens, because the real David never asked.',
  'wire.tryAgain': 'Try again',
  'wire.phone.label': "David's real phone",
  'wire.phone.q': 'Did you ask Amara to send {amount}?',
  'wire.phone.detail': 'To {payee}, Hong Kong. Requested a minute ago on a Huddle call.',
  'wire.phone.expires': 'Expires in {t}',
  'wire.phone.no': "No, I didn't ask for this",
  'wire.phone.yes': 'Yes, I asked',
  'wire.idle.stopped': 'You stopped a payment request. Thanks, David.',
  'wire.idle.timeout': 'Missed: 1 payment request from Proofline',
  'wire.idle.none': 'No requests',
}

export type Key = keyof typeof en

const sw: Record<Key, string> = {
  'nav.proves': 'Inachothibitisha',
  'nav.privacy': 'Faragha',
  'nav.demo': 'Jaribu onyesho',
  'lang.label': 'Lugha',

  'hero.h1': 'Jua nani yuko kweli kwenye simu.',
  'hero.l1': 'Jua nani',
  'hero.l2': 'yuko kweli',
  'hero.l3': 'kwenye simu.',
  'hero.sub':
    'Sura na sauti zinaweza kughushiwa kwa dakika chache. Proofline humkagua mtu, si picha, na kukueleza ilichopata kwa maneno rahisi. Kitambulisho chako hakitoki kwenye simu yako.',
  'hero.try': 'Jaribu onyesho',
  'tour.play': 'Cheza hadithi ya sekunde {n}',

  'beats.h2': 'Tazama simu',
  'beats.c0': '0 kati ya 3',
  'beats.c1': '1 kati ya 3',
  'beats.c2': '2 kati ya 3',
  'beats.c3': 'Haijathibitishwa',
  'beats.l0': 'Watu wanne wanajiunga na simu ya malipo.',
  'beats.l1': 'Wanjiru amethibitishwa, kwenye simu aliyoisajili.',
  'beats.l2': 'Brian naye amethibitishwa.',
  'beats.l3': 'David anaonekana na kusikika sawa. Lakini hii si simu yake.',
  'beats.hint': 'endelea kusogeza ↓',

  'badge.identity': 'Utambulisho umethibitishwa',
  'badge.checking': 'Inakagua utambulisho',
  'badge.cant': 'Haiwezi kuthibitisha utambulisho',
  'badge.human': 'Mtu halisi',
  'badge.purchase': 'Ununuzi umethibitishwa',
  'badge.stopped': 'Malipo yamesimamishwa',
  'badge.flagged': 'Ametambuliwa kuwa bandia',
  'badge.for': '{label}: {who}',
  'badge.ask': 'Hii inathibitisha nini?',
  'pop.proves': 'Inachothibitisha',
  'pop.doesnt': 'Kisichoshirikiwa',
  'ex.identity.p': 'Huyu ndiye mtu aliyetajwa, kwenye simu aliyoisajili alipothibitisha.',
  'ex.identity.d': 'Haionyeshi kamwe kitambulisho, anwani wala tarehe ya kuzaliwa.',
  'ex.human.p': 'Mtu halisi, mmoja, ndiye aliyefungua akaunti hii. Si roboti wala nakala.',
  'ex.human.d': 'Haisemi ni nani. Jina lake linabaki siri isipokuwa akilishiriki.',
  'ex.purchase.p': 'Aliyeandika hili alilipia bidhaa hii kutoka kwa muuzaji huyu.',
  'ex.purchase.d': 'Haionyeshi alichonunua kwingine wala jinsi alivyolipa.',
  'ex.stopped.p': 'Mtu anayepaswa kuidhinisha malipo haya alisema hakuyaomba.',
  'ex.stopped.d': 'Hakuna pesa iliyotumwa.',
  'ex.flagged.p': 'Mtu halisi, kwenye simu aliyoisajili, alisema huyu si yeye.',
  'ex.flagged.d': 'Haimfichulii mpigaji chochote kuhusu mtu halisi.',

  'reason.notPhone': 'Hayuko kwenye simu aliyosajili David',
  'reason.denied': 'David anasema huyu si yeye',
  'reason.noAnswer': 'David hajajibu',

  'call.title': 'Mkutano wa malipo Q4',
  'call.onCall': 'Watu 4 kwenye simu',
  'call.you': '{name} (wewe)',
  'call.caption': 'Amara, nahitaji malipo ya Meridian yatumwe kabla ya saa tisa. Tuyaweke kati yetu kwa sasa.',
  'call.checking': 'Proofline inakagua walio kwenye simu hii…',
  'call.nOf3': '{n} kati ya 3 wamethibitishwa',
  'call.cant.b': 'Hatuwezi kuthibitisha kuwa huyu ni David Otieno.',
  'call.cant.r': 'Wengine wawili wamethibitishwa.',
  'call.asking.b': 'Tunamuuliza David kwenye simu aliyoisajili…',
  'call.asking.r': 'Si kwenye simu hii, kwa hiyo mdanganyifu hawezi kuiona.',
  'call.denied.b': 'David halisi anasema hayuko kwenye simu hii.',
  'call.denied.r': 'Mtu huyu anajifanya kuwa yeye.',
  'call.reported.b': 'Imeripotiwa kwa usalama wa Kilima Freight.',
  'call.reported.r': 'Wana maelezo ya simu hii. Usifanye chochote alichoomba mtu huyu.',
  'call.yes.b': 'David anasema ni yeye.',
  'call.yes.r':
    'Katika hadithi hii David halisi yuko mkutanoni upande mwingine wa mji, kwa hiyo angebonyeza Hapana. Jaribu tena uone.',
  'call.ask': 'Muombe David athibitishe',
  'call.advice': 'Nifanye nini?',
  'call.hideAdvice': 'Ficha ushauri',
  'call.advice.p':
    'Sura na sauti zinaweza kughushiwa. Hadi David athibitishwe, usitekeleze maombi kutoka kwenye simu hii ya kutuma pesa au kushiriki nywila.',
  'call.advice.1': 'Muombe David athibitishe kupitia Proofline. Ombi linaenda kwenye simu yake mwenyewe.',
  'call.advice.2': 'Au mpigie kwa namba uliyonayo tayari, si iliyotolewa kwenye simu hii.',
  'call.report': 'Ripoti simu hii',
  'call.phone.who': 'Simu ya David halisi, akiwa mkutanoni upande mwingine wa mji',
  'call.phone.q': 'Je, uko kwenye simu ya "Mkutano wa malipo Q4" na Amara sasa hivi?',
  'call.phone.no': 'Hapana, si mimi',
  'call.phone.yes': 'Ndiyo, ni mimi',
  'call.continue': 'David anamwomba Amara atume malipo',
  'call.continueDenied': 'Ona kinachotokea asipokagua',

  'demo.s1': 'Thibitisha mara moja',
  'demo.s2': 'Pochi yake',
  'demo.s3': 'Simu ya video',
  'demo.s4': 'Malipo',
  'demo.s5': 'Kila mahali',
  'demo.persona': 'Amara Njoroge ni afisa wa fedha katika Kilima Freight, Nairobi.',
  'demo.persona5': 'Nje ya ofisi, beji hizi hizi hulinda maisha ya kila siku mtandaoni.',
  'demo.stepOf': 'Hatua {n} kati ya {total}',
  'demo.overview': 'Muhtasari',
  'demo.keys': 'Tumia {l} {r} kusogea',
  'demo.call.h': 'Afisa mkuu wa fedha anaonekana na kusikika kama David kabisa',
  'demo.call.p':
    'Si yeye. Proofline inawathibitisha wenzake wawili kwenye simu zao wenyewe, lakini haiwezi kumthibitisha "David", kwa sababu simu hii inatoka kwenye kifaa ambacho David hakuwahi kusajili.',

  'wire.h': 'Malipo yanahitaji David halisi',
  'wire.p':
    'David bandia anamshinikiza Amara atume pesa sasa. Anapobonyeza kuidhinisha, Proofline inamuuliza David halisi kwenye simu aliyoisajili. Sura iliyonakiliwa haiwezi kujibu hilo.',
  'wire.bank': 'Malipo ya {company}',
  'wire.signedIn': 'Umeingia kama Amara Njoroge',
  'wire.kicker': 'Malipo yanayotoka',
  'wire.to': 'Kwa',
  'wire.by': 'Yameombwa na',
  'wire.byValue': 'David Otieno, kwenye simu ya Huddle',
  'wire.needs': 'Yanahitaji idhini ya',
  'wire.needsValue': 'David Otieno, Afisa mkuu wa fedha',
  'wire.flag': 'Aliyeomba hili kwenye simu hakuthibitishwa kuwa David.',
  'wire.approve': 'Idhinisha malipo',
  'wire.wait.b': 'Inasubiri David athibitishe kwenye simu yake mwenyewe.',
  'wire.wait.r': 'Proofline ilituma ombi kwenye simu aliyoisajili, si kwa mtu yeyote kwenye simu ya video.',
  'wire.countdown': 'Zimebaki {t} kujibu. Malipo yanasimamishwa hadi wakati huo.',
  'wire.skip': 'Onyesho: ruka dakika 5 mbele',
  'wire.timeout.b': 'David hakujibu, kwa hiyo hakuna kilichotumwa.',
  'wire.timeout.r': 'Malipo ya kiasi hiki hayatumwi bila yeye. Yanabaki yamesimamishwa, na Amara anaweza kuomba tena au kuyaghairi.',
  'wire.askAgain': 'Muulize David tena',
  'wire.cancel': 'Ghairi malipo',
  'wire.cancelled.b': 'Malipo yameghairiwa.',
  'wire.cancelled.r': 'Hakuna pesa iliyotumwa. Ombi na simu vimehifadhiwa kwa timu ya usalama ya {company}.',
  'wire.startOver': 'Anza upya',
  'wire.next': 'Ona Proofline kila mahali pengine',
  'wire.stopped.b': 'David anasema hakuomba hili. Hakuna pesa iliyotumwa.',
  'wire.stopped.r': 'Timu ya usalama ya {company} imearifiwa na simu imewekwa alama.',
  'wire.approved.b': 'David alithibitisha kwenye simu yake.',
  'wire.approved.r': 'Katika hadithi halisi, hatua hii haitokei kamwe, kwa sababu David halisi hakuwahi kuomba.',
  'wire.tryAgain': 'Jaribu tena',
  'wire.phone.label': 'Simu halisi ya David',
  'wire.phone.q': 'Je, ulimwomba Amara atume {amount}?',
  'wire.phone.detail': 'Kwa {payee}, Hong Kong. Iliombwa dakika moja iliyopita kwenye simu ya Huddle.',
  'wire.phone.expires': 'Inaisha baada ya {t}',
  'wire.phone.no': 'Hapana, sikuomba hili',
  'wire.phone.yes': 'Ndiyo, niliomba',
  'wire.idle.stopped': 'Umesimamisha ombi la malipo. Asante, David.',
  'wire.idle.timeout': 'Hukujibu: ombi 1 la malipo kutoka Proofline',
  'wire.idle.none': 'Hakuna maombi',
}

const dict: Record<Lang, Record<Key, string>> = { en, sw }
const KEY = 'proofline-lang'

const readLang = (): Lang => {
  try {
    return localStorage.getItem(KEY) === 'sw' ? 'sw' : 'en'
  } catch {
    return 'en'
  }
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key, vars?: Record<string, string | number>) => string }
const LangCtx = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'sw' ? 'sw' : 'en'
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(KEY, l)
    } catch {
      /* storage blocked: language lasts for this page view */
    }
  }, [])

  const t = useCallback(
    (k: Key, vars?: Record<string, string | number>) => {
      let s = dict[lang][k] ?? en[k]
      if (vars) for (const [name, v] of Object.entries(vars)) s = s.split(`{${name}}`).join(String(v))
      return s
    },
    [lang],
  )

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
}

export const useT = () => useContext(LangCtx)!

export function LangToggle() {
  const { lang, setLang, t } = useT()
  return (
    <div className="lang-toggle" role="group" aria-label={t('lang.label')}>
      <button type="button" aria-pressed={lang === 'en'} lang="en" onClick={() => setLang('en')}>
        EN<span className="sr-only"> English</span>
      </button>
      <button type="button" aria-pressed={lang === 'sw'} lang="sw" onClick={() => setLang('sw')}>
        SW<span className="sr-only"> Kiswahili</span>
      </button>
    </div>
  )
}
