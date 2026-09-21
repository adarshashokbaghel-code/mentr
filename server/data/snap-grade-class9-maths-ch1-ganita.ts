/**
 * NCERT Class 9 Maths — Ganita Manjari Chapter 1
 * "Orienting Yourself: The Use of Coordinates"
 * Extracted from official iemh101.pdf (all exercise-set + end-of-chapter items).
 */
import type { RawChapter } from "./snap-grade-seed-helpers";

export const GANITA_MANJARI_CH1: RawChapter = {
  chapterNumber: 1,
  chapterName: "Orienting Yourself: The Use of Coordinates",
  exercises: [
    {
      exercise: "1.1",
      questions: [
        {
          n: "1",
          marks: 4,
          text: `Fig. 1.3 shows Reiaan’s room with points OABC marking its corners. The x- and y-axes are marked in the figure. Point O is the origin. Referring to Fig. 1.3, answer the following questions:

(i) If D₁R₁ represents the door to Reiaan’s room, how far is the door from the left wall (the y-axis) of the room? How far is the door from the x-axis?
(ii) What are the coordinates of D₁?
(iii) If R₁ is the point (11.5, 0), how wide is the door? Do you think this is a comfortable width for the room door? If a person in a wheelchair wants to enter the room, will he/she be able to do so easily?
(iv) If B₁ (0, 1.5) and B₂ (0, 4) represent the ends of the bathroom door, is the bathroom door narrower or wider than the room door?`,
          ref: "Read distances from Fig. 1.3 in the NCERT PDF. (iii)–(iv) need a calculated width comparison.",
        },
      ],
    },
    {
      exercise: "1.1-TR",
      questions: [
        {
          n: "1",
          marks: 2,
          text: "Think and Reflect (after Exercise Set 1.1):\n1. What are the standard widths for a room door? Look around your home and in school.\n2. Are the doors in your school suitable for people in wheelchairs?",
        },
        {
          n: "2",
          marks: 3,
          text: "Think and Reflect (quadrants):\n1. What is the x-coordinate of a point on the y-axis?\n2. Is there a similar generalisation for a point on the x-axis?\n3. Does point Q (y, x) ever coincide with point P (x, y)? Justify your answer.",
          ref: "1. x = 0. 2. y = 0 on the x-axis. 3. Only when x = y.",
        },
      ],
    },
    {
      exercise: "1.2",
      questions: [
        {
          n: "1",
          marks: 3,
          text: `On a graph sheet, mark the x-axis and y-axis and the origin O. Mark points from (−7, 0) to (13, 0) on the x-axis and from (0, −15) to (0, 12) on the y-axis. (Use the scale 1 cm = 1 unit.) Using Fig. 1.5, answer:

Place Reiaan’s rectangular study table with three of its feet at the points (8, 9), (11, 9) and (11, 7).
(i) Where will the fourth foot of the table be?
(ii) Is this a good spot for the table?
(iii) What is the width of the table? The length? Can you make out the height of the table?`,
          ref: "Fourth foot at (8, 7). Width 3, length 2 (units on plane). Height cannot be found from 2-D coordinates.",
        },
        {
          n: "2",
          marks: 2,
          text: "If the bathroom door has a hinge at B₁ and opens into the bedroom, will it hit the wardrobe? Are there any changes you would suggest if the door is made wider?",
        },
        {
          n: "3",
          marks: 4,
          text: `Look at Reiaan’s bathroom.
(i) What are the coordinates of the four corners O, F, R, and P of the bathroom?
(ii) What is the shape of the showering area SHWR in Reiaan’s bathroom? Write the coordinates of the four corners.
(iii) Mark off a 3 ft × 2 ft space for the washbasin and a 2 ft × 3 ft space for the toilet. Write the coordinates of the corners of these spaces.`,
        },
        {
          n: "4",
          marks: 4,
          text: `Other rooms in the house:
(i) Reiaan’s room door leads from the dining room which has the length 18 ft and width 15 ft. The length of the dining room extends from point P to point A. Sketch the dining room and mark the coordinates of its corners.
(ii) Place a rectangular 5 ft × 3 ft dining table precisely in the centre of the dining room. Write down the coordinates of the feet of the table.`,
        },
      ],
    },
    {
      exercise: "1.2-TR",
      questions: [
        {
          n: "1",
          marks: 2,
          text: "Think and Reflect (distance):\n1. In moving from A (3, 4) to D (7, 1), what distance has been covered along the x-axis? What about the distance along the y-axis?\n2. Can these distances help you find the distance AD?",
          ref: "Δx = 4, Δy = 3; AD = 5 by Baudhāyana–Pythagoras.",
        },
      ],
    },
    {
      exercise: "EOC",
      questions: [
        {
          n: "1",
          marks: 1,
          text: "What are the x-coordinate and y-coordinate of the point of intersection of the two axes?",
          ref: "(0, 0) — the origin.",
        },
        {
          n: "2",
          marks: 2,
          text: "Point W has x-coordinate equal to −5. Can you predict the coordinates of point H which is on the line through W parallel to the y-axis? Which quadrants can H lie in?",
          ref: "H = (−5, y) for some y. Quadrants II or III (or on axes) depending on y.",
        },
        {
          n: "3",
          marks: 3,
          text: `Consider the points R (3, 0), A (0, −2), M (−5, −2) and P (−5, 2). If they are joined in the same order, predict:
(i) Two sides of RAMP that are perpendicular to each other.
(ii) One side of RAMP that is parallel to one of the axes.
(iii) Two points that are mirror images of each other in one axis. Which axis will this be?
Now plot the points and verify your predictions.`,
        },
        {
          n: "4",
          marks: 3,
          text: "Plot point Z (5, −6) on the Cartesian plane. Construct a right-angled triangle IZN and find the lengths of the three sides.\n(Comment: Answers may differ from person to person.)",
        },
        {
          n: "5",
          marks: 2,
          text: "What would a system of coordinates be like if we did not have negative numbers? Would this system allow us to locate all the points on a 2-D plane?",
          ref: "Only Quadrant I (and positive axes). No — cannot locate points with negative coordinates.",
        },
        {
          n: "6",
          marks: 3,
          text: "Are the points M (−3, −4), A (0, 0) and G (6, 8) on the same straight line? Suggest a method to check this without plotting and joining the points.",
          ref: "Yes — e.g. slopes MA = AG, or area/collinearity condition.",
        },
        {
          n: "7",
          marks: 3,
          text: "Use your method (from Problem 6) to check if the points R (−5, −1), B (−2, −5) and C (4, −12) are on the same straight line. Now plot both sets of points and check your answers.",
        },
        {
          n: "8",
          marks: 3,
          text: `Using the origin as one vertex, plot the vertices of:
(i) A right-angled isosceles triangle.
(ii) An isosceles triangle with one vertex in Quadrant III and the other in Quadrant IV.`,
        },
        {
          n: "9",
          marks: 4,
          text: `The following table shows the coordinates of points S, M and T. In each case, state whether M is the midpoint of segment ST. Justify your answer.

S (−3, 0), M (0, 0), T (3, 0)
S (2, 3), M (3, 4), T (4, 5)
S (0, 0), M (0, 5), T (0, −10)
S (−8, 7), M (0, −2), T (6, −3)

When M is the mid-point of ST, can you find any connection between the coordinates of M, S and T?`,
          ref: "Midpoint formula: M = ((x_S+x_T)/2, (y_S+y_T)/2).",
        },
        {
          n: "10",
          marks: 2,
          text: "Use the connection you found to find the coordinates of B given that M (−7, 1) is the midpoint of A (3, −4) and B (x, y).",
          ref: "B = (−17, 6).",
        },
        {
          n: "11",
          marks: 3,
          text: "Let P, Q be points of trisection of AB, with P closer to A, and Q closer to B. Using your knowledge of how to find the coordinates of the midpoint of a segment, how would you find the coordinates of P and Q? Do this for the case when the points are A (4, 7) and B (16, −2).",
        },
        {
          n: "12",
          marks: 3,
          text: `(i) Given the points A (1, −8), B (−4, 7) and C (−7, −4), show that they lie on a circle K whose center is the origin O (0, 0). What is the radius of circle K?
(ii) Given the points D (−5, 6) and E (0, 9), check whether D and E lie within the circle, on the circle, or outside the circle K.`,
          ref: "Radius √65. Compare OD², OE² with 65.",
        },
        {
          n: "13",
          marks: 4,
          text: "The midpoints of the sides of triangle ABC are the points D, E, and F. Given that the coordinates of D, E, and F are (5, 1), (6, 5), and (0, 3), respectively, find the coordinates of A, B and C.",
        },
        {
          n: "14",
          marks: 4,
          text: `A city has two main roads which cross each other at the centre of the city. These two roads are along the North–South (N–S) direction and East–West (E–W) direction. All the other streets of the city run parallel to these roads and are 200 m apart. There are 10 streets in each direction.
(i) Using 1 cm = 200 m, draw a model of the city in your notebook. Represent the roads/streets by single lines.
(ii) There are street intersections in the model. Each street intersection is formed by two streets — one running in the N–S direction and another in the E–W direction. Each street intersection is referred to in the following manner: If the second street running in the N–S direction and 5th street in the E–W direction meet at some crossing, then we call this street intersection (2, 5). Using this convention, find:
(a) how many street intersections can be referred to as (4, 3).
(b) how many street intersections can be referred to as (3, 4).`,
        },
        {
          n: "15",
          marks: 3,
          text: `A computer graphics program displays images on a rectangular screen whose coordinate system has the origin at the bottom-left corner. The screen is 800 pixels wide and 600 pixels high. A circular icon of radius 80 pixels is drawn with its centre at the point A (100, 150). Another circular icon of radius 100 pixels is drawn with its centre at the point B (250, 230). Determine:
(i) whether any part of either circle lies outside the screen.
(ii) whether the two circles intersect each other.`,
        },
        {
          n: "16",
          marks: 3,
          text: "Plot the points A (2, 1), B (−1, 2), C (−2, −1), and D (1, −2) in the coordinate plane. Is ABCD a square? Can you explain why? What is the area of this square?",
        },
      ],
    },
  ],
};
