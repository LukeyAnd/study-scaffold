/* A small second class and a replaceable bank example. */
(function () {
  const bank = {
    id: 'example-math-v1', // Stable id; change it when the curriculum changes substantially.
    title: 'Everyday math',
    subject: 'Mathematics',
    reviewStatus: 'Starter bank · replace with your material',
    topics: [{ id: 'arithmetic', name: 'Arithmetic' }, { id: 'percentages', name: 'Percentages' }],
    glossary: { Percentage: 'A quantity expressed as a fraction of one hundred.' },
    questions: [
      {
        id: 'addition', topic: 'arithmetic', angle: 'Addition', skill: 'Calculation', isMath: true,
        generate() {
          const a = 10 + Math.floor(Math.random() * 30), b = 10 + Math.floor(Math.random() * 30);
          return { prompt: `What is ${a} + ${b}?`, correct: String(a+b),
            distractors: [String(a+b+1), String(a+b-1), String(a+b+10)],
            concept: 'Add the quantities together.', math: `${a} + ${b} = ${a+b}`,
            whyWrong: ['One too high.', 'One too low.', 'Ten too high.'] };
        }
      },
      {
        id: 'ten-percent', topic: 'percentages', angle: 'A tenth of a quantity', skill: 'Calculation', isMath: true,
        generate() {
          const n = 100 + Math.floor(Math.random()*90)*10;
          return { prompt: `What is 10% of ${n}?`, correct: String(n/10),
            distractors: [String(n/100), String(n/2), String(n)], concept: 'Ten percent is one tenth.',
            math: `${n} × 0.10 = ${n/10}`, whyWrong: ['This is 1%.', 'This is 50%.', 'This is 100%.'] };
        }
      }
    ]
  };
  globalThis.STUDY_BANK ||= bank;
  (globalThis.STUDY_COURSES ||= []).push(bank);
})();
