// Venture definitions — muted natural palette per design system
export const VENTURES = {
  dts: {
    label: 'DTS',
    color: 'var(--venture-dts)',
    dimColor: 'var(--venture-dts-dim)',
    tag: 'Driving Test Swap',
  },
  aimybiz: {
    label: 'AIMyBiz',
    color: 'var(--venture-aimybiz)',
    dimColor: 'var(--venture-aimybiz-dim)',
    tag: 'CloseCoach & Web Dev',
  },
  athletics: {
    label: 'Athletics',
    color: 'var(--venture-athletics)',
    dimColor: 'var(--venture-athletics-dim)',
    tag: 'Personal Brand',
  },
  admin: {
    label: 'Admin',
    color: 'var(--venture-admin)',
    dimColor: 'var(--venture-admin-dim)',
    tag: 'Planning & Finance',
  },
  property: {
    label: 'Property',
    color: 'var(--venture-property)',
    dimColor: 'var(--venture-property-dim)',
    tag: 'BRRR Portfolio',
  },
  body: {
    label: 'Body',
    color: 'var(--venture-body)',
    dimColor: 'var(--venture-body-dim)',
    tag: 'Physical Mastery',
  },
  spiritual: {
    label: 'Spirit',
    color: 'var(--venture-spiritual)',
    dimColor: 'var(--venture-spiritual-dim)',
    tag: 'Bible & Values',
  },
  jobs: {
    label: 'Jobs',
    color: 'var(--venture-jobs)',
    dimColor: 'var(--venture-jobs-dim)',
    tag: 'Employment Track',
  },
}

// Each task has:
//   id, label, venture, period, xp
//   detail: { duration, output, why, steps[], planB? }
//
// Day index: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

export const WEEKLY_TASKS = {

  // ── Every day ──────────────────────────────────────────────────────────
  daily: [
    {
      id: 'daily_1',
      label: 'Morning Bible study — 10 min passage + one written reflection',
      venture: 'spiritual',
      period: 'morning',
      xp: 15,
      detail: {
        duration: '10 min',
        output: 'One passage read. One sentence written on what stood out.',
        why: 'Your values, decisions, and how you treat people all flow from your foundation. Daily Bible study is not a religious formality — it is the practice of consistently sharpening the lens through which you interpret everything else. 10 quiet minutes before the noise of the day sets the tone for how you show up. Missing one day is fine. Missing a week means you are running on yesterday\'s values.',
        steps: [
          'Open your Bible app (YouVersion, Bible Gateway) or physical Bible. If you don\'t have a reading plan, start in Proverbs — one chapter per day, 31 chapters, one month.',
          'Read the passage. Don\'t rush. If something catches, stop and sit with it.',
          'Write one sentence in your notes or a journal: "Today I read [book/chapter] and it made me think about [specific thing]." That\'s all.',
          'If time allows, pray or reflect for 2 minutes before moving on. If not, the reading alone is enough.',
          'PLAN B — missed yesterday: Do not double up on passages to "catch up". Just continue from where you are. Consistency over completeness.',
        ],
      },
    },
    {
      id: 'daily_2',
      label: 'Morning prehab — 8 min joint mobility circuit',
      venture: 'body',
      period: 'morning',
      xp: 10,
      detail: {
        duration: '8–10 min',
        output: 'Wrists, shoulders, hips, and spine mobilised before the day\'s demands.',
        why: 'One injury derails 4–8 weeks of training. Ten minutes of prehab every morning costs you nothing and buys you years of consistent movement. The athletes who last are not always the most talented — they are the most durable. This is your durability practice.',
        steps: [
          'Wrist circles — 10 forward, 10 backward. Then wrist flexion/extension holds for 15 seconds each.',
          'Shoulder CARS (Controlled Articular Rotations) — slow full circles in each shoulder, 5 per direction. Feel the range, don\'t force it.',
          'Hip 90/90 stretch — 60 seconds per side. Keep your spine tall.',
          'Deep squat hold — 60 seconds. Use a doorframe for balance if needed.',
          'Cat-cow spinal wave — 10 slow repetitions. Breathe into each position.',
          'PLAN B — current injury: Replace this routine with your rehab protocol for the specific injury site. If you have no protocol, look up the standard physiotherapy exercises for your injury type. Do not skip this block entirely — working around the injury keeps the habit intact and speeds recovery.',
        ],
      },
    },
    {
      id: 'daily_3',
      label: 'LinkedIn reputation build — comment on 5 posts in target industries',
      venture: 'aimybiz',
      period: 'morning',
      xp: 20,
      detail: {
        duration: '15 min',
        output: '5 genuine, visible comments left on posts by people in your target markets.',
        why: 'Every comment you leave is seen by everyone who views that post — including sales directors, agency owners, and hiring managers who are exactly your CloseCoach prospects and job application targets. Done daily, this builds name recognition before you ever send a cold message or application. People buy from — and hire — people they\'ve seen before. This costs £0 and compounds every single day.',
        steps: [
          'Open LinkedIn. Search hashtags: #salestraining, #salestips, #realestate, #recruitmentagency, #insurancebroker, or #learnerdriver.',
          'Find 5 posts with decent engagement (10+ likes). Prioritise posts by sales managers, agency directors, and team leads — your exact CloseCoach prospect profile.',
          'Leave a comment that adds value: an insight, a question, a perspective. Not "great post!" — something that proves you know the subject. Example on an onboarding post: "Onboarding is where most sales teams lose reps silently — they don\'t fail loudly, they just underperform for 3 months then leave. Curious if you\'ve found roleplay-based training helps at the start."',
          'On DTS-relevant posts (driving test complaints, DVSA wait times), mention drivingtestswap.uk naturally.',
          'This is brand-building. You are becoming a recognisable name in spaces where your customers and employers live.',
        ],
      },
    },
    {
      id: 'daily_4',
      label: 'Evening debrief — wins, blocks, tomorrow\'s first move',
      venture: 'admin',
      period: 'evening',
      xp: 10,
      detail: {
        duration: '5 min',
        output: 'A brief written record: what moved today, what blocked you, tomorrow\'s first task.',
        why: 'The debrief closes the loop. Without it, days blur into weeks and you lose track of what is actually moving. It also means you start tomorrow knowing your first move — you are never spending 20 minutes deciding what to do. Five minutes tonight saves an hour of drift tomorrow.',
        steps: [
          'Write 1–3 things you did today that moved a venture or goal forward. Small things count.',
          'Write 1 thing that did not happen — and be honest about why. Was it blocked externally, or did you avoid it?',
          'Write tomorrow\'s single first task. The one thing you do before anything else. Make it specific (e.g. "Send CloseCoach message to the 3 estate agents from Sunday\'s prep list").',
          'Update any Mission Control metrics that changed today — takes 2 minutes.',
        ],
      },
    },
  ],

  // ── Mon / Wed / Fri — CloseCoach sales + DTS marketing + Job Hunt ──────
  mwf: [
    {
      id: 'mwf_1',
      label: 'Send 3 CloseCoach LinkedIn outbound messages',
      venture: 'aimybiz',
      period: 'morning',
      xp: 35,
      detail: {
        duration: '30–45 min',
        output: '3 personalised LinkedIn messages sent to qualified sales-team decision makers.',
        why: 'CloseCoach is complete. The gap between 0 and 3 paying customers is consistent outbound. 3 messages per MWF = ~36 messages per month. At a 10% reply rate and 30% conversion on replies, first customers arrive within 6–8 weeks. Pricing tiers: Starter £149/mo (1–5 reps), Team £399/mo (5–15 reps), Growth £749/mo (15–30 reps), Scale £1,199/mo (30–50 reps). Target the Team and Growth tiers first — the ROI conversation is easiest at those levels.',
        steps: [
          'Open LinkedIn. Search: "sales director estate agent", "insurance broker sales manager", "recruitment agency director", "car dealership sales manager".',
          'Qualify before messaging: do they have a sales team of 5+ people? That\'s your minimum for Team tier (£399/mo). Teams of 15+ are Growth tier targets (£749/mo) — prioritise these.',
          'Send a connection request with a note (under 300 chars): "Hi [Name], I\'ve built an AI sales trainer that simulates real customer conversations — designed for teams onboarding reps or developing existing ones. Would be good to connect."',
          'For already-connected prospects, direct message: "Hi [Name], I run CloseCoach — an AI-powered sales training tool. It puts your reps into realistic roleplays before they face real customers. Takes 15 minutes a day, measurably shortens onboarding. Would you be open to a 20-min demo this week?"',
          'Log each message: name, company, team size estimate, date, status (sent / replied / demo booked). Any tracker works.',
          'PLAN B — zero replies this week: Shift 30 minutes toward posting CloseCoach content on LinkedIn instead (case study format, tip post, "what I built" post). Inbound leads convert faster than cold outbound. Content builds your legitimacy while outbound continues in parallel.',
        ],
      },
    },
    {
      id: 'mwf_2',
      label: 'Follow up on any open CloseCoach leads',
      venture: 'aimybiz',
      period: 'morning',
      xp: 20,
      detail: {
        duration: '15 min',
        output: 'All leads 3+ days old without response have received a follow-up.',
        why: 'Most deals close on the 5th–8th contact. One message rarely converts. A polite follow-up after 3 days signals professionalism and keeps you top of mind. Most people are not ignoring you — they are just busy.',
        steps: [
          'Check your lead log (from mwf_1). Find messages sent 3+ days ago with no reply.',
          'Send a follow-up: "Hey [Name], circling back on the CloseCoach message. Happy to do a 15-min walkthrough if that\'s easier than reading about it — no pitch, just a demo to see whether it fits."',
          'If still no reply after two follow-ups, mark as "cold" and move on. Don\'t chase more than twice.',
          'If someone replied positively, book the demo immediately. Have CloseCoach open and ready — show a live simulation. Anchor pricing early: "We work with teams from £149/mo and scale based on team size."',
          'If a demo converts: the next conversation is about tier selection. Team (5–15 reps) = £399/mo. Growth (15–30 reps) = £749/mo. Don\'t undersell — the ROI from one rep closing an extra deal per month covers the cost completely.',
        ],
      },
    },
    {
      id: 'mwf_3',
      label: 'DTS: publish one piece of content or execute one outreach action',
      venture: 'dts',
      period: 'afternoon',
      xp: 30,
      detail: {
        duration: '20–30 min',
        output: 'One post published or one outreach action completed (instructor contacted, community engaged).',
        why: 'DTS has a 600k+ addressable market (learner drivers waiting for tests) but zero acquisition if nothing is pushed. Each piece of content or outreach is a seed. You only need a few to land to trigger compounding referral growth.',
        steps: [
          'Choose today\'s format: (A) short video/post — "did you know 47% of learner drivers book placeholder tests just to get in the queue? Here\'s a better way," (B) post in a Facebook learner driver group, (C) DM a driving instructor about referring students.',
          'For content: under 60 seconds or 150 words. Open with the problem ("waiting 6 months for a test date"), close with the solution ("swap with someone who has what you need at drivingtestswap.uk").',
          'For instructor outreach: find 3 instructors on Instagram or Facebook. Message: "Hi [Name], I run a platform that lets learner drivers swap test dates — a lot of my users are referred by instructors. Would you mention it to students struggling with availability?"',
          'Post it. Don\'t overthink. Done is better than perfect.',
          'PLAN B — DTS traffic or registrations have dropped: Audit where recent users came from. If community posts drove most sign-ups, increase to daily community activity for 2 weeks. If instructors drove referrals, send a re-engagement message to every instructor you\'ve previously contacted. Do not run paid ads until you have squeezed all organic channels dry.',
        ],
      },
    },
    {
      id: 'mwf_4',
      label: 'DTS: engage in two learner driver communities',
      venture: 'dts',
      period: 'afternoon',
      xp: 15,
      detail: {
        duration: '15 min',
        output: 'Genuine comments or responses in 2 communities where learner drivers gather.',
        why: 'Organic community presence builds trust and awareness without spending a penny. People recommend what they\'ve seen help others in context.',
        steps: [
          'Open Facebook. Search "learner drivers UK", "driving test tips", "driving anxiety". Join 2–3 active groups if not already a member.',
          'Find posts where people complain about wait times, rescheduling, or test date problems. Leave a genuinely helpful comment first.',
          'Then, naturally, mention DTS: "There\'s a site called drivingtestswap.uk where people swap dates — might help if you need something sooner."',
          'Do not post links without context — you\'ll get removed. Be a person first, mention the tool second.',
          'Also check Reddit: r/LearnerDrivers, r/driving. Same approach.',
        ],
      },
    },
    {
      id: 'mwf_5',
      label: 'Job hunt: 1 targeted application or 1 company deep-research session',
      venture: 'jobs',
      period: 'afternoon',
      xp: 25,
      detail: {
        duration: '30–45 min',
        output: '1 application submitted or 1 company fully researched and logged in the Job Shortlist.',
        why: 'A senior developer role (£45–70k) at the right company is not a backup plan — it is a leverage multiplier. The right job fills your skills gap (system design, enterprise tooling), provides a stable financial floor while ventures grow, and opens doors your solo track cannot. The companies on the shortlist are strategic choices, not desperation moves. Keep the pipeline moving consistently.',
        steps: [
          'Open the Jobs tab in this dashboard. Which company is at "not_applied" status with the highest strategic value?',
          'If applying today: open the JD. Identify their exact tech stack and keywords. Update your CV intro to mirror their language (keep it honest — reorder emphasis, not invent experience). Write a 3-sentence cover intro if required: what you\'ve built, why their specific work interests you, what you can contribute from day one.',
          'If researching today: read their engineering blog, GitHub, recent news, Glassdoor reviews. What are their interview stages? What stack do they use? Note one genuine connection between your experience and their work.',
          'Submit the application or update the Job Shortlist with your research notes. Move the status to the appropriate stage.',
          'Follow up on any "applied" applications older than 7 days — a short, polite email: "Hi [Name], I applied for [role] on [date] and wanted to confirm receipt. Happy to send any additional materials if helpful."',
          'PLAN B — a company has gone silent for 10+ days after a trial project: mark it as "cold" in the Job Shortlist. Turn the trial work into a portfolio post if you are allowed to share it. Increase application frequency to 2 per week on Otta and Wellfound.',
        ],
      },
    },
  ],

  // ── Tue / Thu — Web Dev + Athletics content + Property research ─────────
  tuth: [
    {
      id: 'tuth_1',
      label: 'Web build: advance the active project by one deliverable',
      venture: 'aimybiz',
      period: 'morning',
      xp: 45,
      detail: {
        duration: '2–3 hours',
        output: 'One concrete section or feature of the active website is complete and documented.',
        why: 'Web builds are direct revenue (target £750+ per site). The faster you deliver, the faster you invoice. Slow delivery means slow cash flow and clients who lose confidence. A "deliverable" means something the client can actually see and react to.',
        steps: [
          'Open the client brief or your notes. What was the last thing completed? What is the next section — hero, about, services, contact, portfolio?',
          'Before writing a single line of code, confirm you have all the content for that section (text, images, links). If not — stop and message the client to request it. Missing assets are the #1 reason builds drag.',
          'Build the section. Use your existing components and stack. Focus on functionality over perfection — you can refine once the client approves structure.',
          'When done, take a screenshot or short screen recording of the completed section.',
          'Send to the client: "Hi [Name], here\'s the [section] done. Let me know if you want any changes before I move to [next section]." Regular feedback prevents big rework at the end.',
          'Log: what you built, how long it took, any blockers. This helps you price the next job accurately.',
        ],
      },
    },
    {
      id: 'tuth_2',
      label: 'Film 3–5 content clips during or after gym session',
      venture: 'athletics',
      period: 'afternoon',
      xp: 30,
      detail: {
        duration: '15–20 min (within gym session)',
        output: '3–5 raw video clips saved to phone, ready for Sunday editing.',
        why: 'You are already at the gym. The equipment, setting, and movement are all there. Filming costs almost no extra time if you plan it — but if you do not plan it, you leave with nothing. Consistency of 3x/week posting is only possible if you batch-capture.',
        steps: [
          'Before your session, set your phone on a tripod, shelf, or lean it at a good angle.',
          'Capture at least: one clip of a rope flow or movement sequence (15–30 seconds), one clip of a calisthenics skill (pull-ups, L-sit, muscle-up, rings), one unusual or visually interesting shot (slow-mo, handstand attempt, transition).',
          'Train naturally. Do not stop to review clips mid-session — you\'ll kill your flow. Review after.',
          'Save the best 3–5 clips to a folder labelled with the date. Editing happens Sunday.',
          'PLAN B — injured and cannot train: Film a stationary piece-to-camera instead. Talk about your training philosophy, a skill you\'re working toward, or a movement concept. Content does not require you to perform — knowledge is enough.',
        ],
      },
    },
    {
      id: 'tuth_3',
      label: 'Client comms: respond to any pending web dev messages',
      venture: 'aimybiz',
      period: 'morning',
      xp: 10,
      detail: {
        duration: '10–15 min',
        output: 'All client messages older than 24 hours have a response.',
        why: 'Responsiveness is the single biggest differentiator for freelancers. Clients do not care if you are busy — they care if they feel ignored. Fast responses equal trust, which equals referrals, which equals higher pricing power.',
        steps: [
          'Check email, WhatsApp, and any other channel the client uses.',
          'For any message over 24 hours old without a response: reply now.',
          'If they are asking about progress: give a specific update ("I\'m finishing the Services section today, will send a preview by end of day").',
          'If they are requesting a change: acknowledge clearly ("Got it — I\'ll update the hero text to X and send a revised version tomorrow").',
          'If you are waiting on something from them: follow up ("Just checking in on the logo/images/copy — I need these to complete [section]. Could you send them by [day]?").',
        ],
      },
    },
    {
      id: 'tuth_4',
      label: 'Property research: screen 3 Nottingham deals against BRRR criteria',
      venture: 'property',
      period: 'afternoon',
      xp: 20,
      detail: {
        duration: '30 min',
        output: '3 properties logged with rough ARV, refurb estimate, and yield calculation.',
        why: 'You won\'t find a good deal by waiting until you have capital. The best deals move fast. Sourcing consistently now means when capital is ready, you know exactly what to buy — and you have done the market research that most first-time investors skip entirely. Target: Nottingham (high yield, strong rental demand, below-market entry prices). Live-in first deal to access 10% residential deposit (vs 25% BTL) and first-time buyer SDLT relief.',
        steps: [
          'Open Rightmove. Filter: Nottingham, ≤£175,000, 2–3 bed, houses only (not flats). Sort by: Lowest price first.',
          'For each property below market rate, estimate post-refurb value by checking recent sold prices on the same street for comparable size (Rightmove shows sold prices — use the "Sold" filter).',
          'Calculate rough deal: [Purchase price] + [estimated refurb £15–25k] vs [ARV]. Does the deal leave 15–20%+ equity post-refurb? That\'s your BRRR margin.',
          'For properties that pass the screen, log: address, asking price, estimated ARV, estimated refurb, yield at current rents (check Rightmove rental listings on same street). Note: Nottingham 3-bed HMO conversion yields can hit 8–12% — flag these separately.',
          'Research task only — not action. No offers until capital is staged. You are building market expertise and deal flow awareness.',
          'PLAN B — a deal falls through after offer accepted: Return to research mode immediately. Do not redeploy capital emotionally into a second-best deal. The right deal comes up every quarter in an active search. Record what went wrong (surveyor findings, seller pulled out, finance issue) and learn from it.',
          'PLAN B — capital emergency drains your deposit fund: Emergency fund (3 months living expenses) takes absolute priority over any property deposit. Shift timeline by 1–2 months and continue the research. Missing a deal because you protected your emergency fund is not failure — it is correct sequencing.',
        ],
      },
    },
  ],

  // ── Saturday — Review, Finance & Property Pipeline ─────────────────────
  sat: [
    {
      id: 'sat_1',
      label: 'Weekly review: score each venture and identify what changed',
      venture: 'admin',
      period: 'morning',
      xp: 25,
      detail: {
        duration: '20–30 min',
        output: 'A written score (1–5) for each area with one sentence on what moved and one on what blocked.',
        why: 'Without a weekly review, weeks blur together. Scoring forces honesty. One sentence on "what moved" celebrates progress; one on "what blocked" identifies the pattern before it becomes a habit.',
        steps: [
          'Score DTS (1–5): did you post content every MWF? Did you engage in communities? Did registered user count grow?',
          'Score CloseCoach (1–5): did you send 9+ outbound messages? Did anyone reply? Any demos booked?',
          'Score Web Dev (1–5): did you advance the active build by at least 2 deliverables? Any invoices raised?',
          'Score Athletics (1–5): did you film on Tue and Thu? Is editing and scheduling done for next week?',
          'Score Job Hunt (1–5): did you submit or deeply research at least 3 companies this week? Any responses received?',
          'Score Property (1–5): did you run the TuTh research sessions? Did you log any deals worth tracking?',
          'Score Body (1–5): did you complete prehab daily? Did you train according to your weekly split?',
          'Score Spirit (1–5): did you read your passage daily? What was your Bible streak?',
          'For each: one sentence on what moved and one on what blocked. Keep this record. In a month you\'ll see patterns.',
        ],
      },
    },
    {
      id: 'sat_2',
      label: 'Update all Mission Control metrics with this week\'s real numbers',
      venture: 'admin',
      period: 'morning',
      xp: 15,
      detail: {
        duration: '10 min',
        output: 'All metric fields in Mission Control reflect today\'s actual numbers.',
        why: 'Stale metrics are worse than no metrics — they create false confidence or false despair. Updating weekly keeps you honest about where you actually are.',
        steps: [
          'Go to Mission Control tab in this dashboard.',
          'Update DTS: log in to drivingtestswap.uk admin, check registered users and active packages. Update both fields.',
          'Update CloseCoach: count outbound messages sent this week, demos booked total, paying customers. Update MRR if changed.',
          'Update Web Dev: how many sites delivered, last invoice amount.',
          'Update Athletics: check follower count on your primary platform, count posts published this week.',
          'Takes 10 minutes. Do it now while the week is fresh.',
        ],
      },
    },
    {
      id: 'sat_3',
      label: 'Log this week\'s income, expenses, invoices, and LISA contribution',
      venture: 'admin',
      period: 'afternoon',
      xp: 20,
      detail: {
        duration: '15–20 min',
        output: 'Written record of financial activity: money in, money out, invoices raised, LISA balance noted.',
        why: 'Finance is a flagged gap. Tracking weekly prevents end-of-year chaos, shows you your real income, and — critically — keeps you aware of your capital-building pace toward your first BRRR deal. Every week you track is a week you can make adjustments. Every week you skip is a week of drift you cannot recover.',
        steps: [
          'Write everything that came in this week: payments received, amounts, which venture. Even £0 is worth noting — the absence of income is information.',
          'Write everything that went out: software, tools, materials, anything business-related.',
          'Raise any outstanding invoices now. Use a simple invoice template. Send before you forget.',
          'LISA check: open your Lifetime ISA (Skipton, Moneybox, or similar). What is your current balance? The annual allowance is £4,000 — the government adds £1,000 free (25% bonus). If you have not maxed this tax year\'s contribution, note how much room remains and set a monthly standing order. Even £100/month means £1,200/year into LISA, plus £300 government bonus — money towards your first property deposit for zero extra work.',
          'Note your running capital total: savings + LISA + any other earmarked property funds. Track this number weekly.',
          'PLAN B — emergency expense depletes savings: Write down exactly what happened and the new balance. Rebuild the emergency fund (target: 3 months living expenses) before resuming property capital accumulation. The BRRR timeline shifts — but the direction does not change.',
        ],
      },
    },
    {
      id: 'sat_4',
      label: 'Identify next week\'s #1 bottleneck and define one action to fix it',
      venture: 'admin',
      period: 'afternoon',
      xp: 20,
      detail: {
        duration: '10 min',
        output: 'One sentence: "Next week\'s main bottleneck is [X] and I will address it by [specific action]."',
        why: 'Most stalled ventures have one real bottleneck — not ten. Finding and naming it turns a vague sense of being stuck into a solvable problem. This becomes your north star for the week ahead.',
        steps: [
          'Look at your weekly scores. Which venture scored lowest? What was the specific blocker?',
          'Ask: if this venture only made one piece of progress next week, what would matter most?',
          'Write it as a specific action, not a category. "Get one CloseCoach demo booked" not "do more sales".',
          'On Monday morning, do this task first — before LinkedIn, before email, before anything else.',
        ],
      },
    },
    {
      id: 'sat_5',
      label: 'Property pipeline scan — Rightmove watchlist review and JV check',
      venture: 'property',
      period: 'afternoon',
      xp: 15,
      detail: {
        duration: '15 min',
        output: 'Saved Rightmove search reviewed. Any reduced or new deals logged. JV partner status noted.',
        why: 'Markets move weekly. Prices drop. New listings appear. A 15-minute scan keeps your market intelligence current and prevents you from missing fast-moving deals when capital is ready. You are not just building savings — you are building deal-sourcing fluency.',
        steps: [
          'Open your saved Rightmove search (Nottingham, ≤£175k, 2–3 bed, houses).',
          'Filter for "Reduced" this week. A recently reduced property is often a motivated seller — the most important signal in BRRR sourcing.',
          'Check any properties you logged during the week from your research sessions. Have any had price changes? Any removed from market (possible sale agreed)?',
          'Capital tracker: note your current total (savings + LISA) against your £40,000 target. How many months away are you at current accumulation rate?',
          'JV partner check: do you have 1–2 people identified who would co-invest? Have you had a specific conversation about terms? Pre-agree your exit clause and equity split in writing before deploying any joint capital — even a simple email thread with specific numbers.',
          'PLAN B — JV partner dispute on terms, equity, or exit: Do not deploy capital together until terms are documented, even informally. If the relationship cannot be structured professionally, find a different partner. One bad JV deal can cost more than several missed deals. Walk away cleanly if needed.',
        ],
      },
    },
  ],

  // ── Sunday — Planning, Content & Deep Study ────────────────────────────
  sun: [
    {
      id: 'sun_1',
      label: 'Plan next week: assign one win-condition per area per day',
      venture: 'admin',
      period: 'morning',
      xp: 25,
      detail: {
        duration: '20–30 min',
        output: 'A written weekly plan: one specific win-condition per venture per applicable day.',
        why: 'Planning Sunday means Monday starts with direction, not decision fatigue. A "win-condition" is clearer than a task — it\'s the outcome that means the day was a success for that venture.',
        steps: [
          'Write Mon, Tue, Wed, Thu, Fri, Sat across the top of a note.',
          'For each MWF: CloseCoach win = "3 messages sent + 1 follow-up done". DTS win = "1 content piece published + 2 community engagements". Jobs win = "1 application submitted or 1 company researched".',
          'For each TuTh: Web Dev win = "one section delivered to client". Athletics win = "3+ clips filmed". Property win = "3 deals logged with yield calculations".',
          'Saturday: Admin win = "all scores logged, metrics updated, LISA balance noted".',
          'Review last week\'s #1 bottleneck from sat_4. Build one specific action to address it into Monday\'s plan.',
          'Check the Goals OS tab. Which goal is furthest from its next milestone? Make one task this week specifically serve that gap.',
        ],
      },
    },
    {
      id: 'sun_2',
      label: 'Edit and schedule 3 Athletics content pieces for next week',
      venture: 'athletics',
      period: 'afternoon',
      xp: 35,
      detail: {
        duration: '45–60 min',
        output: '3 edited videos or posts queued and ready, with captions written.',
        why: 'Batching editing and scheduling on Sunday means you never post in a rush, never miss a day because you "didn\'t get round to it", and your content quality stays consistent. Spontaneous posting is the enemy of a consistent brand.',
        steps: [
          'Open the clips filmed on Tuesday and Thursday. Pick the 3 best.',
          'Edit each one: trim dead space at start and end. Add text overlays if needed (movement name, cue, tip). Keep under 60 seconds for short-form.',
          'Write a caption for each. Format: hook on line 1 (e.g. "Most people do pull-ups wrong —"), then the useful information, then a question or CTA ("What movement are you training this week?").',
          'Schedule using your platform\'s native scheduler or a free tool. Monday, Wednesday, Friday at a consistent time (e.g. 7am or 7pm).',
          'If you do not have enough clips from the week — plan to film something before Sunday ends. Even 10 focused minutes gives material.',
          'PLAN B — injured and no training clips: Repurpose a knowledge-based post (text carousel, talking-head video about training philosophy, or still with a strong caption). Injury does not end content — your perspective is the product, not just the performance.',
        ],
      },
    },
    {
      id: 'sun_3',
      label: 'Prep CloseCoach outreach list: 10 target companies for next week',
      venture: 'aimybiz',
      period: 'afternoon',
      xp: 20,
      detail: {
        duration: '20 min',
        output: 'A list of 10 specific companies with a named decision maker and their LinkedIn URL.',
        why: 'Preparing the list Sunday means Monday outreach is execution, not research. Research and execution in the same session burns mental energy and slows you down.',
        steps: [
          'Open LinkedIn search. Search: "sales manager" OR "sales director" in industries: real estate, insurance, recruitment, automotive.',
          'Filter by company size: 10–50 employees (big enough to have a sales team, small enough that the founder is reachable). These are Team and Growth tier targets: £399–£749/mo.',
          'Find 10 people. For each: full name, job title, company, LinkedIn URL, one note from their profile that makes them a strong fit (e.g. "posts frequently about sales training" or "recently hired 3 new reps").',
          'That\'s your Monday send list. Personalise each message using the note you wrote — it doubles response rates.',
        ],
      },
    },
    {
      id: 'sun_4',
      label: 'Deep study session: property education OR finance/SaaS theory (30 min)',
      venture: 'admin',
      period: 'evening',
      xp: 15,
      detail: {
        duration: '30 min',
        output: 'One thing read or reflected on. One sentence written on what stood out.',
        why: 'Consistent Sunday study compounds dramatically over time. A year of 30-minute weekly sessions equals roughly 26 hours of focused learning — more than most people invest in their financial education across a decade. Sunday Bible passages are covered in daily_1. This session is reserved for the material that will make your ventures structurally smarter.',
        steps: [
          'Alternate each Sunday between two tracks:',
          'TRACK A — Property education: read about BRRR case studies, HMO licensing in Nottingham, Section 24 tax implications (mortgage interest relief for landlords), Ltd company SPV structure for property (offsetting costs, ring-fencing liability), SDLT surcharge rules (3% surcharge on investment properties — confirmed reason to live in your first property first). Suggested: search "BRRR UK 2024 Nottingham case study" or read Samuel Leeds / Property Hub content.',
          'TRACK B — Finance and SaaS: read about SaaS pricing strategy (value-based vs cost-plus), MRR/ARR/churn modelling, unit economics, or general finance literacy. Suggested starting point: "The Psychology of Money" by Morgan Housel (short chapters, applicable immediately). Follow with Ben Horowitz "The Hard Thing About Hard Things" for the venture context.',
          'Write one sentence: "Today I read about [topic] and it means [specific implication for your situation]." That specificity is the difference between knowledge and useful knowledge.',
          'Rotate between tracks. Do not let one crowd out the other.',
        ],
      },
    },
  ],
}

export function getTasksForDay(dayIndex) {
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const daily = WEEKLY_TASKS.daily
  let specific = []

  if (dayIndex === 1 || dayIndex === 3 || dayIndex === 5) specific = WEEKLY_TASKS.mwf
  else if (dayIndex === 2 || dayIndex === 4) specific = WEEKLY_TASKS.tuth
  else if (dayIndex === 6) specific = WEEKLY_TASKS.sat
  else if (dayIndex === 0) specific = WEEKLY_TASKS.sun

  return [...daily, ...specific]
}

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const WEEK_SCHEDULE = {
  0: { theme: 'Planning, Content & Deep Study',  focus: ['admin', 'aimybiz', 'athletics', 'spiritual'] },
  1: { theme: 'Sales, DTS & Job Hunt',           focus: ['aimybiz', 'dts', 'jobs', 'spiritual', 'body'] },
  2: { theme: 'Build, Film & Property Research', focus: ['aimybiz', 'athletics', 'property', 'spiritual', 'body'] },
  3: { theme: 'Sales, DTS & Job Hunt',           focus: ['aimybiz', 'dts', 'jobs', 'spiritual', 'body'] },
  4: { theme: 'Build, Film & Property Research', focus: ['aimybiz', 'athletics', 'property', 'spiritual', 'body'] },
  5: { theme: 'Sales, DTS & Job Hunt',           focus: ['aimybiz', 'dts', 'jobs', 'spiritual', 'body'] },
  6: { theme: 'Review, Finance & LISA Check',    focus: ['admin', 'property', 'spiritual'] },
}
