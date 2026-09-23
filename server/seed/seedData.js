export const codingQuestionsSeed = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    topics: ['Arrays', 'Hashing'],
    functionName: 'twoSum',
    statement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'Can you solve it in O(n) time using a Hash Map?',
      'Store each number along with its index as you iterate through the array.'
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}`,
      java: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] }
    ]
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    topics: ['Strings', 'Two Pointers'],
    functionName: 'isPalindrome',
    statement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    hints: ['Consider using two pointers moving inward from both ends of the string.'],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}`,
      python: `def isPalindrome(s: str) -> bool:
    # Write your solution here
    pass`,
      cpp: `bool isPalindrome(string s) {
    // Write your solution here
    return false;
}`,
      java: `public class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}`
    },
    testCases: [
      { input: ["A man, a plan, a canal: Panama"], expected: true },
      { input: ["race a car"], expected: false },
      { input: [" "], expected: true }
    ]
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    topics: ['Arrays', 'Dynamic Programming'],
    functionName: 'maxProfit',
    statement: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return `0`.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and max profit = 0.' }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    hints: ['Keep track of the lowest buy price seen so far and the max profit obtained by selling today.'],
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your solution here
  
}`,
      python: `def maxProfit(prices: list[int]) -> int:
    # Write your solution here
    pass`,
      cpp: `int maxProfit(vector<int>& prices) {
    // Write your solution here
    return 0;
}`,
      java: `public class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
}`
    },
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { input: [[7, 6, 4, 3, 1]], expected: 0 },
      { input: [[2, 4, 1]], expected: 2 }
    ]
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    topics: ['Arrays', 'Dynamic Programming'],
    functionName: 'maxSubArray',
    statement: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum. (Kadane\'s Algorithm).',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    hints: ['At each index, decide whether to add nums[i] to the current running sum or restart a new subarray from nums[i].'],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}`,
      python: `def maxSubArray(nums: list[int]) -> int:
    # Write your solution here
    pass`,
      cpp: `int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}`,
      java: `public class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
}`
    },
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 }
    ]
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    topics: ['Arrays', 'Binary Search'],
    functionName: 'search',
    statement: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`. You must write an algorithm with `O(log n)` runtime complexity.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    hints: ['Maintain two pointers left and right, and check the middle element.'],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your solution here
  
}`,
      python: `def search(nums: list[int], target: int) -> int:
    # Write your solution here
    pass`,
      cpp: `int search(vector<int>& nums, int target) {
    // Write your solution here
    return -1;
}`,
      java: `public class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`
    },
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 }
    ]
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    topics: ['Stack', 'Strings'],
    functionName: 'isValid',
    statement: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets in the correct order.",
    examples: [
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "{[]}"', output: 'true' }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    hints: ['Push opening brackets onto a stack; pop and compare upon encountering closing brackets.'],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  
}`,
      python: `def isValid(s: str) -> bool:
    # Write your solution here
    pass`,
      cpp: `bool isValid(string s) {
    // Write your solution here
    return false;
}`,
      java: `public class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`
    },
    testCases: [
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false },
      { input: ["{[]}"], expected: true }
    ]
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    topics: ['Dynamic Programming', 'Math'],
    functionName: 'climbStairs',
    statement: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways: 1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, or 2+1.' }
    ],
    constraints: ['1 <= n <= 45'],
    hints: ['To reach step n, you can either step from n-1 or n-2. Thus ways(n) = ways(n-1) + ways(n-2).'],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Write your solution here
  
}`,
      python: `def climbStairs(n: int) -> int:
    # Write your solution here
    pass`,
      cpp: `int climbStairs(int n) {
    // Write your solution here
    return 0;
}`,
      java: `public class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}`
    },
    testCases: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 }
    ]
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'Arrays'],
    functionName: 'coinChange',
    statement: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.',
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    hints: ['Define dp[i] as the minimum coins needed for amount i. Transition: dp[i] = min(dp[i - c] + 1).'],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Write your solution here
  
}`,
      python: `def coinChange(coins: list[int], amount: int) -> int:
    # Write your solution here
    pass`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
    // Write your solution here
    return -1;
}`,
      java: `public class Solution {
    public int coinChange(int[] coins, int amount) {
        // Write your solution here
        return -1;
    }
}`
    },
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3 },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 }
    ]
  }
];

export const aptitudeQuestionsSeed = [
  // ==================== QUANTITATIVE ABILITY ====================
  {
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Percentages & Profit/Loss',
    question: 'A retailer buys a mechanical keyboard for $80 and sells it for $100. What is his percentage profit?',
    options: ['20%', '25%', '15%', '30%'],
    correctAnswer: 1, // 25%
    explanation: 'Profit = $100 - $80 = $20. Profit % = (Profit / Cost Price) * 100 = (20 / 80) * 100 = 25%.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Percentages & Profit/Loss',
    question: 'A shopkeeper sells a book for $480 making a profit of 20%. What was the original cost price of the book?',
    options: ['$380', '$400', '$420', '$440'],
    correctAnswer: 1, // $400
    explanation: 'Selling Price = Cost Price * (1 + Profit%). Therefore, Cost Price = 480 / 1.20 = $400.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Time and Work',
    question: 'A can complete a piece of work in 12 days and B can complete it in 18 days. If they work together, in how many days will the work be completed?',
    options: ['7.2 days', '6.5 days', '8 days', '7.5 days'],
    correctAnswer: 0, // 7.2 days
    explanation: 'Combined 1-day work = 1/12 + 1/18 = (3+2)/36 = 5/36. Total days = 36/5 = 7.2 days.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Speed, Time & Distance',
    question: 'A train 150 meters long passes a telegraph post in 10 seconds. What is the speed of the train in km/h?',
    options: ['45 km/h', '54 km/h', '60 km/h', '72 km/h'],
    correctAnswer: 1, // 54 km/h
    explanation: 'Speed in m/s = 150 / 10 = 15 m/s. Convert to km/h: 15 * (18/5) = 54 km/h.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Hard',
    topic: 'Probability & Combinatorics',
    question: 'Two dice are rolled simultaneously. What is the probability that the sum of the numbers obtained is a multiple of 4?',
    options: ['1/4', '1/6', '7/36', '5/36'],
    correctAnswer: 0, // 1/4 (9/36)
    explanation: 'Multiples of 4 between 2 and 12 are 4, 8, 12. Pairs for 4: (1,3),(2,2),(3,1) [3]. Pairs for 8: (2,6),(3,5),(4,4),(5,3),(6,2) [5]. Pairs for 12: (6,6) [1]. Total = 3+5+1 = 9 outcomes. Probability = 9/36 = 1/4.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Simple & Compound Interest',
    question: 'A sum of $1,000 is invested at 10% annual interest compounded annually for 2 years. What is the total compound interest earned?',
    options: ['$200', '$210', '$220', '$250'],
    correctAnswer: 1, // $210
    explanation: 'Amount = 1000 * (1 + 0.10)^2 = 1000 * 1.21 = $1210. Compound Interest = $1210 - $1000 = $210.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Ratios & Proportions',
    question: 'The ratio of ages of Alice and Bob is 4:5. After 6 years, the ratio becomes 5:6. What is Alice\'s present age?',
    options: ['20 years', '24 years', '28 years', '30 years'],
    correctAnswer: 1, // 24 years
    explanation: 'Let ages be 4x and 5x. (4x + 6) / (5x + 6) = 5/6 => 24x + 36 = 25x + 30 => x = 6. Alice = 4 * 6 = 24 years.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Averages',
    question: 'The average of 5 consecutive odd numbers is 27. What is the smallest of these numbers?',
    options: ['23', '25', '21', '27'],
    correctAnswer: 0, // 23
    explanation: 'In 5 consecutive odd numbers, the median is the average. So the middle number is 27. The numbers are 23, 25, 27, 29, 31. Smallest = 23.'
  },

  // ==================== LOGICAL REASONING ====================
  {
    category: 'Logical reasoning',
    difficulty: 'Easy',
    topic: 'Number Series',
    question: 'Identify the next number in the sequence: 4, 9, 19, 39, 79, ?',
    options: ['119', '139', '159', '169'],
    correctAnswer: 2, // 159
    explanation: 'The pattern is: (Previous number * 2) + 1. So, 79 * 2 + 1 = 158 + 1 = 159.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Medium',
    topic: 'Blood Relations',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
    options: ['Brother', 'Uncle', 'Father', 'Grandfather'],
    correctAnswer: 2, // Father
    explanation: 'The "only son of my mother" means Suresh himself. Thus, the boy is the son of Suresh, making Suresh his Father.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Medium',
    topic: 'Coding-Decoding',
    question: 'In a certain code, "COMPUTER" is written as "RFUVQNPC". How is "MEDICINE" written in that same code?',
    options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'EOJDJFEM'],
    correctAnswer: 0, // EOJDJEFM
    explanation: 'Reverse the word order and substitute: The first letter moves to last, last to first, and internal letters increment by 1.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Hard',
    topic: 'Syllogism',
    question: 'Statements: 1. All engineers are innovators. 2. Some innovators are designers.\nConclusions: I. Some designers are engineers. II. Some innovators are engineers.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither follows'],
    correctAnswer: 1, // Only conclusion II follows
    explanation: 'Since all engineers are innovators, by conversion some innovators are engineers (Conclusion II holds). There is no guaranteed overlap between designers and engineers, so I does not necessarily follow.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Medium',
    topic: 'Direction Sense',
    question: 'A person walks 5 km North, turns right and walks 3 km, then turns right again and walks 5 km. In which direction and distance is he from the starting point?',
    options: ['3 km East', '3 km West', '5 km South', '8 km North'],
    correctAnswer: 0, // 3 km East
    explanation: 'Moving North 5km and then South 5km cancels out vertical displacement. The right turn was toward the East for 3km. He is 3 km East.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Medium',
    topic: 'Seating Arrangement',
    question: 'Five colleagues A, B, C, D, E are sitting in a row facing North. C is sitting in the center. A is to the immediate left of C. B is to the extreme right. Who is sitting between A and the left end if D is at the left end?',
    options: ['E', 'B', 'C', 'None'],
    correctAnswer: 0, // E
    explanation: 'Positions 1 to 5 from left to right: Center (pos 3) = C. Pos 2 = A (immediate left of C). Pos 5 = B (extreme right). Pos 1 = D (left end). Remaining Pos 4 = E.'
  },

  // ==================== VERBAL ABILITY ====================
  {
    category: 'Verbal ability',
    difficulty: 'Easy',
    topic: 'Synonyms & Vocabulary',
    question: 'Select the synonym for the word: "PRAGMATIC"',
    options: ['Idealistic', 'Practical', 'Theoretical', 'Uncertain'],
    correctAnswer: 1, // Practical
    explanation: 'Pragmatic means dealing with things sensibly and realistically based on practical considerations.'
  },
  {
    category: 'Verbal ability',
    difficulty: 'Medium',
    topic: 'Sentence Correction',
    question: 'Identify the grammatically correct sentence:',
    options: [
      'Neither the manager nor the employees was aware of the policy update.',
      'Neither the manager nor the employees were aware of the policy update.',
      'Neither the manager or the employees was aware of the policy update.',
      'Neither the manager or the employees were aware of the policy update.'
    ],
    correctAnswer: 1, // were
    explanation: 'In "neither... nor" constructions, the verb agrees with the subject closest to it ("employees", which is plural, so "were").'
  },
  {
    category: 'Verbal ability',
    difficulty: 'Medium',
    topic: 'Reading Comprehension',
    question: '"Premature optimization is the root of all evil in software engineering." What is the primary implication of this well-known aphorism?',
    options: [
      'Developers should never optimize code for speed.',
      'Code should be written cleanly and correctly first before optimizing unmeasured bottlenecks.',
      'Software engineers should only write unoptimized code.',
      'Optimization should be completely automated by compilers.'
    ],
    correctAnswer: 1,
    explanation: 'The quote stresses prioritizing readable, maintainable, working code first, avoiding wasting time optimizing code before profiling proves it is a bottleneck.'
  },
  {
    category: 'Verbal ability',
    difficulty: 'Easy',
    topic: 'Antonyms',
    question: 'Select the antonym for the word: "TRANSIENT"',
    options: ['Permanent', 'Ephemeral', 'Brief', 'Fugitive'],
    correctAnswer: 0, // Permanent
    explanation: 'Transient means lasting only for a short time. Permanent means lasting indefinitely.'
  },
  {
    category: 'Verbal ability',
    difficulty: 'Medium',
    topic: 'Idioms & Phrases',
    question: 'What is the meaning of the idiom: "Bite the bullet"?',
    options: [
      'To eat something dangerous',
      'To endure an inevitable, painful situation with courage',
      'To engage in hostile arguments',
      'To make an impulsive financial mistake'
    ],
    correctAnswer: 1,
    explanation: '"Bite the bullet" means to face a difficult or unpleasant situation with courage and fortitude.'
  },

  // ==================== CORE CS FUNDAMENTALS ====================
  {
    category: 'Core CS',
    difficulty: 'Easy',
    topic: 'Operating Systems',
    question: 'Which of the following conditions is NOT required for a deadlock to occur (Coffman conditions)?',
    options: [
      'Mutual Exclusion',
      'Hold and Wait',
      'Preemption Allowed',
      'Circular Wait'
    ],
    correctAnswer: 2, // Preemption Allowed
    explanation: 'Deadlock requires NO preemption (resources cannot be forcibly confiscated). If preemption is allowed, deadlocks can be resolved.'
  },
  {
    category: 'Core CS',
    difficulty: 'Medium',
    topic: 'DBMS',
    question: 'In relational databases, which ACID property guarantees that once a transaction has committed, its changes will survive crashes or power failures?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correctAnswer: 3, // Durability
    explanation: 'Durability ensures that committed transactions are permanently recorded in non-volatile storage (WAL/transaction logs).'
  },
  {
    category: 'Core CS',
    difficulty: 'Medium',
    topic: 'Computer Networks',
    question: 'Which protocol functions at the Transport Layer and provides reliable, connection-oriented, in-order packet delivery?',
    options: ['UDP', 'IP', 'TCP', 'ICMP'],
    correctAnswer: 2, // TCP
    explanation: 'TCP (Transmission Control Protocol) operates at Layer 4 and implements flow control, sequencing, and reliable acknowledgments.'
  },
  {
    category: 'Core CS',
    difficulty: 'Easy',
    topic: 'OOP Concepts',
    question: 'The ability of a single interface or method signature to take different forms or implementations depending on the calling object is called:',
    options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'],
    correctAnswer: 1, // Polymorphism
    explanation: 'Polymorphism (Greek for "many forms") allows methods to behave differently based on the runtime instance (method overriding/overloading).'
  },
  {
    category: 'Core CS',
    difficulty: 'Hard',
    topic: 'Operating Systems',
    question: 'What is "Thrashing" in an operating system virtual memory subsystem?',
    options: [
      'When the CPU clock speed oscillates rapidly',
      'A state where the system spends more time swapping pages in/out than executing user instructions',
      'When multiple processes experience deadlocks simultaneously',
      'A hardware error causing disk sectors to fail'
    ],
    correctAnswer: 1,
    explanation: 'Thrashing occurs when the total working set of active processes exceeds available physical RAM, causing constant page faults and disk I/O.'
  },

  // ==================== CAMPUS PLACEMENT EXPANSION: QUANTITATIVE ====================
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Pipes & Cisterns',
    question: 'Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. A waste pipe C can empty the full tank in 15 minutes. If all three pipes are opened together, in how many minutes will the tank be filled?',
    options: ['45 minutes', '60 minutes', '50 minutes', '40 minutes'],
    correctAnswer: 1, // 60 minutes
    explanation: 'Net rate per minute = 1/20 + 1/30 - 1/15 = (3 + 2 - 4) / 60 = 1/60. Tank fills in 60 minutes.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Alligation & Mixtures',
    question: 'In what ratio must a 20% alcohol solution be mixed with a 50% alcohol solution to obtain a mixture with 30% alcohol concentration?',
    options: ['2:1', '1:2', '3:2', '2:3'],
    correctAnswer: 0, // 2:1
    explanation: 'Using alligation: (50 - 30) : (30 - 20) = 20 : 10 = 2 : 1.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Speed, Time & Distance',
    question: 'Two trains of lengths 140 m and 160 m are running in opposite directions on parallel tracks at 60 km/h and 48 km/h respectively. In how many seconds will they completely cross each other?',
    options: ['8 seconds', '10 seconds', '12 seconds', '15 seconds'],
    correctAnswer: 1, // 10 seconds
    explanation: 'Total distance = 140 + 160 = 300 m. Relative speed = 60 + 48 = 108 km/h = 108 * (5/18) = 30 m/s. Time = 300 / 30 = 10 seconds.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Hard',
    topic: 'Clocks & Calendars',
    question: 'What is the angle between the hour hand and the minute hand of a clock at 3:40?',
    options: ['120°', '125°', '130°', '140°'],
    correctAnswer: 2, // 130°
    explanation: 'Angle = |30 * H - (11/2) * M| = |30 * 3 - 5.5 * 40| = |90 - 220| = |-130| = 130°.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Hard',
    topic: 'Simple & Compound Interest',
    question: 'The difference between compound interest and simple interest on a certain sum of money for 2 years at 10% per annum is $45. Find the principal sum.',
    options: ['$4,000', '$4,500', '$5,000', '$3,500'],
    correctAnswer: 1, // $4,500
    explanation: 'For 2 years, Difference = P * (R/100)^2. 45 = P * (10/100)^2 => 45 = P * 0.01 => P = 45 / 0.01 = $4,500.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Easy',
    topic: 'Permutations & Combinations',
    question: 'In how many different ways can the letters of the word "LEADER" be arranged?',
    options: ['720', '360', '180', '120'],
    correctAnswer: 1, // 360
    explanation: 'Word has 6 letters with letter E repeated 2 times. Total ways = 6! / 2! = 720 / 2 = 360.'
  },
  {
    category: 'Quantitative',
    difficulty: 'Medium',
    topic: 'Number System',
    question: 'Find the largest 4-digit number that is completely divisible by 12, 15, 18, and 27.',
    options: ['9720', '9820', '9900', '9640'],
    correctAnswer: 0, // 9720
    explanation: 'LCM of 12, 15, 18, 27 = 540. Largest 4-digit number is 9999. 9999 mod 540 = 279. Desired number = 9999 - 279 = 9720.'
  },

  // ==================== CAMPUS PLACEMENT EXPANSION: LOGICAL REASONING ====================
  {
    category: 'Logical reasoning',
    difficulty: 'Hard',
    topic: 'Seating Arrangement',
    question: 'Six friends (P, Q, R, S, T, U) sit around a circular table facing the center. P is opposite to R. Q is to the immediate right of P. S is between R and T. Who is sitting to the immediate left of P?',
    options: ['U', 'Q', 'S', 'T'],
    correctAnswer: 0, // U
    explanation: 'Facing center, right of P is clockwise/counter-clockwise. Arranging P at bottom, Q at immediate right, R opposite P, S between R and T leaves U at the immediate left of P.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Medium',
    topic: 'Blood Relations',
    question: 'If "P + Q" means P is the brother of Q, "P - Q" means P is the mother of Q, and "P * Q" means P is the sister of Q, what does "A + B - C" mean?',
    options: ['A is the maternal uncle of C', 'A is the father of C', 'A is the nephew of C', 'A is the brother of C'],
    correctAnswer: 0, // A is the maternal uncle of C
    explanation: 'B - C means B is the mother of C. A + B means A is the brother of B. Thus, A is the brother of C\'s mother, which is maternal uncle.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Medium',
    topic: 'Direction Sense',
    question: 'One morning after sunrise, Vikram was standing facing a telephone pole. The shadow of the pole fell exactly to his right. Which direction was Vikram facing?',
    options: ['South', 'North', 'East', 'West'],
    correctAnswer: 0, // South
    explanation: 'In the morning, the sun rises in the East, so shadows fall toward the West. For shadow (West) to be on Vikram\'s right side, Vikram must be facing South.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Easy',
    topic: 'Alpha-Numeric Series',
    question: 'Find the next term in the alphanumeric pattern: B2D, D4F, F8H, H16J, ?',
    options: ['J32L', 'J24L', 'I32K', 'K32M'],
    correctAnswer: 0, // J32L
    explanation: 'First letter: B(+2)=D(+2)=F(+2)=H(+2)=J. Middle number: 2(*2)=4(*2)=8(*2)=16(*2)=32. Last letter: D(+2)=F(+2)=H(+2)=J(+2)=L. Next is J32L.'
  },
  {
    category: 'Logical reasoning',
    difficulty: 'Hard',
    topic: 'Data Sufficiency',
    question: 'Is integer x greater than integer y?\nStatement (1): x - 2y = 6\nStatement (2): y < 0',
    options: [
      'Statement (1) ALONE is sufficient',
      'Statement (2) ALONE is sufficient',
      'Both statements TOGETHER are sufficient',
      'Statements (1) and (2) TOGETHER are NOT sufficient'
    ],
    correctAnswer: 3, // Together not sufficient
    explanation: 'From (1), x = 2y + 6. We want x - y > 0 => (2y + 6) - y > 0 => y + 6 > 0 => y > -6. From (2), y < 0. So if y = -2, y > -6 is true (x > y). If y = -10, y > -6 is false (x < y). Since both cases are possible when y < 0, both together are NOT sufficient.'
  },

  // ==================== CAMPUS PLACEMENT EXPANSION: VERBAL ABILITY ====================
  {
    category: 'Verbal ability',
    difficulty: 'Medium',
    topic: 'Error Spotting',
    question: 'Identify the segment containing a grammatical error: "Neither of the two candidates (A) / who were interviewed yesterday (B) / were found suitable for the technical lead role (C) / No error (D)"',
    options: ['Segment A', 'Segment B', 'Segment C', 'Segment D (No error)'],
    correctAnswer: 2, // Segment C
    explanation: '"Neither of..." is grammatically singular and takes a singular verb. "were found suitable" in segment C should be "was found suitable".'
  },
  {
    category: 'Verbal ability',
    difficulty: 'Easy',
    topic: 'Sentence Completion',
    question: 'The rapid deployment of autonomous algorithms has ________ heated discussions regarding algorithmic bias and ethical governance.',
    options: ['ignited', 'repressed', 'quenched', 'extinguished'],
    correctAnswer: 0, // ignited
    explanation: '"Ignited" accurately fits the context of sparking or stimulating intense debates and discussions.'
  },
  {
    category: 'Verbal ability',
    difficulty: 'Medium',
    topic: 'Para Jumbles',
    question: 'Rearrange the sentences into a coherent paragraph:\nP: This rapid data growth requires modern distributed storage engines.\nQ: Over the past decade, internet bandwidth has increased exponentially.\nR: As a consequence, cloud providers have redefined system architectures.\nS: This surge has led to astronomical volumes of real-time telemetry.',
    options: ['Q - S - P - R', 'Q - P - S - R', 'S - Q - P - R', 'P - Q - R - S'],
    correctAnswer: 0, // Q - S - P - R
    explanation: 'Q introduces the premise (bandwidth growth), S notes the surge in telemetry from it, P states the need for distributed storage, and R concludes with providers redefining architectures.'
  },
  {
    category: 'Verbal ability',
    difficulty: 'Medium',
    topic: 'Antonyms',
    question: 'Select the word most opposite in meaning to: "CANDID"',
    options: ['Deceitful', 'Frank', 'Outspoken', 'Sincere'],
    correctAnswer: 0, // Deceitful
    explanation: 'Candid means truthful, straightforward, and honest. The opposite is deceitful (misleading or untruthful).'
  },

  // ==================== CAMPUS PLACEMENT EXPANSION: CORE CS ====================
  {
    category: 'Core CS',
    difficulty: 'Easy',
    topic: 'Operating Systems',
    question: 'Which CPU scheduling algorithm is prone to the "Convoy Effect", where short processes wait for one long process to release the CPU?',
    options: ['First-Come, First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
    correctAnswer: 0, // FCFS
    explanation: 'In FCFS, non-preemptive scheduling can cause all subsequent short I/O-bound jobs to get delayed behind a massive CPU-bound burst.'
  },
  {
    category: 'Core CS',
    difficulty: 'Medium',
    topic: 'Operating Systems',
    question: 'Which page replacement algorithm NEVER suffers from Belady\'s Anomaly (where adding page frames increases page faults)?',
    options: ['FIFO', 'Least Recently Used (LRU)', 'Second-Chance Algorithm', 'Random Replacement'],
    correctAnswer: 1, // LRU
    explanation: 'LRU is a stack-based page replacement algorithm. Stack algorithms satisfy inclusion property and are mathematically immune to Belady\'s Anomaly.'
  },
  {
    category: 'Core CS',
    difficulty: 'Medium',
    topic: 'DBMS',
    question: 'Which Normal Form eliminates transitive dependencies (where a non-prime attribute depends on another non-prime attribute)?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: 2, // 3NF
    explanation: 'Third Normal Form (3NF) requires 2NF and mandates that no non-prime attribute is transitively dependent on any candidate key.'
  },
  {
    category: 'Core CS',
    difficulty: 'Easy',
    topic: 'DBMS',
    question: 'What is a fundamental difference between TRUNCATE and DELETE in SQL relational databases?',
    options: [
      'TRUNCATE is a DDL command that resets identity columns and deallocates data pages, while DELETE is a DML command that logs row by row',
      'DELETE is always faster than TRUNCATE',
      'TRUNCATE allows WHERE clauses while DELETE does not',
      'DELETE cannot be committed inside a transaction'
    ],
    correctAnswer: 0,
    explanation: 'TRUNCATE is DDL, operates by deallocating data pages without logging individual row deletions, and resets auto-increment identities.'
  },
  {
    category: 'Core CS',
    difficulty: 'Easy',
    topic: 'Computer Networks',
    question: 'During the TCP three-way handshake, what packet flags does the receiving server transmit back to acknowledge the client\'s initial connection request?',
    options: ['SYN', 'ACK', 'SYN-ACK', 'FIN-ACK'],
    correctAnswer: 2, // SYN-ACK
    explanation: 'The TCP handshake sequence is: Client -> SYN -> Server; Server -> SYN-ACK -> Client; Client -> ACK -> Server.'
  },
  {
    category: 'Core CS',
    difficulty: 'Easy',
    topic: 'Computer Networks',
    question: 'Which network protocol and default transport port is used by DNS (Domain Name System) queries?',
    options: ['TCP Port 80', 'UDP Port 53', 'UDP Port 67', 'TCP Port 443'],
    correctAnswer: 1, // UDP Port 53
    explanation: 'Standard DNS lookups operate over UDP port 53 for low latency and minimal overhead (TCP 53 is used for zone transfers or responses > 512 bytes).'
  },
  {
    category: 'Core CS',
    difficulty: 'Medium',
    topic: 'Data Structures & Algorithms',
    question: 'What is the worst-case and average-case time complexity of standard QuickSort when using deterministic first-element partitioning?',
    options: ['Worst: O(n^2), Average: O(n log n)', 'Worst: O(n log n), Average: O(n log n)', 'Worst: O(n^2), Average: O(n^2)', 'Worst: O(n log n), Average: O(n)'],
    correctAnswer: 0, // Worst: O(n^2), Average: O(n log n)
    explanation: 'When input is already sorted or reverse-sorted, partitioning produces unbalanced subproblems of sizes 0 and n-1, degrading to O(n^2).'
  },
  {
    category: 'Core CS',
    difficulty: 'Easy',
    topic: 'OOP Concepts',
    question: 'Which SOLID object-oriented design principle states that software entities (classes, modules, functions) should be open for extension, but closed for modification?',
    options: ['Single Responsibility Principle', 'Open-Closed Principle (OCP)', 'Liskov Substitution Principle', 'Dependency Inversion Principle'],
    correctAnswer: 1, // Open-Closed Principle
    explanation: 'The Open-Closed Principle (OCP) requires that existing tested code should not be modified when introducing new behavior; instead, behavior should be extended via polymorphism or inheritance.'
  }
];

export const companiesSeed = [
  {
    name: 'Google',
    slug: 'google',
    overview: 'Google is a global technology leader known for world-class search, cloud, AI, and systems engineering. Technical placement rounds focus deeply on strong algorithmic foundations, code elegance, and scale considerations.',
    tier: 'Tier 1 / Product',
    roles: ['Software Engineer (L3)', 'Associate Product Manager', 'Cloud Engineer'],
    dsaEmphasis: [
      { topic: 'Dynamic Programming & Graphs', weightage: 'Very High (35%)', importance: 5 },
      { topic: 'Trees & Binary Search', weightage: 'High (25%)', importance: 5 },
      { topic: 'Two Pointers & Sliding Window', weightage: 'Medium (20%)', importance: 4 },
      { topic: 'Heaps & Priority Queues', weightage: 'Medium (20%)', importance: 4 }
    ],
    aptitudeEmphasis: [
      { topic: 'Probability & Math Puzzles', weightage: 'High' },
      { topic: 'Logical Deduction', weightage: 'Medium' }
    ],
    coreCsTopics: ['Operating Systems (Threading, Memory)', 'Algorithms & Time Complexities', 'Distributed Systems Basics', 'Computer Networks'],
    interviewPattern: [
      { round: 1, name: 'Online Assessment (OA)', duration: '90 mins', format: '2 medium-to-hard coding problems on HackerEarth/custom platform.', description: 'Tests algorithmic correctness, edge-case coverage, and execution speed.' },
      { round: 2, name: 'Technical Round 1 (DSA)', duration: '45 mins', format: '1:1 Google Meet with collaborative Google Doc / editor.', description: 'Live problem solving, writing clean syntactically sound code, explaining asymptotic complexity.' },
      { round: 3, name: 'Technical Round 2 (DSA & Core CS)', duration: '45 mins', format: '1:1 Technical interview.', description: 'Graph/tree modeling or advanced dynamic programming problem with scalability follow-ups.' },
      { round: 4, name: 'Googliness & Leadership', duration: '45 mins', format: 'Behavioral & hypothetical scenario evaluation.', description: 'Focuses on peer collaboration, dealing with ambiguity, bias for action, and ethical considerations.' }
    ],
    preparationChecklist: [
      { id: 'g-1', item: 'Solve at least 50 LeetCode Medium/Hard questions across DFS, BFS, and DP', category: 'DSA' },
      { id: 'g-2', item: 'Be able to explain Big-O time and auxiliary space complexity instantly for all solutions', category: 'DSA' },
      { id: 'g-3', item: 'Review thread synchronization, mutexes, virtual memory, and TCP/IP handshakes', category: 'Core CS' },
      { id: 'g-4', item: 'Prepare 3 STAR-format behavioral stories reflecting humility, learning from failure, and team impact', category: 'Behavioral' }
    ],
    popularQuestions: [
      { title: 'Median of Two Sorted Arrays', topic: 'Binary Search', difficulty: 'Hard' },
      { title: 'Word Ladder', topic: 'Graphs (BFS)', difficulty: 'Hard' },
      { title: 'LRU Cache', topic: 'Hash Table & Doubly Linked List', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Amazon',
    slug: 'amazon',
    overview: 'Amazon heavily integrates its 16 Leadership Principles into every stage of the technical hiring loop alongside rigorous data structures and problem solving.',
    tier: 'Tier 1 / Product',
    roles: ['Software Development Engineer I (SDE-1)', 'Cloud Support Associate'],
    dsaEmphasis: [
      { topic: 'Trees, BST & Heaps', weightage: 'Very High (30%)', importance: 5 },
      { topic: 'Arrays, Strings & Hash Maps', weightage: 'High (25%)', importance: 5 },
      { topic: 'Graphs & BFS/DFS', weightage: 'High (25%)', importance: 4 },
      { topic: 'Greedy & Dynamic Programming', weightage: 'Medium (20%)', importance: 4 }
    ],
    aptitudeEmphasis: [
      { topic: 'Work Style Assessment', weightage: 'High' },
      { topic: 'Data Interpretation', weightage: 'Medium' }
    ],
    coreCsTopics: ['Object-Oriented Design (SOLID)', 'Operating Systems', 'DBMS & Indexing', 'API Design'],
    interviewPattern: [
      { round: 1, name: 'Online Assessment (OA1 & OA2)', duration: '120 mins', format: '2 Coding questions + Work Style Assessment simulation.', description: 'Tests problem solving and alignment with Amazon Leadership Principles.' },
      { round: 2, name: 'Technical Round 1 (SDE)', duration: '60 mins', format: 'Live coding + 20 mins of Leadership Principle behavioral questions.', description: 'Algorithms, data modeling, clean object-oriented architecture.' },
      { round: 3, name: 'Technical Round 2 (Low-Level Design & DSA)', duration: '60 mins', format: 'LLD scenario (e.g. Design Parking Lot, Elevator) + coding.', description: 'Class diagrams, inheritance vs composition, edge cases.' },
      { round: 4, name: 'Bar Raiser Round', duration: '60 mins', format: 'Conducted by an independent cross-team interviewer.', description: 'Deep probe into Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action).' }
    ],
    preparationChecklist: [
      { id: 'amz-1', item: 'Map 2 distinct real-world project stories to each of the Amazon Leadership Principles', category: 'Behavioral' },
      { id: 'amz-2', item: 'Master Heap/PriorityQueue and Tree traversal patterns', category: 'DSA' },
      { id: 'amz-3', item: 'Practice Low-Level Object-Oriented Design problems using SOLID principles', category: 'LLD' },
      { id: 'amz-4', item: 'Review SQL queries, joins, and indexing strategies', category: 'Core CS' }
    ],
    popularQuestions: [
      { title: 'Merge k Sorted Lists', topic: 'Heaps & Linked Lists', difficulty: 'Hard' },
      { title: 'Course Schedule', topic: 'Graphs (Topological Sort)', difficulty: 'Medium' },
      { title: 'Design an In-Memory File System', topic: 'Design & Trie', difficulty: 'Hard' }
    ]
  },
  {
    name: 'Microsoft',
    slug: 'microsoft',
    overview: 'Microsoft evaluates fundamental computer science principles, solid code hygiene, data structures, and a collaborative growth mindset.',
    tier: 'Tier 1 / Product',
    roles: ['Software Engineer', 'Support Engineer', 'Data Engineer'],
    dsaEmphasis: [
      { topic: 'Linked Lists & Trees', weightage: 'Very High (30%)', importance: 5 },
      { topic: 'Arrays & Two Pointers', weightage: 'High (25%)', importance: 4 },
      { topic: 'Dynamic Programming', weightage: 'Medium (25%)', importance: 4 },
      { topic: 'Strings & Parsing', weightage: 'Medium (20%)', importance: 4 }
    ],
    aptitudeEmphasis: [
      { topic: 'Quantitative Problem Solving', weightage: 'Medium' },
      { topic: 'Logical Sequences', weightage: 'Medium' }
    ],
    coreCsTopics: ['Operating Systems (Deadlocks, Paging)', 'Object-Oriented Programming', 'DBMS & Normalization', 'Computer Networks'],
    interviewPattern: [
      { round: 1, name: 'Codility / Online Assessment', duration: '75-90 mins', format: '2-3 coding problems with automated test suites.', description: 'Assesses edge case awareness, time limits, and code cleanliness.' },
      { round: 2, name: 'Technical Round 1', duration: '45-60 mins', format: '1:1 Live Coding with an engineer.', description: 'Focuses on linked lists, binary trees, recursion, and string manipulation.' },
      { round: 3, name: 'Technical Round 2', duration: '45-60 mins', format: 'System fundamentals and coding.', description: 'Core CS questions (OS, DBMS, networking) combined with algorithmic challenge.' },
      { round: 4, name: 'Director / Partner Round', duration: '45 mins', format: 'Vision, culture fit, and architecture conversation.', description: 'Growth mindset evaluation and technical motivation.' }
    ],
    preparationChecklist: [
      { id: 'msft-1', item: 'Practice pointer manipulation and edge cases for Linked Lists and Binary Trees', category: 'DSA' },
      { id: 'msft-2', item: 'Review OS page replacement algorithms, semaphores, and virtual memory', category: 'Core CS' },
      { id: 'msft-3', item: 'Understand SQL Normalization (1NF, 2NF, 3NF, BCNF) and ACID transactions', category: 'Core CS' },
      { id: 'msft-4', item: 'Prepare examples illustrating continuous learning and teamwork under tight deadlines', category: 'Behavioral' }
    ],
    popularQuestions: [
      { title: 'Reverse Nodes in k-Group', topic: 'Linked Lists', difficulty: 'Hard' },
      { title: 'Lowest Common Ancestor of a Binary Tree', topic: 'Binary Trees', difficulty: 'Medium' },
      { title: 'Spiral Matrix', topic: 'Arrays', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Tata Consultancy Services (TCS)',
    slug: 'tcs',
    overview: 'TCS is India’s largest IT services employer. Placement drives (TCS NQT / Digital / Prime) focus heavily on numerical aptitude, verbal reasoning, advanced coding, and foundational CS concepts.',
    tier: 'Service / Enterprise',
    roles: ['Ninja (Systems Engineer)', 'Digital (Specialist Programmer)', 'Prime (AI & Cloud SDE)'],
    dsaEmphasis: [
      { topic: 'Arrays & Strings', weightage: 'High (35%)', importance: 4 },
      { topic: 'Sorting, Searching & Math', weightage: 'High (30%)', importance: 4 },
      { topic: 'Basic Recursion & Stacks', weightage: 'Medium (20%)', importance: 3 },
      { topic: 'Matrix Operations', weightage: 'Medium (15%)', importance: 3 }
    ],
    aptitudeEmphasis: [
      { topic: 'Quantitative Ability (Percentages, Time/Work, Ratios)', weightage: 'Very High (40%)' },
      { topic: 'Logical Reasoning (Deductive, Series)', weightage: 'High (30%)' },
      { topic: 'Verbal Ability (Comprehension, Grammar)', weightage: 'High (30%)' }
    ],
    coreCsTopics: ['C / C++ / Java Fundamentals', 'DBMS & Basic Queries', 'Software Engineering Lifecycles (Agile/Waterfall)', 'Computer Networks Basics'],
    interviewPattern: [
      { round: 1, name: 'TCS National Qualifier Test (NQT)', duration: '120-180 mins', format: 'Part A: Cognitive (Quants, Logic, Verbal). Part B: Advanced Coding (2 problems).', description: 'Mandatory benchmark test determining Ninja, Digital, or Prime track eligibility.' },
      { round: 2, name: 'Technical Interview (TR)', duration: '30-45 mins', format: 'Panel interview.', description: 'Projects, final year subjects, coding syntax, OOPs concepts, DBMS queries.' },
      { round: 3, name: 'Managerial & HR Interview (MR/HR)', duration: '20-30 mins', format: 'Communication and willingness to relocate/learn new technologies.', description: 'Evaluates adaptability, shift readiness, and professional presentation.' }
    ],
    preparationChecklist: [
      { id: 'tcs-1', item: 'Practice 100+ Quantitative Aptitude questions with strict time limits (under 90s per question)', category: 'Aptitude' },
      { id: 'tcs-2', item: 'Master String manipulation, palindrome checks, array rotations, and matrix algebra in C++/Java/Python', category: 'DSA' },
      { id: 'tcs-3', item: 'Be thoroughly ready to explain every single detail of your academic projects', category: 'Technical' },
      { id: 'tcs-4', item: 'Review OOPs pillars: Encapsulation, Abstraction, Polymorphism, and Inheritance with real examples', category: 'Core CS' }
    ],
    popularQuestions: [
      { title: 'Subarray with Given Sum', topic: 'Arrays', difficulty: 'Easy' },
      { title: 'Find Missing Number in Array', topic: 'Math & Arrays', difficulty: 'Easy' },
      { title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium' }
    ]
  },
  {
    name: 'Infosys',
    slug: 'infosys',
    overview: 'Infosys placement (InfyTQ / HackWithInfy / Campus hiring) recruits for Specialist Programmer (SP), Digital Specialist Engineer (DSE), and Systems Engineer roles with strong emphasis on algorithmic coding.',
    tier: 'Service / Enterprise',
    roles: ['Specialist Programmer (SP)', 'Digital Specialist Engineer (DSE)', 'Systems Engineer (SE)'],
    dsaEmphasis: [
      { topic: 'Dynamic Programming & Greedy', weightage: 'Very High (35%)', importance: 5 },
      { topic: 'Graphs & BFS/DFS', weightage: 'High (25%)', importance: 4 },
      { topic: 'Arrays & Math', weightage: 'High (25%)', importance: 4 },
      { topic: 'Strings & Hash Tables', weightage: 'Medium (15%)', importance: 3 }
    ],
    aptitudeEmphasis: [
      { topic: 'Reasoning Ability (Puzzles, Seating arrangement)', weightage: 'High' },
      { topic: 'Technical Ability & Pseudo-code interpretation', weightage: 'High' }
    ],
    coreCsTopics: ['DBMS & Normalization', 'Object-Oriented Programming in Java/Python', 'Operating Systems Basics', 'Computer Networks Basics'],
    interviewPattern: [
      { round: 1, name: 'Online Assessment / HackWithInfy', duration: '180 mins', format: '3 coding problems of ascending difficulty (Easy, Medium, Hard).', description: 'Determines offer tier (SP: 8-9 LPA, DSE: 6-6.5 LPA, SE: 3.6-4 LPA).' },
      { round: 2, name: 'Technical & HR Interview Combined', duration: '40-60 mins', format: 'Interview with senior technical lead.', description: 'Code walkthrough of round 1 solutions, algorithmic discussions, project architecture.' }
    ],
    preparationChecklist: [
      { id: 'infy-1', item: 'Practice HackWithInfy previous year coding problems (focus on DP, Knapsack, and Graph traversals)', category: 'DSA' },
      { id: 'infy-2', item: 'Review SQL joins, aggregate functions, and nested subqueries', category: 'Core CS' },
      { id: 'infy-3', item: 'Master reading and tracing pseudocode under timed pressure', category: 'Aptitude' },
      { id: 'infy-4', item: 'Prepare a 2-minute concise introduction emphasizing hands-on coding experience', category: 'Behavioral' }
    ],
    popularQuestions: [
      { title: '0/1 Knapsack Problem', topic: 'Dynamic Programming', difficulty: 'Medium' },
      { title: 'Rotten Oranges', topic: 'Graphs (BFS)', difficulty: 'Medium' },
      { title: 'Next Greater Element', topic: 'Stacks', difficulty: 'Medium' }
    ]
  }
];
