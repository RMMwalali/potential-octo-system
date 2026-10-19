import { Badge } from '../components/Badge'
import { CallStage } from '../components/CallStage'
import { ArrowRight, EyeIcon, EyeOffIcon } from '../components/icons'
import { Wordmark } from '../components/Wordmark'

export function Landing() {
  return (
    <>
      <header className="site-nav">
        <a href="#/" className="nav-home" aria-label="Proofline home">
          <Wordmark />
        </a>
        <nav aria-label="Main">
          <a href="#signals">What it proves</a>
          <a href="#privacy">Privacy</a>
          <a href="#/demo/1" className="btn btn-primary btn-small">
            Try the demo
          </a>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-story">
              A finance worker joined a video call with his CFO and several colleagues, then sent $25&nbsp;million.
              Everyone else on that call was a deepfake.
            </p>
            <h1>Know who's really on the call.</h1>
            <p className="hero-lede">
              Faces and voices can be faked in minutes. Proofline checks the person, not the picture, and tells you
              what it found in plain words. Your ID never leaves your phone.
            </p>
            <div className="hero-actions">
              <a href="#/demo/1" className="btn btn-primary">
                Try the demo <ArrowRight />
              </a>
              <a href="#privacy" className="btn btn-quiet">
                How we protect your privacy
              </a>
            </div>
          </div>
          <div className="hero-stage">
            <CallStage mode="hero" />
          </div>
        </section>

        <section className="signals" id="signals" aria-labelledby="signals-h">
          <div className="section-head">
            <h2 id="signals-h">Three things Proofline can prove</h2>
            <p>
              Each one looks different, so you can tell them apart at a glance, even without colour. Tap any badge to
              see exactly what it means.
            </p>
          </div>

          <div className="signal-rows">
            <article className="signal">
              <div className="signal-badge">
                <Badge kind="identity" size="lg" explain />
              </div>
              <div className="signal-body">
                <h3>This is the person you think it is</h3>
                <p>
                  The named person, on the phone they registered. This is what stops a fake CFO, because the scammer
                  can copy David's face but not David's phone.
                </p>
              </div>
              <p className="signal-where">Video calls, payment approvals, password resets</p>
            </article>

            <article className="signal">
              <div className="signal-badge">
                <Badge kind="human" size="lg" explain />
              </div>
              <div className="signal-body">
                <h3>A real person, not a bot</h3>
                <p>A unique human made this account. Their name stays private unless they choose to share it.</p>
              </div>
              <p className="signal-where">Replies, dating matches, sign-ups</p>
            </article>

            <article className="signal">
              <div className="signal-badge">
                <Badge kind="purchase" size="lg" explain />
              </div>
              <div className="signal-body">
                <h3>They actually bought it</h3>
                <p>The reviewer paid for this item from this seller. Nothing else about their shopping is shared.</p>
              </div>
              <p className="signal-where">Product reviews, seller ratings</p>
            </article>
          </div>

          <aside className="insight">
            <h3>Why "real person" isn't enough</h3>
            <p>
              The people behind the $25 million call were real humans. A badge that only said "not a bot" would have
              stayed green. Proofline keeps the two questions separate: is this a person, and is it the right person.
            </p>
          </aside>
        </section>

        <section className="how" aria-labelledby="how-h">
          <h2 id="how-h">How it works</h2>
          <ol className="how-steps">
            <li>
              <h3>Verify once, on your phone</h3>
              <p>Scan your ID and take a quick selfie. It takes about a minute and happens on the device.</p>
            </li>
            <li>
              <h3>Your proof stays in your wallet</h3>
              <p>Proofline saves a sealed credential on your phone. There is no central database of IDs to steal.</p>
            </li>
            <li>
              <h3>Apps ask, you approve</h3>
              <p>A bank, a call or a dating app asks a question. You see who's asking and what they'll learn.</p>
            </li>
            <li>
              <h3>They get a yes or no</h3>
              <p>The app learns the answer, such as "this is Amara" or "over 18", and nothing more.</p>
            </li>
          </ol>
        </section>

        <section className="privacy" id="privacy" aria-labelledby="privacy-h">
          <div className="privacy-inner">
            <h2 id="privacy-h">Proof without handing over your ID</h2>
            <p className="privacy-lede">
              Every time an app asks, Proofline shows you this split before you agree. Here's what Huddle sees when it
              checks Amara on a call.
            </p>
            <div className="see-split">
              <div className="see-col">
                <h3>
                  <EyeIcon /> What Huddle sees
                </h3>
                <ul>
                  <li>Identity confirmed: Amara Njoroge</li>
                  <li>Works at Kilima Freight</li>
                  <li>On the phone she registered</li>
                </ul>
              </div>
              <div className="see-col see-never">
                <h3>
                  <EyeOffIcon /> What it never sees
                </h3>
                <ul>
                  <li>Her ID number or document photo</li>
                  <li>Her date of birth or home address</li>
                  <li>Her selfie or face scan</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-end">
          <h2>Watch Proofline stop a $25 million call.</h2>
          <p>Five short steps. Takes about two minutes.</p>
          <a href="#/demo/1" className="btn btn-primary">
            Start the demo <ArrowRight />
          </a>
        </section>
      </main>

      <footer className="site-foot">
        <Wordmark small />
        <p>
          A design prototype for Hyperbloom October 2026. All people and companies in this demo are fictional, and no
          real identity checks run.
        </p>
      </footer>
    </>
  )
}
