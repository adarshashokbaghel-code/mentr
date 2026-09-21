/** Auto-extracted NCERT Class 11 Maths from hosted chapter PDFs. */
import type { RawChapter } from "./snap-grade-seed-helpers";

export const CLASS11_MATHS_EXTRACTED: RawChapter[] = [
  {
    classLevel: 11,
    chapterNumber: 1,
    chapterName: "Sets",
    exercises: [
      {
        exercise: "1.1",
        questions: [
          {
            n: "1",
            marks: 5,
            text: `Which of the following are sets ? Justify your answer.
(i) The collection of all the months of a year beginning with the letter J.
(ii) The collection of ten most talented writers of India.
(iii) A team of eleven best-cricket batsmen of the world.
(iv) The collection of all boys in your class.
(v) The collection of all natural numbers less than 100.
(vi) A collection of novels written by the writer Munshi Prem Chand.
(vii) The collection of all even integers.

SETS 5
(viii) The collection of questions in this Chapter.
(ix) A collection of most dangerous animals of the world.`,
          },
          {
            n: "2",
            marks: 5,
            text: `Let A = {1, 2, 3, 4, 5, 6}. Insert the appropriate symbol ∈ or ∉ in the blank
spaces:
(i) 5. . .A (ii) 8 . . . A (iii) 0. . .A
(iv) 4. . . A (v) 2. . .A (vi) 10. . .A`,
          },
          {
            n: "3",
            marks: 5,
            text: `Write the following sets in roster form:
(i) A = {x : x is an integer and –3 ≤ x < 7}
(ii) B = {x : x is a natural number less than 6}
(iii) C = {x : x is a two-digit natural number such that the sum of its digits is 8}
(iv) D = {x : x is a prime number which is divisor of 60}
(v) E = The set of all letters in the word TRIGONOMETRY
(vi) F = The set of all letters in the word BETTER`,
          },
          {
            n: "4",
            marks: 5,
            text: `Write the following sets in the set-builder form :
(i) (3, 6, 9, 12} (ii) {2,4,8,16,32} (iii) {5, 25, 125, 625}
(iv) {2, 4, 6, . . .} (v) {1,4,9, . . .,100}`,
          },
          {
            n: "5",
            marks: 5,
            text: `List all the elements of the following sets :
(i) A = {x : x is an odd natural number}
(ii) B = {x : x is an integer, 1
2
– < x < 9
2 }
(iii) C = {x : x is an integer, x2 ≤ 4}
(iv) D = {x : x is a letter in the word “LOYAL”}
(v) E = {x : x is a month of a year not having 31 days}
(vi) F = {x : x is a consonant in the English alphabet which precedes k }.`,
          },
          {
            n: "6",
            marks: 3,
            text: `Match each of the set on the left in the roster form with the same set on the right
described in set-builder form:
(i) {1, 2, 3, 6} (a) {x : x is a prime number and a divisor of 6}
(ii) {2, 3} (b) {x : x is an odd natural number less than 10}
(iii) {M,A,T,H,E,I,C,S} (c) {x : x is natural number and divisor of 6}
(iv) {1, 3, 5, 7, 9} (d) {x : x is a letter of the word MATHEMATICS}.`,
          },
        ],
      },
      {
        exercise: "1.2",
        questions: [
          {
            n: "1",
            marks: 3,
            text: `Which of the following are examples of the null set
(i) Set of odd natural numbers divisible by 2
(ii) Set of even prime numbers
(iii) { x : x is a natural numbers, x < 5 and x > 7 }
(iv) { y : y is a point common to any two parallel lines}`,
          },
          {
            n: "2",
            marks: 5,
            text: `Which of the following sets are finite or infinite
(i) The set of months of a year
(ii) {1, 2, 3, . . .}
(iii) {1, 2, 3, . . .99, 100}
(iv) The set of positive integers greater than 100
(v) The set of prime numbers less than 99`,
          },
          {
            n: "3",
            marks: 5,
            text: `State whether each of the following set is finite or infinite:
(i) The set of lines which are parallel to the x-axis
(ii) The set of letters in the English alphabet
(iii) The set of numbers which are multiple of 5

SETS 9
(iv) The set of animals living on the earth
(v) The set of circles passing through the origin (0,0)`,
          },
          {
            n: "4",
            marks: 3,
            text: `In the following, state whether A = B or not:
(i) A = { a, b, c, d } B = { d, c, b, a }
(ii) A = { 4, 8, 12, 16 } B = { 8, 4, 16, 18}
(iii) A = {2, 4, 6, 8, 10} B = { x : x is positive even integer and x ≤ 10}
(iv) A = { x : x is a multiple of 10}, B = { 10, 15, 20, 25, 30, . . . }`,
          },
          {
            n: "5",
            marks: 2,
            text: `Are the following pair of sets equal ? Give reasons.
(i) A = {2, 3}, B = {x : x is solution of x2 + 5x + 6 = 0}
(ii) A = { x : x is a letter in the word FOLLOW}
B = { y : y is a letter in the word WOLF}`,
          },
          {
            n: "6",
            marks: 3,
            text: `From the sets given below, select equal sets :
A = { 2, 4, 8, 12}, B = { 1, 2, 3, 4}, C = { 4, 8, 12, 14}, D = { 3, 1, 4, 2}
E = {–1, 1}, F = { 0, a}, G = {1, –1}, H = { 0, 1}
1.6 Subsets
Consider the sets : X = set of all students in your school, Y = set of all students in your
class.
We note that every element of Y is also an element of X; we say that Y is a subset
of X. The fact that Y is subset of X is expressed in symbols as Y ⊂ X. The symbol ⊂
stands for ‘is a subset of’ or ‘is contained in’.
Definition 4 A set A is said to be a subset of a set B if every element of A is also an
element of B.
In other words, A ⊂ B if whenever a ∈ A, then a ∈ B. It is often convenient to
use the symbol “⇒” which means implies. Using this symbol, we can write the definiton
of subset as follows:
A ⊂ B if a ∈ A ⇒ a ∈ B
We read the above statement as “A is a subset of B if a is an element of A
implies that a is also an element of B”. If A is not a subset of B, we write A ⊄ B.
We may note that for A to be a subset of B, all that is needed is that every
element of A is in B. It is possible that every element of B may or may not be in A. If
it so happens that every element of B is also in A, then we shall also have B ⊂ A. In this
case, A and B are the same sets so that we have A ⊂ B and B ⊂ A ⇔ A = B, where
“⇔” is a symbol for two way implications, and is usually read as if and only if (briefly
written as “iff”).
It follows from the above definition that every set A is a subset of itself, i.e.,
A ⊂ A. Since the empty set φ has no elements, we agree to say that φ is a subset of
every set. We now consider some examples :

10 MATHEMATICS
(i) The set Q of rational numbers is a subset of the set R of real numbes, and
we write Q ⊂ R.
(ii) If A is the set of all divisors of 56 and B the set of all prime divisors of 56,
then B is a subset of A and we write B ⊂ A.
(iii) Let A = {1, 3, 5} and B = {x : x is an odd natural number less than 6}. Then
A ⊂ B and B ⊂ A and hence A = B.
(iv) Let A = { a, e, i, o, u} and B = { a, b, c, d}. Then A is not a subset of B,
also B is not a subset of A.
Let A and B be two sets. If A ⊂ B and A ≠ B , then A is called a proper subset
of B and B is called supe…`,
          },
        ],
      },
      {
        exercise: "1.3",
        questions: [
          {
            n: "1",
            marks: 5,
            text: `Make correct statements by filling in the symbols ⊂ or ⊄ in the blank spaces :
(i) { 2, 3, 4 } . . . { 1, 2, 3, 4,5 } (ii) { a, b, c } . . . { b, c, d }
(iii) {x : x is a student of Class XI of your school}. . .{x : x student of your school}
(iv) {x : x is a circle in the plane} . . .{x : x is a circle in the same plane with
radius 1 unit}
(v) {x : x is a triangle in a plane} . . . {x : x is a rectangle in the plane}
(vi) {x : x is an equilateral triangle in a plane} . . . {x : x is a triangle in the same plane}
(vii) {x : x is an even natural number} . . . {x : x is an integer}

SETS 13
Fig 1.2`,
          },
          {
            n: "2",
            marks: 5,
            text: `Examine whether the following statements are true or false:
(i) { a, b } ⊄ { b, c, a }
(ii) { a, e } ⊂ { x : x is a vowel in the English alphabet}
(iii) { 1, 2, 3 } ⊂ { 1, 3, 5 }
(iv) { a } ⊂ { a, b, c }
(v) { a } ∈ { a, b, c }
(vi) { x : x is an even natural number less than 6} ⊂ { x : x is a natural number
which divides 36}`,
          },
          {
            n: "3",
            marks: 5,
            text: `Let A = { 1, 2, { 3, 4 }, 5 }. Which of the following statements are incorrect and why?
(i) {3, 4} ⊂ A (ii) {3, 4} ∈ A (iii) {{3, 4}} ⊂ A
(iv) 1 ∈ A (v) 1 ⊂ A (vi) {1, 2, 5} ⊂ A
(vii) {1, 2, 5} ∈ A (viii) {1, 2, 3} ⊂ A (ix) φ ∈ A
(x) φ ⊂ A (xi) {φ} ⊂ A`,
          },
          {
            n: "4",
            marks: 3,
            text: `Write down all the subsets of the following sets
(i) {a} (ii) {a, b} (iii) {1, 2, 3} (iv) φ`,
          },
          {
            n: "5",
            marks: 2,
            text: `How many elements has P(A), if A = φ?`,
          },
          {
            n: "6",
            marks: 3,
            text: `Write the following as intervals :
(i) {x : x ∈ R, – 4 < x ≤ 6} (ii) {x : x ∈ R, – 12 < x < –10}
(iii) {x : x ∈ R, 0 ≤ x < 7} (iv) {x : x ∈ R, 3 ≤ x ≤ 4}`,
          },
          {
            n: "7",
            marks: 3,
            text: `Write the following intervals in set-builder form :
(i) (– 3, 0) (ii) [6 , 12] (iii) (6, 12] (iv) [–23, 5)`,
          },
          {
            n: "8",
            marks: 2,
            text: `What universal set(s) would you propose for each of the following :
(i) The set of right triangles. (ii) The set of isosceles triangles.`,
          },
          {
            n: "9",
            marks: 3,
            text: `Given the sets A = {1, 3, 5}, B = {2, 4, 6} and C = {0, 2, 4, 6, 8}, which of the
following may be considered as universal set (s) for all the three sets A, B and C
(i) {0, 1, 2, 3, 4, 5, 6}
(ii) φ
(iii) {0,1,2,3,4,5,6,7,8,9,10}
(iv) {1,2,3,4,5,6,7,8}`,
          },
        ],
      },
      {
        exercise: "1.4",
        questions: [
          {
            n: "1",
            marks: 5,
            text: `Find the union of each of the following pairs of sets :
(i) X = {1, 3, 5} Y = {1, 2, 3}
(ii) A = [ a, e, i, o, u} B = {a, b, c}
(iii) A = {x : x is a natural number and multiple of 3}
B = {x : x is a natural number less than 6}
(iv) A = {x : x is a natural number and 1 < x ≤ 6 }
B = {x : x is a natural number and 6 < x < 10 }
(v) A = {1, 2, 3}, B = φ`,
          },
          {
            n: "2",
            marks: 2,
            text: `Let A = { a, b }, B = {a, b, c}. Is A ⊂ B ? What is A ∪ B ?`,
          },
          {
            n: "3",
            marks: 2,
            text: `If A and B are two sets such that A ⊂ B, then what is A ∪ B ?`,
          },
          {
            n: "4",
            marks: 5,
            text: `If A = {1, 2, 3, 4}, B = {3, 4, 5, 6}, C = {5, 6, 7, 8 }and D = { 7, 8, 9, 10 }; find

18 MATHEMATICS
(i) A ∪ B (ii) A ∪ C (iii) B ∪ C (iv) B ∪ D
(v) A ∪ B ∪ C (vi) A ∪ B ∪ D (vii) B ∪ C ∪ D`,
          },
          {
            n: "5",
            marks: 2,
            text: `Find the intersection of each pair of sets of question 1 above.`,
          },
          {
            n: "6",
            marks: 5,
            text: `If A = { 3, 5, 7, 9, 11 }, B = {7, 9, 11, 13}, C = {11, 13, 15}and D = {15, 17}; find
(i) A ∩ B (ii) B ∩ C (iii) A ∩ C ∩ D
(iv) A ∩ C (v) B ∩ D (vi) A ∩ (B ∪ C)
(vii) A ∩ D (viii) A ∩ (B ∪ D) (ix) ( A ∩ B ) ∩ ( B ∪ C )
(x) ( A ∪ D) ∩ ( B ∪ C)`,
          },
          {
            n: "7",
            marks: 5,
            text: `If A = {x : x is a natural number }, B = {x : x is an even natural number}
C = {x : x is an odd natural number}andD = {x : x is a prime number }, find
(i) A ∩ B (ii) A ∩ C (iii) A ∩ D
(iv) B ∩ C (v) B ∩ D (vi) C ∩ D`,
          },
          {
            n: "8",
            marks: 3,
            text: `Which of the following pairs of sets are disjoint
(i) {1, 2, 3, 4} and {x : x is a natural number and 4 ≤ x ≤ 6 }
(ii) { a, e, i, o, u } and { c, d, e, f }
(iii) {x : x is an even integer } and {x : x is an odd integer}`,
          },
          {
            n: "9",
            marks: 5,
            text: `If A = {3, 6, 9, 12, 15, 18, 21}, B = { 4, 8, 12, 16, 20 },
C = { 2, 4, 6, 8, 10, 12, 14, 16 }, D = {5, 10, 15, 20 }; find
(i) A – B (ii) A – C (iii) A – D (iv) B – A
(v) C – A (vi) D – A (vii) B – C (viii) B – D
(ix) C – B (x) D – B (xi) C – D (xii) D – C`,
          },
          {
            n: "10",
            marks: 3,
            text: `If X= { a, b, c, d } and Y = { f, b, d, g}, find
(i) X – Y (ii) Y – X (iii) X ∩ Y`,
          },
          {
            n: "11",
            marks: 2,
            text: `If R is the set of real numbers and Q is the set of rational numbers, then what is
R – Q?`,
          },
          {
            n: "12",
            marks: 3,
            text: `State whether each of the following statement is true or false. Justify your answer.
(i) { 2, 3, 4, 5 } and { 3, 6} are disjoint sets.
(ii) { a, e, i, o, u } and { a, b, c, d }are disjoint sets.
(iii) { 2, 6, 10, 14 } and { 3, 7, 11, 15} are disjoint sets.
(iv) { 2, 6, 10 } and { 3, 7, 11} are disjoint sets.`,
          },
        ],
      },
      {
        exercise: "1.5",
        questions: [
          {
            n: "1",
            marks: 5,
            text: `Let U = { 1, 2, 3, 4, 5, 6, 7, 8, 9 }, A = { 1, 2, 3, 4}, B = { 2, 4, 6, 8 } and
C = { 3, 4, 5, 6 }. Find (i) A′ (ii) B′ (iii) (A ∪ C)′ (iv) (A ∪ B)′ (v) (A′)′
(vi) (B – C)′`,
          },
          {
            n: "2",
            marks: 3,
            text: `If U = { a, b, c, d, e, f, g, h}, find the complements of the following sets :
(i) A = {a, b, c} (ii) B = {d, e, f, g}
(iii) C = {a, c, e, g} (iv) D = { f, g, h, a}`,
          },
          {
            n: "3",
            marks: 5,
            text: `Taking the set of natural numbers as the universal set, write down the complements
of the following sets:
(i) {x : x is an even natural number} (ii) { x : x is an odd natural number }
(iii) {x : x is a positive multiple of 3} (iv) { x : x is a prime number }
(v) {x : x is a natural number divisible by 3 and 5}
(vi) { x : x is a perfect square } (vii) { x : x is a perfect cube}
(viii) { x : x + 5 = 8 } (ix) { x : 2x + 5 = 9}
(x) { x : x ≥ 7 } (xi) { x : x ∈ N and 2x + 1 > 10 }`,
          },
          {
            n: "4",
            marks: 2,
            text: `If U = {1, 2, 3, 4, 5, 6, 7, 8, 9 }, A = {2, 4, 6, 8} and B = { 2, 3, 5, 7}. Verify that
(i) (A ∪ B)′ = A′ ∩ B′ (ii) (A ∩ B)′ = A′ ∪ B′`,
          },
          {
            n: "5",
            marks: 3,
            text: `Draw appropriate Venn diagram for each of the following :
(i) (A ∪ B)′, (ii) A′ ∩ B′, (iii) (A ∩ B)′, (iv) A′ ∪ B′`,
          },
          {
            n: "6",
            marks: 2,
            text: `Let U be the set of all triangles in a plane. If A is the set of all triangles with at
least one angle different from 60°, what is A′?
Fig 1.10

SETS 21`,
          },
          {
            n: "7",
            marks: 3,
            text: `Fill in the blanks to make each of the following a true statement :
(i) A ∪ A′ = . . . (ii) φ′ ∩ A = . . .
(iii) A ∩ A′ = . . . (iv) U′ ∩ A = . . .`,
          },
        ],
      },
      {
        exercise: "1.6",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `If X and Y are two sets such that n ( X ) = 17, n ( Y ) = 23 and n ( X ∪ Y ) = 38,
find n ( X ∩ Y ).`,
          },
          {
            n: "2",
            marks: 2,
            text: `If X and Y are two sets such that X ∪ Y has 18 elements, X has 8 elements and
Y has 15 elements ; how many elements does X ∩ Y have?`,
          },
          {
            n: "3",
            marks: 2,
            text: `In a group of 400 people, 250 can speak Hindi and 200 can speak English. How
many people can speak both Hindi and English?`,
          },
          {
            n: "4",
            marks: 2,
            text: `If S and T are two sets such that S has 21 elements, T has 32 elements, and S ∩ T
has 11 elements, how many elements does S ∪ T have?`,
          },
          {
            n: "5",
            marks: 2,
            text: `If X and Y are two sets such that X has 40 elements, X ∪ Y has 60 elements and
X ∩ Y has 10 elements, how many elements does Y have?`,
          },
          {
            n: "6",
            marks: 2,
            text: `In a group of 70 people, 37 like coffee, 52 like tea and each person likes at least
one of the two drinks. How many people like both coffee and tea?`,
          },
          {
            n: "7",
            marks: 2,
            text: `In a group of 65 people, 40 like cricket, 10 like both cricket and tennis. How many
like tennis only and not cricket? How many like tennis?`,
          },
          {
            n: "8",
            marks: 3,
            text: `In a committee, 50 people speak French, 20 speak Spanish and 10 speak both
Spanish and French. How many speak at least one of these two languages?
Miscellaneous Examples
Example 28 Show that the set of letters needed to spell “ CATARACT ” and the
set of letters needed to spell “ TRACT” are equal.
Solution Let X be the set of letters in “CATARACT”. Then
X = { C, A, T, R }
Let Y be the set of letters in “ TRACT”. Then
Y = { T, R, A, C, T } = { T, R, A, C }
Since every element in X is in Y and every element in Y is in X. It follows that X = Y.
Example 29 List all the subsets of the set { –1, 0, 1 }.
Solution Let A = { –1, 0, 1 }. The subset of A having no element is the empty
set φ. The subsets of A having one element are { –1 }, { 0 }, { 1 }. The subsets of
A having two elements are {–1, 0}, {–1, 1} ,{0, 1}. The subset of A having three
elements of A is A itself. So, all the subsets of A are φ, {–1}, {0}, {1}, {–1, 0}, {–1, 1},
{0, 1} and {–1, 0, 1}.

SETS 25
Example 30 Show that A ∪ B = A ∩ B implies A = B
Solution Let a ∈ A. Then a ∈ A ∪ B. Since A ∪ B = A ∩ B , a ∈ A ∩ B. So a ∈ B.
Therefore, A ⊂ B. Similarly, if b ∈ B, then b ∈ A ∪ B. Since
A ∪ B = A ∩ B, b ∈ A ∩ B. So, b ∈ A. Therefore, B ⊂ A. Thus, A = B
Example 31 For any sets A and B, show that
P ( A ∩ B ) = P ( A ) ∩ P ( B ).
Solution Let X ∈ P ( A ∩ B ). Then X ⊂ A ∩ B. So, X ⊂ A and X ⊂ B. Therefore,
X ∈ P ( A ) and X ∈ P ( B ) which implies X ∈ P ( A ) ∩ P ( B). This gives P ( A ∩ B )
⊂ P ( A ) ∩ P ( B ). Let Y ∈ P ( A ) ∩ P ( B ). Then Y ∈ P ( A) and Y ∈ P ( B ). So,
Y ⊂ A and Y ⊂ B. Therefore, Y ⊂ A ∩ B, which implies Y ∈ P ( A ∩ B ). This gives
P ( A ) ∩ P ( B ) ⊂ P ( A ∩ B)
Hence P ( A ∩ B ) = P ( A ) ∩ P ( B ).
Example 32 A market research group conducted a survey of 1000 consumers and
reported that 720 consumers like product A and 450 consumers like product B, what is
the least number that must have liked both products?
Solution Let U be the set of consumers questioned, S be the set of consumers who
liked the product A and T be the set of consumers who like the product B. Given that
n ( U ) = 1000, n ( S ) = 720, n ( T ) = 450
So n ( S ∪ T ) = n ( S ) + n ( T ) – n ( S ∩ T )
= 720 + 450 – n (S ∩ …`,
          },
          {
            n: "9",
            marks: 3,
            text: `Using properties of sets, show that
(i) A ∪ ( A ∩ B ) = A (ii) A ∩ ( A ∪ B ) = A.`,
          },
          {
            n: "10",
            marks: 3,
            text: `Show that A ∩ B = A ∩ C need not imply B = C.`,
          },
          {
            n: "11",
            marks: 3,
            text: `Let A and B be sets. If A ∩ X = B ∩ X = φ and A ∪ X = B ∪ X for some set
X, show that A = B.
(Hints A = A ∩ ( A ∪ X ) , B = B ∩ ( B ∪ X ) and use Distributive law )`,
          },
          {
            n: "12",
            marks: 2,
            text: `Find sets A, B and C such that A ∩ B, B ∩ C and A ∩ C are non-empty
sets and A ∩ B ∩ C = φ.`,
          },
          {
            n: "13",
            marks: 2,
            text: `In a survey of 600 students in a school, 150 students were found to be taking tea
and 225 taking coffee, 100 were taking both tea and coffee. Find how many
students were taking neither tea nor coffee?`,
          },
          {
            n: "14",
            marks: 2,
            text: `In a group of students, 100 students know Hindi, 50 know English and 25 know
both. Each of the students knows either Hindi or English. How many students
are there in the group?`,
          },
          {
            n: "15",
            marks: 2,
            text: `In a survey of 60 people, it was found that 25 people read newspaper H, 26 read
newspaper T, 26 read newspaper I, 9 read both H and I, 11 read both H and T,
8 read both T and I, 3 read all three newspapers. Find:
(i) the number of people who read at least one of the newspapers.
(ii) the number of people who read exactly one newspaper.`,
          },
          {
            n: "16",
            marks: 2,
            text: `In a survey it was found that 21 people liked product A, 26 liked product B and
29 liked product C. If 14 people liked products A and B, 12 people liked products
C and A, 14 people liked products B and C and 8 liked all the three products.
Find how many liked product C only.
Summary
This chapter deals with some basic definitions and operations involving sets. These
are summarised below:
®A set is a well-defined collection of objects.
®A set which does not contain any element is called empty set.
®A set which consists of a definite number of elements is called finite set,
otherwise, the set is called infinite set.
®Two sets A and B are said to be equal if they have exactly the same elements.
®A set A is said to be subset of a set B, if every element of A is also an element
of B. Intervals are subsets of R.
®A power set of a set A is collection of all subsets of A. It is denoted by P(A).

28 MATHEMATICS
®The union of two sets A and B is the set of all those elements which are either
in A or in B.
®The intersection of two sets A and B is the set of all elements which are
common. The difference of two sets A and B in this order is the set of elements
which belong to A but not to B.
®The complement of a subset A of universal set U is the set of all elements of U
which are not the elements of A.
®For any two sets A and B, (A ∪ B)′ = A′ ∩ B′ and ( A ∩ B )′ = A′ ∪ B′
®If A and B are finite sets such that A ∩ B = φ, then
n (A ∪ B) = n (A) + n (B).
If A ∩ B ≠ φ, then
n (A ∪ B) = n (A) + n (B) – n (A ∩ B)
Historical Note
The modern theory of sets is considered to have been originated largely by the
German mathematician Georg Cantor (1845-1918). His papers on set theory
appeared sometimes during 1874 to 1897. His study of set theory came when he
was studying trigonometric series of the form a1 sin x + a2 sin 2x + a3 sin 3x + ...
He published in a paper in 1874 that the set of real numbers could not be put into
one-to-one correspondence wih the integers. From 1879 onwards, he publishd
several papers showing various properties of abstract sets.
Cantor’s work was well received by another famous mathematician Richard
Dedekind (1831-1916). But Kronecker (1810-1893) castigated hi…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 2,
    chapterName: "Relations and Functions",
    exercises: [
      {
        exercise: "2.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `If 2 5 1
1
3 3 3 3
x , y – ,
   
+ =	   
    , find the values of x and y.`,
          },
          {
            n: "2",
            marks: 2,
            text: `If the set A has 3 elements and the set B = {3, 4, 5}, then find the number of
elements in (A×B).`,
          },
          {
            n: "3",
            marks: 2,
            text: `If G = {7, 8} and H = {5, 4, 2}, find G × H and H × G.`,
          },
          {
            n: "4",
            marks: 3,
            text: `State whether each of the following statements are true or false. If the statement
is false, rewrite the given statement correctly.
(i) If P = {m, n} and Q = { n, m}, then P × Q = {(m, n),(n, m)}.
(ii) If A and B are non-empty sets, then A × B is a non-empty set of ordered
pairs (x, y) such that x ∈ A and y ∈ B.
(iii) If A = {1, 2}, B = {3, 4}, then A × (B ∩ φ) = φ.`,
          },
          {
            n: "5",
            marks: 2,
            text: `If A = {–1, 1}, find A × A × A.`,
          },
          {
            n: "6",
            marks: 2,
            text: `If A × B = {(a, x),(a , y), (b, x), (b, y)}. Find A and B.`,
          },
          {
            n: "7",
            marks: 2,
            text: `Let A = {1, 2}, B = {1, 2, 3, 4}, C = {5, 6} and D = {5, 6, 7, 8}. Verify that
(i) A × (B ∩ C) = (A × B) ∩ (A × C). (ii) A × C is a subset of B × D.`,
          },
          {
            n: "8",
            marks: 2,
            text: `Let A = {1, 2} and B = {3, 4}. Write A × B. How many subsets will A × B have?
List them.`,
          },
          {
            n: "9",
            marks: 2,
            text: `Let A and B be two sets such that n(A) = 3 and n(B) = 2. If (x, 1), (y, 2), (z, 1)
are in A × B, find A and B, where x, y and z are distinct elements.

34 MATHEMATICS`,
          },
          {
            n: "10",
            marks: 5,
            text: `The Cartesian product A × A has 9 elements among which are found (–1, 0) and
(0,1). Find the set A and the remaining elements of A × A.
2.3 Relations
Consider the two sets P = {a, b, c} and Q = {Ali, Bhanu, Binoy, Chandra, Divya}.
The cartesian product of
P and Q has 15 ordered pairs which
can be listed as P × Q = {(a, Ali),
(a,Bhanu), (a, Binoy), ..., (c, Divya)}.
We can now obtain a subset of
P × Q by introducing a relation R
between the first element x and the
second element y of each ordered pair
(x, y) as
R= { (x,y): x is the first letter of the name y, x ∈ P, y ∈ Q}.
Then R = {(a, Ali), (b, Bhanu), (b, Binoy), (c, Chandra)}
A visual representation of this relation R (called an arrow diagram) is shown
in Fig 2.4.
Definition 2 A relation R from a non-empty set A to a non-empty set B is a subset of
the cartesian product A × B. The subset is derived by describing a relationship between
the first element and the second element of the ordered pairs in A × B. The second
element is called the image of the first element.
Definition 3 The set of all first elements of the ordered pairs in a relation R from a set
A to a set B is called the domain of the relation R.
Definition 4 The set of all second elements in a relation R from a set A to a set B is
called the range of the relation R. The whole set B is called the codomain of the
relation R. Note that range ⊂ codomain.
Remarks (i) A relation may be represented algebraically either by the Roster
method or by the Set-builder method.
(ii) An arrow diagram is a visual representation of a relation.
Example 7 Let A = {1, 2, 3, 4, 5, 6}. Define a relation R from A to A by
R = {(x, y) : y = x + 1 }
(i) Depict this relation using an arrow diagram.
(ii) Write down the domain, codomain and range of R.
Solution (i) By the definition of the relation,
R = {(1,2), (2,3), (3,4), (4,5), (5,6)}.
Fig 2.4

RELATIONS AND FUNCTIONS 35
The corresponding arrow diagram is
shown in Fig 2.5.
(ii) We can see that the
domain ={1, 2, 3, 4, 5,}
Similarly, the range = {2, 3, 4, 5, 6}
and the codomain = {1, 2, 3, 4, 5, 6}.
Example 8 The Fig 2.6 shows a relation
between the sets P and Q. Write this relation (i) in set-builder form, (ii) in roster for…`,
          },
        ],
      },
      {
        exercise: "2.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Let A = {1, 2, 3,...,14}. Define a relation R from A to A by
R = {(x, y) : 3x – y = 0, where x, y ∈ A}. Write down its domain, codomain and
range.
Fig 2.5
Fig 2.6

36 MATHEMATICS`,
          },
          {
            n: "2",
            marks: 2,
            text: `Define a relation R on the set N of natural numbers by R = {(x, y) : y = x + 5,
x is a natural number less than 4; x, y ∈N}. Depict this relationship using roster
form. Write down the domain and the range.`,
          },
          {
            n: "3",
            marks: 2,
            text: `A = {1, 2, 3, 5} and B = {4, 6, 9}. Define a relation R from A to B by
R = {(x, y): the difference between x and y is odd; x ∈ A, y ∈ B}. Write R in
roster form.`,
          },
          {
            n: "4",
            marks: 2,
            text: `The Fig2.7 shows a relationship
between the sets P and Q. Write this
relation
(i) in set-builder form (ii) roster form.
What is its domain and range?`,
          },
          {
            n: "5",
            marks: 3,
            text: `Let A = {1, 2, 3, 4, 6}. Let R be the
relation on A defined by
{(a, b): a , b ∈A, b is exactly divisible by a}.
(i) Write R in roster form
(ii) Find the domain of R
(iii) Find the range of R.`,
          },
          {
            n: "6",
            marks: 2,
            text: `Determine the domain and range of the relation R defined by
R = {(x, x + 5) : x ∈ {0, 1, 2, 3, 4, 5}}.`,
          },
          {
            n: "7",
            marks: 2,
            text: `Write the relation R = {(x, x3) : x is a prime number less than 10} in roster form.`,
          },
          {
            n: "8",
            marks: 2,
            text: `Let A = {x, y, z} and B = {1, 2}. Find the number of relations from A to B.`,
          },
          {
            n: "9",
            marks: 3,
            text: `Let R be the relation on Z defined by R = {(a,b): a, b ∈ Z, a – b is an integer}.
Find the domain and range of R.
2.4 Functions
In this Section, we study a special type of relation called function. It is one of the most
important concepts in mathematics. We can, visualise a function as a rule, which produces
new elements out of some given elements. There are many terms such as ‘map’ or
‘mapping’ used to denote a function.
Definition 5 A relation f from a set A to a set B is said to be a function if every
element of set A has one and only one image in set B.
In other words, a function f is a relation from a non-empty set A to a non-empty
set B such that the domain of f is A and no two distinct ordered pairs in f have the
same first element.
If f is a function from A to B and (a, b) ∈ f, then f (a) = b, where b is called the
image of a under f and a is called the preimage of b under f.
Fig 2.7

RELATIONS AND FUNCTIONS 37
The function f from A to B is denoted by f: A à B.
Looking at the previous examples, we can easily see that the relation in Example 7 is
not a function because the element 6 has no image.
Again, the relation in Example 8 is not a function because the elements in the
domain are connected to more than one images. Similarly, the relation in Example 9 is
also not a function. (Why?) In the examples given below, we will see many more
relations some of which are functions and others are not.
Example 10 Let N be the set of natural numbers and the relation R be defined on
N such that R = {(x, y) : y = 2x, x, y ∈ N}.
What is the domain, codomain and range of R? Is this relation a function?
Solution The domain of R is the set of natural numbers N. The codomain is also N.
The range is the set of even natural numbers.
Since every natural number n has one and only one image, this relation is a
function.
Example 11 Examine each of the following relations given below and state in each
case, giving reasons whether it is a function or not?
(i) R = {(2,1),(3,1), (4,2)}, (ii) R = {(2,2),(2,4),(3,3), (4,4)}
(iii) R = {(1,2),(2,3),(3,4), (4,5), (5,6), (6,7)}
Solution (i) Since 2, 3, 4 are the elements of domain of R having their unique images,
this relation R is a func…`,
          },
        ],
      },
      {
        exercise: "2.3",
        questions: [
          {
            n: "1",
            marks: 3,
            text: `Which of the following relations are functions? Give reasons. If it is a function,
determine its domain and range.
(i) {(2,1), (5,1), (8,1), (11,1), (14,1), (17,1)}
(ii) {(2,1), (4,2), (6,3), (8,4), (10,5), (12,6), (14,7)}
(iii) {(1,3), (1,5), (2,5)}.`,
          },
          {
            n: "2",
            marks: 3,
            text: `Find the domain and range of the following real functions:
(i) f(x) = – x (ii) f(x) = 2
9 x	− .`,
          },
          {
            n: "3",
            marks: 3,
            text: `A function f is defined by f(x) = 2x –5. Write down the values of
(i) f (0), (ii) f (7), (iii) f (–3).`,
          },
          {
            n: "4",
            marks: 3,
            text: `The function ‘t’ which maps temperature in degree Celsius into temperature in
degree Fahrenheit is defined by t(C) = 9C
5 + 32.
Find (i) t(0) (ii) t(28) (iii) t(–10) (iv) The value of C, when t(C) = 212.`,
          },
          {
            n: "5",
            marks: 5,
            text: `Find the range of each of the following functions.
(i) f (x) = 2 – 3x, x ∈ R, x > 0.
(ii) f (x) = x2 + 2, x is a real number.
(iii) f (x) = x, x is a real number.
Miscellaneous Examples
Example 18 Let R be the set of real numbers.
Define the real function
f: R→R by f(x) = x + 10
and sketch the graph of this function.
Solution Here f(0) = 10, f(1) = 11, f(2) = 12, ...,
f(10) = 20, etc., and
f(–1) = 9, f(–2) = 8, ..., f(–10) = 0 and so on.
Therefore, shape of the graph of the given
function assumes the form as shown in Fig 2.16.
Remark The function f defined by f(x) = mx + c ,
x ∈ R, is called linear function, where m and c are
constants. Above function is an example of a linear
function. Fig 2.16

RELATIONS AND FUNCTIONS 45
Example 19 Let R be a relation from Q to Q defined by R = {(a,b): a,b ∈ Q and
a – b ∈ Z}. Show that
(i) (a,a) ∈ R for all a ∈ Q
(ii) (a,b) ∈ R implies that (b, a) ∈ R
(iii) (a,b) ∈ R and (b,c) ∈ R implies that (a,c) ∈R
Solution (i) Since, a – a = 0 ∈ Z, if follows that (a, a) ∈ R.
(ii) (a,b) ∈ R implies that a – b ∈ Z. So, b – a ∈ Z. Therefore,
(b, a) ∈ R
(iii) (a, b) and (b, c) ∈ R implies that a – b ∈ Z. b – c ∈ Z. So,
a – c = (a – b) + (b – c) ∈ Z. Therefore, (a,c) ∈ R
Example 20 Let f = {(1,1), (2,3), (0, –1), (–1, –3)} be a linear function from Z into Z.
Find f(x).
Solution Since f is a linear function, f (x) = mx + c. Also, since (1, 1), (0, – 1) ∈ R,
f (1) = m + c = 1 and f (0) = c = –1. This gives m = 2 and f(x) = 2x – 1.
Example 21 Find the domain of the function
2
2
3 5
( ) 5 4
x x
f x x x
+ +
= − +
Solution Since x2
–5x + 4 = (x – 4) (x –1), the function f is defined for all real numbers
except at x = 4 and x = 1. Hence the domain of f is R – {1, 4}.
Example 22 The function f is defined by
f (x) =
1 0
1 0
1 0
x, x
, x
x , x
− <	
 =	
 + >	
Draw the graph of f (x).
Solution Here, f(x) = 1 – x, x < 0, this gives
f(– 4) = 1 – (– 4) = 5;
f(– 3) =1 – (– 3) = 4,
f(– 2) = 1 – (– 2) = 3
f(–1) = 1 – (–1) = 2; etc,
and f(1) = 2, f (2) = 3, f (3) = 4
f(4) = 5 and so on for f(x) = x + 1, x > 0.
Thus, the graph of f is as shown in Fig 2.17 Fig 2.17

46 MATHEMATICS
Miscellaneous Exercise on Chapter 2`,
          },
          {
            n: "6",
            marks: 2,
            text: `Let
2
2
, :
1
x
f x x
x
 	 	 
= ∈	  
+	 	 	 
R be a function from R into R. Determine the range
of f.`,
          },
          {
            n: "7",
            marks: 2,
            text: `Let f, g : R→R be defined, respectively by f(x) = x + 1, g(x) = 2x – 3. Find
f + g, f – g and f
g .`,
          },
          {
            n: "8",
            marks: 2,
            text: `Let f = {(1,1), (2,3), (0,–1), (–1, –3)} be a function from Z to Z defined by
f(x) = ax + b, for some integers a, b. Determine a, b.`,
          },
          {
            n: "9",
            marks: 3,
            text: `Let R be a relation from N to N defined by R = {(a, b) : a, b ∈N and a = b2
}. Are
the following true?
(i) (a,a) ∈ R, for all a ∈ N (ii) (a,b) ∈ R, implies (b,a) ∈ R
(iii) (a,b) ∈ R, (b,c) ∈ R implies (a,c) ∈ R.
Justify your answer in each case.`,
          },
          {
            n: "10",
            marks: 2,
            text: `Let A ={1,2,3,4}, B = {1,5,9,11,15,16} and f = {(1,5), (2,9), (3,1), (4,5), (2,11)}
Are the following true?
(i) f is a relation from A to B (ii) f is a function from A to B.
Justify your answer in each case.

RELATIONS AND FUNCTIONS 47`,
          },
          {
            n: "11",
            marks: 2,
            text: `Let f be the subset of Z × Z defined by f = {(ab, a + b) : a, b ∈ Z}. Is f a
function from Z to Z? Justify your answer.`,
          },
          {
            n: "12",
            marks: 5,
            text: `Let A = {9,10,11,12,13} and let f : A→N be defined by f (n) = the highest prime
factor of n. Find the range of f.
Summary
In this Chapter, we studied about relations and functions.The main features of
this Chapter are as follows:
® Ordered pair A pair of elements grouped together in a particular order.
® Cartesian product A × B of two sets A and B is given by
A × B = {(a, b): a ∈ A, b ∈ B}
In particular R × R = {(x, y): x, y ∈ R}
and R × R × R = (x, y, z): x, y, z ∈ R}
® If (a, b) = (x, y), then a = x and b = y.
® If n(A) = p and n(B) = q, then n(A × B) = pq.
® A × φ = φ
® In general, A × B ≠ B × A.
® Relation A relation R from a set A to a set B is a subset of the cartesian
product A × B obtained by describing a relationship between the first element
x and the second element y of the ordered pairs in A × B.
® The image of an element x under a relation R is given by y, where (x, y) ∈ R,
® The domain of R is the set of all first elements of the ordered pairs in a
relation R.
® The range of the relation R is the set of all second elements of the ordered
pairs in a relation R.
® Function A function f from a set A to a set B is a specific type of relation for
which every element x of set A has one and only one image y in set B.
We write f: A→B, where f(x) = y.
® A is the domain and B is the codomain of f.

48 MATHEMATICS
® The range of the function is the set of images.
® A real function has the set of real numbers or one of its subsets both as its
domain and as its range.
® Algebra of functions For functions f : X → R and g : X → R, we have
(f + g) (x) = f (x) + g(x), x ∈ X
(f – g) (x) = f (x) – g(x), x ∈ X
(f.g) (x) = f (x) .g (x), x ∈ X
(kf) (x) = k ( f (x) ), x ∈ X, where k is a real number.
( )
f x
g
 
 
  = ( )
( )
f x
g x , x ∈ X, g(x) ≠ 0
Historical Note
The word FUNCTION first appears in a Latin manuscript “Methodus
tangentium inversa, seu de fuctionibus” written by Gottfried Wilhelm Leibnitz
(1646-1716) in 1673; Leibnitz used the word in the non-analytical sense. He
considered a function in terms of “mathematical job” – the “employee” being
just a curve.
On July 5, 1698, Johan Bernoulli, in a letter to Leibnitz, for the first time
deliberately assign…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 3,
    chapterName: "Trigonometric Functions",
    exercises: [
      {
        exercise: "3.1",
        questions: [
          {
            n: "1",
            marks: 3,
            text: `Find the radian measures corresponding to the following degree measures:
(i) 25° (ii) – 47°30′ (iii) 240° (iv) 520°

TRIGONOMETRIC FUNCTIONS 55`,
          },
          {
            n: "2",
            marks: 3,
            text: `Find the degree measures corresponding to the following radian measures
(Use 22
π 7
= ).
(i) 11
16 (ii) – 4 (iii) 5π
3 (iv) 7π
6`,
          },
          {
            n: "3",
            marks: 2,
            text: `A wheel makes 360 revolutions in one minute. Through how many radians does
it turn in one second?`,
          },
          {
            n: "4",
            marks: 2,
            text: `Find the degree measure of the angle subtended at the centre of a circle of
radius 100 cm by an arc of length 22 cm (Use 22
π 7
= ).`,
          },
          {
            n: "5",
            marks: 2,
            text: `In a circle of diameter 40 cm, the length of a chord is 20 cm. Find the length of
minor arc of the chord.`,
          },
          {
            n: "6",
            marks: 2,
            text: `If in two circles, arcs of the same length subtend angles 60° and 75° at the
centre, find the ratio of their radii.`,
          },
          {
            n: "7",
            marks: 3,
            text: `Find the angle in radian through which a pendulum swings if its length is 75 cm
and th e tip describes an arc of length
(i) 10 cm (ii) 15 cm (iii) 21 cm`,
          },
        ],
      },
      {
        exercise: "3.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `cos x = – 1
2 , x lies in third quadrant.`,
          },
          {
            n: "2",
            marks: 2,
            text: `sin x = 3
5 , x lies in second quadrant.`,
          },
          {
            n: "3",
            marks: 2,
            text: `cot x = 4
3 , x lies in third quadrant.`,
          },
          {
            n: "4",
            marks: 2,
            text: `sec x = 13
5 , x lies in fourth quadrant.`,
          },
          {
            n: "5",
            marks: 2,
            text: `tan x = – 5
12 , x lies in second quadrant.
Find the values of the trigonometric functions in Exercises 6 to 10.`,
          },
          {
            n: "6",
            marks: 2,
            text: `sin 765° 7. cosec (– 1410°)`,
          },
          {
            n: "7",
            marks: 2,
            text: `tan 19π
3 9. sin (– 11π`,
          },
          {
            n: "8",
            marks: 2,
            text: `sin (x – y) = sin x cos y – cos x sin y
If we replace y by –y, in the Identity 7, we get the result.`,
          },
          {
            n: "9",
            marks: 2,
            text: `By taking suitable values of x and y in the identities 3, 4, 7 and 8, we get the
following results:
cos x
π
( + )
2 = – sin x sin x
π
( + )
2 = cos x
cos (πππππ – x) = – cos x sin (πππππ – x) = sin x

66 MATHEMATICS
cos (πππππ + x) = – cos x sin (πππππ + x) = – sin x
cos (2πππππ – x) = cos x sin (2πππππ – x) = – sin x
Similar results for tan x, cot x, sec x and cosec x can be obtained from the results of sin
x and cos x.`,
          },
          {
            n: "10",
            marks: 2,
            text: `If none of the angles x, y and (x + y) is an odd multiple of π
2 , then
tan (x + y) = x y
x y
tan + tan
1 – tan tan
Since none of the x, y and (x + y) is an odd multiple of π
2 , it follows that cos x,
cos y and cos (x + y) are non-zero. Now
tan (x + y) = sin( )
cos( )
x y
x y
+
+ = sin cos cos sin
cos cos sin sin
x y x y
x y x y
+
− .
Dividing numerator and denominator by cos x cos y, we have
tan (x + y) =
y	x
y	x
y	x
y	x
y	x
y	x
y	x
y	x
cos	cos
sin	sin
cos	cos
cos	cos
cos	cos
sin	cos
cos	cos
cos	sin
−
+
= tan tan
1 – tan tan
x y
x y
+`,
          },
          {
            n: "11",
            marks: 2,
            text: `tan ( x – y) = x y
x y
tan – tan
1 + tan tan
If we replace y by – y in Identity 10, we get
tan (x – y) = tan [x + (– y)]
= tan tan ( )
1 tan tan ( )
x y
x y
+ −
− − = tan tan
1 tan tan
x y
x y
−
+`,
          },
          {
            n: "12",
            marks: 2,
            text: `If none of the angles x, y and (x + y) is a multiple of πππππ, then
cot ( x + y) = x y
y x
cot cot – 1
cot + cot

TRIGONOMETRIC FUNCTIONS 67
Since, none of the x, y and (x + y) is multiple of π, we find that sin x sin y and
sin (x + y) are non-zero. Now,
cot ( x + y) = cos ( ) cos cos – sin sin
sin ( ) sin cos cos sin
x y x y x y
x y x y x y
+ =
+ +
Dividing numerator and denominator by sin x sin y, we have
cot (x + y) = cot cot – 1
cot cot
x y
y x	+`,
          },
          {
            n: "13",
            marks: 2,
            text: `cot (x – y) = x y
y x
cot cot + 1
cot – cot if none of angles x, y and x–y is a multiple of π
If we replace y by –y in identity 12, we get the result`,
          },
          {
            n: "14",
            marks: 2,
            text: `cos 2x = cos2x – sin2 x = 2 cos2 x – 1 = 1 – 2 sin2 x = x
x
2
2
1 – tan
1 + tan
We know that
cos (x + y) = cos x cos y – sin x sin y
Replacing y by x, we get
cos 2x = cos2x – sin2 x
= cos2 x – (1 – cos2 x) = 2 cos2x – 1
Again, cos 2x = cos2 x – sin2 x
= 1 – sin2 x – sin2 x = 1 – 2 sin2 x.
We have cos 2x = cos2 x – sin 2 x =
2 2
2 2
cos sin
cos sin
x x
x x
−
+
Dividing numerator and denominator by cos2 x, we get
cos 2x =
2
2
1 – tan
1 + tan
x
x , π
π 2
≠ +	x n , where n is an integer`,
          },
          {
            n: "15",
            marks: 2,
            text: `sin 2x = 2 sinx cos x = x
x2
2tan
1 + tan
π
π 2
≠ +	x n , where n is an integer
We have
sin (x + y) = sin x cos y + cos x sin y
Replacing y by x, we get sin 2x = 2 sin x cos x.
Again sin 2x = 2 2
2sin cos
cos sin
x x
x x	+

68 MATHEMATICS
Dividing each term by cos2 x, we get
sin 2x = 2
2tan
1 tan
x
x	+`,
          },
          {
            n: "16",
            marks: 2,
            text: `tan 2x = x
x2
2tan
1 – tan if π
2 π 2
≠ +	x n , where n is an integer
We know that
tan (x + y) = tan tan
1 tan tan
x y
– x y
+
Replacing y by x , we get 2
2 tan
tan 2 1 tan
x
x x
= −`,
          },
          {
            n: "17",
            marks: 2,
            text: `sin 3x = 3 sin x – 4 sin3 x
We have,
sin 3x = sin (2x + x)
= sin 2x cos x + cos 2x sin x
= 2 sin x cos x cos x + (1 – 2sin2 x) sin x
= 2 sin x (1 – sin2 x) + sin x – 2 sin3 x
= 2 sin x – 2 sin3 x + sin x – 2 sin3 x
= 3 sin x – 4 sin3 x`,
          },
          {
            n: "18",
            marks: 2,
            text: `cos 3x = 4 cos3 x – 3 cos x
We have,
cos 3x = cos (2x +x)
= cos 2x cos x – sin 2x sin x
= (2cos2 x – 1) cos x – 2sin x cos x sin x
= (2cos2 x – 1) cos x – 2cos x (1 – cos2 x)
= 2cos3 x – cos x – 2cos x + 2 cos3 x
= 4cos3 x – 3cos x.`,
          },
          {
            n: "19",
            marks: 2,
            text: `= x x
x x
3
2
3 tan – tan
tan 3 1 – 3tan if π
3 π 2
≠ +	x n , where n is an integer
We have tan 3x =tan (2x + x)
= tan 2 tan
1 tan 2 tan
x x
– x x
+ 2
2
2tan tan
1 tan
2tan tan
1 1 tan
x x
– x
x . x
– – x
+
=

TRIGONOMETRIC FUNCTIONS 69
3 3
2 2 2
2tan tan tan 3 tan tan
1 tan 2tan 1 3tan
x x – x x – x
– x – x – x
+
= =`,
          },
          {
            n: "20",
            marks: 3,
            text: `(i) cos x + cos y = x y x y	+ –
2cos cos
2 2
(ii) cos x – cos y = – x y x y	+ –
2sin sin
2 2
(iii) sin x + sin y = x y x y	+ –
2sin cos
2 2
(iv) sin x – sin y = x y x y	+ –
2cos sin
2 2
We know that
cos (x + y) = cos x cos y – sin x sin y ... (1)
and cos (x – y) = cos x cos y + sin x sin y ... (2)
Adding and subtracting (1) and (2), we get
cos (x + y) + cos(x – y) = 2 cos x cos y ... (3)
and cos (x + y) – cos (x – y) = – 2 sin x sin y ... (4)
Further sin (x + y) = sin x cos y + cos x sin y ... (5)
and sin (x – y) = sin x cos y – cos x sin y ... (6)
Adding and subtracting (5) and (6), we get
sin (x + y) + sin (x – y) = 2 sin x cos y ... (7)
sin (x + y) – sin (x – y) = 2cos x sin y ... (8)
Let x + y = θ and x – y = φ. Therefore
θ θ
and
2 2
x y
+ φ −φ	   
= =	   
   
Substituting the values of x and y in (3), (4), (7) and (8), we get
cos θ + cos φ = 2 cos θ θ
cos
2 2
+ φ −φ	   
   
   
cos θ – cos φ = – 2 sin θ θ
sin
2
–	+ φ φ	   
   
2	   
sin θ + sin φ = 2 sin θ θ
cos
2 2
+ φ −φ	   
   
   

70 MATHEMATICS
sin θ – sin φ = 2 cos θ θ
sin
2 2
+ φ −φ	   
   
   
Since θ and φ can take any real values, we can replace θ by x and φ by y.
Thus, we get
cos x + cos y = 2 cos cos
2 2
x y x y	+ − ; cos x – cos y = – 2 sin sin
2 2
x y x y	+ − ,
sin x + sin y = 2 sin cos
2 2
x y x y	+ − ; sin x – sin y = 2 cos sin
2 2
x y x y	+ − .
Remark As a part of identities given in 20, we can prove the following results:`,
          },
          {
            n: "21",
            marks: 5,
            text: `(i) 2 cos x cos y = cos (x + y) + cos (x – y)
(ii) –2 sin x sin y = cos (x + y) – cos (x – y)
(iii) 2 sin x cos y = sin (x + y) + sin (x – y)
(iv) 2 cos x sin y = sin (x + y) – sin (x – y).
Example 10 Prove that
5
3sin sec 4sin cot 1
6 3 6 4
π π π π
− =
Solution We have
L.H.S. = 5
3sin sec 4sin cot
6 3 6 4
π π π π
−
= 3 × 1
2 × 2 – 4 sin 6
π	 
π −	 
  × 1 = 3 – 4 sin 6
π
= 3 – 4 × 1
2 = 1 = R.H.S.
Example 11 Find the value of sin 15°.
Solution We have
sin 15° = sin (45° – 30°)
= sin 45° cos 30° – cos 45° sin 30°
= 1 3 1 1 3 1
2 2	2 2 2 2
–
× − × = .
Example 12 Find the value of tan 13
12
π .

TRIGONOMETRIC FUNCTIONS 71
Solution We have
tan 13
12
π = tan 12
π	 
π +	 
  = tan tan
12 4 6
π π π	 
= −	 
 
=
tan tan
4 6
1 tan tan
4 6
π π
−
π π
+
=
1
1 3 1	3 2 3
1 3 1	1 3
− −
= = −
+	+
Example 13 Prove that
sin ( ) tan tan
sin ( ) tan tan
x y x y
x y x y
+ +
=
− − .
Solution We have
L.H.S. sin ( ) sin cos cos sin
sin ( ) sin cos cos sin
x y x y x y
x y x y x y
+ +
= =
− −
Dividing the numerator and denominator by cos x cos y, we get
sin ( ) tan tan
sin ( ) tan tan
x y x y
x y x y
+ +
=
− − .
Example 14 Show that
tan 3 x tan 2 x tan x = tan 3x – tan 2 x – tan x
Solution We know that 3x = 2x + x
Therefore, tan 3x = tan (2x + x)
or tan 2 tan
tan 3 1– tan 2 tan
x x
x x x
+
=
or tan 3x – tan 3x tan 2x tan x = tan 2x + tan x
or tan 3x – tan 2x – tan x = tan 3x tan 2x tan x
or tan 3x tan 2x tan x = tan 3x – tan 2x – tan x.
Example 15 Prove that
cos cos 2 cos
4 4
x x x
π π	   
+ + − =	   
   
Solution Using the Identity 20(i), we have

72 MATHEMATICS
L.H.S. cos cos
4 4
x x
π π	   
= + + −	   
   
( )
4 4 4 4	2cos cos
2 2
x x x – x
π π π π	   
+ + − + −	   
=    
   	   
   
= 2 cos 4
π cos x = 2 × 1
2 cos x = 2 cos x = R.H.S.
Example 16 Prove that cos 7 cos 5 cot
sin 7 – sin 5
x x x
x x
+ =
Solution Using the Identities 20 (i) and 20 (iv), we get
L.H.S. =
7 5 7 5
2cos cos
2 2
7 5 7 5
2cos sin
2 2
x x x x
x x x x
+ −
+ − = cos
sin cot
x
x x	= = R.H.S.
Example 17 Prove that sin 5 2sin 3 sin tan
cos5 cos
x x x x
x x
− +
= =
−
Solution We have
L.H.S. sin 5 2sin 3 sin
cos5 cos
x x x
x x
− +
= −
sin 5 sin 2sin 3
cos5 …`,
          },
        ],
      },
      {
        exercise: "3.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `sin2 π
6 + cos2
3
π – tan2 1
–
4 2
π = 2. 2sin2
6
π + cosec2 2	7 3
cos
6 3 2
π π =`,
          },
          {
            n: "2",
            marks: 2,
            text: `2 2	5
cot cosec 3tan 6
6 6 6
π π π
+ + = 4. 2 2 2	3
2sin 2cos 2sec 10
4 4 3
π π π
+ + =`,
          },
          {
            n: "3",
            marks: 2,
            text: `Example 19 Find the principal solutions of the equation tan x = − 1`,
          },
        ],
      },
      {
        exercise: "3.4",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `tan x = 3 2. sec x = 2`,
          },
          {
            n: "2",
            marks: 2,
            text: `cot x = − 3 4. cosec x = – 2
Find the general solution for each of the following equations:`,
          },
          {
            n: "3",
            marks: 2,
            text: `(cos x + cos y)2 + (sin x – sin y)2 = 4 cos2
2
x y	+`,
          },
          {
            n: "4",
            marks: 2,
            text: `(cos x – cos y)2 + (sin x – sin y)2 = 4 sin2
2
x y	−`,
          },
          {
            n: "5",
            marks: 2,
            text: `sin x + sin 3x + sin 5x + sin 7x = 4 cos x cos 2x sin 4x`,
          },
          {
            n: "6",
            marks: 2,
            text: `6.	6.	6.	6. (sin 7 sin 5 ) (sin 9 sin 3 ) tan 6
(cos 7 cos 5 ) (cos 9 cos 3 )
x x x x x
x x x x
+ + + =
+ + +`,
          },
          {
            n: "7",
            marks: 2,
            text: `sin 3x + sin 2x – sin x = 4sin x cos x
2 cos 3
2
x
Find sin x
2 , cos x
2 and tan x
2 in each of the following :`,
          },
          {
            n: "8",
            marks: 2,
            text: `tan x = − 4
3 , x in quadrant II 9. cos x = − 1
3, x in quadrant III`,
          },
          {
            n: "9",
            marks: 5,
            text: `sin x = 4
1 , x in quadrant II
Summary
®If in a circle of radius r, an arc of length l subtends an angle of θ radians, then
l = r θ
®Radian measure = π
180 × Degree measure
®Degree measure = 180
π × Radian measure
®cos2 x + sin2 x = 1
®1 + tan2 x = sec2 x
®1 + cot2 x = cosec2 x
®cos (2nπ + x) = cos x
®sin (2nπ + x) = sin x
®sin (– x) = – sin x
®cos (– x) = cos x

TRIGONOMETRIC FUNCTIONS 83
®cos (x + y) = cos x cos y – sin x sin y
®cos (x – y) = cos x cos y + sin x sin y
®cos ( π
2 x	− ) = sin x
®sin ( π
2 x	− ) = cos x
®sin (x + y) = sin x cos y + cos x sin y
®sin (x – y) = sin x cos y – cos x sin y
®cos π +
2 x
 
 
  = – sin x sin π +
2 x
 
 
  = cos x
cos (π – x) = – cos x sin (π – x) = sin x
cos (π + x) = – cos x sin (π + x) = – sin x
cos (2π – x) = cos x sin (2π – x) = – sin x
®If none of the angles x, y and (x ± y) is an odd multiple of π
2 , then
tan (x + y) = tan tan
tan tan
x y
x y
+
−	1
®tan (x – y) = tan tan
tan tan
x y
x y
−
+	1
®If none of the angles x, y and (x ± y) is a multiple of π, then
cot (x + y) = cot cot 1
cot cot
x y
y x
−
+
®cot (x – y) = cot cot 1
cot cot
x y
y x	−
+
®cos 2x = cos2 x – sin2 x = 2cos2 x – 1 = 1 – 2 sin2 x
2
2
1 tan
1 tan
– x
x
= +

84 MATHEMATICS
®sin 2x = 2 sin x cos x 2
2 tan
1 tan
x
x
= +
®tan 2x = 2
2tan
1 tan
x
x	−
®sin 3x = 3sin x – 4sin3 x
®cos 3x = 4cos3 x – 3cos x
®tan 3x =
3
2
3tan tan
1 3tan
x x
x
−
−
® (i) cos x + cos y = 2cos cos
2 2
x y x y	+ −
(ii) cos x – cos y = – 2sin sin
2 2
x y x y	+ −
(iii) sin x + sin y = 2 sin cos
2 2
x y x y	+ −
(iv) sin x – sin y = 2cos sin
2 2
x y x y	+ −
® (i) 2cos x cos y = cos ( x + y) + cos ( x – y)
(ii) – 2sin x sin y = cos (x + y) – cos (x – y)
(iii) 2sin x cos y = sin (x + y) + sin (x – y)
(iv) 2 cos x sin y = sin (x + y) – sin (x – y).
®sin x = 0 gives x = nπ, where n ∈ Z.
®cos x = 0 gives x = (2n + 1) π
2 , where n ∈ Z.
® sin x = sin y implies x = nπ + (– 1)n y, where n ∈ Z.
®cos x = cos y, implies x = 2nπ ± y, where n ∈ Z.
®tan x = tan y implies x = nπ + y, where n ∈ Z.

TRIGONOMETRIC FUNCTIONS 85
Historical Note
The study of trigonometry was first started in India. The ancient Indian
Mathematicians, Aryabhatta (476), Brahmagupta (598), Bhaskara I (600) and
B…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 4,
    chapterName: "Principle of Mathematical Induction",
    exercises: [
      {
        exercise: "4.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `1 + 3 + 32 + ... + 3n – 1 = (3 1)
2
n − .`,
          },
          {
            n: "2",
            marks: 2,
            text: `13 + 23 + 33 + … +n3 =
2
( 1)
2
n n +	 
 
  .`,
          },
          {
            n: "3",
            marks: 2,
            text: `1 1 1 2
1 (1 2) (1 2 3) (1 2 3 ) ( 1)
n
... ...n n
+ + + + =
+ + + + + + + .`,
          },
          {
            n: "4",
            marks: 2,
            text: `1.2.3 + 2.3.4 +…+ n(n+1) (n+2) = ( 1) ( 2) ( 3)
4
n n n n	+ + + .`,
          },
          {
            n: "5",
            marks: 2,
            text: `1.3 + 2.32 + 3.33 +…+ n.3n =
1
(2 1)3 3
4
n
n +
− + .`,
          },
          {
            n: "6",
            marks: 2,
            text: `1.2 + 2.3 + 3.4 +…+ n.(n+1) = ( 1)( 2)
3
n n n	+ +	 
   .`,
          },
          {
            n: "7",
            marks: 2,
            text: `1.3 + 3.5 + 5.7 +…+ (2n–1) (2n+1) =
2
(4 6 1)
3
n n n	+ − .`,
          },
          {
            n: "8",
            marks: 2,
            text: `1.2 + 2.22 + 3.23 + ...+n.2n = (n–1) 2n + 1 + 2.`,
          },
          {
            n: "9",
            marks: 2,
            text: `1 1 1 1 1
... 1
2 4 8 2 2n n
+ + + + = − .`,
          },
          {
            n: "10",
            marks: 2,
            text: `1 1 1 1
...
2.5 5.8 8.11 (3 1)(3 2) (6 4)
n
n n n
+ + + + =
− + + .`,
          },
          {
            n: "11",
            marks: 2,
            text: `1 1 1 1 ( 3)
...
1.2.3 2.3.4 3.4.5 ( 1)( 2) 4( 1)( 2)
n n
n n n n n
+
+ + + + =
+ + + + .

PRINCIPLE OF MATHEMATICAL INDUCTION 95`,
          },
          {
            n: "12",
            marks: 2,
            text: `a + ar + ar2 +…+ arn-1 = ( 1)
1
n
a r
r
−
− .`,
          },
          {
            n: "13",
            marks: 2,
            text: `2
2
3 5 7 (2 1)
1 1 1 ... 1 ( 1)
1 4 9
n n
n
+	       
+ + + + = +	       
        .`,
          },
          {
            n: "14",
            marks: 2,
            text: `1 1 1 1
1 1 1 ... 1 ( 1)
1 2 3 n
n
       
+ + + + = +	       
        .`,
          },
          {
            n: "15",
            marks: 2,
            text: `12 + 32 + 52 + …+ (2n–1)2 = (2 1)(2 1)
3
n n n	− + .`,
          },
          {
            n: "16",
            marks: 2,
            text: `1 1 1 1
...
1.4 4.7 7.10 (3 2)(3 1) (3 1)
n
n n n
+ + + + =
− + + .`,
          },
          {
            n: "17",
            marks: 2,
            text: `1 1 1 1
...
3.5 5.7 7.9 (2 1)(2 3) 3(2 3)
n
n n n
+ + + + =
+ + + .`,
          },
          {
            n: "18",
            marks: 2,
            text: `1 + 2 + 3 +…+ n < 1
8 (2n + 1)2.`,
          },
          {
            n: "19",
            marks: 2,
            text: `n (n + 1) (n + 5) is a multiple of 3.`,
          },
          {
            n: "20",
            marks: 2,
            text: `102n – 1 + 1 is divisible by 11.`,
          },
          {
            n: "21",
            marks: 2,
            text: `x2n – y2n is divisible by x + y.`,
          },
          {
            n: "22",
            marks: 2,
            text: `32n+2 – 8n – 9 is divisible by 8.`,
          },
          {
            n: "23",
            marks: 2,
            text: `41n – 14n is a multiple of 27.`,
          },
          {
            n: "24",
            marks: 3,
            text: `(2n + 7) < (n + 3)2.
Summary
®One key basis for mathematical thinking is deductive reasoning. In contrast to
deduction, inductive reasoning depends on working with different cases and
developing a conjecture by observing incidences till we have observed each
and every case. Thus, in simple language we can say the word ‘induction’
means the generalisation from particular cases or facts.
®The principle of mathematical induction is one such tool which can be used to
prove a wide variety of mathematical statements. Each such statement is
assumed as P(n) associated with positive integer n, for which the correctness

96 MATHEMATICS
for the case n = 1 is examined. Then assuming the truth of P(k) for some
positive integer k, the truth of P (k+1) is established.
Historical Note
Unlike other concepts and methods, proof by mathematical induction is not
the invention of a particular individual at a fixed moment. It is said that the principle
of mathematical induction was known by the Pythagoreans.
The French mathematician Blaise Pascal is credited with the origin of the
principle of mathematical induction.
The name induction was used by the English mathematician John Wallis.
Later the principle was employed to provide a proof of the binomial theorem.
De Morgan contributed many accomplishments in the field of mathematics
on many different subjects. He was the first person to define and name
“mathematical induction” and developed De Morgan’s rule to determine the
convergence of a mathematical series.
G. Peano undertook the task of deducing the properties of natural numbers
from a set of explicitly stated assumptions, now known as Peano’s axioms.The
principle of mathematical induction is a restatement of one of the Peano’s axioms.
— v	v	v	v	v —`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 5,
    chapterName: "Complex Numbers and Quadratic Equations",
    exercises: [
      {
        exercise: "5.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `( ) 3
5 5
i i
 
−	 
  2. i i
9 19
+ 3. i −39

104 MATHEMATICS
Fig 5.1`,
          },
        ],
      },
      {
        exercise: "5.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `z = – 1 – i 3 2. z = – 3 + i
Convert each of the complex numbers given in Exercises 3 to 8 in the polar form:`,
          },
          {
            n: "2",
            marks: 2,
            text: `1 – i 4. – 1 + i 5. – 1 – i`,
          },
        ],
      },
      {
        exercise: "5.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `x2 + 3 = 0 2. 2x2 + x + 1 = 0 3. x2 + 3x + 9 = 0`,
          },
          {
            n: "2",
            marks: 3,
            text: `(ii) We have 1 1 1 1
1 (1 )(1 ) 1 1 2 2
i i i
i i i
− −
= = = −
+ + − +
Let 1
2 = r cos θ, – 1
2 = r sin θ
Proceeding as in part (i) above, we get 1 1 1
; cosθ , sin θ
2 2 2
r −
= = =
Therefore π
θ 4
−
=
Hence, the modulus of 1
1 i	+ is 1
2 , argument is π
4
− .
Example 14 If x + iy = a ib
a ib
+
− , prove that x2 + y2 = 1.
Solution We have,
x + iy = ( )( )
( )( )
a ib a ib
a ib a ib
+ +
− + =
2 2
2 2
2	a b abi
a b
− +
+ =
2 2
2 2 2 2
2	a b ab i
a b a b
− +
+ +

COMPLEX NUMBERS AND QUADRATIC EQUATIONS 111
So that, x – iy =
2 2
2 2 2 2
2	a b ab i
a b a b
− −
+ +
Therefore,
x2 + y2 = (x + iy) (x – iy) =
2 2 2 2 2
2 2 2 2 2 2
( ) 4
( ) ( )
a b a b
a b a b
− +
+ + =
2 2 2
2 2 2
( )
( )
a b
a b
+
+ = 1
Example 15 Find real θ such that
3 2 sinθ
1 2 sinθ
i
i
+
− is purely real.
Solution We have,
3 2 sinθ
1 2 sinθ
i
i
+
− = (3 2 sinθ)(1 2 sinθ)
(1 2 sinθ)(1 2 sinθ)
i i
i i
+ +
− +
=
2
2
3+ 6 sinθ + 2 sinθ – 4sin θ
1+ 4sin θ
i i =
2
2 2
3 4sin θ 8 sinθ
1 4sin θ 1 4sin θ
i	− +
+ +
We are given the complex number to be real. Therefore
2
8sinθ
1 4sin θ	+ = 0, i.e., sin θ = 0
Thus θ = nπ, n ∈ Z.
Example 16 Convert the complex number 1
π π
cos sin
3 3
i
z
i
−
=
+
in the polar form.
Solution We have, z = 1
1 3
2 2
i
i
−
+
= ( )	2 3 1 3	2( 1) 1 3
1 3	1 3 1 3
i i	i i
i i
+ − +	− −
× = +	+ − = 3 1 3 1
2 2 i
− +
+
Now, put 3 1 3 1
cos , sin
2 2
r r
θ
	θ
− +
= =

112 MATHEMATICS
Squaring and adding, we obtain
2 2
2 3 1 3 1
2 2
r    	− +
= +	   	   
    = ( )2
2 3 1 2 4 2
4 4
 +	  ×	  = =
Hence, 2	r = which gives 3 1 3 1
cosθ , sinθ
2 2 2 2
− +
= =
Therefore, π π 5π
θ 4 6 12
= + = (Why?)
Hence, the polar form is
5π 5π
2 cos sin
12 12
i
 
+	 
 
Miscellaneous Exercise on Chapter 5`,
          },
          {
            n: "3",
            marks: 2,
            text: `Reduce 1 2 3 4
1 4 1 5
i
i i i
−	   
−	   
− + +	    to the standard form .`,
          },
          {
            n: "4",
            marks: 3,
            text: `If a ib
x iy c id
−
− = − prove that ( ) 2 2	2
	2 2
2 2
a b
x y c d
+
+ = + .`,
          },
          {
            n: "5",
            marks: 2,
            text: `Convert the following in the polar form:
(i) ( )2
1 7
2
i
i
+
− , (ii) 1 3
1 – 2
i
i
+
Solve each of the equation in Exercises 6 to 9.`,
          },
          {
            n: "6",
            marks: 2,
            text: `2 20
3 4 0
3
x x	− + = 7. 2 3
2 0
2
x x	− + =`,
          },
          {
            n: "7",
            marks: 2,
            text: `2
27 10 1 0	x x	− + =

COMPLEX NUMBERS AND QUADRATIC EQUATIONS 113`,
          },
          {
            n: "8",
            marks: 2,
            text: `2
21 28 10 0	x x	− + =`,
          },
          {
            n: "9",
            marks: 2,
            text: `If z1 = 2 – i, z2 = 1 + i, find 1 2
1 2
1
– 1
z z
z z
+ +
+ .`,
          },
          {
            n: "10",
            marks: 3,
            text: `If a + ib =
2
2
( )
2 1
x i
x
+
+ , prove that a2 + b2 = ( )
2 2
2
2
( 1)
2 1
x
x
+
+ .`,
          },
          {
            n: "11",
            marks: 2,
            text: `Let z1 = 2 – i, z2 = –2 + i. Find
(i) 1 2
1
Re z z
z
 
 
  , (ii) 1 1
1
Im z z
 
 
  .`,
          },
          {
            n: "12",
            marks: 2,
            text: `Find the modulus and argument of the complex number 1 2
1 3
i
i
+
− .`,
          },
          {
            n: "13",
            marks: 2,
            text: `Find the real numbers x and y if (x – iy) (3 + 5i) is the conjugate of –6 – 24i.`,
          },
          {
            n: "14",
            marks: 2,
            text: `Find the modulus of 1 1
1 1
i i
i i
+ −
−
− + .`,
          },
          {
            n: "15",
            marks: 3,
            text: `If (x + iy)3 = u + iv, then show that 2 2
4( – )
u v x y
x y
+ = .`,
          },
          {
            n: "16",
            marks: 2,
            text: `If α and β are different complex numbers with β 1	= , then find
β α
1 α β
–
– .`,
          },
          {
            n: "17",
            marks: 2,
            text: `Find the number of non-zero integral solutions of the equation 1 2
x x
– i = .`,
          },
          {
            n: "18",
            marks: 3,
            text: `If (a + ib) (c + id) (e + if) (g + ih) = A + iB, then show that
(a2 + b2) (c2 + d2) (e2 + f 2) (g2 + h2) = A2 + B2`,
          },
          {
            n: "19",
            marks: 2,
            text: `If 1 1
1
m
i
– i
 	+ =	 
  , then find the least positive integral value of m.

114 MATHEMATICS
Summary
®A number of the form a + ib, where a and b are real numbers, is called a
complex number, a is called the real part and b is called the imaginary part
of the complex number.
®Let z1 = a + ib and z2 = c + id. Then
(i) z1 + z2 = (a + c) + i (b + d)
(ii) z1 z2 = (ac – bd) + i (ad + bc)
®For any non-zero complex number z = a + ib (a ≠ 0, b ≠ 0), there exists the
complex number 2 2 2 2
a b
i
a b a b
−
+
+ + , denoted by 1
z or z–1, called the
multiplicative inverse of z such that (a + ib)
2
2 2 2 2
a b
i
a b a b
 	−
+	 
+ +	  = 1 + i0 =1
®For any integer k, i4k = 1, i4k + 1 = i, i4k + 2 = – 1, i4k + 3 = – i
®The conjugate of the complex number z = a + ib, denoted by z , is given by
z = a – ib.
®The polar form of the complex number z = x + iy is r (cosθ + i sinθ), where
r = 2 2
x y	+ (the modulus of z) and cosθ = x
r , sinθ = y
r . (θ is known as the
argument of z. The value of θ, such that – π < θ ≤ π, is called the principal
argument of z.
®A polynomial equation of n degree has n roots.
®The solutions of the quadratic equation ax2 + bx + c = 0, where a, b, c ∈ R,
a ≠ 0, b2 – 4ac < 0, are given by x =
2
4
2
b ac b i
a
− ± − .

COMPLEX NUMBERS AND QUADRATIC EQUATIONS 115
Historical Note
The fact that square root of a negative number does not exist in the real number
system was recognised by the Greeks. But the credit goes to the Indian
mathematician Mahavira (850) who first stated this difficulty clearly. “He mentions
in his work ‘Ganitasara Sangraha’ as in the nature of things a negative (quantity)
is not a square (quantity)’, it has, therefore, no square root”. Bhaskara, another
Indian mathematician, also writes in his work Bijaganita, written in 1150. “There
is no square root of a negative quantity, for it is not a square.” Cardan (1545)
considered the problem of solving
x + y = 10, xy = 40.
He obtained x = 5 + 15	− and y = 5 – 15	− as the solution of it, which
was discarded by him by saying that these numbers are ‘useless’. Albert Girard
(about 1625) accepted square root of negative numbers and said that this will
enable us to get as many roots as th…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 6,
    chapterName: "Linear Inequalities",
    exercises: [
      {
        exercise: "6.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Solve 24x < 100, when
(i) x is a natural number. (ii) x is an integer.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Solve – 12x > 30, when
(i) x is a natural number. (ii) x is an integer.`,
          },
          {
            n: "3",
            marks: 2,
            text: `Solve 5x – 3 < 7, when
(i) x is an integer. (ii) x is a real number.`,
          },
          {
            n: "4",
            marks: 2,
            text: `Solve 3x + 8 >2, when
(i) x is an integer. (ii) x is a real number.
Solve the inequalities in Exercises 5 to 16 for real x.`,
          },
          {
            n: "5",
            marks: 2,
            text: `4x + 3 < 5x + 7 6. 3x – 7 > 5x – 1`,
          },
          {
            n: "6",
            marks: 2,
            text: `3(x – 1) ≤ 2 (x – 3) 8. 3 (2 – x) ≥ 2 (1 – x)`,
          },
        ],
      },
      {
        exercise: "6.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `x + y < 5 2. 2x + y ≥ 6 3. 3x + 4y ≤ 12`,
          },
        ],
      },
      {
        exercise: "6.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `x ≥ 3, y ≥ 2 2. 3x + 2y ≤ 12, x ≥ 1, y ≥ 2`,
          },
          {
            n: "2",
            marks: 2,
            text: `2x + y ≥ 6, 3x + 4y < 12 4. x + y ≥ 4, 2x – y < 0`,
          },
          {
            n: "3",
            marks: 2,
            text: `7
3 4 18
2
x
– ≤ − ≤ 4. 3 2
15 0
5
( x )	−
− < ≤`,
          },
          {
            n: "4",
            marks: 2,
            text: `3
12 4 2
5
x
− < − ≤
− 6. 3 11
7 11
2
( x )	+
≤ ≤ .
Solve the inequalities in Exercises 7 to 10 and represent the solution graphically on
number line.`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 7,
    chapterName: "Permutations and Combinations",
    exercises: [
      {
        exercise: "7.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `How many 3-digit numbers can be formed from the digits 1, 2, 3, 4 and 5
assuming that
(i) repetition of the digits is allowed?
(ii) repetition of the digits is not allowed?`,
          },
          {
            n: "2",
            marks: 2,
            text: `How many 3-digit even numbers can be formed from the digits 1, 2, 3, 4, 5, 6 if the
digits can be repeated?`,
          },
          {
            n: "3",
            marks: 2,
            text: `How many 4-letter code can be formed using the first 10 letters of the English
alphabet, if no letter can be repeated?`,
          },
          {
            n: "4",
            marks: 3,
            text: `How many 5-digit telephone numbers can be constructed using the digits 0 to 9 if
each number starts with 67 and no digit appears more than once?`,
          },
          {
            n: "5",
            marks: 2,
            text: `A coin is tossed 3 times and the outcomes are recorded. How many possible
outcomes are there?`,
          },
          {
            n: "6",
            marks: 2,
            text: `Given 5 flags of different colours, how many different signals can be generated if
each signal requires the use of 2 flags, one below the other?`,
          },
        ],
      },
      {
        exercise: "7.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Evaluate
(i) 8 ! (ii) 4 ! – 3 !

PERMUTATIONS AND COMBINATIONS 141`,
          },
          {
            n: "2",
            marks: 2,
            text: `Is 3 ! + 4 ! = 7 ! ? 3. Compute 8!
6! 2!	× 4. If 1 1
6! 7! 8!
x
+ = , find x`,
          },
        ],
      },
      {
        exercise: "7.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `How many 3-digit numbers can be formed by using the digits 1 to 9 if no digit is
repeated?`,
          },
          {
            n: "2",
            marks: 2,
            text: `How many 4-digit numbers are there with no digit repeated?`,
          },
          {
            n: "3",
            marks: 2,
            text: `How many 3-digit even numbers can be made using the digits
1, 2, 3, 4, 6, 7, if no digit is repeated?`,
          },
          {
            n: "4",
            marks: 2,
            text: `Find the number of 4-digit numbers that can be formed using the digits 1, 2, 3, 4,
5 if no digit is repeated. How many of these will be even?`,
          },
          {
            n: "5",
            marks: 2,
            text: `From a committee of 8 persons, in how many ways can we choose a chairman
and a vice chairman assuming one person can not hold more than one position?`,
          },
          {
            n: "6",
            marks: 2,
            text: `Find n if n – 1P3 : nP4 = 1 : 9.`,
          },
          {
            n: "7",
            marks: 2,
            text: `Find r if (i) 5 6
1	P 2 P	r r−	= (ii) 5 6
1	P P	r r −	= .`,
          },
          {
            n: "8",
            marks: 2,
            text: `How many words, with or without meaning, can be formed using all the letters of
the word EQUATION, using each letter exactly once?`,
          },
          {
            n: "9",
            marks: 3,
            text: `How many words, with or without meaning can be made from the letters of the
word MONDAY, assuming that no letter is repeated, if.
(i) 4 letters are used at a time, (ii) all letters are used at a time,
(iii) all letters are used but first letter is a vowel?`,
          },
          {
            n: "10",
            marks: 2,
            text: `In how many of the distinct permutations of the letters in MISSISSIPPI do the
four I’s not come together?`,
          },
          {
            n: "11",
            marks: 3,
            text: `In how many ways can the letters of the word PERMUTATIONS be arranged if the
(i) words start with P and end with S, (ii) vowels are all together,
(iii) there are always 4 letters between P and S?`,
          },
        ],
      },
      {
        exercise: "7.4",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `If nC8 = nC2, find nC2.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Determine n if
(i) 2nC3 : nC3 = 12 : 1 (ii) 2nC3 : nC3 = 11 : 1`,
          },
          {
            n: "3",
            marks: 2,
            text: `How many chords can be drawn through 21 points on a circle?`,
          },
          {
            n: "4",
            marks: 2,
            text: `In how many ways can a team of 3 boys and 3 girls be selected from 5 boys and
4 girls?`,
          },
          {
            n: "5",
            marks: 2,
            text: `Find the number of ways of selecting 9 balls from 6 red balls, 5 white balls and 5
blue balls if each selection consists of 3 balls of each colour.`,
          },
          {
            n: "6",
            marks: 2,
            text: `Determine the number of 5 card combinations out of a deck of 52 cards if there
is exactly one ace in each combination.`,
          },
          {
            n: "7",
            marks: 2,
            text: `In how many ways can one select a cricket team of eleven from 17 players in
which only 5 players can bowl if each cricket team of 11 must include exactly 4
bowlers?`,
          },
          {
            n: "8",
            marks: 2,
            text: `A bag contains 5 black and 6 red balls. Determine the number of ways in which
2 black and 3 red balls can be selected.`,
          },
          {
            n: "9",
            marks: 5,
            text: `In how many ways can a student choose a programme of 5 courses if 9 courses
are available and 2 specific courses are compulsory for every student?
Miscellaneous Examples
Example 20 How many words, with or without meaning, each of 3 vowels and 2
consonants can be formed from the letters of the word INVOLUTE ?
Solution In the word INVOLUTE, there are 4 vowels, namely, I,O,E,Uand 4
consonants, namely, N, V, L and T.

154 MATHEMATICS
The number of ways of selecting 3 vowels out of 4 = 4C3 = 4.
The number of ways of selecting 2 consonants out of 4 = 4C2 = 6.
Therefore, the number of combinations of 3 vowels and 2 consonants is
4 × 6 = 24.
Now, each of these 24 combinations has 5 letters which can be arranged among
themselves in 5 ! ways. Therefore, the required number of different words is
24 × 5 ! = 2880.
Example 21 A group consists of 4 girls and 7 boys. In how many ways can a team of
5 members be selected if the team has (i) no girl ? (ii) at least one boy and one girl ?
(iii) at least 3 girls ?
Solution (i) Since, the team will not include any girl, therefore, only boys are to be
selected. 5 boys out of 7 boys can be selected in 7C5 ways. Therefore, the required
number of ways = 7
5
7! 6 7
C 21
5! 2! 2
×
= = =
(ii) Since, at least one boy and one girl are to be there in every team. Therefore, the
team can consist of
(a) 1 boy and 4 girls (b) 2 boys and 3 girls
(c) 3 boys and 2 girls (d) 4 boys and 1 girl.
1 boy and 4 girls can be selected in 7C1 × 4C4 ways.
2 boys and 3 girls can be selected in 7C2 × 4C3 ways.
3 boys and 2 girls can be selected in 7C3 × 4C2 ways.
4 boys and 1 girl can be selected in 7C4 × 4C1 ways.
Therefore, the required number of ways
= 7C1 × 4C4 + 7C2 × 4C3 + 7C3 × 4C2 + 7C4 × 4C1
= 7 + 84 + 210 + 140 = 441
(iii) Since, the team has to consist of at least 3 girls, the team can consist of
(a) 3 girls and 2 boys, or (b) 4 girls and 1 boy.
Note that the team cannot have all 5 girls, because, the group has only 4 girls.
3 girls and 2 boys can be selected in 4C3 × 7C2 ways.
4 girls and 1 boy can be selected in 4C4 × 7C1 ways.
Therefore, the required number of ways
= 4C3 × 7C2 + 4C4 × 7C1 = 84 + 7 = 91

PERMUTATIONS AND COMBINATIONS 155
Example 22 F…`,
          },
          {
            n: "10",
            marks: 2,
            text: `From a class of 25 students, 10 are to be chosen for an excursion party. There
are 3 students who decide that either all of them will join or none of them will
join. In how many ways can the excursion party be chosen ?`,
          },
          {
            n: "11",
            marks: 2,
            text: `In how many ways can the letters of the word ASSASSINATION be arranged
so that all the S’s are together ?
Summary
®Fundamental principle of counting If an event can occur in m different
ways, following which another event can occur in n different ways, then the
total number of occurrence of the events in the given order is m × n.
®The number of permutations of n different things taken r at a time, where
repetition is not allowed, is denoted by nPr and is given by nPr = !
( )!
n
n r	− ,
where 0 ≤ r ≤ n.
®n! = 1 × 2 × 3 × ...×n
®n! = n × (n – 1) !
®The number of permutations of n different things, taken r at a time, where
repeatition is allowed, is nr.
®The number of permutations of n objects taken all at a time, where p1 objects

158 MATHEMATICS
are of first kind, p2 objects are of the second kind, ..., pk objects are of the kth
kind and rest, if any, are all different is 1 2
!
! ! !	k
n
p p ... p .
®The number of combinations of n different things taken r at a time, denoted by
nCr , is given by nCr = !
! !
n
r ( n r )
= − , 0 ≤ r ≤ n.
Historical Note
The concepts of permutations and combinations can be traced back to the advent
of Jainism in India and perhaps even earlier. The credit, however, goes to the
Jains who treated its subject matter as a self-contained topic in mathematics,
under the name Vikalpa.
Among the Jains, Mahavira, (around 850) is perhaps the world’s first
mathematician credited with providing the general formulae for permutations and
combinations.
In the 6th century B.C., Sushruta, in his medicinal work, Sushruta Samhita,
asserts that 63 combinations can be made out of 6 different tastes, taken one at a
time, two at a time, etc. Pingala, a Sanskrit scholar around third century B.C.,
gives the method of determining the number of combinations of a given number
of letters, taken one at a time, two at a time, etc. in his work Chhanda Sutra.
Bhaskaracharya (born 1114) treated the subject matter of permutations and
combinations under the name Anka Pasha in his famous work Lilavati. In addition
to the general formulae for nCr and nPr already provided by Mahavira,
Bhaskaracharya gives several important theorems and results concerning the
subject.
Outs…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 8,
    chapterName: "Binomial Theorem",
    exercises: [
      {
        exercise: "8.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `(1–2x)5 2.
5
2
2
x
–
x
 
 
  3. (2x – 3)6

BINOMIAL THEOREM 167`,
          },
          {
            n: "2",
            marks: 2,
            text: `Regarding the middle term in the expansion (a + b)n, we have
(i) If n is even, then the number of terms in the expansion will be n + 1. Since
n is even so n + 1 is odd. Therefore, the middle term is
th
n 




 +	+
2
1	1 , i.e.,
th
n 




 +1
2 term.
For example, in the expansion of (x + 2y)8, the middle term is
th





 +1
2
8 i.e.,
5th term.
(ii) If n is odd, then n +1 is even, so there will be two middle terms in the

168 MATHEMATICS
expansion, namely,
th
n 




 +
2
1 term and 1 1
2
th
n +	 
+	 
  term. So in the expansion
(2x – y)7, the middle terms are
th





 +
2
1	7 , i.e., 4th and
th





 +
+ 1
2
1	7 , i.e., 5th term.`,
          },
          {
            n: "3",
            marks: 2,
            text: `In the expansion of
n
x
x
2
1 




 + , where x ≠ 0, the middle term is
th
n 




 +	+
2
1	1	2 ,
i.e., (n + 1)th term, as 2n is even.
It is given by 2nCnxn
n
x 




 1 = 2nCn (constant).
This term is called the term independent of x or the constant term.
Example 5 Find a if the 17th and 18th terms of the expansion (2 + a)50 are equal.
Solution The (r + 1)th term of the expansion (x + y)n is given by Tr + 1 = nCrxn–ryr.
For the 17th term, we have, r + 1 = 17, i.e., r = 16
Therefore, T17 = T16 + 1 = 50C16 (2)50 – 16 a16
= 50C16 234 a16.
Similarly, T18 = 50C17 233 a17
Given that T17 = T18
So 50C16 (2)34 a16 = 50C17 (2)33 a17
Therefore 16
17
33	50
34	50`,
          },
        ],
      },
      {
        exercise: "8.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `x5 in (x + 3)8 2. a5b7 in (a – 2b)12 .
Write the general term in the expansion of`,
          },
          {
            n: "2",
            marks: 2,
            text: `(x2 – y)6 4. (x2 – yx)12, x ≠ 0.`,
          },
          {
            n: "3",
            marks: 2,
            text: `Find the coefficient of x5 in the product (1 + 2x)6 (1 – x)7 using binomial theorem.`,
          },
          {
            n: "4",
            marks: 3,
            text: `If a and b are distinct integers, prove that a – b is a factor of an – bn, whenever
n is a positive integer.
[Hint write an = (a – b + b)n and expand]`,
          },
          {
            n: "5",
            marks: 2,
            text: `Evaluate ( ) ( )
6 6
3 2 3 2	+ − − .`,
          },
          {
            n: "6",
            marks: 2,
            text: `Find the value of ( ) ( )
4 4
2 2 2 2
1 1	a a a a	+ − + − − .`,
          },
          {
            n: "7",
            marks: 2,
            text: `Find an approximation of (0.99)5 using the first three terms of its expansion.`,
          },
          {
            n: "8",
            marks: 2,
            text: `Find n, if the ratio of the fifth term from the beginning to the fifth term from the
end in the expansion of 4
4
1
2 3
n
 
+	 
  is 1	:	6 .

176 MATHEMATICS`,
          },
          {
            n: "9",
            marks: 2,
            text: `Expand using Binomial Theorem
4
2
1 0
2
x , x
x
 
+ − ≠	 
  .`,
          },
          {
            n: "10",
            marks: 3,
            text: `Find the expansion of (3x2 – 2ax + 3a2)3 using binomial theorem.
Summary
®The expansion of a binomial for any positive integral n is given by Binomial
Theorem, which is (a + b)n = nC0an + nC1an – 1b + nC2an – 2b2 + ...+
nCn – 1a.bn – 1 + nCnbn.
®The coefficients of the expansions are arranged in an array. This array is
called Pascal’s triangle.
®The general term of an expansion (a + b)n is Tr + 1 = nCran – r. br.
®In the expansion (a + b)n, if n is even, then the middle term is the 1
2
th
n	 
+	 
 
term.If n is odd, then the middle terms are 1
2
th
n +	 
 
  and 1 1
2
th
n+	 
+	 
  terms.
Historical Note
The ancient Indian mathematicians knew about the coefficients in the
expansions of (x + y)n, 0 ≤ n ≤ 7. The arrangement of these coefficients was in
the form of a diagram called Meru-Prastara, provided by Pingla in his book
Chhanda shastra (200B.C.). This triangular arrangement is also found in the
work of Chinese mathematician Chu-shi-kie in 1303. The term binomial coefficients
was first introduced by the German mathematician, Michael Stipel (1486-1567) in
approximately 1544. Bombelli (1572) also gave the coefficients in the expansion of
(a + b)n, for n = 1,2 ...,7 and Oughtred (1631) gave them for n = 1, 2,..., 10. The
arithmetic triangle, popularly known as Pascal’s triangle and similar to the Meru-
Prastara of Pingla was constructed by the French mathematician Blaise Pascal
(1623-1662) in 1665.
The present form of the binomial theorem for integral values of n appeared in
Trate du triange arithmetic, written by Pascal and published posthumously in
1665.
— v	v	v	v	v —`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 9,
    chapterName: "Sequences and Series",
    exercises: [
      {
        exercise: "9.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `an = n (n + 2) 2. an = 1
n
n + 3. an = 2n`,
          },
        ],
      },
      {
        exercise: "9.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Find the sum of odd integers from 1 to 2001.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Find the sum of all natural numbers lying between 100 and 1000, which are
multiples of 5.`,
          },
          {
            n: "3",
            marks: 3,
            text: `In an A.P., the first term is 2 and the sum of the first five terms is one-fourth of
the next five terms. Show that 20th term is –112.`,
          },
          {
            n: "4",
            marks: 2,
            text: `How many terms of the A.P. – 6, 11
2
− , – 5, … are needed to give the sum –25?`,
          },
          {
            n: "5",
            marks: 3,
            text: `In an A.P., if pth term is 1
q and qth term is 1
p , prove that the sum of first pq
terms is 1
2 (pq +1), where p ≠ q.`,
          },
          {
            n: "6",
            marks: 2,
            text: `If the sum of a certain number of terms of the A.P. 25, 22, 19, … is 116. Find the
last term.`,
          },
          {
            n: "7",
            marks: 2,
            text: `Find the sum to n terms of the A.P., whose kth term is 5k + 1.`,
          },
          {
            n: "8",
            marks: 2,
            text: `If the sum of n terms of an A.P. is (pn + qn2), where p and q are constants,
find the common difference.`,
          },
          {
            n: "9",
            marks: 2,
            text: `The sums of n terms of two arithmetic progressions are in the ratio
5n + 4 : 9n + 6. Find the ratio of their 18th terms.`,
          },
          {
            n: "10",
            marks: 2,
            text: `If the sum of first p terms of an A.P. is equal to the sum of the first q terms, then
find the sum of the first (p + q) terms.`,
          },
          {
            n: "11",
            marks: 3,
            text: `Sum of the first p, q and r terms of an A.P. are a, b and c, respectively.
Prove that ( ) ( ) ( ) 0
a b c
q r r p p q
p q r
− + − + − =`,
          },
          {
            n: "12",
            marks: 3,
            text: `The ratio of the sums of m and n terms of an A.P. is m2 : n2. Show that the ratio
of mth and nth term is (2m – 1) : (2n – 1).`,
          },
          {
            n: "13",
            marks: 2,
            text: `If the sum of n terms of an A.P. is 3n2 + 5n and its mth term is 164, find the value
of m.`,
          },
          {
            n: "14",
            marks: 2,
            text: `Insert five numbers between 8 and 26 such that the resulting sequence is an A.P.`,
          },
          {
            n: "15",
            marks: 2,
            text: `If 1 1
n n
n n
a b
a b− −
+
+ is the A.M. between a and b, then find the value of n.`,
          },
          {
            n: "16",
            marks: 2,
            text: `Between 1 and 31, m numbers have been inserted in such a way that the resulting
sequence is an A. P. and the ratio of 7th and (m – 1)th numbers is 5 : 9. Find the
value of m.

186 MATHEMATICS`,
          },
          {
            n: "17",
            marks: 2,
            text: `A man starts repaying a loan as first instalment of Rs. 100. If he increases the
instalment by Rs 5 every month, what amount he will pay in the 30th instalment?`,
          },
          {
            n: "18",
            marks: 2,
            text: `The difference between any two consecutive interior angles of a polygon is 5°.
If the smallest angle is 120° , find the number of the sides of the polygon.`,
          },
        ],
      },
      {
        exercise: "9.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Find the 20th and nth terms of the G.P. 5 5 5
2 4 8
, , , ...`,
          },
          {
            n: "2",
            marks: 2,
            text: `Find the 12th term of a G.P. whose 8th term is 192 and the common ratio is 2.`,
          },
          {
            n: "3",
            marks: 2,
            text: `The 5th, 8th and 11th terms of a G.P. are p, q and s, respectively. Show
that q2 = ps.`,
          },
          {
            n: "4",
            marks: 2,
            text: `The 4th term of a G.P. is square of its second term, and the first term is – 3.
Determine its 7th term.`,
          },
          {
            n: "5",
            marks: 2,
            text: `Which term of the following sequences:
(a) 2 2 2 4 is 128 ?	, , ,... (b) 3 3 3 3 is729 ?	, , ,...
(c) 1 1 1 1
is
3 9 27 19683
, , ,... ?`,
          },
          {
            n: "6",
            marks: 2,
            text: `For what values of x, the numbers 2 7
7 2
– , x, – are in G.P.?
Find the sum to indicated number of terms in each of the geometric progressions in
Exercises 7 to 10:`,
          },
          {
            n: "7",
            marks: 2,
            text: `0.15, 0.015, 0.0015, ... 20 terms.`,
          },
          {
            n: "8",
            marks: 2,
            text: `7 , 21 , 3 7 , ... n terms.`,
          },
          {
            n: "9",
            marks: 2,
            text: `1, – a, a2, – a3, ... n terms (if a ≠ – 1).`,
          },
          {
            n: "10",
            marks: 2,
            text: `x3, x5, x7, ... n terms (if x ≠ ± 1).`,
          },
          {
            n: "11",
            marks: 2,
            text: `Evaluate
11
1
(2 3 )k
k =
+	∑ .`,
          },
          {
            n: "12",
            marks: 2,
            text: `The sum of first three terms of a G.P. is 39
10 and their product is 1. Find the
common ratio and the terms.`,
          },
          {
            n: "13",
            marks: 2,
            text: `How many terms of G.P. 3, 32, 33, … are needed to give the sum 120?`,
          },
          {
            n: "14",
            marks: 2,
            text: `The sum of first three terms of a G.P. is 16 and the sum of the next three terms is
128. Determine the first term, the common ratio and the sum to n terms of the G.P.`,
          },
          {
            n: "15",
            marks: 2,
            text: `Given a G.P. with a = 729 and 7th term 64, determine S7.`,
          },
          {
            n: "16",
            marks: 2,
            text: `Find a G.P. for which sum of the first two terms is – 4 and the fifth term is
4 times the third term.`,
          },
          {
            n: "17",
            marks: 3,
            text: `If the 4th, 10th and 16th terms of a G.P. are x, y and z, respectively. Prove that x,
y, z are in G.P.

SEQUENCES AND SERIES 193`,
          },
          {
            n: "18",
            marks: 2,
            text: `Find the sum to n terms of the sequence, 8, 88, 888, 8888… .`,
          },
          {
            n: "19",
            marks: 2,
            text: `Find the sum of the products of the corresponding terms of the sequences 2, 4, 8,
16, 32 and 128, 32, 8, 2, 1`,
          },
          {
            n: "20",
            marks: 2,
            text: `Find four numbers forming a geometric progression in which the third term is
greater than the first term by 9, and the second term is greater than the 4th by 18.`,
          },
          {
            n: "21",
            marks: 3,
            text: `If the pth, qth and rth terms of a G.P. are a, b and c, respectively. Prove that
aq – r br – pcP – q = 1.`,
          },
          {
            n: "22",
            marks: 3,
            text: `If the first and the nth term of a G.P. are a and b, respectively, and if P is the
product of n terms, prove that P2 = (ab)n.`,
          },
          {
            n: "23",
            marks: 3,
            text: `Show that the ratio of the sum of first n terms of a G.P. to the sum of terms from
(n + 1)th to (2n)th term is 1
n
r .`,
          },
          {
            n: "24",
            marks: 3,
            text: `If a, b, c and d are in G.P. show that
(a2 + b2 + c2) (b2 + c2 + d2) = (ab + bc + cd)2 .`,
          },
          {
            n: "25",
            marks: 2,
            text: `Insert two numbers between 3 and 81 so that the resulting sequence is G.P.`,
          },
          {
            n: "26",
            marks: 2,
            text: `Find the value of n so that a b
a b
n n
n n
+ +
+
+
1 1
may be the geometric mean between
a and b.`,
          },
          {
            n: "27",
            marks: 3,
            text: `The sum of two numbers is 6 times their geometric mean, show that numbers
are in the ratio ( ) ( )	3 2 2 : 3 2 2	+ − .`,
          },
          {
            n: "28",
            marks: 3,
            text: `If A and G be A.M. and G.M., respectively between two positive numbers,
prove that the numbers are A A G A G	( )( )	± + − .`,
          },
          {
            n: "29",
            marks: 2,
            text: `The number of bacteria in a certain culture doubles every hour. If there were 30
bacteria present in the culture originally, how many bacteria will be present at the
end of 2nd hour, 4th hour and nth hour ?`,
          },
          {
            n: "30",
            marks: 2,
            text: `What will Rs 500 amounts to in 10 years after its deposit in a bank which pays
annual interest rate of 10% compounded annually?`,
          },
        ],
      },
      {
        exercise: "9.4",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `1 × 2 + 2 × 3 + 3 × 4 + 4 × 5 +... 2. 1 × 2 × 3 + 2 × 3 × 4 + 3 × 4 × 5 + ...`,
          },
          {
            n: "2",
            marks: 2,
            text: `3 × 12 + 5 × 22 + 7 × 32 + ... 4. 1 1 1
1 2 2 3 3 4
+ + +
× × × ...`,
          },
          {
            n: "3",
            marks: 3,
            text: `Let the sum of n, 2n, 3n terms of an A.P. be S1, S2 and S3, respectively, show that
S3 = 3(S2 – S1)`,
          },
          {
            n: "4",
            marks: 2,
            text: `Find the sum of all numbers between 200 and 400 which are divisible by 7.`,
          },
          {
            n: "5",
            marks: 2,
            text: `Find the sum of integers from 1 to 100 that are divisible by 2 or 5.`,
          },
          {
            n: "6",
            marks: 2,
            text: `Find the sum of all two digit numbers which when divided by 4, yields 1 as
remainder.`,
          },
          {
            n: "7",
            marks: 2,
            text: `If f is a function satisfying f (x +y) = f(x) f(y) for all x, y ∈ N such that
f(1) = 3 and 1
( ) 120
n
x
f x
=
=	∑ , find the value of n.`,
          },
          {
            n: "8",
            marks: 2,
            text: `The sum of some terms of G.P. is 315 whose first term and the common ratio are
5 and 2, respectively. Find the last term and the number of terms.`,
          },
          {
            n: "9",
            marks: 2,
            text: `The first term of a G.P. is 1. The sum of the third term and fifth term is 90.
Find the common ratio of G.P.`,
          },
          {
            n: "10",
            marks: 2,
            text: `The sum of three numbers in G.P. is 56. If we subtract 1, 7, 21 from these numbers
in that order, we obtain an arithmetic progression. Find the numbers.`,
          },
          {
            n: "11",
            marks: 2,
            text: `A G.P. consists of an even number of terms. If the sum of all the terms is 5 times
the sum of terms occupying odd places, then find its common ratio.`,
          },
          {
            n: "12",
            marks: 2,
            text: `The sum of the first four terms of an A.P. is 56. The sum of the last four terms is
112. If its first term is 11, then find the number of terms.`,
          },
          {
            n: "13",
            marks: 3,
            text: `If a bx
a bx
b cx
b cx
c dx
c dx x
+
− = +
− = +
− ≠	( ) ,	0 then show that a, b, c and d are in G.P.`,
          },
          {
            n: "14",
            marks: 3,
            text: `Let S be the sum, P the product and R the sum of reciprocals of n terms in a G.P.
Prove that P2Rn = Sn.`,
          },
          {
            n: "15",
            marks: 3,
            text: `The pth, qth and rth terms of an A.P. are a, b, c, respectively. Show that
(q – r )a + (r – p )b + (p – q )c = 0`,
          },
          {
            n: "16",
            marks: 3,
            text: `If 1 1 1 1 1 1
a ,b ,c
b c c a a b
     
+ + +	     
      are in A.P., prove that a, b, c are in A.P.`,
          },
          {
            n: "17",
            marks: 3,
            text: `If a, b, c, d are in G.P, prove that (an + bn), (bn + cn), (cn + dn) are in G.P.`,
          },
          {
            n: "18",
            marks: 3,
            text: `If a and b are the roots of x2 – 3x + p = 0 and c, d are roots of x2 – 12x + q = 0,
where a, b, c, d form a G.P. Prove that (q + p) : (q – p) = 17:15.

200 MATHEMATICS`,
          },
          {
            n: "19",
            marks: 2,
            text: `The ratio of the A.M. and G.M. of two positive numbers a and b, is m : n. Show
that ( ) ( )2 2 2 2
:	a b m m – n : m – m – n	= + .`,
          },
          {
            n: "20",
            marks: 3,
            text: `If a, b, c are in A.P.; b, c, d are in G.P. and 1 1 1
, ,
c d e are in A.P. prove that a, c, e
are in G.P.`,
          },
          {
            n: "21",
            marks: 2,
            text: `Find the sum of the following series up to n terms:
(i) 5 + 55 +555 + … (ii) .6 +. 66 +. 666+…`,
          },
          {
            n: "22",
            marks: 2,
            text: `Find the 20th term of the series 2 × 4 + 4 × 6 + 6 × 8 + ... + n terms.`,
          },
          {
            n: "23",
            marks: 2,
            text: `Find the sum of the first n terms of the series: 3+ 7 +13 +21 +31 +…`,
          },
          {
            n: "24",
            marks: 3,
            text: `If S1, S2, S3 are the sum of first n natural numbers, their squares and their
cubes, respectively, show that 9 2
2	S = S3 (1 + 8S1).`,
          },
          {
            n: "25",
            marks: 2,
            text: `Find the sum of the following series up to n terms:
3 3 3 3 3 3
1 1 2 1 2 3
1 1 3 1 3 5 ...
+ + +
+ + +
+ + +`,
          },
          {
            n: "26",
            marks: 3,
            text: `Show that
2 2 2
2 2 2
1 2 2 3 ( 1) 3 5
3 1	1 2 2 3 ( 1)
... n n n
n	... n n
× + × + + × + +
= +	× + × + + × + .`,
          },
          {
            n: "27",
            marks: 2,
            text: `A farmer buys a used tractor for Rs 12000. He pays Rs 6000 cash and agrees to
pay the balance in annual instalments of Rs 500 plus 12% interest on the unpaid
amount. How much will the tractor cost him?`,
          },
          {
            n: "28",
            marks: 2,
            text: `Shamshad Ali buys a scooter for Rs 22000. He pays Rs 4000 cash and agrees to
pay the balance in annual instalment of Rs 1000 plus 10% interest on the unpaid
amount. How much will the scooter cost him?`,
          },
          {
            n: "29",
            marks: 2,
            text: `A person writes a letter to four of his friends. He asks each one of them to copy
the letter and mail to four different persons with instruction that they move the
chain similarly. Assuming that the chain is not broken and that it costs 50 paise to
mail one letter. Find the amount spent on the postage when 8th set of letter is
mailed.`,
          },
          {
            n: "30",
            marks: 2,
            text: `A man deposited Rs 10000 in a bank at the rate of 5% simple interest annually.
Find the amount in 15th year since he deposited the amount and also calculate the
total amount after 20 years.`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 10,
    chapterName: "Straight Lines",
    exercises: [
      {
        exercise: "10.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Draw a quadrilateral in the Cartesian plane, whose vertices are (– 4, 5), (0, 7),
(5, – 5) and (– 4, –2). Also, find its area.`,
          },
          {
            n: "2",
            marks: 2,
            text: `The base of an equilateral triangle with side 2a lies along the y-axis such that the
mid-point of the base is at the origin. Find vertices of the triangle.`,
          },
          {
            n: "3",
            marks: 2,
            text: `Find the distance between P (x1, y1) and Q (x2, y2) when : (i) PQ is parallel to the
y-axis, (ii) PQ is parallel to the x-axis.`,
          },
          {
            n: "4",
            marks: 2,
            text: `Find a point on the x-axis, which is equidistant from the points (7, 6) and (3, 4).`,
          },
          {
            n: "5",
            marks: 2,
            text: `Find the slope of a line, which passes through the origin, and the mid-point of the
line segment joining the points P (0, – 4) and B (8, 0).
Fig 10.9

212 MATHEMATICS`,
          },
          {
            n: "6",
            marks: 3,
            text: `Without using the Pythagoras theorem, show that the points (4, 4), (3, 5) and
(–1, –1) are the vertices of a right angled triangle.`,
          },
          {
            n: "7",
            marks: 2,
            text: `Find the slope of the line, which makes an angle of 30° with the positive direction
of y-axis measured anticlockwise.`,
          },
          {
            n: "8",
            marks: 2,
            text: `Find the value of x for which the points (x, – 1), (2,1) and (4, 5) are collinear.`,
          },
          {
            n: "9",
            marks: 3,
            text: `Without using distance formula, show that points (– 2, – 1), (4, 0), (3, 3) and (–3, 2)
are the vertices of a parallelogram.`,
          },
          {
            n: "10",
            marks: 2,
            text: `Find the angle between the x-axis and the line joining the points (3,–1) and (4,–2).`,
          },
          {
            n: "11",
            marks: 2,
            text: `The slope of a line is double of the slope of another line. If tangent of the angle
between them is 3
1 , find the slopes of the lines.`,
          },
          {
            n: "12",
            marks: 3,
            text: `A line passes through (x1, y1) and (h, k). If slope of the line is m, show that
k – y1 = m (h – x1).`,
          },
          {
            n: "13",
            marks: 3,
            text: `If three points (h, 0), (a, b) and (0, k) lie on a line, show that 1	=	+ k
b
h
a .`,
          },
          {
            n: "14",
            marks: 2,
            text: `Consider the following population and year graph (Fig 10.10), find the slope of the
line AB and using it, find what will be the population in the year 2010?`,
          },
        ],
      },
      {
        exercise: "10.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Write the equations for the x-and y-axes.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Passing through the point (– 4, 3) with slope 2`,
          },
          {
            n: "3",
            marks: 2,
            text: `Passing through ( )	3	2	,	2 and inclined with the x-axis at an angle of 75o.`,
          },
          {
            n: "4",
            marks: 2,
            text: `Intersecting the x-axis at a distance of 3 units to the left of origin with slope –2.`,
          },
          {
            n: "5",
            marks: 2,
            text: `Intersecting the y-axis at a distance of 2 units above the origin and making an
angle of 30o with positive direction of the x-axis.`,
          },
          {
            n: "6",
            marks: 2,
            text: `Passing through the points (–1, 1) and (2, – 4).

220 MATHEMATICS`,
          },
          {
            n: "7",
            marks: 2,
            text: `Perpendicular distance from the origin is 5 units and the angle made by the
perpendicular with the positive x-axis is 300.`,
          },
          {
            n: "8",
            marks: 2,
            text: `The vertices of ∆ PQR are P (2, 1), Q (–2, 3) and R (4, 5). Find equation of the
median through the vertex R.`,
          },
          {
            n: "9",
            marks: 2,
            text: `Find the equation of the line passing through (–3, 5) and perpendicular to the line
through the points (2, 5) and (–3, 6).`,
          },
          {
            n: "10",
            marks: 2,
            text: `A line perpendicular to the line segment joining the points (1, 0) and (2, 3) divides
it in the ratio 1: n. Find the equation of the line.`,
          },
          {
            n: "11",
            marks: 2,
            text: `Find the equation of a line that cuts off equal intercepts on the coordinate axes
and passes through the point (2, 3).`,
          },
          {
            n: "12",
            marks: 2,
            text: `Find equation of the line passing through the point (2, 2) and cutting off intercepts
on the axes whose sum is 9.`,
          },
          {
            n: "13",
            marks: 2,
            text: `Find equation of the line through the point (0, 2) making an angle 2π
3 with the
positive x-axis. Also, find the equation of line parallel to it and crossing the y-axis
at a distance of 2 units below the origin.`,
          },
          {
            n: "14",
            marks: 2,
            text: `The perpendicular from the origin to a line meets it at the point (–2, 9), find the
equation of the line.`,
          },
          {
            n: "15",
            marks: 2,
            text: `The length L (in centimetre) of a copper rod is a linear function of its Celsius
temperature C. In an experiment, if L = 124.942 when C = 20 and L= 125.134
when C = 110, express L in terms of C.`,
          },
          {
            n: "16",
            marks: 2,
            text: `The owner of a milk store finds that, he can sell 980 litres of milk each week at
Rs 14/litre and 1220 litres of milk each week at Rs 16/litre. Assuming a linear
relationship between selling price and demand, how many litres could he sell
weekly at Rs 17/litre?`,
          },
          {
            n: "17",
            marks: 3,
            text: `P (a, b) is the mid-point of a line segment between axes. Show that equation
of the line is 2	=	+ b
y
a
x .`,
          },
          {
            n: "18",
            marks: 2,
            text: `Point R (h, k) divides a line segment between the axes in the ratio 1: 2. Find
equation of the line.`,
          },
          {
            n: "19",
            marks: 3,
            text: `By using the concept of equation of a line, prove that the three points (3, 0),
(– 2, – 2) and (8, 2) are collinear.`,
          },
        ],
      },
      {
        exercise: "10.3",
        questions: [
          {
            n: "1",
            marks: 3,
            text: `Reduce the following equations into slope - intercept form and find their slopes
and the y - intercepts.
(i) x + 7y = 0, (ii) 6x + 3y – 5 = 0, (iii) y = 0.`,
          },
          {
            n: "2",
            marks: 3,
            text: `Reduce the following equations into intercept form and find their intercepts on
the axes.
(i) 3x + 2y – 12 = 0, (ii) 4x – 3y = 6, (iii) 3y + 2 = 0.`,
          },
          {
            n: "3",
            marks: 3,
            text: `Reduce the following equations into normal form. Find their perpendicular distances
from the origin and angle between perpendicular and the positive x-axis.
(i) x – 3y + 8 = 0, (ii) y – 2 = 0, (iii) x – y = 4.`,
          },
          {
            n: "4",
            marks: 2,
            text: `Find the distance of the point (–1, 1) from the line 12(x + 6) = 5(y – 2).`,
          },
          {
            n: "5",
            marks: 2,
            text: `Find the points on the x-axis, whose distances from the line 1
3 4
x y
+ = are 4 units.`,
          },
          {
            n: "6",
            marks: 2,
            text: `Find the distance between parallel lines
(i) 15x + 8y – 34 = 0 and 15x + 8y + 31 = 0 (ii) l (x + y) + p = 0 and l (x + y) – r = 0.

228 MATHEMATICS`,
          },
          {
            n: "7",
            marks: 2,
            text: `Find equation of the line parallel to the line 3 4 2 0	x y	− + = and passing through
the point (–2, 3).`,
          },
          {
            n: "8",
            marks: 2,
            text: `Find equation of the line perpendicular to the line x – 7y + 5 = 0 and having
x intercept 3.`,
          },
          {
            n: "9",
            marks: 2,
            text: `Find angles between the lines .	1	3	and	1	3 =	+	=	+ y	x	y	x`,
          },
          {
            n: "10",
            marks: 2,
            text: `The line through the points (h, 3) and (4, 1) intersects the line 7 9 19 0	x y .	− − =
at right angle. Find the value of h.`,
          },
          {
            n: "11",
            marks: 3,
            text: `Prove that the line through the point (x1, y1) and parallel to the line Ax + By + C = 0 is
A (x –x1) + B (y – y1) = 0.`,
          },
          {
            n: "12",
            marks: 2,
            text: `Two lines passing through the point (2, 3) intersects each other at an angle of 60o.
If slope of one line is 2, find equation of the other line.`,
          },
          {
            n: "13",
            marks: 2,
            text: `Find the equation of the right bisector of the line segment joining the points (3, 4)
and (–1, 2).`,
          },
          {
            n: "14",
            marks: 2,
            text: `Find the coordinates of the foot of perpendicular from the point (–1, 3) to the
line 3x – 4y – 16 = 0.`,
          },
          {
            n: "15",
            marks: 2,
            text: `The perpendicular from the origin to the line y = mx + c meets it at the point
(–1, 2). Find the values of m and c.`,
          },
          {
            n: "16",
            marks: 3,
            text: `If p and q are the lengths of perpendiculars from the origin to the
lines θ	2	cos	θ	sin	θ	cos k	y	x =	− and x sec θ + y cosec θ = k, respectively, prove
that p2 + 4q2 = k2.`,
          },
          {
            n: "17",
            marks: 2,
            text: `In the triangle ABC with vertices A (2, 3), B (4, –1) and C (1, 2), find the equation
and length of altitude from the vertex A.`,
          },
          {
            n: "18",
            marks: 3,
            text: `If p is the length of perpendicular from the origin to the line whose intercepts on
the axes are a and b, then show that .
1	1	1
2	2	2
b	a	p +	=
Miscellaneous Examples
Example 20 If the lines 2 3 0 5 3 0	x y , x ky	+ − = + − = and 3 2 0	x y	− − = are
concurrent, find the value of k.
Solution Three lines are said to be concurrent, if they pass through a common point,
i.e., point of intersection of any two lines lies on the third line. Here given lines are
2x + y – 3 = 0 ... (1)
5x + ky – 3 = 0 ... (2)

STRAIGHT LINES 229
3x – y – 2 = 0 ... (3)
Solving (1) and (3) by cross-multiplication method, we get
1
= = or = 1, = 1
–2 – 3 –9 + 4 –2 – 3
x y x y .
Therefore, the point of intersection of two lines is (1, 1). Since above three lines are
concurrent, the point (1, 1) will satisfy equation (2) so that
5.1 + k .1 – 3 = 0 or k = – 2.
Example 21 Find the distance of the line 4x – y = 0 from the point P (4, 1) measured
along the line making an angle of 135° with the positive x-axis.
Solution Given line is 4x – y = 0 ... (1)
In order to find the distance of the
line (1) from the point P (4, 1) along
another line, we have to find the point
of intersection of both the lines. For
this purpose, we will first find the
equation of the second line
(Fig 10.21). Slope of second line is
tan 135° = –1. Equation of the line
with slope – 1 through the point
P (4, 1) is
y – 1 = – 1 (x – 4) or x + y – 5 = 0 ... (2)
Solving (1) and (2), we get x = 1 and y = 4 so that point of intersection of the two lines
is Q (1, 4). Now, distance of line (1) from the point P (4, 1) along the line (2)
= the distance between the points P (4, 1) and Q (1, 4).
= ( ) ( )2 21 4 4 1 3 2 units .	− + − =
Example 22 Assuming that straight lines work as the plane mirror for a point, find
the image of the point (1, 2) in the line x – 3y + 4 = 0.
Solution Let Q (h, k) is the image of the point P (1, 2) in the line
x – 3y + 4 = 0 ... (1)
Fig 10.21
(1, 4)

230 MATHEMATICS
Therefore, the line (1) is the perpendicular bisector of line segment PQ (Fig 10.22).
Hence Slope of line PQ = 1
Slope of line 3 4 0	x y
−
− + = ,
so that 2 1 or 3 5
1	1
3
k h k
h
− −
= + =
− ... (2)
and the mid-point of PQ, i.e., point 




…`,
          },
          {
            n: "19",
            marks: 2,
            text: `If the lines y = 3x +1 and 2y = x + 3 are equally inclined to the line y = mx + 4, find
the value of m.`,
          },
          {
            n: "20",
            marks: 3,
            text: `If sum of the perpendicular distances of a variable point P (x, y) from the lines
x + y – 5 = 0 and 3x – 2y +7 = 0 is always 10. Show that P must move on a line.`,
          },
          {
            n: "21",
            marks: 2,
            text: `Find equation of the line which is equidistant from parallel lines 9x + 6y – 7 = 0
and 3x + 2y + 6 = 0.`,
          },
          {
            n: "22",
            marks: 2,
            text: `A ray of light passing through the point (1, 2) reflects on the x-axis at point A and the
reflected ray passes through the point (5, 3). Find the coordinates of A.`,
          },
          {
            n: "23",
            marks: 3,
            text: `Prove that the product of the lengths of the perpendiculars drawn from the
points ( )2 2 0	a b ,	− and ( )2 2 0	a b ,	− − to the line 2
cosθ sin θ 1is
x y b
a b
+ = .`,
          },
          {
            n: "24",
            marks: 2,
            text: `A person standing at the junction (crossing) of two straight paths represented by
the equations 2x – 3y + 4 = 0 and 3x + 4y – 5 = 0 wants to reach the path whose
equation is 6x – 7y + 8 = 0 in the least time. Find equation of the path that he
should follow.
Summary
®Slope (m) of a non-vertical line passing through the points (x1, y1) and (x2, y2)
is given by 2 1 1 2 1 2
2 1 1 2
y y y y
m x x	, .
x x x x
− −
= = ≠
− −
® If a line makes an angle á with the positive direction of x-axis, then the slope
of the line is given by m = tan α, α ≠ 90°.
®Slope of horizontal line is zero and slope of vertical line is undefined.

STRAIGHT LINES 235
® An acute angle (say θ) between lines L1 and L2 with slopes m1 and m2 is
given by 2 1
1 2
1 2
tanθ 1 0
1
m – m , m m
m m
= + ≠
+ .
®Two lines are parallel if and only if their slopes are equal.
®Two lines are perpendicular if and only if product of their slopes is –1.
®Three points A, B and C are collinear, if and only if slope of AB = slope of BC.
®Equation of the horizontal line having distance a from the x-axis is either
y = a or y = – a.
®Equation of the vertical line having distance b from the y-axis is either
x = b or x = – b.
®The point (x, y) lies on the line with slope m and through the fixed point (xo, yo),
if and only if its coordinates satisfy the equation y – yo = m (x – xo).
® Equation of the line passing through the points (x1, y1) and (x2, y2) is given by
).	( 1
1	2
1	2
1 x	x
x	x
y	y
y	y −
−
−
=	−
®The point (x, y) on the line with slope m and y-intercept c lies on the line if and
only if y = mx + c.
®If a line with slope m makes x-intercept d. Then equation of the line is
y = m (x – d).
®Equation of a line making intercepts a and b on the x-and y-axis,
respectively, is 1	=	+ b
y
a
x .
®The equation of the line having normal distance from origin p and angle between
normal and the positive x-axis ω is given by p	y	x =	+ ω	sin	ω	cos .
®Any equation of the form Ax + By + C = 0, with A and B are not zero,
simultaneously, is called the general linear equation or general equation of
a line.
®The perpendicular distance (d) of a line Ax + By+ C = 0 from a point (x1, y1)
is given by 1 1
2 2
A B C
A B
x y
d + +
= + .
®Distan…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 11,
    chapterName: "Conic Sections",
    exercises: [
      {
        exercise: "11.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `centre (0,2) and radius 2 2. centre (–2,3) and radius 4`,
          },
          {
            n: "2",
            marks: 2,
            text: `centre ( 4
1
,
2`,
          },
          {
            n: "3",
            marks: 2,
            text: `When the axis of symmetry is along the y-axis the parabola opens
(c) upwards if the coefficient of y is positive.
(d) downwards if the coefficient of y is negative.

CONIC SECTIONS 245
11.4.2 Latus rectum
Definition 3 Latus rectum of a parabola is a line segment perpendicular to the axis of
the parabola, through the focus and whose end points lie on the parabola (Fig11.17).
To find the Length of the latus rectum of the parabola y2 = 4ax (Fig 11.18).
By the definition of the parabola, AF = AC.
But AC = FM = 2a
Hence AF = 2a.
And since the parabola is symmetric with respect to x-axis AF = FB and so
AB = Length of the latus rectum = 4a.
Fig 11.17 Fig 11.18
Example 5 Find the coordinates of the focus, axis,
the equation of the directrix and latus rectum of
the parabola y2 = 8x.
Solution The given equation involves y2, so the
axis of symmetry is along the x-axis.
The coefficient of x is positive so the parabola opens
to the right. Comparing with the given equation
y2 = 4ax, we find that a = 2.
Thus, the focus of the parabola is (2, 0) and the equation of the directrix of the parabola
is x = – 2 (Fig 11.19).
Length of the latus rectum is 4a = 4 × 2 = 8.
Fig 11.19

246 MATHEMATICS
Example 6 Find the equation of the parabola with focus (2,0) and directrix x = – 2.
Solution Since the focus (2,0) lies on the x-axis, the x-axis itself is the axis of the
parabola. Hence the equation of the parabola is of the form either
y2 = 4ax or y2 = – 4ax. Since the directrix is x = – 2 and the focus is (2,0), the parabola
is to be of the form y2 = 4ax with a = 2. Hence the required equation is
y2 = 4(2)x = 8x
Example 7 Find the equation of the parabola with vertex at (0, 0) and focus at (0, 2).
Solution Since the vertex is at (0,0) and the focus is at (0,2) which lies on y-axis, the
y-axis is the axis of the parabola. Therefore, equation of the parabola is of the form
x2 = 4ay. thus, we have
x2 = 4(2)y, i.e., x2 = 8y.
Example 8 Find the equation of the parabola which is symmetric about the y-axis, and
passes through the point (2,–3).
Solution Since the parabola is symmetric about y-axis and has its vertex at the origin,
the equation is of the form x2 = 4ay or x2 = – 4ay, where the sign…`,
          },
        ],
      },
      {
        exercise: "11.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `y2 = 12x 2. x2 = 6y 3. y2 = – 8x`,
          },
          {
            n: "2",
            marks: 2,
            text: `The foci always lie on the major axis. The major axis can be determined by
finding the intercepts on the axes of symmetry. That is, major axis is along the x-axis
if the coefficient of x2 has the larger denominator and it is along the y-axis if the
coefficient of y2 has the larger denominator.

252 MATHEMATICS
11.5.5 Latus rectum
Definition 6 Latus rectum of an ellipse is a
line segment perpendicular to the major axis
through any of the foci and whose end points
lie on the ellipse (Fig 11.28).
To find the length of the latus rectum
of the ellipse 1
x y
a b
2 2
2 2
+ =
Let the length of AF2 be l.
Then the coordinates of A are (c, l ),i.e.,
(ae, l )
Since A lies on the ellipse
2 2
2 2 1
x y
a b
+ = , we have
2 2
2 2
( ) 1
ae l
a b
+ =
⇒ l2 = b2 (1 – e2)
But
2 2 2 2
2
2 2 2
1
c a – b b
e –
a a a
= = =
Therefore l2 =
4
2
b
a , i.e.,
2
b
l a
=
Since the ellipse is symmetric with respect to y-axis (of course, it is symmetric w.r.t.
both the coordinate axes), AF2 = F2B and so length of the latus rectum is
2
2b
a .
Example 9 Find the coordinates of the foci, the vertices, the length of major axis, the
minor axis, the eccentricity and the latus rectum of the ellipse
2 2
1
25 9
x y
+ =
Solution Since denominator of
2
25
x is larger than the denominator of
2
9
y , the major
Fig 11. 28

CONIC SECTIONS 253
axis is along the x-axis. Comparing the given equation with
2 2
2 2 1
x y
a b
+ = , we get
a = 5 and b = 3. Also
2 2 25 9 4	c a – b –	= = =
Therefore, the coordinates of the foci are (– 4,0) and (4,0), vertices are (– 5, 0) and
(5, 0). Length of the major axis is 10 units length of the minor axis 2b is 6 units and the
eccentricity is 4
5 and latus rectum is
2
2 18
5
b
a = .
Example 10 Find the coordinates of the foci, the vertices, the lengths of major and
minor axes and the eccentricity of the ellipse 9x2 + 4y2 = 36.
Solution The given equation of the ellipse can be written in standard form as
2 2
1
4 9
x y
+ =
Since the denominator of
2
9
y is larger than the denominator of
2
4
x , the major axis is
along the y-axis. Comparing the given equation with the standard equation
2 2
2 2 1
x y
b a
+ = , we have b = 2 and a = 3.
Also c = 2 2
a – b = 9 4 5	– =
and 5
3
c
e a
= =
He…`,
          },
          {
            n: "3",
            marks: 2,
            text: `Example 11 Find the equation of the ellipse whose vertices are (± 13, 0) and foci are
(± 5, 0).
Solution Since the vertices are on x-axis, the equation will be of the form
2 2
2 2 1
x y
a b
+ = , where a is the semi-major axis.

254 MATHEMATICS
Given that a = 13, c = ± 5.
Therefore, from the relation c2 = a2 – b2, we get
25 = 169 – b2 , i.e., b = 12
Hence the equation of the ellipse is
2 2
1
169 144
x y
+ = .
Example 12 Find the equation of the ellipse, whose length of the major axis is 20 and
foci are (0, ± 5).
Solution Since the foci are on y-axis, the major axis is along the y-axis. So, equation
of the ellipse is of the form
2 2
2 2 1
x y
b a
+ = .
Given that
a = semi-major axis 20 10
2
= =
and the relation c2 = a2 – b2 gives
52 = 102 – b2 i.e., b2 = 75
Therefore, the equation of the ellipse is
2 2
1
75 100
x y
+ =
Example 13 Find the equation of the ellipse, with major axis along the x-axis and
passing through the points (4, 3) and (– 1,4).
Solution The standard form of the ellipse is 2
2
2
2
b
y
a
x + = 1. Since the points (4, 3)
and (–1, 4) lie on the ellipse, we have
1
9	16 2	2 =	+ b	a ... (1)
and 2	2
16	1
b	a + = 1 ….(2)
Solving equations (1) and (2), we find that 2 247
7
a = and 2 247
15
b = .
Hence the required equation is

CONIC SECTIONS 255
2 2
1
247	247
15	7
x y
+ =
 
 
 
, i.e., 7x2 + 15y2 = 247.`,
          },
        ],
      },
      {
        exercise: "11.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `2 2
1
36 16
x y
+ = 2.
2 2
1
4 25
x y
+ = 3.
2 2
1
16 9
x y
+ =`,
          },
          {
            n: "2",
            marks: 3,
            text: `The foci are always on the transverse axis. It is the positive term whose
denominator gives the transverse axis. For example,
2 2
1
9 16
x y
– =
has transverse axis along x-axis of length 6, while
2 2
1
25 16
y x
– =
has transverse axis along y-axis of length 10.
11.6.3 Latus rectum
Definition 9 Latus rectum of hyperbola is a line segment perpendicular to the transverse
axis through any of the foci and whose end points lie on the hyperbola.
As in ellipse, it is easy to show that the length of the latus rectum in hyperbola is
2
2b
a .
Example 14 Find the coordinates of the foci and the vertices, the eccentricity,the
length of the latus rectum of the hyperbolas:
(i)
2 2
1
9 16
x y
– = , (ii) y2 – 16x2 = 16
Solution (i) Comparing the equation
2 2
1
9 16
x y
– = with the standard equation
2 2
2 2 1
x y
–
a b =
Here, a = 3, b = 4 and c = 2 2 9 16 5	a b	+ = + =
Therefore, the coordinates of the foci are (± 5, 0) and that of vertices are (± 3, 0).Also,
The eccentricity e = 5
3
c
a = . The latus rectum
2
2 32
3
b
a
= =
(ii) Dividing the equation by 16 on both sides, we have
2 2
1
16 1
y x
– =
Comparing the equation with the standard equation
2 2
2 2 1
y x
–
a b = , we find that
a = 4, b = 1 and 2 2 16 1 17	c a b	= + = + = .

CONIC SECTIONS 261
Therefore, the coordinates of the foci are (0, ± 17 ) and that of the vertices are
(0, ± 4). Also,
The eccentricity 17
4
c
e a
= = . The latus rectum
2
2 1
2
b
a
= = .
Example 15 Find the equation of the hyperbola with foci (0, ± 3) and vertices
(0, ± 11
2 ).
Solution Since the foci is on y-axis, the equation of the hyperbola is of the form
2 2
2 2 1
y x
–
a b =
Since vertices are (0, ± 11
2 ), a = 11
2
Also, since foci are (0, ± 3); c = 3 and b2 = c2 – a2 = 25`,
          },
          {
            n: "3",
            marks: 2,
            text: `Therefore, the equation of the hyperbola is
2 2
11 25
4 4
y x
–
   
   
   
= 1, i.e., 100 y2 – 44 x2 = 275.
Example 16 Find the equation of the hyperbola where foci are (0, ±12) and the length
of the latus rectum is 36.
Solution Since foci are (0, ± 12), it follows that c = 12.
Length of the latus rectum = 36
2 2
=
a
b or b2 = 18a
Therefore c2 = a2 + b2; gives
144 = a2 + 18a
i.e., a2 + 18a – 144 = 0,
So a = – 24, 6.
Since a cannot be negative, we take a = 6 and so b2 = 108.
Therefore, the equation of the required hyperbola is
2 2
1
36 108
y x
– = , i.e., 3y2 – x2 = 108

262 MATHEMATICS
Fig 11.33`,
          },
        ],
      },
      {
        exercise: "11.4",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `2 2
1
16 9
x y
– = 2.
2 2
1
9 27
y x
– = 3. 9y2 – 4x2 = 36`,
          },
          {
            n: "2",
            marks: 2,
            text: `An arch is in the form of a parabola with its axis vertical. The arch is 10 m high
and 5 m wide at the base. How wide is it 2 m from the vertex of the parabola?`,
          },
          {
            n: "3",
            marks: 2,
            text: `The cable of a uniformly loaded suspension bridge hangs in the form of a parabola.
The roadway which is horizontal and 100 m long is supported by vertical wires
attached to the cable, the longest wire being 30 m and the shortest being 6 m.
Find the length of a supporting wire attached to the roadway 18 m from the
middle.`,
          },
          {
            n: "4",
            marks: 2,
            text: `An arch is in the form of a semi-ellipse. It is 8 m wide and 2 m high at the centre.
Find the height of the arch at a point 1.5 m from one end.`,
          },
          {
            n: "5",
            marks: 2,
            text: `A rod of length 12 cm moves with its ends always touching the coordinate axes.
Determine the equation of the locus of a point P on the rod, which is 3 cm from
the end in contact with the x-axis.`,
          },
          {
            n: "6",
            marks: 2,
            text: `Find the area of the triangle formed by the lines joining the vertex of the parabola
x2 = 12y to the ends of its latus rectum.`,
          },
          {
            n: "7",
            marks: 2,
            text: `A man running a racecourse notes that the sum of the distances from the two flag
posts from him is always 10 m and the distance between the flag posts is 8 m.
Find the equation of the posts traced by the man.`,
          },
          {
            n: "8",
            marks: 2,
            text: `An equilateral triangle is inscribed in the parabola y2 = 4 ax, where one vertex is
at the vertex of the parabola. Find the length of the side of the triangle.

CONIC SECTIONS 265
Summary
In this Chapter the following concepts and generalisations are studied.
®A circle is the set of all points in a plane that are equidistant from a fixed point
in the plane.
®The equation of a circle with centre (h, k) and the radius r is
(x – h)2 + (y – k)2 = r2.
®A parabola is the set of all points in a plane that are equidistant from a fixed
line and a fixed point in the plane.
®The equation of the parabola with focus at (a, 0) a > 0 and directrix x = – a is
y2 = 4ax.
®Latus rectum of a parabola is a line segment perpendicular to the axis of the
parabola, through the focus and whose end points lie on the parabola.
®Length of the latus rectum of the parabola y2 = 4ax is 4a.
®An ellipse is the set of all points in a plane, the sum of whose distances from
two fixed points in the plane is a constant.
®The equation of an ellipse with foci on the x-axis is
2 2
2 2 1
x y
+ =
a b .
®Latus rectum of an ellipse is a line segment perpendicular to the major axis
through any of the foci and whose end points lie on the ellipse.
®Length of the latus rectum of the ellipse
2 2
2 2
+ = 1
x y
a b is
2
2b
a .
®The eccentricity of an ellipse is the ratio between the distances from the centre
of the ellipse to one of the foci and to one of the vertices of the ellipse.
®A hyperbola is the set of all points in a plane, the difference of whose distances
from two fixed points in the plane is a constant.
®The equation of a hyperbola with foci on the x-axis is :
2 2
2 2 1
x y
a b
− =

266 MATHEMATICS
®Latus rectum of hyperbola is a line segment perpendicular to the transverse
axis through any of the foci and whose end points lie on the hyperbola.
®Length of the latus rectum of the hyperbola :
2 2
2 2 1
x y
a b
− = is :
2
2b
a .
®The eccentricity of a hyperbola is the ratio of the distances from the centre of
the hyperbola to one of the foci and to one of the vertices of the hyperbola.
Historical Note
Geometry is one of the most ancient branches of mathematics. The Greek
geometers investigated the propert…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 12,
    chapterName: "Introduction to Three Dimensional Geometry",
    exercises: [
      {
        exercise: "12.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `A point is on the x -axis. What are its y-coordinate and z-coordinates?`,
          },
          {
            n: "2",
            marks: 2,
            text: `A point is in the XZ-plane. What can you say about its y-coordinate?`,
          },
          {
            n: "3",
            marks: 2,
            text: `Name the octants in which the following points lie:
(1, 2, 3), (4, –2, 3), (4, –2, –5), (4, 2, –5), (– 4, 2, –5), (– 4, 2, 5),
(–3, –1, 6) (– 2, – 4, –7).`,
          },
          {
            n: "4",
            marks: 3,
            text: `Fill in the blanks:
(i) The x-axis and y-axis taken together determine a plane known as_______.
(ii) The coordinates of points in the XY-plane are of the form _______.
(iii) Coordinate planes divide the space into ______ octants.`,
          },
        ],
      },
      {
        exercise: "12.2",
        questions: [
          {
            n: "1",
            marks: 3,
            text: `Find the distance between the following pairs of points:
(i) (2, 3, 5) and (4, 3, 1) (ii) (–3, 7, 2) and (2, 4, –1)
(iii) (–1, 3, – 4) and (1, –3, 4) (iv) (2, –1, 3) and (–2, 1, 3).`,
          },
          {
            n: "2",
            marks: 3,
            text: `Show that the points (–2, 3, 5), (1, 2, 3) and (7, 0, –1) are collinear.`,
          },
          {
            n: "3",
            marks: 3,
            text: `Verify the following:
(i) (0, 7, –10), (1, 6, – 6) and (4, 9, – 6) are the vertices of an isosceles triangle.
(ii) (0, 7, 10), (–1, 6, 6) and (– 4, 9, 6) are the vertices of a right angled triangle.
(iii) (–1, 2, 1), (1, –2, 5), (4, –7, 8) and (2, –3, 4) are the vertices of a parallelogram.`,
          },
          {
            n: "4",
            marks: 2,
            text: `Find the equation of the set of points which are equidistant from the points
(1, 2, 3) and (3, 2, –1).`,
          },
          {
            n: "5",
            marks: 2,
            text: `Find the equation of the set of points P, the sum of whose distances from
A (4, 0, 0) and B (– 4, 0, 0) is equal to 10.`,
          },
        ],
      },
      {
        exercise: "12.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Find the coordinates of the point which divides the line segment joining the points
(– 2, 3, 5) and (1, – 4, 6) in the ratio (i) 2 : 3 internally, (ii) 2 : 3 externally.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Given that P (3, 2, – 4), Q (5, 4, – 6) and R (9, 8, –10) are collinear. Find the ratio
in which Q divides PR.`,
          },
          {
            n: "3",
            marks: 2,
            text: `Find the ratio in which the YZ-plane divides the line segment formed by joining
the points (–2, 4, 7) and (3, –5, 8).`,
          },
          {
            n: "4",
            marks: 3,
            text: `Using section formula, show that the points A (2, –3, 4), B (–1, 2, 1) and
1
C 0 2
3
, ,
 
 
  are collinear.`,
          },
          {
            n: "5",
            marks: 3,
            text: `Find the coordinates of the points which trisect the line segment joining the points
P (4, 2, – 6) and Q (10, –16, 6).
Miscellaneous Examples
Example 11 Show that the points A (1, 2, 3), B (–1, –2, –1), C (2, 3, 2) and
D (4, 7, 6) are the vertices of a parallelogram ABCD, but it is not a rectangle.
Solution To show ABCD is a parallelogram we need to show opposite side are equal
Note that.
AB = 2	2	2 )	3	1	(	)	2	2	(	)	1	1	( −	−	+	−	−	+	−	− = 4 16 16	+ + = 6
BC = 2	2	2 )	1	2	(	)	2	3	(	)	1	2	( +	+	+	+	+ = 9	25	9 +	+ = 43
CD = 2	2	2 )	2	6	(	)	3	7	(	)	2	4	( −	+	−	+	− = 6	16	16	4 =	+	+
DA = 2	2	2 )	6	3	(	)	7	2	(	)	4	1	( −	+	−	+	− = 43	9	25	9 =	+	+
Since AB = CD and BC = AD, ABCD is a parallelogram.
Now, it is required to prove that ABCD is not a rectangle. For this, we show that
diagonals AC and BD are unequal. We have

278 MATHEMATICS
AC = 3	1	1	1	)	3	2	(	)	2	3	(	)	1	2	( 2	2	2 =	+	+	=	−	+	−	+	−
BD = 155	49	81	25	)	1	6	(	)	2	7	(	)	1	4	( 2	2	2 =	+	+	=	+	+	+	+	+ .
Since AC ≠ BD, ABCD is not a rectangle.
ANote We can also show that ABCD is a parallelogram, using the property that
diagonals AC and BD bisect each other.
Example 12 Find the equation of the set of the points P such that its distances from
the points A (3, 4, –5) and B (– 2, 1, 4) are equal.
Solution If P (x, y, z) be any point such that PA = PB.
Now 2	2	2	2	2	2 )	4	(	)	1	(	)	2	(	)	5	(	)	4	(	)	3	( −	+	−	+	+	=	+	+	−	+	− z	y	x	z	y	x
or 2	2	2	2	2	2 )	4	(	)	1	(	)	2	(	)	5	(	)	4	(	)	3	( −	+	−	+	+	=	+	+	−	+	− z	y	x	z	y	x
or 10 x + 6y – 18z – 29 = 0.
Example 13 The centroid of a triangle ABC is at the point (1, 1, 1). If the coordinates
of A and B are (3, –5, 7) and (–1, 7, – 6), respectively, find the coordinates of the
point C.
Solution Let the coordinates of C be (x, y, z) and the coordinates of the centroid G be
(1, 1, 1). Then
x + − =
3 1
3 1, i.e., x = 1; y − + =
5 7
3 1, i.e., y = 1; z + − =
7 6
3 1, i.e., z = 2.
Hence, coordinates of C are (1, 1, 2).
Miscellaneous Exercise on Chapter 12`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 13,
    chapterName: "Limits and Derivatives",
    exercises: [
      {
        exercise: "13.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `3
lim 3
x
x
→
+ 2. π
22
lim 7	x x
→
 
−	 
  3. 2
1
lim π
r r
→`,
          },
        ],
      },
      {
        exercise: "13.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Find the derivative of x2 – 2 at x = 10.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Find the derivative of x at x = 1.`,
          },
          {
            n: "3",
            marks: 2,
            text: `Find the derivative of 99x at x = l00.`,
          },
          {
            n: "4",
            marks: 3,
            text: `Find the derivative of the following functions from first principle.
(i) 3 27	x − (ii) ( )( )	1 2	x x	− −
(iii) 2
1
x (iv) 1
1
x
x
+
−`,
          },
          {
            n: "5",
            marks: 3,
            text: `For the function
( ) 100 99 2
. . . 1
100 99 2
x x x
f x x	= + + + + + .

LIMITS AND DERIVATIVES 313
Prove that ( ) ( )	1 100 0	f f	′ ′	= .`,
          },
          {
            n: "6",
            marks: 2,
            text: `Find the derivative of 1 2 2 1
. . .n n n n n
x ax a x a x a− − −
+ + + + + for some fixed real
number a.`,
          },
          {
            n: "7",
            marks: 3,
            text: `For some constants a and b, find the derivative of
(i) ( ) ( )	x a x b	− − (ii) ( )2
2
ax b	+ (iii) x a
x b
−
−`,
          },
          {
            n: "8",
            marks: 2,
            text: `Find the derivative of
n n
x a
x a
−
− for some constant a.`,
          },
          {
            n: "9",
            marks: 5,
            text: `Find the derivative of
(i) 3
2 4
x − (ii) ( ) ( )3
5 3 1 1	x x x	+ − −
(iii) ( )3 5 3	x x− + (iv) ( )5 9
3 6	x x−
−
(v) ( )4 5
3 4	x x− −
− (vi)
2
2
1 3 1
x
x x
−
+ −`,
          },
          {
            n: "10",
            marks: 2,
            text: `Find the derivative of cos x from first principle.`,
          },
          {
            n: "11",
            marks: 5,
            text: `Find the derivative of the following functions:
(i) sin cos	x x (ii) sec x (iii) 5sec 4 cos	x x	+
(iv) cosec x (v) 3cot 5cosec	x x	+
(vi) 5sin 6cos 7	x x	− + (vii) 2 tan 7 sec	x x	−
Miscellaneous Examples
Example 19 Find the derivative of f from the first principle, where f is given by
(i) f (x) = 2 3
2
x
x
+
− (ii) f (x) = 1
x x
+
Solution (i) Note that function is not defined at x = 2. But, we have
( ) ( ) ( ) ( )
0 0
2 3 2 3
2 2	lim lim
h h
x h x
f x h f x x h x	f x h h	→ →
+ + +
−+ − + − −	′ = =

314 MATHEMATICS
= ( )( ) ( )( )
( )( )	0
2 2 3 2 2 3 2
lim 2 2	h
x h x x x h
h x x h	→
+ + − − + + −
− + −
= ( )( ) ( ) ( )( ) ( )
( )( )	0
2 3 2 2 2 2 3 2 2 3
lim 2 2	h
x x h x x x h x
h x x h	→
+ − + − − + − − +
− + −
= ( ) ( ) ( )2	0
–7 7
lim 2 2 2	h x x h x	→
= −
− + − −
Again, note that the function f ′ is also not defined at x = 2.
(ii) The function is not defined at x = 0. But, we have
( )	f x	′ = ( ) ( )
0 0
1 1
lim lim
h h
x h x
f x h f x x h x
h h	→ →
   
+ + − +	   	+ − +	   =
= 0
1 1 1
lim
h h
h x h x	→
 
+ −	 	+	 
= ( ) ( )	0 0
1 1 1
lim lim 1
h h
x x h
h h
h x x h h x x h	→ →
 	   	− −
+ = −	 	 	   	+ +	   	   	 
= ( ) 2	0
1 1
lim 1 1
h x x h x	→
 
− = −	 
+	 	 
Again, note that the function f ′ is not defined at x = 0.
Example 20 Find the derivative of f(x) from the first principle, where f(x) is
(i) sin cos	x x	+ (ii) sin	x x
Solution (i) we have ( )	'	f x = ( ) ( )	f x h f x
h
+ −
= ( ) ( )
0
sin cos sin cos
lim
h
x h x h x x
h	→
+ + + − −
= 0
sin cos cos sin cos cos sin sin sin cos
lim
h
x h x h x h x h x x
h	→
+ + − − −

LIMITS AND DERIVATIVES 315
= ( ) ( ) ( )
0
sin cos sin sin cos 1 cos cos 1
lim
h
h x x x h x h
h	→
− + − + −
= ( ) ( )
0 0
cos 1	sin
lim cos sin lim sin
h h
h	h x x x
h h	→ →
−
− + ( )
0
cos 1
lim cos
h
h
x h	→
−
+
= cos sin	x x	−
(ii) ( )	'	f x = ( ) ( ) ( ) ( )
0 0
sin sin
lim lim
h h
f x h f x x h x h x x
h h	→ →
+ − + + −
=
= ( )( )
0
sin cos sin cos sin
lim
h
x h x h h x x x
h	→
+ + −
= ( ) ( )
0
sin cos 1 cos sin sin cos sin cos
lim
h
x x h x x h h x h h x
h	→
− + + +
= ( ) 0
	0
sin cos 1 sin
lim lim cos	h
	h
x x h h
x x
h h
→
	→
− + ( )0
lim sin cos sin cos
h x h h x
→
+ +
=…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 14,
    chapterName: "Mathematical Reasoning",
    exercises: [
      {
        exercise: "14.1",
        questions: [
          {
            n: "1",
            marks: 5,
            text: `Which of the following sentences are statements? Give reasons for your answer.
(i) There are 35 days in a month.
(ii) Mathematics is difficult.
(iii) The sum of 5 and 7 is greater than 10.
(iv) The square of a number is an even number.
(v) The sides of a quadrilateral have equal length.
(vi) Answer this question.
(vii) The product of (–1) and 8 is 8.
(viii) The sum of all interior angles of a triangle is 180°.
(ix) Today is a windy day.
(x) All real numbers are complex numbers.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Give three examples of sentences which are not statements. Give reasons for the
answers.`,
          },
        ],
      },
      {
        exercise: "14.2",
        questions: [
          {
            n: "1",
            marks: 5,
            text: `Write the negation of the following statements:
(i) Chennai is the capital of Tamil Nadu.
(ii) 2 is not a complex number
(iii) All triangles are not equilateral triangle.
(iv) The number 2 is greater than 7.
(v) Every natural number is an integer.`,
          },
          {
            n: "2",
            marks: 2,
            text: `Are the following pairs of statements negations of each other:
(i) The number x is not a rational number.
The number x is not an irrational number.
(ii) The number x is a rational number.
The number x is an irrational number.`,
          },
          {
            n: "3",
            marks: 3,
            text: `Find the component statements of the following compound statements and check
whether they are true or false.
(i) Number 3 is prime or it is odd.
(ii) All integers are positive or negative.
(iii) 100 is divisible by 3, 11 and 5.`,
          },
        ],
      },
      {
        exercise: "14.3",
        questions: [
          {
            n: "1",
            marks: 3,
            text: `For each of the following compound statements first identify the connecting words
and then break it into component statements.
(i) All rational numbers are real and all real numbers are not complex.
(ii) Square of an integer is positive or negative.
(iii) The sand heats up quickly in the Sun and does not cool down fast at night.
(iv) x = 2 and x = 3 are the roots of the equation 3x2 – x – 10 = 0.

MATHEMATICAL REASONING 335`,
          },
          {
            n: "2",
            marks: 3,
            text: `Identify the quantifier in the following statements and write the negation of the
statements.
(i) There exists a number which is equal to its square.
(ii) For every real number x, x is less than x + 1.
(iii) There exists a capital for every state in India.`,
          },
          {
            n: "3",
            marks: 2,
            text: `Check whether the following pair of statements are negation of each other. Give
reasons for your answer.
(i) x + y = y + x is true for every real numbers x and y.
(ii) There exists real numbers x and y for which x + y = y + x.`,
          },
          {
            n: "4",
            marks: 3,
            text: `State whether the “Or” used in the following statements is “exclusive “or” inclusive.
Give reasons for your answer.
(i) Sun rises or Moon sets.
(ii) To apply for a driving licence, you should have a ration card or a passport.
(iii) All integers are positive or negative.`,
          },
          {
            n: "5",
            marks: 5,
            text: `∼q implies ∼p.
This says that if a number is not a multiple of 3, then it is not a multiple of 9.
14.5.1 Contrapositive and converse Contrapositive and converse are certain
other statements which can be formed from a given statement with “if-then”.
For example, let us consider the following “if-then” statement.
If the physical environment changes, then the biological environment changes.
Then the contrapositive of this statement is
If the biological environment does not change, then the physical environment
does not change.
Note that both these statements convey the same meaning.
To understand this, let us consider more examples.
Example 9 Write the contrapositive of the following statement:
(i) If a number is divisible by 9, then it is divisible by 3.
(ii) If you are born in India, then you are a citizen of India.
(iii) If a triangle is equilateral, it is isosceles.
Solution The contrapositive of the these statements are
(i) If a number is not divisible by 3, it is not divisible by 9.
(ii) If you are not a citizen of India, then you were not born in India.
(iii) If a triangle is not isosceles, then it is not equilateral.
The above examples show the contrapositive of the statement if p, then q is “if ∼q,
then ∼p”.
Next, we shall consider another term called converse.
The converse of a given statement “if p, then q” is if q, then p.

MATHEMATICAL REASONING 337
For example, the converse of the statement
p: If a number is divisible by 10, it is divisible by 5 is
q: If a number is divisible by 5, then it is divisible by 10.
Example 10 Write the converse of the following statements.
(i) If a number n is even, then n2 is even.
(ii) If you do all the exercises in the book, you get an A grade in the class.
(iii) If two integers a and b are such that a > b, then a – b is always a positive
integer.
Solution The converse of these statements are
(i) If a number n2 is even, then n is even.
(ii) If you get an A grade in the class, then you have done all the exercises of
the book.
(iii) If two integers a and b are such that a – b is always a positive integer, then
a > b.
Let us consider some more examples.
Example 11 For each of the following compound statements, first identif…`,
          },
        ],
      },
      {
        exercise: "14.4",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Rewrite the following statement with “if-then” in five different ways conveying
the same meaning.
If a natural number is odd, then its square is also odd.`,
          },
          {
            n: "2",
            marks: 5,
            text: `Write the contrapositive and converse of the following statements.
(i) If x is a prime number, then x is odd.
(ii) If the two lines are parallel, then they do not intersect in the same plane.
(iii) Something is cold implies that it has low temperature.
(iv) You cannot comprehend geometry if you do not know how to reason
deductively.
(v) x is an even number implies that x is divisible by 4.`,
          },
          {
            n: "3",
            marks: 3,
            text: `Write each of the following statements in the form “if-then”
(i) You get a job implies that your credentials are good.
(ii) The Bannana trees will bloom if it stays warm for a month.
(iii) A quadrilateral is a parallelogram if its diagonals bisect each other.
(iv) To get an A+ in the class, it is necessary that you do all the exercises of
the book.

MATHEMATICAL REASONING 339`,
          },
          {
            n: "4",
            marks: 3,
            text: `Given statements in (a) and (b). Identify the statements given below as
contrapositive or converse of each other.
(a) If you live in Delhi, then you have winter clothes.
(i) If you do not have winter clothes, then you do not live in Delhi.
(ii) If you have winter clothes, then you live in Delhi.
(b) If a quadrilateral is a parallelogram, then its diagonals bisect each other.
(i) If the diagonals of a quadrilateral do not bisect each other, then the
quadrilateral is not a parallelogram.
(ii) If the diagonals of a quadrilateral bisect each other, then it is a parallelogram.`,
          },
        ],
      },
      {
        exercise: "14.5",
        questions: [
          {
            n: "1",
            marks: 3,
            text: `Show that the statement
p: “If x is a real number such that x3 + 4x = 0, then x is 0” is true by
(i) direct method, (ii) method of contradiction, (iii) method of contrapositive`,
          },
          {
            n: "2",
            marks: 3,
            text: `Show that the statement “For any real numbers a and b, a2 = b2 implies that
a = b” is not true by giving a counter-example.`,
          },
          {
            n: "3",
            marks: 3,
            text: `Show that the following statement is true by the method of contrapositive.
p: If x is an integer and x2 is even, then x is also even.`,
          },
          {
            n: "4",
            marks: 3,
            text: `By giving a counter example, show that the following statements are not true.
(i) p: If all the angles of a triangle are equal, then the triangle is an obtuse
angled triangle.
(ii) q: The equation x2 – 1 = 0 does not have a root lying between 0 and 2.

MATHEMATICAL REASONING 343`,
          },
          {
            n: "5",
            marks: 5,
            text: `Which of the following statements are true and which are false? In each case
give a valid reason for saying so.
(i) p: Each radius of a circle is a chord of the circle.
(ii) q: The centre of a circle bisects each chord of the circle.
(iii) r: Circle is a particular case of an ellipse.
(iv) s: If x and y are integers such that x > y, then –x < – y.
(v) t : 11 is a rational number.
Miscellaneous Examples
Example 17 Check whether “Or” used in the following compound statement is exclusive
or inclusive? Write the component statements of the compound statements and use
them to check whether the compound statement is true or not. Justify your answer.
t: you are wet when it rains or you are in a river.
Solution “Or” used in the given statement is inclusive because it is possible that it rains
and you are in the river.
The component statements of the given statement are
p : you are wet when it rains.
q : You are wet when you are in a river.
Here both the component statements are true and therefore, the compound statement
is true.
Example 18 Write the negation of the following statements:
(i) p: For every real number x, x2 > x.
(ii) q: There exists a rational number x such that x2 = 2.
(iii) r: All birds have wings.
(iv) s: All students study mathematics at the elementary level.
Solution (i) The negation of p is “It is false that p is” which means that the condition
x2 > x does not hold for all real numbers. This can be expressed as
∼p: There exists a real number x such that x2 < x.
(ii) Negation of q is “it is false that q”, Thus ∼q is the statement.
∼q: There does not exist a rational number x such that x2 = 2.
This statement can be rewritten as
∼q: For all real numbers x, x2 ≠ 2
(iii) The negation of the statement is
∼r: There exists a bird which have no wings.

344 MATHEMATICS
(iv) The negation of the given statement is ∼s: There exists a student who does not
study mathematics at the elementary level.
Example 19 Using the words “necessary and sufficient” rewrite the statement “The
integer n is odd if and only if n2 is odd”. Also check whether the statement is true.
Solution The necessary and sufficient condition that the integer n be odd is n2 must be
odd. Let p and q…`,
          },
          {
            n: "6",
            marks: 2,
            text: `Check the validity of the statements given below by the method given against it.
(i) p: The sum of an irrational number and a rational number is irrational (by
contradiction method).
(ii) q: If n is a real number with n > 3, then n2 > 9 (by contradiction method).`,
          },
          {
            n: "7",
            marks: 3,
            text: `Write the following statement in five different ways, conveying the same meaning.
p: If a triangle is equiangular, then it is an obtuse angled triangle.

346 MATHEMATICS
Summary
®A mathematically acceptable statement is a sentence which is either true or
false.
®Explained the terms:
– Negation of a statement p: If p denote a statement, then the negation of p is
denoted by ∼p.
– Compound statements and their related component statements:
A statement is a compound statement if it is made up of two or more smaller
statements. The smaller statements are called component statements of the
compound statement.
– The role of “And”, “Or”, “There exists” and “For every” in compound
statements.
– The meaning of implications “If ”, “only if ”, “ if and only if ”.
A sentence with if p, then q can be written in the following ways.
– p implies q (denoted by p ⇒ q)
– p is a sufficient condition for q
– q is a necessary condition for p
– p only if q
– ∼q implies ∼p
– The contrapositive of a statement p ⇒ q is the statement ∼ q ⇒ ∼p . The
converse of a statement p ⇒ q is the statement q ⇒ p.
p ⇒ q together with its converse, gives p if and only if q.
®The following methods are used to check the validity of statements:
(i) direct method
(ii) contrapositive method
(iii) method of contradiction
(iv) using a counter example.
Historical Note
The first treatise on logic was written by Aristotle (384 B.C.-322 B.C.). It
was a collection of rules for deductive reasoning which would serve as a basis
for the study of every branch of knowledge. Later, in the seventeenth century,
German mathematician G. W. Leibnitz (1646 – 1716) conceived the idea of using
symbols in logic to mechanise the process of deductive reasoning. His idea was
realised in the nineteenth century by the English mathematician George Boole
(1815–1864) and Augustus De Morgan (1806–1871) , who founded the modern
subject of symbolic logic.`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 15,
    chapterName: "Statistics",
    exercises: [
      {
        exercise: "15.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `4, 7, 8, 9, 10, 12, 13, 17`,
          },
          {
            n: "2",
            marks: 2,
            text: `38, 70, 48, 40, 42, 55, 63, 46, 54, 44
Find the mean deviation about the median for the data in Exercises 3 and 4.`,
          },
          {
            n: "3",
            marks: 2,
            text: `13, 17, 16, 14, 11, 13, 10, 16, 11, 18, 12, 17`,
          },
          {
            n: "4",
            marks: 2,
            text: `36, 72, 46, 42, 60, 45, 53, 46, 51, 49
Find the mean deviation about the mean for the data in Exercises 5 and 6.`,
          },
          {
            n: "5",
            marks: 2,
            text: `xi 5 10 15 20 25
f i 7 4 6 3 5`,
          },
          {
            n: "6",
            marks: 2,
            text: `xi 10 30 50 70 90
f i 4 24 28 16 8
Find the mean deviation about the median for the data in Exercises 7 and 8.`,
          },
          {
            n: "7",
            marks: 2,
            text: `xi 5 7 9 10 12 15
f i 8 6 2 2 2 6`,
          },
          {
            n: "8",
            marks: 2,
            text: `xi 15 21 27 30 35
f i 3 5 6 7 8

STATISTICS 361
Find the mean deviation about the mean for the data in Exercises 9 and 10.`,
          },
          {
            n: "9",
            marks: 2,
            text: `Income per 0-100 100-200 200-300 300-400 400-500 500-600 600-700 700-800
day in \`
Number 4 8 9 10 7 5 4 3
of persons`,
          },
          {
            n: "10",
            marks: 2,
            text: `Height 95-105 105-115 115-125 125-135 135-145 145-155
in cms
Number of 9 13 26 30 12 10
boys`,
          },
          {
            n: "11",
            marks: 2,
            text: `Find the mean deviation about median for the following data :
Marks 0-10 10-20 20-30 30-40 40-50 50-60
Number of 6 8 14 16 4 2
Girls`,
          },
          {
            n: "12",
            marks: 2,
            text: `Calculate the mean deviation about median age for the age distribution of 100
persons given below:
Age 16-20 21-25 26-30 31-35 36-40 41-45 46-50 51-55
(in years)
Number 5 6 12 14 26 12 16 9
[Hint Convert the given data into continuous frequency distribution by subtracting 0.5
from the lower limit and adding 0.5 to the upper limit of each class interval]
15.4.3 Limitations of mean deviation In a series, where the degree of variability is
very high, the median is not a representative central tendency. Thus, the mean deviation
about median calculated for such series can not be fully relied.
The sum of the deviations from the mean (minus signs ignored) is more than the
sum of the deviations from median. Therefore, the mean deviation about the mean is
not very scientific.Thus, in many cases, mean deviation may give unsatisfactory results.
Also mean deviation is calculated on the basis of absolute values of the deviations and
therefore, cannot be subjected to further algebraic treatment. This implies that we
must have some other measure of dispersion. Standard deviation is such a measure of
dispersion.`,
          },
        ],
      },
      {
        exercise: "15.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `6, 7, 10, 12, 13, 4, 8, 12`,
          },
          {
            n: "2",
            marks: 2,
            text: `First n natural numbers`,
          },
          {
            n: "3",
            marks: 2,
            text: `First 10 multiples of 3`,
          },
          {
            n: "4",
            marks: 2,
            text: `xi 6 10 14 18 24 28 30
fi 2 4 7 12 8 4 3`,
          },
          {
            n: "5",
            marks: 2,
            text: `xi 92 93 97 98 102 104 109
f i 3 2 3 2 6 3 3`,
          },
          {
            n: "6",
            marks: 2,
            text: `Find the mean and standard deviation using short-cut method.
xi 60 61 62 63 64 65 66 67 68
f i 2 1 12 29 25 12 10 4 5
Find the mean and variance for the following frequency distributions in Exercises
7 and 8.`,
          },
          {
            n: "7",
            marks: 2,
            text: `Classes 0-30 30-60 60-90 90-120 120-150 150-180 180-210
Frequencies 2 3 5 10 3 5 2

372 MATHEMATICS`,
          },
          {
            n: "8",
            marks: 2,
            text: `Classes 0-10 10-20 20-30 30-40 40-50
Frequencies 5 8 15 16 6`,
          },
          {
            n: "9",
            marks: 2,
            text: `Find the mean, variance and standard deviation using short-cut method
Height 70-75 75-80 80-85 85-90 90-95 95-100 100-105 105-110 110-115
in cms
No. of 3 4 7 7 15 9 6 6 3
children`,
          },
          {
            n: "10",
            marks: 2,
            text: `The diameters of circles (in mm) drawn in a design are given below:
Diameters 33-36 37-40 41-44 45-48 49-52
No. of circles 15 17 21 22 25
Calculate the standard deviation and mean diameter of the circles.
[ Hint First make the data continuous by making the classes as 32.5-36.5, 36.5-40.5,
40.5-44.5, 44.5 - 48.5, 48.5 - 52.5 and then proceed.]`,
          },
        ],
      },
      {
        exercise: "15.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `From the data given below state which group is more variable, A or B?
Marks 10-20 20-30 30-40 40-50 50-60 60-70 70-80
Group A 9 17 32 33 40 10 9
Group B 10 20 30 25 43 15 7`,
          },
          {
            n: "2",
            marks: 2,
            text: `From the prices of shares X and Y below, find out which is more stable in value:
X 35 54 52 53 56 58 52 50 51 49
Y 108 107 105 105 106 107 104 103 104 101`,
          },
          {
            n: "3",
            marks: 2,
            text: `An analysis of monthly wages paid to workers in two firms A and B, belonging to
the same industry, gives the following results:
Firm A Firm B
No. of wage earners 586 648
Mean of monthly wages Rs 5253 Rs 5253
Variance of the distribution 100 121
of wages
(i) Which firm A or B pays larger amount as monthly wages?
(ii) Which firm, A or B, shows greater variability in individual wages?

376 MATHEMATICS`,
          },
          {
            n: "4",
            marks: 2,
            text: `The following is the record of goals scored by team A in a football session:
No. of goals scored 0 1 2 3 4
No. of matches 1 9 7 5 3
For the team B, mean number of goals scored per match was 2 with a standard
deviation 1.25 goals. Find which team may be considered more consistent?`,
          },
          {
            n: "5",
            marks: 2,
            text: `The sum and sum of squares corresponding to length x (in cm) and weight y
(in gm) of 50 plant products are given below:
50
1
212	i
i
x
=
=	∑ ,
50 2
1
902 8	i
i
x .
=
=	∑ ,
50
1
261	i
i
y
=
=	∑ ,
50 2
1
1457 6	i
i
y .
=
=	∑
Which is more varying, the length or weight?
Miscellaneous Examples
Example 16 The variance of 20 observations is 5. If each observation is multiplied by
2, find the new variance of the resulting observations.
Solution Let the observations be x1, x2, ..., x20 and x be their mean. Given that
variance = 5 and n = 20. We know that
Variance ( )2
20 2
1
1 ( )	i
i
x x
n
σ =
= −	∑ , i.e.,
20 2
1
1
5 ( )
20 i
i
x x
=
= −	∑
or
20 2
1
( )	i
i
x x
=
−	∑ = 100 ... (1)
If each observation is multiplied by 2, and the new resulting observations are yi , then
yi = 2xi i.e., xi = i	y
2
1
Therefore
20 20
1 1
1 1 2
20
i i
i i
y y x
n = =
= =	∑ ∑ =
20
1
1
2 20 i
i
. x
=
∑
i.e. y = 2 x or x = y
2
1
Substituting the values of xi and x in (1), we get

STATISTICS 377
2	20
1
1 1 100
2 2
i
i
y y
=
 
− =	 
 
∑ , i.e., ∑=
=	−
20
1
2 400	)	(
i
i y	y
Thus the variance of new observations = 2	1 400 20 2 5
20 × = = ×
ANote The reader may note that if each observation is multiplied by a constant
k, the variance of the resulting observations becomes k2 times the original variance.
Example17 The mean of 5 observations is 4.4 and their variance is 8.24. If three of
the observations are 1, 2 and 6, find the other two observations.
Solution Let the other two observations be x and y.
Therefore, the series is 1, 2, 6, x, y.
Now Mean x = 4.4 = 1 2 6
5
x y	+ + + +
or 22 = 9 + x + y
Therefore x + y = 13 ... (1)
Also variance = 8.24 = 2
5`,
          },
          {
            n: "6",
            marks: 2,
            text: `The mean and standard deviation of marks obtained by 50 students of a class in
three subjects, Mathematics, Physics and Chemistry are given below:
Subject Mathematics Physics Chemistry
Mean 42 32 40.9
Standard 12 15 20
deviation
Which of the three subjects shows the highest variability in marks and which
shows the lowest?`,
          },
          {
            n: "7",
            marks: 2,
            text: `The mean and standard deviation of a group of 100 observations were found to
be 20 and 3, respectively. Later on it was found that three observations were
incorrect, which were recorded as 21, 21 and 18. Find the mean and standard
deviation if the incorrect observations are omitted.
Summary
®Measures of dispersion Range, Quartile deviation, mean deviation, variance,
standard deviation are measures of dispersion.
Range = Maximum Value – Minimum Value
®Mean deviation for ungrouped data
M
M.D. ( ) M.D. (M)
i i	x – x x –
x ,
n n
= =
∑ ∑

STATISTICS 381
®Mean deviation for grouped data
M.D. N M.D. M M
N where N	( ) – , ( ) – ,	x f x x f x f
i i i i
i	= = =
∑ ∑ ∑
®Variance and standard deviation for ungrouped data
2 2	1 ( )	ix – x
n
σ = ∑ , 2	1 ( – )	ix x
n
σ = ∑
®Variance and standard deviation of a discrete frequency distribution
( ) ( )2 2	2 1 1
,
N N
i i i i	f x x f x x
σ
	σ	= − = −	∑ ∑
®Variance and standard deviation of a continuous frequency distribution
( ) ( )2	2	2 2	1 1
, N
N N
i i i i i i	f x x f x f x
σ
	σ	= − = −	∑ ∑ ∑
®Shortcut method to find variance and standard deviation.
( )
2 2	2 2
2 N
N i i i i
h f y f y
σ  	= − 	 ∑ ∑ , ( )2	2
N
N i i i i
h f y f y
σ = −	∑ ∑ ,
where A	i
i
x
y h
−
=
®Coefficient of variation (C.V.) 100, 0.	x
x
= × ≠
σ
For series with equal means, the series with lesser standard deviation is more consistent
or less scattered.
Historical Note
‘Statistics’ is derived from the Latin word ‘status’ which means a political
state. This suggests that statistics is as old as human civilisation. In the year 3050
B.C., perhaps the first census was held in Egypt. In India also, about 2000 years
ago, we had an efficient system of collecting administrative statistics, particularly,
during the regime of Chandra Gupta Maurya (324-300 B.C.). The system of
collecting data related to births and deaths is mentioned in Kautilya’s Arthshastra
(around 300 B.C.) A detailed account of administrative surveys conducted during
Akbar’s regime is given in Ain-I-Akbari written by Abul Fazl.

382 MATHEMATICS
— v	v	v	v	v —
Captain John Graunt of London (1620-1674) is known as father of vital
statistics due to his studies on statistics of births and deaths. Jac…`,
          },
        ],
      },
    ],
  },
  {
    classLevel: 11,
    chapterNumber: 16,
    chapterName: "Probability",
    exercises: [
      {
        exercise: "16.1",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `A coin is tossed three times.`,
          },
          {
            n: "2",
            marks: 2,
            text: `A die is thrown two times.`,
          },
          {
            n: "3",
            marks: 2,
            text: `A coin is tossed four times.`,
          },
          {
            n: "4",
            marks: 2,
            text: `A coin is tossed and a die is thrown.`,
          },
          {
            n: "5",
            marks: 2,
            text: `A coin is tossed and then a die is rolled only in case a head is shown on the coin.`,
          },
          {
            n: "6",
            marks: 2,
            text: `2 boys and 2 girls are in Room X, and 1 boy and 3 girls in Room Y. Specify the
sample space for the experiment in which a room is selected and then a person.`,
          },
          {
            n: "7",
            marks: 2,
            text: `One die of red colour, one of white colour and one of blue colour are placed in a
bag. One die is selected at random and rolled, its colour and the number on its
uppermost face is noted. Describe the sample space.`,
          },
          {
            n: "8",
            marks: 2,
            text: `An experiment consists of recording boy–girl composition of families with 2
children.
(i) What is the sample space if we are interested in knowing whether it is a boy
or girl in the order of their births?

PROBABILITY 387
(ii) What is the sample space if we are interested in the number of girls in the
family?`,
          },
          {
            n: "9",
            marks: 2,
            text: `A box contains 1 red and 3 identical white balls. Two balls are drawn at random
in succession without replacement. Write the sample space for this experiment.`,
          },
          {
            n: "10",
            marks: 2,
            text: `An experiment consists of tossing a coin and then throwing it second time if a
head occurs. If a tail occurs on the first toss, then a die is rolled once. Find the
sample space.`,
          },
          {
            n: "11",
            marks: 2,
            text: `Suppose 3 bulbs are selected at random from a lot. Each bulb is tested and
classified as defective (D) or non – defective(N). Write the sample space of this
experiment.`,
          },
          {
            n: "12",
            marks: 2,
            text: `A coin is tossed. If the out come is a head, a die is thrown. If the die shows up
an even number, the die is thrown again. What is the sample space for the
experiment?`,
          },
          {
            n: "13",
            marks: 2,
            text: `The numbers 1, 2, 3 and 4 are written separatly on four slips of paper. The slips
are put in a box and mixed thoroughly. A person draws two slips from the box,
one after the other, without replacement. Describe the sample space for the
experiment.`,
          },
          {
            n: "14",
            marks: 2,
            text: `An experiment consists of rolling a die and then tossing a coin once if the number
on the die is even. If the number on the die is odd, the coin is tossed twice. Write
the sample space for this experiment.`,
          },
          {
            n: "15",
            marks: 2,
            text: `A coin is tossed. If it shows a tail, we draw a ball from a box which contains 2 red
and 3 black balls. If it shows head, we throw a die. Find the sample space for this
experiment.`,
          },
          {
            n: "16",
            marks: 2,
            text: `A die is thrown repeatedly untill a six comes up. What is the sample space for
this experiment?
16.3 Event
We have studied about random experiment and sample space associated with an
experiment. The sample space serves as an universal set for all questions concerned
with the experiment.
Consider the experiment of tossing a coin two times. An associated sample space
is S = {HH, HT, TH, TT}.
Now suppose that we are interested in those outcomes which correspond to the
occurrence of exactly one head. We find that HT and TH are the only elements of S
corresponding to the occurrence of this happening (event). These two elements form
the set E = { HT, TH}
We know that the set E is a subset of the sample space S . Similarly, we find the
following correspondence between events and subsets of S.

388 MATHEMATICS
Description of events Corresponding subset of ‘S’
Number of tails is exactly 2 A = {TT}
Number of tails is atleast one B = {HT, TH, TT}
Number of heads is atmost one C = {HT, TH, TT}
Second toss is not head D = { HT, TT}
Number of tails is atmost two S = {HH, HT, TH, TT}
Number of tails is more than two φ
The above discussion suggests that a subset of sample space is associated with
an event and an event is associated with a subset of sample space. In the light of this
we define an event as follows.
Definition Any subset E of a sample space S is called an event.
16.3.1 Occurrence of an event Consider the experiment of throwing a die. Let E
denotes the event “ a number less than 4 appears”. If actually ‘1’ had appeared on the
die then we say that event E has occurred. As a matter of fact if outcomes are 2 or 3,
we say that event E has occurred
Thus, the event E of a sample space S is said to have occurred if the outcome
ω of the experiment is such that ω ∈ E. If the outcome ω is such that ω ∉ E, we say
that the event E has not occurred.
16.3.2 Types of events Events can be classified into various types on the basis of the
elements they have.`,
          },
        ],
      },
      {
        exercise: "16.2",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `A die is rolled. Let E be the event “die shows 4” and F be the event “die shows
even number”. Are E and F mutually exclusive?`,
          },
          {
            n: "2",
            marks: 5,
            text: `A die is thrown. Describe the following events:
(i) A: a number less than 7 (ii) B: a number greater than 7
(iii) C: a multiple of 3 (iv) D: a number less than 4
(v) E: an even number greater than 4 (vi) F: a number not less than 3
Also find A ∪ B, A ∩ B, B ∪ C, E ∩ F, D ∩ E, A – C, D – E, E ∩ F′, F′`,
          },
          {
            n: "3",
            marks: 2,
            text: `An experiment involves rolling a pair of dice and recording the numbers that
come up. Describe the following events:
A: the sum is greater than 8, B: 2 occurs on either die
C: the sum is at least 7 and a multiple of 3.
Which pairs of these events are mutually exclusive?`,
          },
          {
            n: "4",
            marks: 3,
            text: `Three coins are tossed once. Let A denote the event ‘three heads show”, B
denote the event “two heads and one tail show”, C denote the event” three tails
show and D denote the event ‘a head shows on the first coin”. Which events are
(i) mutually exclusive? (ii) simple? (iii) Compound?`,
          },
          {
            n: "5",
            marks: 5,
            text: `Three coins are tossed. Describe
(i) Two events which are mutually exclusive.
(ii) Three events which are mutually exclusive and exhaustive.
(iii) Two events, which are not mutually exclusive.
(iv) Two events which are mutually exclusive but not exhaustive.
(v) Three events which are mutually exclusive but not exhaustive.`,
          },
          {
            n: "6",
            marks: 5,
            text: `Two dice are thrown. The events A, B and C are as follows:
A: getting an even number on the first die.
B: getting an odd number on the first die.
C: getting the sum of the numbers on the dice ≤ 5.
Describe the events
(i) A′ (ii) not B (iii) A or B
(iv) A and B (v) A but not C (vi) B or C
(vii) B and C (viii) A ∩ B′ ∩ C′`,
          },
          {
            n: "7",
            marks: 5,
            text: `Refer to question 6 above, state true or false: (give reason for your answer)
(i) A and B are mutually exclusive
(ii) A and B are mutually exclusive and exhaustive
(iii) A = B′

394 MATHEMATICS
(iv) A and C are mutually exclusive
(v) A and B′ are mutually exclusive.
(vi) A′, B′, C are mutually exclusive and exhaustive.`,
          },
        ],
      },
      {
        exercise: "16.3",
        questions: [
          {
            n: "1",
            marks: 2,
            text: `Which of the following can not be valid assignment of probabilities for outcomes
of sample Space S = { }	1 2 3 4 5 6 7	, , , , , ,	ω ω ω ω ω ω ω

404 MATHEMATICS
Assignment ω 1 ω 2 ω 3 ω 4 ω 5 ω 6 ω 7
(a) 0.1 0.01 0.05 0.03 0.01 0.2 0.6
(b) 7
1
7
1
7
1
7
1
7
1
7
1
7
1
(c) 0.1 0.2 0.3 0.4 0.5 0.6 0.7
(d) – 0.1 0.2 0.3 0.4 – 0.2 0.1 0.3
(e) 14
1
14
2
14
3
14
4
14
5
14
6
14
15`,
          },
          {
            n: "2",
            marks: 2,
            text: `A coin is tossed twice, what is the probability that atleast one tail occurs?`,
          },
          {
            n: "3",
            marks: 5,
            text: `A die is thrown, find the probability of following events:
(i) A prime number will appear,
(ii) A number greater than or equal to 3 will appear,
(iii) A number less than or equal to one will appear,
(iv) A number more than 6 will appear,
(v) A number less than 6 will appear.`,
          },
          {
            n: "4",
            marks: 2,
            text: `A card is selected from a pack of 52 cards.
(a) How many points are there in the sample space?
(b) Calculate the probability that the card is an ace of spades.
(c) Calculate the probability that the card is (i) an ace (ii) black card.`,
          },
          {
            n: "5",
            marks: 2,
            text: `A fair coin with 1 marked on one face and 6 on the other and a fair die are both
tossed. find the probability that the sum of numbers that turn up is (i) 3 (ii) 12`,
          },
          {
            n: "6",
            marks: 2,
            text: `There are four men and six women on the city council. If one council member is
selected for a committee at random, how likely is it that it is a woman?`,
          },
          {
            n: "7",
            marks: 2,
            text: `A fair coin is tossed four times, and a person win Re 1 for each head and lose
Rs 1.50 for each tail that turns up.
From the sample space calculate how many different amounts of money you can
have after four tosses and the probability of having each of these amounts.`,
          },
          {
            n: "8",
            marks: 5,
            text: `Three coins are tossed once. Find the probability of getting
(i) 3 heads (ii) 2 heads (iii) atleast 2 heads
(iv) atmost 2 heads (v) no head (vi) 3 tails
(vii) exactly two tails (viii) no tail (ix) atmost two tails`,
          },
          {
            n: "9",
            marks: 2,
            text: `If 11
2 is the probability of an event, what is the probability of the event ‘not A’.`,
          },
          {
            n: "10",
            marks: 2,
            text: `A letter is chosen at random from the word ‘ASSASSINATION’. Find the
probability that letter is (i) a vowel (ii) a consonant

PROBABILITY 405`,
          },
          {
            n: "11",
            marks: 2,
            text: `In a lottery, a person choses six different natural numbers at random from 1 to 20,
and if these six numbers match with the six numbers already fixed by the lottery
committee, he wins the prize. What is the probability of winning the prize in the
game? [Hint order of the numbers is not important.]`,
          },
          {
            n: "12",
            marks: 2,
            text: `Check whether the following probabilities P(A) and P(B) are consistently defined
(i) P(A) = 0.5, P(B) = 0.7, P(A ∩ B) = 0.6
(ii) P(A) = 0.5, P(B) = 0.4, P(A ∪ B) = 0.8`,
          },
          {
            n: "13",
            marks: 2,
            text: `Fill in the blanks in following table:
P(A) P(B) P(A ∩ B) P(A ∪ B)
(i) 1
3
1
5
1`,
          },
          {
            n: "14",
            marks: 2,
            text: `. .
(ii) 0.35 . . . 0.25 0.6
(iii) 0.5 0.35 . . . 0.7`,
          },
          {
            n: "15",
            marks: 2,
            text: `If E and F are events such that P(E) = 4
1 , P(F) = 2
1 and P(E and F) = 8
1 , find
(i) P(E or F), (ii) P(not E and not F).`,
          },
          {
            n: "16",
            marks: 2,
            text: `Events E and F are such that P(not E or not F) = 0.25, State whether E and F are
mutually exclusive.`,
          },
          {
            n: "17",
            marks: 3,
            text: `A and B are events such that P(A) = 0.42, P(B) = 0.48 and P(A and B) = 0.16.
Determine (i) P(not A), (ii) P(not B) and (iii) P(A or B)`,
          },
          {
            n: "18",
            marks: 2,
            text: `In Class XI of a school 40% of the students study Mathematics and 30% study
Biology. 10% of the class study both Mathematics and Biology. If a student is
selected at random from the class, find the probability that he will be studying
Mathematics or Biology.`,
          },
          {
            n: "19",
            marks: 2,
            text: `In an entrance test that is graded on the basis of two examinations, the probability
of a randomly chosen student passing the first examination is 0.8 and the probability
of passing the second examination is 0.7. The probability of passing atleast one of
them is 0.95. What is the probability of passing both?`,
          },
          {
            n: "20",
            marks: 2,
            text: `The probability that a student will pass the final examination in both English and
Hindi is 0.5 and the probability of passing neither is 0.1. If the probability of
passing the English examination is 0.75, what is the probability of passing the
Hindi examination?

406 MATHEMATICS`,
          },
          {
            n: "21",
            marks: 5,
            text: `In a class of 60 students, 30 opted for NCC, 32 opted for NSS and 24 opted for
both NCC and NSS. If one of these students is selected at random, find the
probability that
(i) The student opted for NCC or NSS.
(ii) The student has opted neither NCC nor NSS.
(iii) The student has opted NSS but not NCC.
Miscellaneous Examples
Example 14 On her vacations Veena visits four cities (A, B, C and D) in a random
order. What is the probability that she visits
(i) A before B? (ii) A before B and B before C?
(iii) A first and B last? (iv) A either first or second?
(v) A just before B?
Solution The number of arrangements (orders) in which Veena can visit four cities A,
B, C, or D is 4! i.e., 24.Therefore, n (S) = 24.
Since the number of elements in the sample space of the experiment is 24 all of these
outcomes are considered to be equally likely. A sample space for the
experiment is
S = {ABCD, ABDC, ACBD, ACDB, ADBC, ADCB
BACD, BADC, BDAC, BDCA, BCAD, BCDA
CABD, CADB, CBDA, CBAD, CDAB, CDBA
DABC, DACB, DBCA, DBAC, DCAB, DCBA}
(i) Let the event ‘she visits A before B’ be denoted by E
Therefore, E = {ABCD, CABD, DABC, ABDC, CADB, DACB
ACBD, ACDB, ADBC, CDAB, DCAB, ADCB}
Thus ( ) ( )
( )
E 12 1
P E S 24 2
n
n
= = =
(ii) Let the event ‘Veena visits A before B and B before C’ be denoted by F.
Here F = {ABCD, DABC, ABDC, ADBC}
Therefore, ( ) ( )
( )
F 4 1
P F S 24 6
n
n
= = =
Students are advised to find the probability in case of (iii), (iv) and (v).

PROBABILITY 407
Example 15 Find the probability that when a hand of 7 cards is drawn from a well
shuffled deck of 52 cards, it contains (i) all Kings (ii) 3 Kings (iii) atleast 3 Kings.
Solution Total number of possible hands = 52
7	C
(i) Number of hands with 4 Kings = 4 48
4 3	C C	× (other 3 cards must be chosen
from the rest 48 cards)
Hence P (a hand will have 4 Kings) =
4 48
4 3
52
7
C C 1
7735	C
× =
(ii) Number of hands with 3 Kings and 4 non-King cards = 4 48
3 4	C C	×
Therefore P (3 Kings) =
4 48
3 4
52
7
C C 9
1547	C
× =
(iii) P(atleast 3 King) = P(3 Kings or 4 Kings)
= P(3 Kings) + P(4 Kings)
= 9 1 46
1547 7735 7735
+ =
Example 16 If A, B, C are three events associated with a random experiment,
prove that
( )	P A B C	∪ ∪ = ( …`,
          },
        ],
      },
    ],
  },
];
