import { prisma } from './prisma';

export async function seedPrompts() {
  console.log('Seeding prompts...');

  const prompts = [
    {
      title: 'Code Review Assistant',
      description: 'A helpful AI assistant that reviews code and provides constructive feedback on best practices, potential bugs, and improvements.',
      content: `You are a senior software engineer conducting a code review. Analyze the following code and provide:

1. **Bug Identification**: Any bugs or potential runtime errors
2. **Code Quality**: Issues with readability, maintainability
3. **Best Practices**: Deviations from industry standards
4. **Performance**: Any efficiency concerns
5. **Security**: Potential vulnerabilities

Code to review:
\`\`\`
[PASTE CODE HERE]
\`\`\`

Provide your feedback in a structured format with specific line numbers when relevant.`,
      category: 'Development',
      tags: ['code-review', 'programming', 'best-practices'],
      createdBy: 'anonymous',
    },
    {
      title: 'Professional Email Writer',
      description: 'Write professional emails for various business scenarios with the right tone and formatting.',
      content: `You are a professional business communicator. Write an email for the following scenario:

**Scenario**: [DESCRIBE THE SITUATION - e.g., "Requesting a meeting with a potential client" or "Following up on a job application"]

**Tone**: [FORMAL/SEMI-FORMAL/FRIENDLY]
**Length**: [SHORT/BRIEF/DETAILED]

Include:
- Clear subject line
- Appropriate greeting
- Concise body
- Professional closing

Generate the email now.`,
      category: 'Business',
      tags: ['email', 'writing', 'communication', 'professional'],
      createdBy: 'anonymous',
    },
    {
      title: 'SQL Query Generator',
      description: 'Convert natural language descriptions into optimized SQL queries.',
      content: `You are a database expert. Convert the following natural language description into a SQL query.

**Database Schema**:
- Table: users (id, name, email, created_at, status)
- Table: orders (id, user_id, total_amount, status, created_at)
- Table: products (id, name, price, category_id)
- Table: order_items (id, order_id, product_id, quantity, unit_price)

**Request**: [DESCRIBE WHAT DATA YOU NEED]

Consider:
- Proper JOINs
- Appropriate WHERE clauses
- Aggregation if needed (GROUP BY, HAVING)
- Ordering and limiting results

Generate the SQL query with explanation.`,
      category: 'Development',
      tags: ['sql', 'database', 'query', 'programming'],
      createdBy: 'anonymous',
    },
    {
      title: 'Meeting Notes Summarizer',
      description: 'Transform raw meeting notes into clear, actionable summaries.',
      content: `You are an AI assistant specializing in organizing meeting notes. Analyze the following meeting notes and provide:

## Summary
[2-3 sentence overview of the meeting]

## Key Discussion Points
- [Point 1]
- [Point 2]
- [Point 3]

## Decisions Made
- [Decision 1]
- [Decision 2]

## Action Items
| Task | Owner | Due Date |
|------|-------|----------|
| [Task 1] | [Name] | [Date] |
| [Task 2] | [Name] | [Date] |

## Next Steps
[Any follow-up meetings or actions]

---
PASTE MEETING NOTES BELOW:
`,
      category: 'Productivity',
      tags: ['meetings', 'notes', 'summarization', 'organization'],
      createdBy: 'anonymous',
    },
    {
      title: 'Social Media Content Calendar',
      description: 'Create engaging social media content calendars for businesses.',
      content: `Create a 30-day social media content calendar for a [TYPE OF BUSINESS - e.g., coffee shop, tech startup, fitness brand].

**Platforms**: [e.g., Instagram, Twitter, LinkedIn]
**Target Audience**: [DESCRIBE AUDIENCE]
**Brand Voice**: [e.g., Professional, Fun, Inspirational]

For each day, provide:
- Content type (post, story, reel, thread)
- Theme/topic
- Caption direction
- Hashtag suggestions

Format as a calendar grid with columns for each platform.`,
      category: 'Marketing',
      tags: ['social-media', 'marketing', 'content-calendar', 'planning'],
      createdBy: 'anonymous',
    },
    {
      title: 'Technical Documentation Generator',
      description: 'Generate comprehensive technical documentation for APIs and software projects.',
      content: `Generate technical documentation for the following API endpoint:

**Endpoint**: [e.g., POST /api/users]
**Purpose**: [What this endpoint does]

## Overview
[Brief description of the endpoint's functionality]

## Endpoint Details
- **URL**: [Full URL]
- **Method**: [GET/POST/PUT/DELETE]
- **Authentication**: [Required/Optional]

## Request
### Headers
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| [Header 1] | [Type] | [Yes/No] | [Description] |

### Body Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| [Param 1] | [Type] | [Yes/No] | [Description] |

## Response
### Success (200)
\`\`\`json
[EXAMPLE SUCCESS RESPONSE]
\`\`\`

### Error Responses
- 400: [Bad Request description]
- 401: [Unauthorized description]
- 404: [Not Found description]
- 500: [Server Error description]

## Example Usage
\`\`\`bash
[EXAMPLE CURL COMMAND]
\`\`\``,
      category: 'Development',
      tags: ['documentation', 'api', 'technical-writing', 'programming'],
      createdBy: 'anonymous',
    },
    {
      title: 'Fitness Workout Planner',
      description: 'Create personalized workout plans based on fitness goals and equipment available.',
      content: `Create a personalized 4-week workout plan based on the following information:

**Goal**: [Weight loss / Muscle gain / Endurance / General fitness]
**Experience Level**: [Beginner / Intermediate / Advanced]
**Available Equipment**: [List equipment available - e.g., dumbbells, barbells, resistance bands, no equipment]
**Days Available**: [Number of days per week]
**Any Injuries/Limitations**: [Any physical limitations]

Include:
- Warm-up routines
- Main workout exercises with sets/reps
- Cool-down stretches
- Progression guidelines for week 2-4
- Rest day recommendations`,
      category: 'Health & Fitness',
      tags: ['fitness', 'workout', 'exercise', 'health'],
      createdBy: 'anonymous',
    },
    {
      title: 'Recipe Converter & Scaler',
      description: 'Convert recipes between measurement systems and scale quantities.',
      content: `You are a cooking assistant. Help with the following recipe task:

**Task Type**: [CONVERT / SCALE / ADAPT]
- Convert: Change measurement system (e.g., Imperial to Metric)
- Scale: Change serving size
- Adapt: Modify for dietary restrictions or substitutions

**Original Recipe**:
[PASTE RECIPE HERE]

**Requested Changes**:
[DESCRIBE WHAT YOU NEED - e.g., "Convert to metric" or "Scale to serve 8 people" or "Make it vegan"]

Provide the adapted recipe with:
- Converted/scaled ingredients
- Adjusted cooking times if needed
- Clear instructions
- Nutritional notes if relevant`,
      category: 'Cooking',
      tags: ['recipes', 'cooking', 'food', 'conversions'],
      createdBy: 'anonymous',
    },
    {
      title: 'Travel Itinerary Planner',
      description: 'Create detailed travel itineraries for any destination.',
      content: `Create a [NUMBER]-day travel itinerary for [DESTINATION].

**Travel Style**: [Budget / Mid-range / Luxury]
**Travelers**: [Solo / Couple / Family / Group]
**Interests**: [e.g., History, Food, Nature, Nightlife, Art]
**Season/Time of Year**: [What to expect weather-wise]

Include:
- Day-by-day schedule with activities
- Recommended restaurants (budget-friendly and upscale)
- Must-see attractions with ticket booking tips
- Hidden gems only locals know about
- Transportation recommendations between locations
- Packing suggestions based on activities
- Emergency contacts and local customs to be aware of`,
      category: 'Travel',
      tags: ['travel', 'planning', 'itinerary', 'vacation'],
      createdBy: 'anonymous',
    },
    {
      title: 'Interview Question Preparer',
      description: 'Prepare for job interviews with common questions and model answers.',
      content: `Help prepare for a job interview with the following details:

**Position**: [JOB TITLE]
**Company**: [COMPANY NAME]
**Industry**: [INDUSTRY]
**Experience Level**: [Entry / Mid / Senior]

Generate:

## Common Interview Questions
1. [Tell me about yourself - elevator pitch]
2. [Why this company?]
3. [Your greatest strength/weakness]
4. [Describe a challenge you overcame]
5. [Where do you see yourself in 5 years?]
6. [Why should we hire you?]

## Model Answers
For each question, provide:
- What interviewers are looking for
- A strong sample answer (2-3 sentences)
- Things to avoid

## Questions to Ask the Interviewer
5 thoughtful questions that show genuine interest in the role/company`,
      category: 'Career',
      tags: ['interview', 'job-search', 'career', 'preparation'],
      createdBy: 'anonymous',
    },
    {
      title: 'Blog Post Generator',
      description: 'Create well-structured, engaging blog posts on any topic with SEO optimization.',
      content: `Write a blog post based on the following details:

**Topic**: [DESCRIBE THE TOPIC]
**Target Audience**: [WHO IS THIS FOR]
**Word Count**: [APPROXIMATE LENGTH]
**Tone**: [Professional / Casual / Humorous / Educational]
**Goal**: [Inform / Persuade / Entertain / Convert]

Include:
- Attention-grabbing headline
- Introduction that hooks the reader
- 3-5 main sections with H2 headers
- Practical examples or case studies
- Clear conclusion with call-to-action
- Meta description for SEO (150-160 characters)

Make it engaging, well-researched, and ready to publish.`,
      category: 'Writing',
      tags: ['blog', 'content-writing', 'seo', 'marketing'],
      createdBy: 'anonymous',
    },
    {
      title: 'Debug Assistant',
      description: 'Get help debugging code with step-by-step analysis and solutions.',
      content: `You are an expert debugger. Help diagnose and fix the following code issue.

**Problem Description**: [DESCRIBE WHAT SHOULD HAPPEN]
**Actual Result**: [DESCRIBE WHAT ACTUALLY HAPPENS]
**Error Messages**: [PASTE ANY ERROR MESSAGES]

**Code**:
\`\`\`
[PASTE RELEVANT CODE HERE]
\`\`\`

Provide:
1. **Root Cause Analysis**: What's likely causing the issue
2. **Step-by-Step Fix**: How to resolve it
3. **Prevention Tips**: How to avoid this issue in the future
4. **Alternative Approaches**: Other ways to solve this problem`,
      category: 'Development',
      tags: ['debugging', 'programming', 'troubleshooting', 'coding'],
      createdBy: 'anonymous',
    },
    {
      title: 'Product Description Writer',
      description: 'Create compelling product descriptions that drive conversions for e-commerce.',
      content: `Create a product description for:

**Product Name**: [NAME]
**Key Features**: [LIST MAIN FEATURES]
**Target Audience**: [WHO BUYS THIS]
**Price Point**: [BUDGET / MID / PREMIUM]

Write:
- A catchy product title
- 3 bullet points highlighting key benefits (not features)
- A 2-3 sentence compelling description
- A call-to-action

Make it persuasive, clear, and conversion-focused. Use sensory words and emphasize benefits over features.`,
      category: 'Marketing',
      tags: ['product-description', 'ecommerce', 'copywriting', 'marketing'],
      createdBy: 'anonymous',
    },
    {
      title: 'Presentation Outline Creator',
      description: 'Generate structured presentation outlines for business or educational purposes.',
      content: `Create a presentation outline for:

**Topic**: [WHAT'S THE PRESENTATION ABOUT]
**Audience**: [WHO WILL BE WATCHING]
**Duration**: [HOW LONG - e.g., 15 min, 45 min]
**Purpose**: [Inform / Persuade / Train / Report]
**Number of Slides**: [APPROXIMATE COUNT]

Structure the presentation with:
- Attention-grabbing opening slide
- Key message (one sentence)
- 4-7 main points with supporting details
- Transition slides between sections
- Memorable closing slide with call-to-action

Include speaker notes cues for each slide.`,
      category: 'Business',
      tags: ['presentation', 'powerpoint', 'business', 'planning'],
      createdBy: 'anonymous',
    },
    {
      title: 'A/B Test Copy Generator',
      description: 'Generate variations of marketing copy for A/B testing to improve conversion rates.',
      content: `Generate A/B test variations for the following marketing copy:

**Current Copy**: [PASTE CURRENT HEADLINE/HOOK/CTA]
**Placement**: [Email subject / Landing page / Ad copy / CTA button]
**Goal**: [Click-through / Sign-up / Purchase / Engagement]

Create:
- **Version A (Control)**: The original
- **Version B**: [Suggest a specific angle - e.g., urgency, benefit-focused, question-based]
- **Version C**: [Different angle - e.g., social proof, fear of missing out, educational]

For each version, provide:
- The copy text
- The psychological trigger used
- Expected impact on conversion`,
      category: 'Marketing',
      tags: ['ab-testing', 'conversion', 'copywriting', 'marketing'],
      createdBy: 'anonymous',
    },
    {
      title: 'Landing Page Copy Writer',
      description: 'Create high-converting landing page copy with compelling headlines, benefits, and CTAs.',
      content: `Create landing page copy for:

**Product/Service**: [WHAT ARE YOU SELLING]
**Main Benefit**: [THE #1 VALUE PROPOSITION]
**Target Audience**: [WHO IS THIS FOR]
**Offer**: [FREE TRIAL / DISCOUNT / FREE CONSULTATION]

Include:
- Hero headline (under 10 words)
- Subheadline (1-2 sentences expanding on the headline)
- 3-4 benefit statements (benefit-led, not feature-led)
- Social proof placeholder section
- FAQ section (3 common objections + responses)
- Primary CTA button text
- Secondary CTA (softer commitment)

Make it persuasive, benefit-focused, and conversion-optimized.`,
      category: 'Marketing',
      tags: ['landing-page', 'copywriting', 'conversions', 'marketing'],
      createdBy: 'anonymous',
    },
    {
      title: 'README Generator',
      description: 'Generate comprehensive README files for GitHub projects with setup instructions and documentation.',
      content: `Generate a README for the following project:

**Project Name**: [NAME]
**Description**: [WHAT IT DOES]
**Tech Stack**: [LANGUAGES/FRAMEWORKS USED]
**Key Features**: [LIST MAIN FEATURES]
**Installation**: [BASIC SETUP STEPS]

Include these sections:
- Project title and badge row
- Clear project description
- Features list
- Screenshot or demo GIF placeholder
- Prerequisites
- Installation steps
- Usage examples with code snippets
- Configuration options
- Contributing guidelines
- License
- Contact/support info

Make it professional, detailed, and developer-friendly.`,
      category: 'Development',
      tags: ['readme', 'documentation', 'github', 'open-source'],
      createdBy: 'anonymous',
    },
    {
      title: 'Code Explainer',
      description: 'Explain complex code in simple terms with line-by-line breakdowns.',
      content: `You are a coding tutor. Explain the following code in simple terms:

**What the code should do**: [DESCRIBE EXPECTED BEHAVIOR]
**Your skill level**: [BEGINNER / INTERMEDIATE / ADVANCED]

**Code**:
\`\`\`
[PASTE CODE HERE]
\`\`\`

Provide:
1. **Simple Summary**: What this code does in 2-3 sentences
2. **Line-by-Line Breakdown**: Explain each significant line
3. **Key Concepts**: Important programming concepts used
4. **Analogy**: A real-world analogy to help understand
5. **Common Mistakes**: What beginners often get wrong with this

Use beginner-friendly language and avoid jargon without explanation.`,
      category: 'Development',
      tags: ['tutoring', 'explanation', 'programming', 'learning'],
      createdBy: 'anonymous',
    },
    {
      title: 'Job Description Writer',
      description: 'Create clear, inclusive job descriptions that attract the right candidates.',
      content: `Write a job description for:

**Job Title**: [POSITION]
**Department**: [TEAM]
**Location**: [ONSITE/REMOTE/HYBRID]
**Employment Type**: [FULL-TIME/PART-TIME/CONTRACT]
**Salary Range**: [OPTIONAL]

**Responsibilities**:
- [KEY TASK 1]
- [KEY TASK 2]
- [KEY TASK 3]

**Requirements**:
- [MUST-HAVE 1]
- [MUST-HAVE 2]

**Nice to Have**:
- [PREFERRED QUALIFICATIONS]

Include:
- Engaging intro paragraph (why this role matters)
- Clear, actionable bullet points
- Inclusive language
- About company section
- Benefits/perks
- Application instructions

Make it compelling but realistic. Avoid requirements that aren't truly necessary.`,
      category: 'Business',
      tags: ['hiring', 'job-description', 'hr', 'recruitment'],
      createdBy: 'anonymous',
    },
    {
      title: 'Learning Plan Creator',
      description: 'Create personalized learning paths for any skill with resources and milestones.',
      content: `Create a learning plan for:

**Skill to Learn**: [WHAT YOU WANT TO LEARN]
**Current Level**: [BEGINNER / SOME KNOWLEDGE / INTERMEDIATE]
**Time Available**: [HOURS PER WEEK]
**Goal**: [casual understanding / professional proficiency / mastery]
**Deadline**: [TARGET DATE]

Structure the plan with:
- Weekly milestones for 8-12 weeks
- Daily/weekly study activities
- Resource recommendations (free and paid)
- Practice projects of increasing difficulty
- Ways to measure progress
- How to stay motivated
- Communities or accountability partners to find

Make it realistic, structured, and actionable.`,
      category: 'Education',
      tags: ['learning', 'self-improvement', 'education', 'skill-building'],
      createdBy: 'anonymous',
    },
    {
      title: 'Video Script Writer',
      description: 'Write engaging video scripts for YouTube, TikTok, or marketing videos.',
      content: `Write a video script for:

**Topic**: [WHAT'S THE VIDEO ABOUT]
**Platform**: [YouTube / TikTok / Instagram Reels / Corporate]
**Duration**: [LENGTH]
**Style**: [Educational / Entertaining / Tutorial / Vlog / Promotional]
**Target Audience**: [WHO IS WATCHING]

Include:
- Hook (first 3-5 seconds to grab attention)
- Intro (who you are, what the video is about)
- Main content with timestamps
- B-roll suggestions [in brackets]
- Call-to-action at the end
- Suggested thumbnail description (for YouTube)

Format with:
- VISUAL: What viewers see
- AUDIO: What you hear
- TEXT: On-screen text overlays

Make it engaging, well-paced, and platform-appropriate.`,
      category: 'Content Creation',
      tags: ['video', 'youtube', 'scriptwriting', 'content-creation'],
      createdBy: 'anonymous',
    },
    {
      title: 'Mental Health Check-In',
      description: 'Guided self-reflection prompts for emotional well-being and personal growth.',
      content: `Take a moment for yourself. Answer these questions honestly - no one else will see this.

**How are you really feeling right now?** (Rate 1-10 and describe)

**What's been the highlight of your day/week?**

**What's been weighing on you lately?**

**One thing you're grateful for today:**

**One thing you could let go of that no longer serves you:**

**One small action you can take in the next 24 hours to feel better:**

**A kind message to yourself:**

Remember: It's okay to not be okay. Progress isn't linear. Taking time to check in with yourself is a sign of strength, not weakness.`,
      category: 'Wellness',
      tags: ['mental-health', 'self-care', 'reflection', 'wellness'],
      createdBy: 'anonymous',
    },
    {
      title: 'Grammar & Style Editor',
      description: 'Polish your writing with professional grammar, style, and clarity improvements.',
      content: `You are an expert editor. Improve the following text:

**Text Type**: [Email / Blog post / Academic / Business letter / Creative writing]
**Tone Goal**: [Formal / Casual / Persuasive / Friendly]
**Audience**: [WHO WILL READ THIS]

**Original Text**:
[PASTE YOUR TEXT HERE]

Provide:
1. **Corrected Version**: Grammar and spelling fixed
2. **Style Improvements**: Clearer phrasing, better word choices
3. **Tone Adjustments**: Whether it matches the desired tone
4. **Structural Changes**: Better organization if needed
5. **Explanation**: 2-3 key lessons from the corrections

Focus on clarity, flow, and matching the intended voice.`,
      category: 'Writing',
      tags: ['grammar', 'editing', 'proofreading', 'writing'],
      createdBy: 'anonymous',
    },
    {
      title: 'Story Plot Generator',
      description: 'Generate creative story plots, character arcs, and narrative structures.',
      content: `Generate a story concept based on:

**Genre**: [Fantasy / Sci-Fi / Romance / Thriller / Mystery / Horror / Literary Fiction]
**Tone**: [Dark / Light-hearted / Psychological / Action-packed / Emotional]
**Length**: [Short story / Novel]
**Optional Element**: [Include a specific theme, twist, or setting if desired]

Provide:
- **Logline**: One sentence hook
- **Setting**: Time and place
- **Main Character**: Protagonist with want vs. need
- **Inciting Incident**: What disrupts their world
- **Key Plot Points**: Beginning, middle, end
- **Central Conflict**: The main tension
- **Resolution**: How it ends
- **Optional Twist**: One surprising element

Make it original, engaging, and emotionally resonant.`,
      category: 'Creative Writing',
      tags: ['storytelling', 'creative-writing', 'plot', 'fiction'],
      createdBy: 'anonymous',
    },
    {
      title: 'News Article Summarizer',
      description: 'Summarize long articles into key takeaways without the fluff.',
      content: `Summarize the following article into key takeaways:

**Article**: [PASTE ARTICLE TEXT OR PROVIDE URL]

Provide:
- **TL;DR** (Too Long; Didn't Read): One sentence summary
- **Key Takeaways**: 3-5 bullet points of essential information
- **Main Arguments**: The central points the author makes
- **Context**: Why this matters now
- **Different Perspectives**: Other viewpoints on this topic
- **Read If**: Who would benefit most from the full article

Focus on facts, not opinions. Preserve the author's intent while being concise.`,
      category: 'Productivity',
      tags: ['summarization', 'reading', 'information', 'news'],
      createdBy: 'anonymous',
    },
    {
      title: 'Customer Support Response Generator',
      description: 'Write professional, empathetic responses to common customer service scenarios.',
      content: `Write a customer support response for:

**Customer Issue**: [DESCRIBE THE PROBLEM]
**Customer Tone**: [Angry / Frustrated / Confused / Neutral]
**Company Policy**: [RELEVANT POLICY OR GUIDELINE]

Write a response that:
- Acknowledges the customer's feelings
- Shows empathy and understanding
- Explains the situation clearly
- Provides a solution or next steps
- Sets realistic expectations
- Maintains brand voice

Include:
- Greeting (personalized if name provided)
- Apology if appropriate
- Explanation of the issue and solution
- Timeline if action is needed
- Invitation for further help

Make it human, not robotic. One-size-fits-all responses feel fake.`,
      category: 'Business',
      tags: ['customer-support', 'communication', 'service', 'responses'],
      createdBy: 'anonymous',
    },
    {
      title: 'Contract Clause Analyzer',
      description: 'Simplify complex legal clauses into plain language and identify potential concerns.',
      content: `Analyze the following contract clause:

**Clause Type**: [ NDA / Employment / Service Agreement / Lease / License]
**Your Role**: [Individual / Business Owner / Service Provider]

**Clause Text**:
[PASTE THE CLAUSE HERE]

Provide:
- **Plain English Summary**: What this actually says
- **Your Rights & Obligations**: What you're agreeing to
- **Red Flags**: Unusual or potentially harmful terms
- **Questions to Ask**: Things you should clarify before signing
- **Negotiation Points**: Terms that might be adjustable
- **Risk Level**: Low / Medium / High concern

Never provide legal advice, but help them understand what they're signing.`,
      category: 'Legal',
      tags: ['contracts', 'legal', 'analysis', 'clauses'],
      createdBy: 'anonymous',
    },
    {
      title: 'Event Invitation Writer',
      description: 'Create engaging event invitations for any occasion with all necessary details.',
      content: `Write an event invitation for:

**Event Type**: [Birthday / Corporate / Wedding / Baby Shower / Launch Party / Workshop]
**Host**: [WHO IS HOSTING]
**Date & Time**: [WHEN]
**Location/Virtual**: [WHERE OR LINK]
**Dress Code**: [IF APPLICABLE]

Include:
- Catchy event title
- Compelling intro (why attend?)
- Event details (what, when, where)
- RSVP instructions with deadline
- Gift registry or wishlist if appropriate
- Contact info for questions
- Any special instructions

Make it exciting and informative. Set the right tone for the event type.`,
      category: 'Events',
      tags: ['invitation', 'events', 'party', 'announcements'],
      createdBy: 'anonymous',
    },
  ];

  for (const prompt of prompts) {
    await prisma.prompt.create({
      data: prompt,
    });
  }

  console.log(`Created ${prompts.length} prompts`);
}
