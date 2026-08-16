export interface Snippet {
  id: string;
  title: string;
  description: string;
  category: 'Math' | 'Logic' | 'Algorithms' | 'Utilities' | 'Games';
  author: string;
  code: string;
  tags: string[];
}

export const COMMUNITY_SNIPPETS: Snippet[] = [
  {
    id: 'fizzbuzz',
    title: 'Safe FizzBuzz Algorithm',
    description: 'Classic interview problem using AniKode range loops with zero risk of infinite freezing.',
    category: 'Algorithms',
    author: 'Anikesh',
    tags: ['loops', 'math', 'interview'],
    code: `~ Safe Range Loop FizzBuzz in AniKode ~
loop i from 1 to 20 {
  if (i % 15 == 0) {
    say.out("FizzBuzz")
  } else if (i % 3 == 0) {
    say.out("Fizz")
  } else if (i % 5 == 0) {
    say.out("Buzz")
  } else {
    say.out(i)
  }
}`
  },
  {
    id: 'propositional-security',
    title: 'Propositional Logic Security Auditor',
    description: 'Verify access control policies using first-class logic operators (implies, iff, all, any).',
    category: 'Logic',
    author: 'Anikesh',
    tags: ['logic', 'security', 'boolean'],
    code: `~ Propositional Logic Access Rules ~
fn verifyAccess(isAdmin, isManager, is2FA, score) {
  \\ Rule 1: Admin implies 2FA is active \\
  let rule1 = isAdmin implies is2FA
  
  \\ Rule 2: Manager implies score >= 75 \\
  let rule2 = isManager implies (score >= 75)
  
  \\ Access is granted if rules pass and base score >= 50 \\
  return rule1 and rule2 and (score >= 50)
}

say.out("=== ACCESS VERIFICATION PIPELINE ===")
let user1 = verifyAccess(true, false, true, 90)
say.out("Admin (with 2FA, 90 score) -> Access:", user1)

let user2 = verifyAccess(false, true, false, 80)
say.out("Manager (80 score) -> Access:", user2)

let user3 = verifyAccess(true, false, false, 95)
say.out("Admin (missing 2FA) -> Access:", user3)

let user4 = verifyAccess(false, true, false, 60)
say.out("Manager (low score 60) -> Access:", user4)`
  },
  {
    id: 'binary-search',
    title: 'Binary Search Function',
    description: 'Fast O(log n) element lookup using recursion and the recurse() keyword.',
    category: 'Algorithms',
    author: 'Anikesh',
    tags: ['search', 'recursion', 'binary-search'],
    code: `~ Recursive Binary Search in AniKode ~
fn binarySearch(arr, target, low, high) {
  if low > high {
    return -1
  }
  
  let mid = math.floor((low + high) / 2)
  let midVal = arr[mid]
  
  if midVal == target {
    return mid
  } else if midVal > target {
    return recurse(arr, target, low, mid - 1)
  } else {
    return recurse(arr, target, mid + 1, high)
  }
}

set numbers = [10, 25, 34, 56, 78, 92, 105, 200]
let target = 78
let foundIndex = binarySearch(numbers, target, 0, numbers.len() - 1)

say.out("Searching for:", target)
say.out("Found at index:", foundIndex)`
  },
  {
    id: 'string-tools',
    title: 'Polymorphic String & List Utilities',
    description: 'Manipulate strings, reverse sequences, and check memberships polymorphically.',
    category: 'Utilities',
    author: 'Anikesh',
    tags: ['strings', 'lists', 'utilities'],
    code: `~ Polymorphic Methods in AniKode ~
set word = " AniKode Language "
say.out("Original:", word)
say.out("Trimmed:", word.trim())
say.out("Upper:", word.trim().upper())
say.out("Length:", word.len())

set languages = ["C++", "Python", "AniKode", "TypeScript"]
say.out("Languages:", languages)
say.out("Has AniKode?:", languages.has("AniKode"))
say.out("Total Items:", languages.len())`
  },
  {
    id: 'math-stats',
    title: 'Statistical Aggregator (Mean & Clamp)',
    description: 'Calculate average and clamp scores using built-in math namespace.',
    category: 'Math',
    author: 'Anikesh',
    tags: ['math', 'statistics', 'averages'],
    code: `~ Statistical Aggregator ~
fn calculateStats(scores) {
  let total = 0
  each s in scores {
    set total = total + s
  }
  let avg = total / scores.len()
  return {
    "count": scores.len(),
    "average": math.round(avg),
    "clampedAvg": math.clamp(avg, 0, 100)
  }
}

set testScores = [85, 92, 78, 64, 99, 100]
let stats = calculateStats(testScores)
say.out("Total Scores Evaluated:", stats.count)
say.out("Average Score:", stats.average)`
  },
  {
    id: 'guess-game',
    title: 'Number Guessing Mini Game',
    description: 'Simple interactive game using random generation and conditionals.',
    category: 'Games',
    author: 'Anikesh',
    tags: ['game', 'interactive', 'math'],
    code: `~ Number Guessing Game ~
let secret = math.floor(math.random() * 50) + 1
say.out("I'm thinking of a number between 1 and 50.")
say.out("(For test demo, secret is:", secret, ")")

fn checkGuess(guess, target) {
  if guess == target {
    return "🎉 Correct! You won!"
  } else if guess < target {
    return "⬆️ Too low! Guess higher."
  } else {
    return "⬇️ Too high! Guess lower."
  }
}

say.out(checkGuess(25, secret))`
  }
];
