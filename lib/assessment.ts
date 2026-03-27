// Shared assessment question definitions — imported by both the API route and the component
// so the question text and evaluation focus are always in sync.

export interface AssessmentQuestion {
  id: string;
  question: string;
  evaluationFocus: string;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: "You've just read three conflicting email chains from Engineering, Sales, and Design. Each team believes their Q3 priority should take the top slot. Walk me through your first 2 hours as the incoming PM.",
    evaluationFocus: 'Does the answer prioritise understanding constraints over immediately forming an opinion? Do they do 1:1s before group sessions? Do they seek data before deciding?',
  },
  {
    id: 'q2',
    question: "Marcus from Engineering tells you 'six weeks minimum' for a critical feature the CEO considers non-negotiable. What do you say to him — right now, in this conversation?",
    evaluationFocus: 'Do they push back on the estimate constructively? Do they explore assumptions (what is driving that number)? Do they ask about third-party alternatives? Do they avoid simply accepting or escalating?',
  },
  {
    id: 'q3',
    question: "Your CEO wants one recommendation for Monday's board meeting, not a list of options. You see three viable paths, each with real trade-offs she needs to understand. How do you approach this?",
    evaluationFocus: 'Do they understand how to give one recommendation while making the trade-offs visible? Do they avoid presenting options dressed up as a recommendation? Do they show they know when to ask a clarifying question vs when to decide?',
  },
  {
    id: 'q4',
    question: "Priya from Design sends a brief message: 'I have some data that might be relevant to the Q3 plan.' You have 4 hours before your EOD milestone. What do you do?",
    evaluationFocus: 'Do they immediately follow up and treat this as potentially important? Do they understand that understated messages from individual contributors often carry the most strategic weight? Do they make time despite the deadline?',
  },
];
