# **App Name**: SortVision

## Core Features:

- Array Control: Allows users to input the size of the array and generate a new array with random values.
- Algorithm Selection: Allows users to select a sorting algorithm from a dropdown menu, including Bubble Sort, Selection Sort, and Insertion Sort.
- Step-by-Step Visualization: Allows users to step through the sorting process forward and backward, visualizing each comparison and swap. Highlights the bars being compared or swapped and displays textual explanations of each step.

## Style Guidelines:

- Primary color: A calm blue (#3498db) to represent stability and order.
- Secondary color: A light grey (#ecf0f1) for the background to provide contrast.
- Accent: A vibrant green (#2ecc71) to highlight elements being compared or swapped.
- Use a clean, minimalist layout to focus on the visualization.
- Use smooth, subtle animations to transition between steps.
- Use clear, simple icons for the control buttons (play, pause, next, back).

## Original User Request:
Interactive Sorting Visualizer with Step-by-Step Controls

Objective: Build a responsive and interactive Sorting Visualizer using JavaScript (or Java/Python if preferred) that allows users to visualize multiple sorting algorithms step by step. The tool should be beginner-friendly and educational, showing each stage of the sorting process.

🛠️ Features to Implement:

Array Controls:

Slider or input to control the size of the array.

Button to generate a new random array.

Algorithm Selector:

Dropdown or buttons to switch between sorting algorithms:

Bubble Sort

Selection Sort

Insertion Sort

Merge Sort

Quick Sort

Heap Sort (optional)

Step-by-Step Animation:

Next and Back buttons to manually go forward and backward through each step of the sorting algorithm.

Optional: Auto-play mode with adjustable speed.

Bar Visualization:

Represent array elements as vertical bars whose height corresponds to the value.

Highlight bars that are currently being compared or swapped.

Textual Explanation:

Display a text description of what is happening at each step:

Comparisons

Swaps

Recursion calls (for Merge/Quick)

Sorted elements

Responsive UI:

Works on desktop and mobile.

Smooth transitions and animations for visual clarity.

Optional Enhancements:

Show pseudocode or actual code snippet alongside.

Dark/light theme toggle.

Display current time complexity info of the selected algorithm.

🧑‍💻 Technologies (suggested):

Frontend: HTML, CSS, JavaScript (or React for dynamic UI)

Backend (if needed): None (client-side is sufficient)

State Management: Use arrays of actions or states to enable forward/backward steps.
  