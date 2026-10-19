# Proofline

**Know who's really on the call.** Proofline is a verify-once, prove-anywhere trust layer. It tells you, in plain words, whether the person on a video call, message or payment is real and is who they say they are, without handing over your ID.

Built for **Hyperbloom October 2026: UI/UX and Web Design**. This is a design prototype: every identity check is scripted, and all people and companies are fictional.

## The story the demo tells

A finance officer at a Nairobi logistics firm joins a call with her "CFO", who asks her to send USD 25 million. It mirrors a real 2024 case where every other person on a call was a deepfake.

1. **Verify once** – Amara scans her ID and does a selfie check on her own phone. Nothing is uploaded.
2. **Her wallet** – the call app asks to confirm it's her. She sees *what they'll see* and *what they'll never see* side by side, and chooses.
3. **The call** – colleagues show *Identity confirmed*. "David" looks and sounds right, but shows *Can't confirm identity*: he isn't on David's registered phone.
4. **The payment** – Amara presses approve. Proofline asks the real David on his own phone. He taps *No, I didn't ask for this*. Payment stopped.
5. **Everywhere else** – the same badges on bot-free replies, a dating match, and verified-purchase reviews.

## Design decisions

- **Two questions, kept apart.** "Is this a real person?" and "Is this the right person?" get different badges. The scammers in the real case were human, so a "not a bot" badge alone would have stayed green.
- **The two-second rule.** Every badge says what it proves in words. Shape carries meaning too (shield, circle, receipt, octagon), so nothing relies on colour alone.
- **Privacy you can see.** Every request shows what the app learns and what it never sees, before you agree. A share log answers "who knows what about me?"
- **Tap to explain.** Any badge opens a short "what this proves / what it doesn't share" note.

## Accessibility

- WCAG AA contrast on text and badges
- Status shown by shape and words, never colour alone
- Full keyboard path, visible focus rings, skip link, focus moved to each new demo step
- Screen-reader labels on badges ("Identity confirmed for Wanjiru Kamau") and live regions for status changes
- Respects reduced-motion settings
- Responsive down to 360px phones
- An in-person path for people without an ID to hand. There is deliberately no vouching by other accounts: if one fake account got verified, it could vouch for the next.

## Run it

```bash
npm install
npm run dev
```

Built with React, TypeScript and Vite. Headlines in Bowlby One, text in Inter Tight, notes in Nothing You Could Do (all free, OFL). 3D hero in three.js; scroll animation with GSAP ScrollTrigger. Visual direction inspired by sweet-tape.com. AI-assisted tools were used during development, as the hackathon rules allow.
