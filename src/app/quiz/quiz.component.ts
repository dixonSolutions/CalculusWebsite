import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz, Question } from './quiz.types';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizzes: Quiz[] = [
    {
      id: 1,
      name: 'Basic Limits Concepts',
      description: 'Test your understanding of fundamental limit concepts',
      questions: [
        {
          id: 1,
          title: 'What is the limit of sin(x)/x as x approaches 0?',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Limit_of_sin_x_over_x_as_x_approaches_0.svg/440px-Limit_of_sin_x_over_x_as_x_approaches_0.svg.png',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Undefined' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 2,
          hint: 'Try plotting the function for values very close to 0'
        },
        {
          id: 2,
          title: 'What is the limit of (x² - 1)/(x - 1) as x approaches 1?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '2' },
            { id: 3, text: '1' },
            { id: 4, text: 'Undefined' }
          ],
          correctAnswerId: 2,
          hint: 'Try factoring the numerator'
        },
        {
          id: 3,
          title: 'What is the limit of 1/x as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Undefined' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 1,
          hint: 'Think about what happens to fractions with very large denominators'
        },
        {
          id: 4,
          title: 'What is the limit of x²/x as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Infinity' },
            { id: 4, text: 'Undefined' }
          ],
          correctAnswerId: 3,
          hint: 'Simplify the expression first'
        },
        {
          id: 5,
          title: 'What is the limit of √x as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Infinity' },
            { id: 4, text: 'Undefined' }
          ],
          correctAnswerId: 3,
          hint: 'Consider how square root grows compared to linear functions'
        },
        {
          id: 6,
          title: 'What is the limit of 1/x² as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Infinity' },
            { id: 4, text: 'Undefined' }
          ],
          correctAnswerId: 3,
          hint: 'Think about very small numbers in the denominator'
        },
        {
          id: 7,
          title: 'What is the limit of e^x as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'e' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 4,
          hint: 'Consider the exponential growth behavior'
        },
        {
          id: 8,
          title: 'What is the limit of ln(x) as x approaches 0⁺?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '-Infinity' },
            { id: 3, text: 'Infinity' },
            { id: 4, text: 'Undefined' }
          ],
          correctAnswerId: 2,
          hint: 'Think about the domain of ln(x)'
        },
        {
          id: 9,
          title: 'What is the limit of sin(1/x) as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Does not exist' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 1,
          hint: 'Consider what happens to 1/x for very large x'
        },
        {
          id: 10,
          title: 'What is the limit of x/|x| as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Does not exist' },
            { id: 4, text: '-1' }
          ],
          correctAnswerId: 3,
          hint: 'Check the left and right hand limits'
        }
      ]
    },
    {
      id: 2,
      name: 'One-Sided Limits',
      description: 'Practice evaluating one-sided limits and understanding their significance',
      questions: [
        {
          id: 1,
          title: 'What is the left-hand limit of 1/x as x approaches 0?',
          answers: [
            { id: 1, text: 'Negative Infinity' },
            { id: 2, text: 'Positive Infinity' },
            { id: 3, text: '0' },
            { id: 4, text: 'Undefined' }
          ],
          correctAnswerId: 1,
          hint: 'Consider what happens when x is slightly negative'
        },
        {
          id: 2,
          title: 'What is the right-hand limit of √x as x approaches 0?',
          answers: [
            { id: 1, text: 'Does not exist' },
            { id: 2, text: '0' },
            { id: 3, text: 'Infinity' },
            { id: 4, text: '-Infinity' }
          ],
          correctAnswerId: 2,
          hint: 'Think about very small positive numbers'
        },
        {
          id: 3,
          title: 'For what value of k does lim(x→2⁺) |x-2|/(x-2) = k?',
          answers: [
            { id: 1, text: '-1' },
            { id: 2, text: '0' },
            { id: 3, text: '1' },
            { id: 4, text: 'Does not exist' }
          ],
          correctAnswerId: 3,
          hint: 'Consider the definition of absolute value'
        },
        {
          id: 4,
          title: 'What is the left-hand limit of [x] as x approaches 2?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '2' },
            { id: 3, text: '3' },
            { id: 4, text: 'Does not exist' }
          ],
          correctAnswerId: 1,
          hint: 'The floor function takes the largest integer less than x'
        },
        {
          id: 5,
          title: 'What is the right-hand limit of tan(x) as x approaches π/2?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '-Infinity' },
            { id: 3, text: 'Infinity' },
            { id: 4, text: '0' }
          ],
          correctAnswerId: 3,
          hint: 'Consider the behavior of tangent near π/2'
        },
        {
          id: 6,
          title: 'What is the left-hand limit of ln|x| as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: 'Infinity' },
            { id: 3, text: '-Infinity' },
            { id: 4, text: 'Does not exist' }
          ],
          correctAnswerId: 3,
          hint: 'Consider very small positive numbers in ln(x)'
        },
        {
          id: 7,
          title: 'What is the right-hand limit of 1/(x-1)² as x approaches 1?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: '-Infinity' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 4,
          hint: 'Think about very small positive numbers in the denominator'
        },
        {
          id: 8,
          title: 'What is the left-hand limit of cos(1/x) as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Does not exist' },
            { id: 4, text: '-1' }
          ],
          correctAnswerId: 3,
          hint: 'Consider the oscillation of cosine with large inputs'
        },
        {
          id: 9,
          title: 'What is the right-hand limit of e^(1/x) as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Infinity' },
            { id: 4, text: '-Infinity' }
          ],
          correctAnswerId: 3,
          hint: 'Think about exponential growth with large positive inputs'
        },
        {
          id: 10,
          title: 'What is the left-hand limit of x/|x| as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: '-1' },
            { id: 4, text: 'Does not exist' }
          ],
          correctAnswerId: 3,
          hint: 'Consider the sign of very small negative numbers'
        }
      ]
    },
    {
      id: 3,
      name: 'Limit Properties and Special Limits',
      description: 'Test your knowledge of limit properties and important special limits',
      questions: [
        {
          id: 1,
          title: 'What is the limit of (1 + 1/n)^n as n approaches infinity?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '2' },
            { id: 3, text: 'e' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 3,
          hint: 'This is a fundamental limit that defines e'
        },
        {
          id: 2,
          title: 'What is the limit of (sin(x))/(x) as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: '-1' },
            { id: 4, text: 'Does not exist' }
          ],
          correctAnswerId: 2,
          hint: 'This is a fundamental trigonometric limit'
        },
        {
          id: 3,
          title: 'What is the limit of (1 - cos(x))/(x²) as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1/2' },
            { id: 3, text: '1' },
            { id: 4, text: 'Does not exist' }
          ],
          correctAnswerId: 2,
          hint: 'Use the half-angle formula and previous limit knowledge'
        },
        {
          id: 4,
          title: 'What is the limit of (a^x - 1)/x as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'ln(a)' },
            { id: 4, text: 'a' }
          ],
          correctAnswerId: 3,
          hint: 'This is related to the derivative of exponential functions'
        },
        {
          id: 5,
          title: 'What is the limit of x·sin(1/x) as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'Does not exist' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 3,
          hint: 'Consider the bounded nature of sine'
        },
        {
          id: 6,
          title: 'What is the limit of (tan(x))/x as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: '2' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 2,
          hint: 'Use the definition of tangent and previous limits'
        },
        {
          id: 7,
          title: 'What is the limit of (e^x - 1 - x)/x² as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1/2' },
            { id: 3, text: '1' },
            { id: 4, text: 'e' }
          ],
          correctAnswerId: 2,
          hint: 'This is related to the second derivative of e^x'
        },
        {
          id: 8,
          title: 'What is the limit of (√(x+1) - √x) as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1/2' },
            { id: 3, text: '1' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 1,
          hint: 'Rationalize the numerator'
        },
        {
          id: 9,
          title: 'What is the limit of x·ln(1 + 1/x) as x approaches infinity?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: 'e' },
            { id: 4, text: 'Infinity' }
          ],
          correctAnswerId: 2,
          hint: 'This is related to a fundamental limit'
        },
        {
          id: 10,
          title: 'What is the limit of (sin(x) - x)/x³ as x approaches 0?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '-1/6' },
            { id: 3, text: '1/6' },
            { id: 4, text: 'Does not exist' }
          ],
          correctAnswerId: 2,
          hint: 'Use the Taylor series expansion of sin(x)'
        }
      ]
    },
    {
      id: 4,
      name: 'Basic Derivatives',
      description: 'Test your knowledge of fundamental derivative rules',
      questions: [
        {
          id: 1,
          title: 'What is the derivative of x³?',
          answers: [
            { id: 1, text: '3x²' },
            { id: 2, text: 'x²' },
            { id: 3, text: '3x' },
            { id: 4, text: '3' }
          ],
          correctAnswerId: 1,
          hint: 'Use the power rule: multiply by the power and reduce the power by 1'
        },
        {
          id: 2,
          title: 'What is the derivative of e^x?',
          answers: [
            { id: 1, text: 'e^(x-1)' },
            { id: 2, text: 'xe^x' },
            { id: 3, text: 'e^x' },
            { id: 4, text: 'ln(x)' }
          ],
          correctAnswerId: 3,
          hint: 'This is a special function that is its own derivative'
        },
        {
          id: 3,
          title: 'What is the derivative of ln(x)?',
          answers: [
            { id: 1, text: '1/x' },
            { id: 2, text: 'x' },
            { id: 3, text: '1' },
            { id: 4, text: 'ln(x-1)' }
          ],
          correctAnswerId: 1,
          hint: 'This is the reciprocal function'
        },
        {
          id: 4,
          title: 'What is the derivative of √x?',
          answers: [
            { id: 1, text: '1/(2√x)' },
            { id: 2, text: '2√x' },
            { id: 3, text: '1/2x' },
            { id: 4, text: '1/x' }
          ],
          correctAnswerId: 1,
          hint: 'Write as x^(1/2) and use the power rule'
        },
        {
          id: 5,
          title: 'What is the derivative of 1/x?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '-1/x' },
            { id: 3, text: '-1/x²' },
            { id: 4, text: '1/x²' }
          ],
          correctAnswerId: 3,
          hint: 'Write as x^(-1) and use the power rule'
        },
        {
          id: 6,
          title: 'What is the derivative of x·sin(x)?',
          answers: [
            { id: 1, text: 'sin(x) + x·cos(x)' },
            { id: 2, text: 'x·cos(x)' },
            { id: 3, text: 'sin(x) + cos(x)' },
            { id: 4, text: 'x·sin(x)' }
          ],
          correctAnswerId: 1,
          hint: 'Use the product rule'
        },
        {
          id: 7,
          title: 'What is the derivative of sin(x²)?',
          answers: [
            { id: 1, text: '2x·cos(x²)' },
            { id: 2, text: 'cos(x²)' },
            { id: 3, text: '2x·sin(x²)' },
            { id: 4, text: 'sin(2x)' }
          ],
          correctAnswerId: 1,
          hint: 'Use the chain rule'
        },
        {
          id: 8,
          title: 'What is the derivative of (x² + 1)/(x - 1)?',
          answers: [
            { id: 1, text: '(2x(x-1) - (x²+1))/(x-1)²' },
            { id: 2, text: '2x/(x-1)' },
            { id: 3, text: '(x²+1)/(x-1)²' },
            { id: 4, text: '2x/(x²-1)' }
          ],
          correctAnswerId: 1,
          hint: 'Use the quotient rule'
        },
        {
          id: 9,
          title: 'What is the derivative of arctan(x)?',
          answers: [
            { id: 1, text: '-1/(1+x²)' },
            { id: 2, text: '1/(1+x²)' },
            { id: 3, text: '1/√(1-x²)' },
            { id: 4, text: '-1/√(1-x²)' }
          ],
          correctAnswerId: 2,
          hint: 'This is a standard inverse trigonometric derivative'
        },
        {
          id: 10,
          title: 'What is the derivative of sec(x)?',
          answers: [
            { id: 1, text: 'sec(x)tan(x)' },
            { id: 2, text: '-sec(x)tan(x)' },
            { id: 3, text: 'tan(x)' },
            { id: 4, text: 'sec²(x)' }
          ],
          correctAnswerId: 1,
          hint: 'This is a standard trigonometric derivative'
        }
      ]
    },
    {
      id: 5,
      name: 'Chain Rule Applications',
      description: 'Practice applying the chain rule to various functions',
      questions: [
        {
          id: 1,
          title: 'What is d/dx[sin(x²)]?',
          answers: [
            { id: 1, text: '2x·cos(x²)' },
            { id: 2, text: 'cos(x²)' },
            { id: 3, text: '2x·sin(x²)' },
            { id: 4, text: 'sin(2x)' }
          ],
          correctAnswerId: 1,
          hint: 'Apply chain rule: derivative of outer function times derivative of inner function'
        },
        {
          id: 2,
          title: 'What is d/dx[ln(cos(x))]?',
          answers: [
            { id: 1, text: '-tan(x)' },
            { id: 2, text: '-sin(x)/cos(x)' },
            { id: 3, text: '1/cos(x)' },
            { id: 4, text: '-1/sin(x)' }
          ],
          correctAnswerId: 1,
          hint: 'Use chain rule with ln(u) and cos(x)'
        },
        {
          id: 3,
          title: 'What is d/dx[e^(x²)]?',
          answers: [
            { id: 1, text: 'e^(x²)' },
            { id: 2, text: '2x·e^(x²)' },
            { id: 3, text: 'x·e^(x²)' },
            { id: 4, text: '2e^(x²)' }
          ],
          correctAnswerId: 2,
          hint: 'Apply chain rule to exponential function'
        },
        {
          id: 4,
          title: 'What is d/dx[(sin(x))²]?',
          answers: [
            { id: 1, text: '2sin(x)' },
            { id: 2, text: '2sin(x)cos(x)' },
            { id: 3, text: 'cos(2x)' },
            { id: 4, text: '2cos(x)' }
          ],
          correctAnswerId: 2,
          hint: 'Use chain rule with power rule'
        },
        {
          id: 5,
          title: 'What is d/dx[√(1+x²)]?',
          answers: [
            { id: 1, text: 'x/√(1+x²)' },
            { id: 2, text: '1/√(1+x²)' },
            { id: 3, text: '2x/√(1+x²)' },
            { id: 4, text: '1/(2√(1+x²))' }
          ],
          correctAnswerId: 1,
          hint: 'Write as (1+x²)^(1/2) and use chain rule'
        },
        {
          id: 6,
          title: 'What is d/dx[tan(ln(x))]?',
          answers: [
            { id: 1, text: 'sec²(ln(x))/x' },
            { id: 2, text: 'tan(ln(x))/x' },
            { id: 3, text: 'sec²(x)/x' },
            { id: 4, text: '1/(x·cos²(ln(x)))' }
          ],
          correctAnswerId: 1,
          hint: 'Apply chain rule twice'
        },
        {
          id: 7,
          title: 'What is d/dx[arcsin(x²)]?',
          answers: [
            { id: 1, text: '2x/√(1-x⁴)' },
            { id: 2, text: '1/√(1-x⁴)' },
            { id: 3, text: '2x/√(1-x²)' },
            { id: 4, text: '1/√(1-x²)' }
          ],
          correctAnswerId: 1,
          hint: 'Use chain rule with arcsin(u)'
        },
        {
          id: 8,
          title: 'What is d/dx[ln(x + √(x² + 1))]?',
          answers: [
            { id: 1, text: '1/√(x² + 1)' },
            { id: 2, text: '1/(x + √(x² + 1))' },
            { id: 3, text: '1/x' },
            { id: 4, text: '1/(x² + 1)' }
          ],
          correctAnswerId: 1,
          hint: 'This is actually the inverse hyperbolic sine'
        },
        {
          id: 9,
          title: 'What is d/dx[cos(e^x)]?',
          answers: [
            { id: 1, text: '-sin(e^x)' },
            { id: 2, text: '-e^x·sin(e^x)' },
            { id: 3, text: '-sin(e^x)·e^x' },
            { id: 4, text: 'cos(e^x)·e^x' }
          ],
          correctAnswerId: 2,
          hint: 'Apply chain rule to composition of cos and e^x'
        },
        {
          id: 10,
          title: 'What is d/dx[(1+x)^(1/3)]?',
          answers: [
            { id: 1, text: '1/3(1+x)^(-2/3)' },
            { id: 2, text: '(1+x)^(-2/3)' },
            { id: 3, text: '1/3(1+x)^(1/3)' },
            { id: 4, text: '1/(3(1+x)^(2/3))' }
          ],
          correctAnswerId: 4,
          hint: 'Use chain rule with power rule'
        }
      ]
    },
    {
      id: 6,
      name: 'Product and Quotient Rules',
      description: 'Master the application of product and quotient rules',
      questions: [
        {
          id: 1,
          title: 'What is d/dx[x·ln(x)]?',
          answers: [
            { id: 1, text: 'ln(x) + 1' },
            { id: 2, text: 'x·(1/x)' },
            { id: 3, text: 'ln(x)' },
            { id: 4, text: '1/x' }
          ],
          correctAnswerId: 1,
          hint: 'Use the product rule'
        },
        {
          id: 2,
          title: 'What is d/dx[x²·sin(x)]?',
          answers: [
            { id: 1, text: '2x·sin(x) + x²·cos(x)' },
            { id: 2, text: 'x²·cos(x)' },
            { id: 3, text: '2x·sin(x)' },
            { id: 4, text: 'sin(x) + x²·cos(x)' }
          ],
          correctAnswerId: 1,
          hint: 'Apply product rule with power rule'
        },
        {
          id: 3,
          title: 'What is d/dx[e^x·cos(x)]?',
          answers: [
            { id: 1, text: 'e^x·cos(x) - e^x·sin(x)' },
            { id: 2, text: 'e^x·(cos(x) - sin(x))' },
            { id: 3, text: 'e^x·cos(x)' },
            { id: 4, text: '-e^x·sin(x)' }
          ],
          correctAnswerId: 2,
          hint: 'Use product rule with e^x'
        },
        {
          id: 4,
          title: 'What is d/dx[x/sin(x)]?',
          answers: [
            { id: 1, text: '(sin(x) - x·cos(x))/sin²(x)' },
            { id: 2, text: '1/sin(x) - x·cos(x)/sin²(x)' },
            { id: 3, text: 'cos(x)/sin²(x)' },
            { id: 4, text: '1/sin²(x)' }
          ],
          correctAnswerId: 1,
          hint: 'Apply the quotient rule'
        },
        {
          id: 5,
          title: 'What is d/dx[(x² + 1)/(x - 1)]?',
          answers: [
            { id: 1, text: '(2x(x-1) - (x²+1))/(x-1)²' },
            { id: 2, text: '2x/(x-1)' },
            { id: 3, text: '(x²+1)/(x-1)²' },
            { id: 4, text: '2x/(x²-1)' }
          ],
          correctAnswerId: 1,
          hint: 'Use the quotient rule carefully'
        },
        {
          id: 6,
          title: 'What is d/dx[x·e^x]?',
          answers: [
            { id: 1, text: 'e^x + x·e^x' },
            { id: 2, text: 'x·e^x' },
            { id: 3, text: 'e^x' },
            { id: 4, text: 'x + e^x' }
          ],
          correctAnswerId: 1,
          hint: 'Apply product rule'
        },
        {
          id: 7,
          title: 'What is d/dx[tan(x)/x]?',
          answers: [
            { id: 1, text: '(x·sec²(x) - tan(x))/x²' },
            { id: 2, text: 'sec²(x)/x' },
            { id: 3, text: 'tan(x)/x²' },
            { id: 4, text: '1/x²' }
          ],
          correctAnswerId: 1,
          hint: 'Use quotient rule and recall d/dx[tan(x)]'
        },
        {
          id: 8,
          title: 'What is d/dx[x·arctan(x)]?',
          answers: [
            { id: 1, text: 'arctan(x) + x/(1+x²)' },
            { id: 2, text: 'x/(1+x²)' },
            { id: 3, text: 'arctan(x)' },
            { id: 4, text: '1/(1+x²)' }
          ],
          correctAnswerId: 1,
          hint: 'Use product rule with arctan(x)'
        },
        {
          id: 9,
          title: 'What is d/dx[(ln(x))²]?',
          answers: [
            { id: 1, text: '2·ln(x)/x' },
            { id: 2, text: '2/x' },
            { id: 3, text: 'ln(x)/x' },
            { id: 4, text: '2·ln(x)' }
          ],
          correctAnswerId: 1,
          hint: 'Use chain rule with square function'
        },
        {
          id: 10,
          title: 'What is d/dx[sin(x)·cos(x)]?',
          answers: [
            { id: 1, text: 'cos²(x) - sin²(x)' },
            { id: 2, text: 'sin(2x)' },
            { id: 3, text: 'cos(2x)' },
            { id: 4, text: '1' }
          ],
          correctAnswerId: 1,
          hint: 'Apply product rule to sine and cosine'
        }
      ]
    },
    {
      id: 7,
      name: 'Basic Integration Techniques',
      description: 'Practice fundamental integration methods and rules',
      questions: [
        {
          id: 1,
          title: 'What is ∫x² dx?',
          answers: [
            { id: 1, text: 'x³/3 + C' },
            { id: 2, text: 'x³ + C' },
            { id: 3, text: '2x + C' },
            { id: 4, text: 'x²/2 + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use the power rule for integration: add 1 to the power and divide by the new power'
        },
        {
          id: 2,
          title: 'What is ∫sin(x) dx?',
          answers: [
            { id: 1, text: 'cos(x) + C' },
            { id: 2, text: '-cos(x) + C' },
            { id: 3, text: 'sin(x) + C' },
            { id: 4, text: '-sin(x) + C' }
          ],
          correctAnswerId: 2,
          hint: 'Remember the negative when integrating sine'
        },
        {
          id: 3,
          title: 'What is ∫1/x dx?',
          answers: [
            { id: 1, text: 'x + C' },
            { id: 2, text: 'ln|x| + C' },
            { id: 3, text: '1/x + C' },
            { id: 4, text: 'e^x + C' }
          ],
          correctAnswerId: 2,
          hint: 'This is the natural logarithm integration'
        },
        {
          id: 4,
          title: 'What is ∫e^x dx?',
          answers: [
            { id: 1, text: 'e^x + C' },
            { id: 2, text: 'ln(x) + C' },
            { id: 3, text: 'xe^x + C' },
            { id: 4, text: 'e^x/x + C' }
          ],
          correctAnswerId: 1,
          hint: 'e^x is its own derivative'
        },
        {
          id: 5,
          title: 'What is ∫sec²(x) dx?',
          answers: [
            { id: 1, text: 'sec(x) + C' },
            { id: 2, text: 'tan(x) + C' },
            { id: 3, text: 'sin(x) + C' },
            { id: 4, text: 'cos(x) + C' }
          ],
          correctAnswerId: 2,
          hint: 'This is the derivative of tangent in reverse'
        },
        {
          id: 6,
          title: 'What is ∫x·e^x dx?',
          answers: [
            { id: 1, text: 'e^x(x - 1) + C' },
            { id: 2, text: 'x·e^x + C' },
            { id: 3, text: 'e^x + C' },
            { id: 4, text: '(x + 1)e^x + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use integration by parts'
        },
        {
          id: 7,
          title: 'What is ∫1/(1 + x²) dx?',
          answers: [
            { id: 1, text: 'tan(x) + C' },
            { id: 2, text: 'arctan(x) + C' },
            { id: 3, text: 'ln(1 + x²) + C' },
            { id: 4, text: '1/x + C' }
          ],
          correctAnswerId: 2,
          hint: 'This is the derivative of arctangent in reverse'
        },
        {
          id: 8,
          title: 'What is ∫cos(2x) dx?',
          answers: [
            { id: 1, text: 'sin(2x) + C' },
            { id: 2, text: 'sin(2x)/2 + C' },
            { id: 3, text: '2sin(x) + C' },
            { id: 4, text: 'cos(2x)/2 + C' }
          ],
          correctAnswerId: 2,
          hint: 'Remember to account for the chain rule when integrating'
        },
        {
          id: 9,
          title: 'What is ∫x·ln(x) dx?',
          answers: [
            { id: 1, text: 'x²·ln(x)/2 - x²/4 + C' },
            { id: 2, text: 'x²·ln(x)/2 - x/2 + C' },
            { id: 3, text: 'x²·ln(x) - x + C' },
            { id: 4, text: 'x²/2·ln(x) + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use integration by parts'
        },
        {
          id: 10,
          title: 'What is ∫√x dx?',
          answers: [
            { id: 1, text: '2x^(3/2)/3 + C' },
            { id: 2, text: 'x^(3/2) + C' },
            { id: 3, text: '2√x + C' },
            { id: 4, text: 'x·√x + C' }
          ],
          correctAnswerId: 1,
          hint: 'Write as x^(1/2) and use the power rule'
        }
      ]
    },
    {
      id: 8,
      name: 'Integration Applications',
      description: 'Apply integration to solve real-world problems',
      questions: [
        {
          id: 1,
          title: 'A particle moves with velocity v(t) = 3t² m/s. If it starts at position s(0) = 2m, what is its position after 2 seconds?',
          answers: [
            { id: 1, text: '10 meters' },
            { id: 2, text: '8 meters' },
            { id: 3, text: '12 meters' },
            { id: 4, text: '14 meters' }
          ],
          correctAnswerId: 2,
          hint: 'Integrate v(t) and add initial position'
        },
        {
          id: 2,
          title: 'Find the area between y = x² and y = x from x = 0 to x = 1',
          answers: [
            { id: 1, text: '1/3 square units' },
            { id: 2, text: '1/2 square units' },
            { id: 3, text: '2/3 square units' },
            { id: 4, text: '1 square unit' }
          ],
          correctAnswerId: 1,
          hint: 'Integrate the difference of the functions'
        },
        {
          id: 3,
          title: 'A tank is filled with water at a rate of r(t) = 2t + 1 liters/min. How many liters enter in the first 3 minutes?',
          answers: [
            { id: 1, text: '9 liters' },
            { id: 2, text: '12 liters' },
            { id: 3, text: '15 liters' },
            { id: 4, text: '18 liters' }
          ],
          correctAnswerId: 2,
          hint: 'Integrate the rate function from 0 to 3'
        },
        {
          id: 4,
          title: 'Find the volume of the solid formed by rotating y = √x about the x-axis from x = 0 to x = 4',
          answers: [
            { id: 1, text: '16π cubic units' },
            { id: 2, text: '32π/3 cubic units' },
            { id: 3, text: '8π cubic units' },
            { id: 4, text: '24π cubic units' }
          ],
          correctAnswerId: 2,
          hint: 'Use the washer method: π∫[f(x)]² dx'
        },
        {
          id: 5,
          title: 'Find the work done in stretching a spring from 2 to 5 meters if the force is F(x) = 2x newtons',
          answers: [
            { id: 1, text: '23 joules' },
            { id: 2, text: '21 joules' },
            { id: 3, text: '19 joules' },
            { id: 4, text: '25 joules' }
          ],
          correctAnswerId: 1,
          hint: 'Work is the integral of force with respect to distance'
        },
        {
          id: 6,
          title: 'Find the average value of f(x) = x² on [0,2]',
          answers: [
            { id: 1, text: '4/3' },
            { id: 2, text: '2' },
            { id: 3, text: '8/3' },
            { id: 4, text: '3' }
          ],
          correctAnswerId: 2,
          hint: 'Use the mean value theorem for integrals'
        },
        {
          id: 7,
          title: 'A region bounded by y = x² and y = 2x is rotated about the y-axis. Find the volume.',
          answers: [
            { id: 1, text: '4π/15 cubic units' },
            { id: 2, text: '8π/15 cubic units' },
            { id: 3, text: '2π/3 cubic units' },
            { id: 4, text: 'π cubic units' }
          ],
          correctAnswerId: 2,
          hint: 'Use the shell method'
        },
        {
          id: 8,
          title: 'Find the arc length of y = ln(x) from x = 1 to x = 2',
          answers: [
            { id: 1, text: '1.124 units' },
            { id: 2, text: '1.312 units' },
            { id: 3, text: '1.524 units' },
            { id: 4, text: '1.762 units' }
          ],
          correctAnswerId: 1,
          hint: 'Use the arc length formula with derivative'
        },
        {
          id: 9,
          title: 'Find the surface area generated by rotating y = x² about the x-axis from x = 0 to x = 1',
          answers: [
            { id: 1, text: '2π units²' },
            { id: 2, text: '5π/3 units²' },
            { id: 3, text: '4π/3 units²' },
            { id: 4, text: 'π units²' }
          ],
          correctAnswerId: 2,
          hint: 'Use the surface area formula for revolution'
        },
        {
          id: 10,
          title: 'A particle moves with acceleration a(t) = 6t. If v(0) = 2 and s(0) = 1, find s(2).',
          answers: [
            { id: 1, text: '13 units' },
            { id: 2, text: '11 units' },
            { id: 3, text: '9 units' },
            { id: 4, text: '15 units' }
          ],
          correctAnswerId: 1,
          hint: 'Integrate twice and use initial conditions'
        }
      ]
    },
    {
      id: 9,
      name: 'Integration by Parts and Substitution',
      description: 'Master advanced integration techniques',
      questions: [
        {
          id: 1,
          title: 'What is ∫x·cos(x) dx?',
          answers: [
            { id: 1, text: 'x·sin(x) + cos(x) + C' },
            { id: 2, text: 'x·sin(x) - cos(x) + C' },
            { id: 3, text: 'sin(x) - x·cos(x) + C' },
            { id: 4, text: 'x·cos(x) - sin(x) + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use integration by parts with u = x and dv = cos(x)dx'
        },
        {
          id: 2,
          title: 'What is ∫ln(x)·x dx?',
          answers: [
            { id: 1, text: 'x²·ln(x)/2 - x²/4 + C' },
            { id: 2, text: 'x²·ln(x)/2 - x/2 + C' },
            { id: 3, text: 'x²·ln(x) - x + C' },
            { id: 4, text: 'x²/2·ln(x) + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use integration by parts with u = ln(x) and dv = x dx'
        },
        {
          id: 3,
          title: 'What is ∫sin²(x) dx?',
          answers: [
            { id: 1, text: 'x/2 - sin(2x)/4 + C' },
            { id: 2, text: 'x - sin(2x)/2 + C' },
            { id: 3, text: 'sin(x)cos(x) + C' },
            { id: 4, text: '-cos(2x)/4 + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use the double angle formula'
        },
        {
          id: 4,
          title: 'What is ∫x·arctan(x) dx?',
          answers: [
            { id: 1, text: 'x²·arctan(x)/2 - x/2 + ln(1+x²)/4 + C' },
            { id: 2, text: 'x²·arctan(x)/2 - ln(1+x²)/2 + C' },
            { id: 3, text: 'x·arctan(x) - ln(1+x²) + C' },
            { id: 4, text: 'x²·arctan(x)/2 + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use integration by parts'
        },
        {
          id: 5,
          title: 'What is ∫sec³(x) dx?',
          answers: [
            { id: 1, text: 'sec(x)tan(x)/2 + ln|sec(x) + tan(x)| + C' },
            { id: 2, text: 'sec(x)tan(x)/2 + sec(x)/2 + C' },
            { id: 3, text: 'tan(x) + sec(x) + C' },
            { id: 4, text: 'sec(x)tan(x)/2 + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use substitution u = sec(x)'
        },
        {
          id: 6,
          title: 'What is ∫x²e^x dx?',
          answers: [
            { id: 1, text: 'e^x(x² - 2x + 2) + C' },
            { id: 2, text: 'e^x(x² - x) + C' },
            { id: 3, text: 'x²e^x - 2xe^x + C' },
            { id: 4, text: 'e^x(x² + 2) + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use integration by parts twice'
        },
        {
          id: 7,
          title: 'What is ∫tan²(x) dx?',
          answers: [
            { id: 1, text: 'tan(x) - x + C' },
            { id: 2, text: 'sec²(x)/2 + C' },
            { id: 3, text: 'tan(x) - sec(x) + C' },
            { id: 4, text: 'tan(x) - ln|cos(x)| + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use the identity tan²(x) = sec²(x) - 1'
        },
        {
          id: 8,
          title: 'What is ∫x·sin(ln(x)) dx?',
          answers: [
            { id: 1, text: 'x·sin(ln(x)) + x·cos(ln(x)) + C' },
            { id: 2, text: 'x·sin(ln(x)) - x·cos(ln(x)) + C' },
            { id: 3, text: 'e^x·sin(x) + C' },
            { id: 4, text: 'x²·sin(ln(x))/2 + C' }
          ],
          correctAnswerId: 2,
          hint: 'Use substitution u = ln(x) first'
        },
        {
          id: 9,
          title: 'What is ∫1/(x·ln(x)) dx?',
          answers: [
            { id: 1, text: 'ln|ln(x)| + C' },
            { id: 2, text: 'ln(x) + C' },
            { id: 3, text: '1/ln(x) + C' },
            { id: 4, text: 'ln|x| + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use substitution u = ln(x)'
        },
        {
          id: 10,
          title: 'What is ∫x·ln²(x) dx?',
          answers: [
            { id: 1, text: 'x²·ln²(x)/2 - x²·ln(x) + x²/2 + C' },
            { id: 2, text: 'x²·ln²(x)/2 - x + C' },
            { id: 3, text: 'x·ln²(x) - 2x·ln(x) + 2x + C' },
            { id: 4, text: 'x²·ln²(x)/4 + C' }
          ],
          correctAnswerId: 1,
          hint: 'Use integration by parts twice'
        }
      ]
    },
    {
      id: 10,
      name: 'Series and Sequences',
      description: 'Test your knowledge of infinite series and sequences',
      questions: [
        {
          id: 1,
          title: 'For what values of r does the geometric series ∑r^n converge?',
          answers: [
            { id: 1, text: '|r| < 1' },
            { id: 2, text: '|r| ≤ 1' },
            { id: 3, text: 'r < 1' },
            { id: 4, text: 'r > -1' }
          ],
          correctAnswerId: 1,
          hint: 'Consider the ratio test'
        },
        {
          id: 2,
          title: 'What is the sum of the geometric series ∑(1/2)^n from n=0 to infinity?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '2' },
            { id: 3, text: '1/2' },
            { id: 4, text: 'Diverges' }
          ],
          correctAnswerId: 2,
          hint: 'Use the formula for sum of geometric series: a/(1-r)'
        },
        {
          id: 3,
          title: 'Which series converges?',
          answers: [
            { id: 1, text: '∑1/n' },
            { id: 2, text: '∑1/n²' },
            { id: 3, text: '∑1/√n' },
            { id: 4, text: '∑1/ln(n)' }
          ],
          correctAnswerId: 2,
          hint: 'Compare to p-series convergence criteria'
        },
        {
          id: 4,
          title: 'What is the radius of convergence of the power series ∑(x^n)/n!?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '∞' },
            { id: 3, text: '0' },
            { id: 4, text: 'e' }
          ],
          correctAnswerId: 2,
          hint: 'This is the Taylor series for e^x'
        },
        {
          id: 5,
          title: 'Which test would be most appropriate for ∑n/(n²+1)?',
          answers: [
            { id: 1, text: 'Ratio Test' },
            { id: 2, text: 'Root Test' },
            { id: 3, text: 'Limit Comparison Test' },
            { id: 4, text: 'Integral Test' }
          ],
          correctAnswerId: 3,
          hint: 'Compare to a similar series with known behavior'
        },
        {
          id: 6,
          title: 'What is the sum of the series ∑1/(n(n+1))?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '2' },
            { id: 3, text: '1/2' },
            { id: 4, text: 'Diverges' }
          ],
          correctAnswerId: 1,
          hint: 'Use partial fractions decomposition'
        },
        {
          id: 7,
          title: 'For which p does ∑1/n^p converge?',
          answers: [
            { id: 1, text: 'p > 0' },
            { id: 2, text: 'p > 1' },
            { id: 3, text: 'p ≥ 1' },
            { id: 4, text: 'p > 2' }
          ],
          correctAnswerId: 2,
          hint: 'This is the p-series convergence criterion'
        },
        {
          id: 8,
          title: 'What is the radius of convergence of ∑n!x^n?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '1' },
            { id: 3, text: '∞' },
            { id: 4, text: '1/e' }
          ],
          correctAnswerId: 1,
          hint: 'Use the ratio test'
        },
        {
          id: 9,
          title: 'Which series is absolutely convergent?',
          answers: [
            { id: 1, text: '∑(-1)^n/n' },
            { id: 2, text: '∑(-1)^n/n²' },
            { id: 3, text: '∑(-1)^n/ln(n)' },
            { id: 4, text: '∑(-1)^n/√n' }
          ],
          correctAnswerId: 2,
          hint: 'Check if the series of absolute values converges'
        },
        {
          id: 10,
          title: 'What is the sum of ∑x^n/n! from n=0 to infinity when x=1?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: 'e' },
            { id: 3, text: 'π' },
            { id: 4, text: '∞' }
          ],
          correctAnswerId: 2,
          hint: 'This is the Taylor series for e^x evaluated at x=1'
        }
      ]
    },
    {
      id: 11,
      name: 'Taylor Series',
      description: 'Master Taylor and Maclaurin series expansions',
      questions: [
        {
          id: 1,
          title: 'What is the Maclaurin series for sin(x)?',
          answers: [
            { id: 1, text: '∑(-1)^n·x^(2n+1)/(2n+1)!' },
            { id: 2, text: '∑(-1)^n·x^(2n)/(2n)!' },
            { id: 3, text: '∑x^n/n!' },
            { id: 4, text: '∑(-1)^n·x^n/n!' }
          ],
          correctAnswerId: 1,
          hint: 'Consider the derivatives of sin(x) at x=0'
        },
        {
          id: 2,
          title: 'What is the interval of convergence for the Taylor series of ln(1+x) about x=0?',
          answers: [
            { id: 1, text: '(-1,1]' },
            { id: 2, text: '[-1,1]' },
            { id: 3, text: '(-1,1)' },
            { id: 4, text: '(-∞,∞)' }
          ],
          correctAnswerId: 1,
          hint: 'Consider where ln(1+x) is defined and the ratio test'
        },
        {
          id: 3,
          title: 'What is the first non-zero term in the Taylor series for cos(x) about x=π/2?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: '-1' },
            { id: 3, text: '0' },
            { id: 4, text: 'x' }
          ],
          correctAnswerId: 2,
          hint: 'Evaluate cos(π/2) first'
        },
        {
          id: 4,
          title: 'Which function is represented by the series ∑x^n/n?',
          answers: [
            { id: 1, text: 'e^x' },
            { id: 2, text: 'ln(1-x)' },
            { id: 3, text: '-ln(1-x)' },
            { id: 4, text: '1/(1-x)' }
          ],
          correctAnswerId: 3,
          hint: 'Try differentiating the geometric series'
        },
        {
          id: 5,
          title: 'What is the radius of convergence of the Taylor series for e^x about any point?',
          answers: [
            { id: 1, text: '1' },
            { id: 2, text: 'e' },
            { id: 3, text: '∞' },
            { id: 4, text: 'π' }
          ],
          correctAnswerId: 3,
          hint: 'Consider the behavior of derivatives of e^x'
        },
        {
          id: 6,
          title: 'Which series represents arctan(x)?',
          answers: [
            { id: 1, text: '∑(-1)^n·x^(2n+1)/(2n+1)' },
            { id: 2, text: '∑x^n/n' },
            { id: 3, text: '∑(-1)^n·x^n/n' },
            { id: 4, text: '∑x^(2n)/(2n)!' }
          ],
          correctAnswerId: 1,
          hint: 'Consider the derivative and integrate the geometric series'
        },
        {
          id: 7,
          title: 'What is the error bound when using n=2 in the Taylor series for sin(x) at x=0.1?',
          answers: [
            { id: 1, text: '0.001' },
            { id: 2, text: '0.0001' },
            { id: 3, text: '0.00001' },
            { id: 4, text: '0.000001' }
          ],
          correctAnswerId: 2,
          hint: 'Use the Lagrange error bound formula'
        },
        {
          id: 8,
          title: 'Which of these cannot be represented by a power series?',
          answers: [
            { id: 1, text: 'sin(x)' },
            { id: 2, text: 'e^x' },
            { id: 3, text: '1/x' },
            { id: 4, text: 'cos(x)' }
          ],
          correctAnswerId: 3,
          hint: 'Consider where the function is defined'
        },
        {
          id: 9,
          title: 'What is the Maclaurin series for 1/(1-x)?',
          answers: [
            { id: 1, text: '∑x^n' },
            { id: 2, text: '∑nx^n' },
            { id: 3, text: '∑x^n/n' },
            { id: 4, text: '∑(-1)^n·x^n' }
          ],
          correctAnswerId: 1,
          hint: 'This is the geometric series'
        },
        {
          id: 10,
          title: 'Which technique is most useful for finding the Taylor series of tan(x)?',
          answers: [
            { id: 1, text: 'Direct differentiation' },
            { id: 2, text: 'Division of series' },
            { id: 3, text: 'Integration' },
            { id: 4, text: 'Substitution' }
          ],
          correctAnswerId: 2,
          hint: 'Recall that tan(x) = sin(x)/cos(x)'
        }
      ]
    },
    {
      id: 12,
      name: 'Convergence Tests',
      description: 'Practice applying various convergence tests for series',
      questions: [
        {
          id: 1,
          title: 'Which test is most appropriate for ∑(-1)^n/n?',
          answers: [
            { id: 1, text: 'Ratio Test' },
            { id: 2, text: 'Alternating Series Test' },
            { id: 3, text: 'Comparison Test' },
            { id: 4, text: 'Root Test' }
          ],
          correctAnswerId: 2,
          hint: 'Notice the alternating signs and decreasing terms'
        },
        {
          id: 2,
          title: 'For which series is the ratio test inconclusive?',
          answers: [
            { id: 1, text: '∑1/n!' },
            { id: 2, text: '∑1/n' },
            { id: 3, text: '∑n!' },
            { id: 4, text: '∑1/2^n' }
          ],
          correctAnswerId: 2,
          hint: 'Calculate the limit of consecutive terms'
        },
        {
          id: 3,
          title: 'Which series converges by the integral test?',
          answers: [
            { id: 1, text: '∑1/n' },
            { id: 2, text: '∑1/n²' },
            { id: 3, text: '∑1/n^(1/2)' },
            { id: 4, text: '∑1/n^(1/3)' }
          ],
          correctAnswerId: 2,
          hint: 'Integrate 1/x^p and check convergence'
        },
        {
          id: 4,
          title: 'Which series converges absolutely?',
          answers: [
            { id: 1, text: '∑(-1)^n/n' },
            { id: 2, text: '∑(-1)^n/n²' },
            { id: 3, text: '∑(-1)^n/ln(n)' },
            { id: 4, text: '∑(-1)^n' }
          ],
          correctAnswerId: 2,
          hint: 'Check if the series of absolute values converges'
        },
        {
          id: 5,
          title: 'What is the value of lim(a_(n+1)/a_n) for ∑(n!x^n)?',
          answers: [
            { id: 1, text: '0' },
            { id: 2, text: '∞' },
            { id: 3, text: 'x' },
            { id: 4, text: '|x|' }
          ],
          correctAnswerId: 2,
          hint: 'Apply the ratio test directly'
        },
        {
          id: 6,
          title: 'Which series can be compared to ∑1/n² to prove convergence?',
          answers: [
            { id: 1, text: '∑1/(n²+1)' },
            { id: 2, text: '∑1/n' },
            { id: 3, text: '∑1/√n' },
            { id: 4, text: '∑n/(n²+1)' }
          ],
          correctAnswerId: 1,
          hint: 'Look for series that are smaller than 1/n²'
        },
        {
          id: 7,
          title: 'Which condition of the alternating series test is NOT satisfied by ∑(-1)^n/ln(n)?',
          answers: [
            { id: 1, text: 'Terms alternate in sign' },
            { id: 2, text: 'Terms decrease in magnitude' },
            { id: 3, text: 'Limit of terms is 0' },
            { id: 4, text: 'Series is absolutely convergent' }
          ],
          correctAnswerId: 2,
          hint: 'Check if |a_(n+1)| < |a_n|'
        },
        {
          id: 8,
          title: 'For which p does ∑1/(n·ln^p(n)) converge?',
          answers: [
            { id: 1, text: 'p > 0' },
            { id: 2, text: 'p > 1' },
            { id: 3, text: 'p ≥ 1' },
            { id: 4, text: 'p > 2' }
          ],
          correctAnswerId: 2,
          hint: 'Use the integral test'
        },
        {
          id: 9,
          title: 'Which test is most efficient for ∑(n^2/3^n)?',
          answers: [
            { id: 1, text: 'Ratio Test' },
            { id: 2, text: 'Root Test' },
            { id: 3, text: 'Comparison Test' },
            { id: 4, text: 'Integral Test' }
          ],
          correctAnswerId: 1,
          hint: 'Consider the algebraic simplicity of taking ratios'
        },
        {
          id: 10,
          title: 'What can be concluded about ∑a_n if ∑|a_n| converges?',
          answers: [
            { id: 1, text: '∑a_n diverges' },
            { id: 2, text: '∑a_n converges absolutely' },
            { id: 3, text: '∑a_n converges conditionally' },
            { id: 4, text: 'Nothing can be concluded' }
          ],
          correctAnswerId: 2,
          hint: 'Think about the definition of absolute convergence'
        }
      ]
    }
  ];

  currentQuiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswerId: number | null = null;
  isAnswerSubmitted = false;
  score = 0;
  isQuizCompleted = false;
  showHint = false;
  availableQuizzes: Quiz[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const quizId = params['id'];
      const lessonId = params['lessonId'];
      const quizIds = params['quizIds']?.split(',').map(Number);

      if (quizIds && quizIds.length > 0) {
        // Filter quizzes based on the lesson's quiz IDs
        this.availableQuizzes = this.quizzes.filter(quiz => quizIds.includes(quiz.id));
      } else if (quizId) {
        // Single quiz selection
        const quiz = this.quizzes.find(q => q.id === +quizId);
        if (quiz) {
          this.selectQuiz(quiz);
        }
      } else {
        // Show all quizzes if no specific IDs provided
        this.availableQuizzes = this.quizzes;
      }
    });
  }

  get currentQuestion(): Question | null {
    if (!this.currentQuiz) return null;
    return this.currentQuiz.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    if (!this.currentQuiz) return 0;
    return ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
  }

  selectQuiz(quiz: Quiz) {
    this.currentQuiz = quiz;
    this.resetQuiz();
  }

  selectAnswer(answerId: number) {
    if (!this.isAnswerSubmitted) {
      this.selectedAnswerId = answerId;
    }
  }

  checkAnswer() {
    if (this.selectedAnswerId === null) return;
    
    this.isAnswerSubmitted = true;
    if (this.currentQuestion && this.selectedAnswerId === this.currentQuestion.correctAnswerId) {
      this.score++;
    }
  }

  nextQuestion() {
    if (!this.currentQuiz) return;
    
    if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswerId = null;
      this.isAnswerSubmitted = false;
      this.showHint = false;
    } else {
      this.isQuizCompleted = true;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedAnswerId = null;
      this.isAnswerSubmitted = false;
      this.showHint = false;
    }
  }

  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedAnswerId = null;
    this.isAnswerSubmitted = false;
    this.score = 0;
    this.isQuizCompleted = false;
    this.showHint = false;
  }

  get scorePercentage(): number {
    if (!this.currentQuiz) return 0;
    return (this.score / this.currentQuiz.questions.length) * 100;
  }

  goBackToLesson() {
    const lessonId = this.route.snapshot.queryParams['lessonId'];
    if (lessonId) {
      this.router.navigate(['/lessons'], { queryParams: { id: lessonId } });
    } else {
      this.router.navigate(['/lessons']);
    }
  }

  goBackToPractice() {
    // Only go back to practice if we came from practice page
    if (!this.route.snapshot.queryParams['lessonId']) {
      this.router.navigate(['/practice']);
    } else {
      this.goBackToLesson();
    }
  }
} 