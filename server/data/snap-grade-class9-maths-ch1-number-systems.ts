/**
 * NCERT Class 9 Maths Chapter 1 — Number Systems
 * Questions extracted to match the hosted NCERT PDF (iemh101.pdf).
 * Current CBSE school syllabus (Ganita Manjari not adopted yet).
 */
import type { RawChapter } from "./snap-grade-seed-helpers";
import { trueFalseReasonRubric } from "./snap-grade-seed-helpers";

export const NUMBER_SYSTEMS_CH1: RawChapter = {
  chapterNumber: 1,
  chapterName: "Number Systems",
  exercises: [
    {
      exercise: "1.1",
      questions: [
        {
          n: "1",
          marks: 2,
          text: "Is zero a rational number? Can you write it in the form p/q, where p and q are integers and q ≠ 0?",
          ref: "Yes. 0 = 0/1.",
        },
        {
          n: "2",
          marks: 3,
          text: "Find six rational numbers between 3 and 4.",
          ref: "Any six distinct rationals in (3, 4).",
        },
        {
          n: "3",
          marks: 3,
          text: "Find five rational numbers between 3/5 and 4/5.",
          ref: "e.g. 19/30, 20/30, 21/30, 22/30, 23/30.",
        },
        {
          n: "4",
          marks: 3,
          text: "State whether the following statements are true or false. Give reasons for your answers.\n(i) Every natural number is a whole number.\n(ii) Every integer is a whole number.\n(iii) Every rational number is a whole number.",
          ref: "(i) True — ℕ ⊂ 𝕎. (ii) False — e.g. −1. (iii) False — e.g. 1/2.",
          rubric: trueFalseReasonRubric([
            {
              id: "s1",
              label: "(i) T/F + reason",
              criteria:
                "States True AND gives a valid reason that every natural number is a whole number (naturals ⊂ wholes).",
            },
            {
              id: "s2",
              label: "(ii) T/F + reason",
              criteria:
                "States False AND gives a concrete counterexample (e.g. −1 or any negative integer).",
            },
            {
              id: "s3",
              label: "(iii) T/F + reason",
              criteria:
                "States False AND gives a concrete counterexample (e.g. 1/2 or any non-integer rational).",
            },
          ]),
        },
      ],
    },
    {
      exercise: "1.2",
      questions: [
        {
          n: "1",
          marks: 3,
          text: "State whether the following statements are true or false. Justify your answers.\n(i) Every irrational number is a real number.\n(ii) Every point on the number line is of the form √m, where m is a natural number.\n(iii) Every real number is an irrational number.",
          ref: "(i) True (ii) False (iii) False.",
          rubric: trueFalseReasonRubric([
            {
              id: "s1",
              label: "(i) T/F + justification",
              criteria:
                "States True AND justifies that irrationals are a subset of reals.",
            },
            {
              id: "s2",
              label: "(ii) T/F + justification",
              criteria:
                "States False AND gives a valid counterexample or reason.",
            },
            {
              id: "s3",
              label: "(iii) T/F + justification",
              criteria:
                "States False AND gives a counterexample of a real that is rational (e.g. 2).",
            },
          ]),
        },
        {
          n: "2",
          marks: 2,
          text: "Are the square roots of all positive integers irrational? If not, give an example of the square root of a number that is a rational number.",
          ref: "No. √4 = 2.",
        },
        {
          n: "3",
          marks: 3,
          text: "Show how √5 can be represented on the number line.",
        },
        {
          n: "4",
          marks: 3,
          text: "Classroom activity (Constructing the square root spiral): Take a large sheet of paper and construct the ‘square root spiral’ as described in the NCERT textbook (unit segments perpendicular successively). Depict √2, √3, √4, … on the spiral.",
        },
      ],
    },
    {
      exercise: "1.3",
      questions: [
        {
          n: "1",
          marks: 6,
          text: "Write the following in decimal form and say what kind of decimal expansion each has:\n(i) 36/100\n(ii) 1/11\n(iii) 4⅛\n(iv) 3/13\n(v) 2/11\n(vi) 329/400",
        },
        {
          n: "2",
          marks: 3,
          text: "You know that 1/7 = 0.142857̅. Can you predict the decimal expansions of 2/7, 3/7, 4/7, 5/7 and 6/7 without actually doing the long division? If so, how?",
        },
        {
          n: "3",
          marks: 3,
          text: "Express the following in the form p/q, where p and q are integers and q ≠ 0.\n(i) 0.6̅\n(ii) 0.47̅\n(iii) 0.001̅",
        },
        {
          n: "4",
          marks: 2,
          text: "Express 0.99999… in the form p/q. Are you surprised by your answer? With your teacher and classmates discuss why the answer makes sense.",
          ref: "0.999… = 1.",
        },
        {
          n: "5",
          marks: 3,
          text: "What can the maximum number of digits be in the repeating block of digits in the decimal expansion of 1/17? Perform the division to check your answer.",
        },
        {
          n: "6",
          marks: 2,
          text: "Look at several examples of rational numbers in the form p/q (q ≠ 0), where p and q are integers with no common factors other than 1 and having terminating decimal representations. Can you guess what property q must satisfy?",
        },
        {
          n: "7",
          marks: 2,
          text: "Write three numbers whose decimal expansions are non-terminating non-recurring.",
        },
        {
          n: "8",
          marks: 3,
          text: "Find three different irrational numbers between the rational numbers 5/7 and 9/11.",
        },
        {
          n: "9",
          marks: 2,
          text: "Classify the following numbers as rational or irrational:\n(i) √23\n(ii) √225\n(iii) 0.3796\n(iv) 7.478478…\n(v) 1.101001000100001…",
        },
      ],
    },
    {
      exercise: "1.4",
      questions: [
        {
          n: "1",
          marks: 3,
          text: "Visualise 3.765 on the number line, using successive magnification.",
        },
        {
          n: "2",
          marks: 3,
          text: "Visualise 4.26̅ on the number line, up to 4 decimal places.",
        },
      ],
    },
    {
      exercise: "1.5",
      questions: [
        {
          n: "1",
          marks: 5,
          text: "Classify the following numbers as rational or irrational:\n(i) 2 − √5\n(ii) (3 + √23) − √23\n(iii) 2√7 / (7√7)\n(iv) 1/√2\n(v) 2π",
          ref: "(i) irrational (ii) rational (=3) (iii) rational (=2/7) (iv) irrational (v) irrational.",
        },
        {
          n: "2",
          marks: 4,
          text: "Simplify each of the following expressions:\n(i) (3 + √3)(2 + √2)\n(ii) (3 + √3)(3 − √3)\n(iii) (√5 + √2)²\n(iv) (√5 − √2)(√5 + √2)",
        },
        {
          n: "3",
          marks: 2,
          text: "Recall, π is defined as the ratio of the circumference (say c) of a circle to its diameter (say d). That is, π = c/d. This seems to contradict the fact that π is irrational. How will you resolve this contradiction?",
        },
        {
          n: "4",
          marks: 3,
          text: "Represent √9.3 on the number line.",
        },
        {
          n: "5",
          marks: 4,
          text: "Rationalise the denominators of the following:\n(i) 1/√7\n(ii) 1/(√7 − √6)\n(iii) 1/(√5 + √2)\n(iv) 1/(√7 − 2)",
        },
      ],
    },
    {
      exercise: "1.6",
      questions: [
        {
          n: "1",
          marks: 3,
          text: "Find:\n(i) 64^(1/2)\n(ii) 32^(1/5)\n(iii) 125^(1/3)",
          ref: "(i) 8 (ii) 2 (iii) 5.",
        },
        {
          n: "2",
          marks: 4,
          text: "Find:\n(i) 9^(3/2)\n(ii) 32^(2/5)\n(iii) 16^(3/4)\n(iv) 125^(-1/3)",
        },
        {
          n: "3",
          marks: 4,
          text: "Simplify:\n(i) 2^(2/3) · 2^(1/5)\n(ii) (1/3^3)^(1/4)\n(iii) 11^(1/2) / 11^(1/4)\n(iv) 7^(1/2) · 8^(1/2)",
        },
      ],
    },
  ],
};
