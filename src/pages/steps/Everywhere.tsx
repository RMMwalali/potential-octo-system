import { useState } from 'react'
import { Badge } from '../../components/Badge'
import { Spot } from '../../components/Notes'

export function Everywhere() {
  const [showHidden, setShowHidden] = useState(false)

  return (
    <div className="everywhere">
      <div className="step-copy step-copy-wide">
        <h2>The same proof works everywhere else</h2>
        <p>
          One set of badges, one meaning each, on every surface. Tap a badge to see what it proves and what it keeps
          private.
        </p>
      </div>

      <div className="surfaces">
        <section className="surface surface-replies" aria-labelledby="sf-replies">
          <h3 id="sf-replies">Replies without the bots</h3>
          <div className="post">
            <p className="post-author">Nairobi Weather Desk</p>
            <p>Heavy rain expected in Nairobi from 3pm. Avoid low-lying roads near the river.</p>
          </div>
          <Spot n={1} title="One badge, one meaning, everywhere" note="The same shapes and words appear in calls, replies, dating and reviews. Learn them once, read them anywhere. Tap any badge for what it proves and what it keeps private.">
          <ul className="replies">
            <li>
              <p className="reply-head">
                <span className="reply-name">Achieng O.</span>
                <Badge kind="human" size="sm" explain />
              </p>
              <p>Mombasa Road is already flooding near the Capital Centre exit.</p>
            </li>
            <li>
              <p className="reply-head">
                <span className="reply-name">Kev M.</span>
                <Badge kind="human" size="sm" explain />
              </p>
              <p>Thanks. Rescheduling pickup to tomorrow.</p>
            </li>
          </ul>
          </Spot>
          <Spot n={2} place="tl" title="Hidden, never deleted" note="Unverified replies are folded away by default but always one tap from view. Filtering protects people without silencing anyone.">
          <button type="button" className="hidden-replies" aria-expanded={showHidden} onClick={() => setShowHidden((s) => !s)}>
            {showHidden ? 'Hide' : 'Show'} 214 replies from accounts that aren't verified
          </button>
          </Spot>
          {showHidden && (
            <p className="hidden-sample">
              Hidden by default, never deleted. You choose whether to read them.
            </p>
          )}
        </section>

        <section className="surface surface-match" aria-labelledby="sf-match">
          <h3 id="sf-match">A match who's really there</h3>
          <div className="match">
            <div className="match-photo" aria-hidden="true">
              <span>J</span>
            </div>
            <p className="match-name">Jabari, 28</p>
            <div className="match-badges">
              <Badge kind="human" size="sm" explain />
            </div>
            <p className="match-shared">
              Jabari chose to share his first name and age range. His surname and ID stay private until he decides
              otherwise.
            </p>
          </div>
        </section>

        <section className="surface surface-review" aria-labelledby="sf-review">
          <h3 id="sf-review">Reviews from real buyers</h3>
          <div className="review">
            <p className="review-stars" aria-label="Rated 4 out of 5">
              <span aria-hidden="true">★★★★☆</span>
            </p>
            <p className="review-title">Solid, but the charger runs warm</p>
            <p>Battery lasts two days with normal use. Fast delivery to Kisumu.</p>
            <p className="review-by">
              <span>Wairimu N.</span>
              <Badge kind="purchase" size="sm" explain />
            </p>
          </div>
          <p className="review-note">Only shown on reviews where the purchase was confirmed with the seller.</p>
        </section>
      </div>

      <div className="the-end">
        <h2>That's Proofline: proof of the person, not the picture.</h2>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#/demo/1">
            Watch it again
          </a>
          <a className="btn btn-quiet" href="#/">
            Back to the overview
          </a>
        </div>
      </div>
    </div>
  )
}
