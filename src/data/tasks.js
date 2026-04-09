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
}

// Each task has:
//   id, label, venture, period, xp
//   detail: { duration, output, why, steps[] }
//
// Day index: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

export const WEEKLY_TASKS = {

  // ── Every day ──────────────────────────────────────────────────────────
  daily: [
    {
      id: 'daily_1',
      label: 'LinkedIn reputation build: comment on 5 posts in target industries',
      venture: 'aimybiz',
      period: 'morning',
      xp: 20,
      detail: {
        duration: '15 min',
        output: '5 genuine, visible comments left on posts by people in your target markets.',
        why: 'Every comment you leave is seen by everyone who views that post — including decision-makers in sales, recruitment, real estate and insurance who are exactly your CloseCoach prospects. Done daily, this builds name recognition and credibility before you ever send a cold message. People buy from people they\'ve seen before. This also costs £0 and compounds every single day.',
        steps: [
          'Open LinkedIn. Search for posts using hashtags: #salestraining, #salestips, #realestate, #recruitmentagency, #insurancebroker, or #learnerdriver.',
          'Find 5 posts with decent engagement (10+ likes). Prioritise posts by people who match your CloseCoach target profile: sales managers, agency directors, team leads.',
          'Leave a comment that adds value — an insight, a question, a perspective. Not "great post!" — something that shows you know your subject. e.g. on a post about onboarding: "Onboarding is where most sales teams lose reps silently — they don\'t fail loudly, they just underperform for 3 months before leaving. Curious if you\'ve found roleplay-based training makes a difference at the start."',
          'On DTS-relevant posts (driving test complaints, learner driver frustrations, DVSA wait times), mention drivingtestswap.uk naturally in your comment.',
          'This is brand-building. You are becoming a recognisable name in the spaces where your customers live.',
        ],
      },
    },
    {
      id: 'daily_2',
      label: 'Evening debrief: wins, blocks, tomorrow\'s first move',
      venture: 'admin',
      period: 'evening',
      xp: 10,
      detail: {
        duration: '5 min',
        output: 'A brief written record: what moved today, what blocked you, and tomorrow\'s first task.',
        why: 'The debrief closes the loop. Without it, days blur into weeks and you lose track of what\'s actually moving. It also means you start tomorrow knowing your first move — you\'re never spending 20 minutes deciding what to do. Five minutes tonight saves an hour of drift tomorrow.',
        steps: [
          'Write 1–3 things you did today that moved a venture forward. Even small things count.',
          'Write 1 thing that didn\'t happen — and be honest about why. Was it blocked externally, or did you avoid it?',
          'Write tomorrow\'s single first task. The one thing you do before anything else. Make it specific (e.g. "Send CloseCoach message to the 3 estate agents from Sunday\'s prep list").',
          'Update any Mission Control metrics that changed today — takes 2 minutes.',
        ],
      },
    },
  ],

  // ── Mon / Wed / Fri — CloseCoach sales + DTS marketing ─────────────────
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
        why: 'CloseCoach is complete. The only thing between 0 and 3 paying customers is consistent outbound. 3 messages per MWF = 36 messages per month. If 10% respond and 30% of those convert, you get your first customer within 6–8 weeks.',
        steps: [
          'Open LinkedIn. Search one of these: "sales director estate agent Southampton", "insurance broker sales manager", "recruitment agency director", "car dealership sales manager".',
          'Look at their profile. Do they have a sales team of 3+ people? That\'s your qualifier.',
          'Send a connection request with a short note: "Hi [Name], I\'ve built a sales training tool that uses AI roleplay to help teams onboard reps faster and sharpen existing ones. Would be good to connect." — keep it under 300 characters.',
          'For people already connected, send a direct message: "Hi [Name], I\'ve been building CloseCoach — an AI-powered sales trainer that simulates real customer conversations. It\'s designed for teams onboarding new reps or developing existing ones. Would you be open to a 20-min demo this week?"',
          'Log each message sent: name, company, date, status (sent / replied / demo booked). Use a note, spreadsheet, or anything consistent.',
          'Do 3 per session. Quality over quantity — read their profile first.',
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
        output: 'All leads that are 3+ days old without response have received a follow-up.',
        why: 'Most deals close on the 5th–8th contact. One message rarely converts. A polite follow-up after 3 days signals professionalism and keeps you top of mind.',
        steps: [
          'Check your lead log (from mwf_1). Find any messages sent 3+ days ago with no reply.',
          'Send a follow-up: "Hey [Name], just circling back on the CloseCoach message. Happy to do a 15-min walkthrough if that\'s easier than reading about it — no pitch, just a demo so you can see whether it fits."',
          'If still no reply after a second follow-up, mark as "cold" and move on. Don\'t chase more than twice.',
          'If someone replied positively, book the demo immediately and prepare your walkthrough (have CloseCoach open and ready to show a live simulation).',
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
        output: 'One post published or one outreach action completed (instructor contacted, community engaged, etc.).',
        why: 'DTS has a huge addressable market (600k waiting learners) but zero acquisition if nothing is pushed out. Each piece of content or outreach is a seed. You only need a few to land to see compounding growth.',
        steps: [
          'Choose today\'s format: (A) short video/post — e.g. "did you know 47% of learner drivers book placeholder tests just to get in the queue? Here\'s a better way", (B) post in a Facebook group for learner drivers (search "learner drivers UK"), (C) direct message to a driving instructor asking if their students struggle with test date availability.',
          'For content: keep it under 60 seconds or 150 words. Lead with the problem ("waiting 6 months for a test date"), close with the solution ("swap with someone who has what you want at drivingtestswap.uk").',
          'For instructor outreach: find 3 instructors on Instagram/Facebook. Message: "Hi [Name], I run a platform that lets learner drivers swap their test dates — a lot of my users are referred by instructors. Would you be open to mentioning it to students who are struggling with availability?"',
          'Post it. Don\'t overthink it. Done is better than perfect.',
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
        why: 'Organic community presence builds trust and brand awareness without spending a penny. People recommend what they\'ve seen help others in context.',
        steps: [
          'Open Facebook. Search "learner drivers UK", "driving test tips", "driving anxiety". Join 2–3 active groups if not already a member.',
          'Find posts where people are complaining about wait times, rescheduling, or test date problems. Leave a genuinely helpful comment first.',
          'Then, naturally (not spammily), mention DTS: "There\'s a site called drivingtestswap.uk where people swap dates — might help if you need something sooner."',
          'Don\'t post links without context — you\'ll get removed. Be a person first, mention the tool second.',
          'Also check Reddit: r/LearnerDrivers, r/driving. Same approach.',
        ],
      },
    },
  ],

  // ── Tue / Thu — Web Dev + Athletics content ────────────────────────────
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
        why: 'Web builds are direct revenue (£458+ per site, aiming for £750+). The faster you deliver, the faster you invoice. Slow delivery = slow cash flow and unhappy clients. A "deliverable" means something the client can actually see and react to.',
        steps: [
          'Open the client brief or your notes. What was the last thing you completed? What\'s the next section — hero, about, services, contact, portfolio?',
          'Before writing a single line of code, confirm you have all the content you need for that section (text, images, links). If not — stop and message the client to request it before continuing. Missing assets are the #1 reason builds drag on.',
          'Build the section. Use your existing components and stack. Focus on functionality over perfection — you can refine once the client approves structure.',
          'When done, take a screenshot or short screen recording of the completed section.',
          'Send to the client: "Hi [Name], here\'s the [section] done. Let me know if you want any changes before I move to [next section]." Getting regular feedback prevents big rework at the end.',
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
        output: '3–5 raw video clips saved to your phone, ready for editing later.',
        why: 'You\'re already at the gym. The equipment, the setting, and the movement are all there. Filming costs you almost no extra time if you plan it — but if you don\'t, you leave with nothing. Consistency of 3x/week posting is only possible if you batch-capture.',
        steps: [
          'Before you start your session, set your phone on a tripod, a shelf, or lean it against something stable at a good angle.',
          'Capture at least: one clip of a rope flow sequence (15–30 seconds), one clip of a calisthenics movement (pull-ups, L-sit, muscle-up — whatever you\'re training today), one clip of something unusual or visually interesting (slow-mo jump, handstand attempt, ring work).',
          'You don\'t need to look at the camera. Train naturally. Film your actual session.',
          'Don\'t stop to review clips mid-session — you\'ll kill your flow. Review after.',
          'Save the best 3–5 clips to a folder labelled with the date. That\'s it for today. Editing happens on Sunday.',
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
        why: 'Responsiveness is the single biggest differentiator for freelancers. Clients don\'t care if you\'re busy — they care if they feel ignored. Fast responses = trust = referrals = higher pricing power.',
        steps: [
          'Check email, WhatsApp, and any other channel the client uses.',
          'For any message over 24 hours old without a response: reply now.',
          'If they\'re asking about progress: give them a specific update ("I\'m finishing the Services section today, will send a preview by end of day").',
          'If they\'re requesting a change: acknowledge it clearly ("Got it — I\'ll update the hero text to X and send a revised version tomorrow").',
          'If you\'re waiting on something from them: follow up politely ("Just checking in on the logo/images/copy — I need these to complete [section]. Could you send them by [day]?").',
        ],
      },
    },
  ],

  // ── Saturday — Review & Finance ────────────────────────────────────────
  sat: [
    {
      id: 'sat_1',
      label: 'Weekly review: score each venture and identify what changed',
      venture: 'admin',
      period: 'morning',
      xp: 25,
      detail: {
        duration: '20–30 min',
        output: 'A written score (1–5) for each venture, with one sentence on what moved and one on what blocked you.',
        why: 'Without a weekly review, weeks blur together and you lose track of momentum. Scoring forces honesty. One sentence on "what moved" celebrates progress; one on "what blocked" identifies the pattern before it becomes a habit.',
        steps: [
          'Score DTS (1–5): did you post content every MWF? Did you engage in communities? Did your registered user count grow?',
          'Score CloseCoach (1–5): did you send 9 outbound messages (3 per MWF)? Did anyone reply? Did any demo get booked?',
          'Score Web Dev (1–5): did you advance the active build by at least 2 deliverables this week? Did you invoice anything?',
          'Score Athletics (1–5): did you film content on both Tue and Thu? Is editing/scheduling done for next week?',
          'For each venture: write one sentence — what actually moved (even slightly), and one sentence — what got in the way.',
          'Keep this record somewhere. In a month you\'ll see patterns: which venture gets skipped when you\'re stressed, which tasks you procrastinate, which days are dead.',
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
        why: 'Stale metrics are worse than no metrics — they create false confidence or false despair. Updating weekly keeps you honest about where you actually are versus where you want to be.',
        steps: [
          'Go to Mission Control tab in this dashboard.',
          'Update DTS: log in to drivingtestswap.uk admin, check registered users and active packages. Update both fields.',
          'Update CloseCoach: count outbound messages sent this week, demos booked total, paying customers.',
          'Update Web Dev: how many sites delivered, last invoice amount.',
          'Update Athletics: check your follower count on your primary platform, count posts published this week.',
          'Takes 10 minutes. Do it now while the week is fresh.',
        ],
      },
    },
    {
      id: 'sat_3',
      label: 'Log this week\'s income, expenses, and invoices',
      venture: 'admin',
      period: 'afternoon',
      xp: 20,
      detail: {
        duration: '15–20 min',
        output: 'A written record of this week\'s financial activity: money in, money out, invoices raised.',
        why: 'You\'ve flagged finance and business admin as a gap. Tracking weekly (even roughly) prevents end-of-year chaos, helps you understand your real income, and builds the habit of treating your ventures as businesses.',
        steps: [
          'Write down everything that came in this week: payments received, amounts, which venture. Even £0 is worth noting.',
          'Write down everything that went out: software, tools, materials, anything business-related.',
          'If you did any work this week that hasn\'t been invoiced yet — raise the invoice now. Use a simple invoice template (name, service, amount, payment terms). Send it before you forget.',
          'Note your running total: total revenue to date across all ventures. Update this weekly.',
          'If you\'re unsure what counts as a business expense, err on the side of writing it down. You\'ll figure out tax later — first, get in the habit of tracking.',
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
        why: 'Most stalled ventures have one real bottleneck — not ten. Finding and naming it turns a vague sense of being stuck into a solvable problem. This becomes your north star for the following week.',
        steps: [
          'Look at your weekly scores. Which venture scored lowest? What was the blocker?',
          'Ask yourself: if this venture only made one piece of progress next week, what would matter most?',
          'Write it as a specific action, not a category. "Get one CloseCoach demo booked" not "do more sales".',
          'Pin this somewhere visible: your phone lock screen, top of your notes, or the dashboard.',
          'On Monday morning, do this task first — before LinkedIn, before email, before anything else.',
        ],
      },
    },
  ],

  // ── Sunday — Planning & Content ────────────────────────────────────────
  sun: [
    {
      id: 'sun_1',
      label: 'Plan next week: assign one win-condition per venture per day',
      venture: 'admin',
      period: 'morning',
      xp: 25,
      detail: {
        duration: '20–30 min',
        output: 'A written weekly plan: one specific win-condition per venture per applicable day.',
        why: 'Planning on Sunday means Monday starts with direction, not decision fatigue. A "win-condition" is clearer than a task — it\'s the outcome that means the day was a success for that venture.',
        steps: [
          'Write Mon, Tue, Wed, Thu, Fri, Sat across the top of a note.',
          'For each MWF: CloseCoach win = "3 messages sent + 1 follow-up done". DTS win = "1 content piece published + 2 community engagements".',
          'For each TuTh: Web Dev win = "one section delivered to client". Athletics win = "3+ clips filmed".',
          'For Saturday: Admin win = "scores logged, metrics updated, invoices raised".',
          'Review last week\'s bottleneck from Saturday\'s task. Build in a specific action to address it this coming week.',
          'Keep this somewhere you\'ll see it on Monday morning. It\'s your week\'s mission brief.',
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
        output: '3 edited videos or posts queued and ready to go, with captions written.',
        why: 'Batching editing and scheduling on Sunday means you never post in a rush, never miss a day because you "didn\'t get round to it", and your content quality is consistent. Spontaneous posting is the enemy of a consistent brand.',
        steps: [
          'Open the clips you filmed on Tuesday and Thursday. Pick the 3 best.',
          'Edit each one: trim dead space at the start and end. Add text overlays if needed (movement name, cue, tip). Keep it under 60 seconds for short-form.',
          'Write a caption for each. Format: hook on line 1 (e.g. "Most people do pull-ups wrong —"), then the useful information, then close with a question or CTA ("What movement are you training this week?").',
          'Schedule using your platform\'s native scheduler or a free tool. Monday, Wednesday, Friday at a consistent time (e.g. 7am or 7pm).',
          'If you don\'t have enough clips from the week — plan to film something specific before Sunday ends. Even 10 minutes of focused filming gives you material.',
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
        output: 'A list of 10 specific companies with a named decision maker and their LinkedIn profile link.',
        why: 'Preparing the list on Sunday means Monday morning outreach is execution, not research. Research and execution in the same session burns mental energy and slows you down.',
        steps: [
          'Open LinkedIn Sales Navigator (free tier) or LinkedIn search.',
          'Search: "sales manager" OR "sales director" in industries: real estate, insurance, recruitment, automotive.',
          'Filter by company size: 10–50 employees (big enough to have a sales team, small enough that the founder/director is reachable).',
          'Find 10 people. For each, copy: full name, job title, company name, LinkedIn URL.',
          'Note one thing from their profile that makes them a good fit (e.g. "runs a team of 5 sales reps" or "posts about sales training").',
          'That\'s your Monday morning send list. Aim to personalise each message using the note you wrote.',
        ],
      },
    },
    {
      id: 'sun_4',
      label: 'Study session: Bible, philosophy, or finance (30 min)',
      venture: 'admin',
      period: 'evening',
      xp: 15,
      detail: {
        duration: '30 min',
        output: 'One thing you read or reflected on. Optional: one sentence written on what stood out.',
        why: 'You\'ve flagged finance as a gap and philosophy/truth as a core interest. Consistent Sunday study compounds over time. A year of 30-minute weekly finance sessions will give you a better understanding of money than most people ever develop.',
        steps: [
          'Pick your focus for this session: Bible reading, philosophy (you\'re already reading — keep going), or finance basics (suggested: start with "The Psychology of Money" by Morgan Housel — 10-min chapters, very readable).',
          'Read for 30 minutes. No phone, no interruptions.',
          'Optional: write one sentence about what stood out. "Today I read about X and it made me think about Y." That\'s it.',
          'Rotate between all three over time. Don\'t let one crowd out the others.',
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
  0: { theme: 'Planning & Content',    focus: ['admin', 'aimybiz', 'athletics'] },
  1: { theme: 'Sales & DTS Marketing', focus: ['aimybiz', 'dts'] },
  2: { theme: 'Web Dev & Content',     focus: ['aimybiz', 'athletics'] },
  3: { theme: 'Sales & DTS Marketing', focus: ['aimybiz', 'dts'] },
  4: { theme: 'Web Dev & Content',     focus: ['aimybiz', 'athletics'] },
  5: { theme: 'Sales & DTS Marketing', focus: ['aimybiz', 'dts'] },
  6: { theme: 'Review & Finance',      focus: ['admin'] },
}
