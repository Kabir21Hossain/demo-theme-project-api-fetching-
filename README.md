# 🐛 GitHub Issues Tracker

A clean, responsive GitHub Issues Management Dashboard built with HTML, Tailwind CSS, DaisyUI, and Vanilla JavaScript.
* login page
![GitHub Issues Tracker Screenshot](images/login_page.jpg)
![GitHub Issues Tracker Screenshot](images/main_page.jpg)

## 🚀 Live Demo

> [Open Live Demo](https://kabir21hossain.github.io/demo-theme-project-api-fetching-/)

> Deploy to GitHub Pages, Netlify, or Vercel — open `index.html` to start.

## 🔑 Demo Credentials

```
Username: admin
Password: admin123
```

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **CSS** (Vanilla + Tailwind CDN + DaisyUI) — Styling & layout
- **JavaScript** (Vanilla ES6+) — All logic, no frameworks

## 📁 Project Structure

```
github-issues-tracker/
├── index.html          # Login page
├── dashboard.html      # Main issues dashboard
├── css/
│   └── style.css       # Custom styles
└── js/
    ├── login.js        # Login logic
    └── dashboard.js    # Dashboard logic
```

## ✨ Features

- 🔐 Login with demo credentials
- 📋 View all GitHub issues from API
- 🟢 Filter by Open / Closed / All tabs
- 🔍 Search issues by keyword
- 📦 Issue detail modal on card click
- 🎨 Green top border for open, purple for closed cards
- ⏳ Loading spinner on data fetch
- 📱 Responsive for mobile devices

---

## 📚 JavaScript Concepts — My Own Explanations

### 1️⃣ What is the difference between `var`, `let`, and `const`?

These are three ways to declare variables in JavaScript, and they differ in scope, reassignment, and hoisting behavior.

**`var`** is the old way. It is **function-scoped**, meaning it only cares about the nearest function it lives inside — not blocks like `if` or `for`. It also gets **hoisted** to the top of its scope, but its value is not initialized yet (so accessing it before declaration gives `undefined` instead of an error). You can redeclare and reassign `var` freely, which often causes bugs.

**`let`** is the modern replacement for `var`. It is **block-scoped**, so it only exists inside the `{}` block where it was declared. It is also hoisted but is in a "temporal dead zone" before its declaration, meaning accessing it before the declaration throws an error. You can reassign `let`, but you cannot redeclare it in the same scope.

**`const`** is similar to `let` in scope and hoisting rules, but it cannot be reassigned after its initial value is set. It does **not** mean the value is immutable — if a `const` holds an object or array, you can still change properties or push items. It just means the variable binding itself cannot be changed.

In modern JavaScript, the best practice is: use `const` by default, use `let` when you need to reassign, and avoid `var` entirely.

---

### 2️⃣ What is the spread operator (`...`)?

The spread operator (`...`) takes an iterable (like an array or object) and **expands** its elements or properties in place.

For **arrays**, it lets you copy or merge arrays without mutating the original:
```js
const a = [1, 2, 3];
const b = [...a, 4, 5]; // [1, 2, 3, 4, 5]
```

For **objects**, it copies all key-value pairs from one object into another:
```js
const user = { name: 'Ali', age: 25 };
const updatedUser = { ...user, age: 26 }; // { name: 'Ali', age: 26 }
```

It is also used in **function calls** to pass array elements as individual arguments:
```js
const nums = [3, 1, 4];
Math.max(...nums); // same as Math.max(3, 1, 4)
```

The spread operator is useful for creating shallow copies of data, combining arrays/objects, and writing clean, non-mutating code.

---

### 3️⃣ What is the difference between `map()`, `filter()`, and `forEach()`?

All three are array methods that iterate over elements, but they have different purposes and return values.

**`map()`** transforms each element and returns a **new array** of the same length. Use it when you want to convert every item into something else:
```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2); // [2, 4, 6]
```

**`filter()`** tests each element against a condition and returns a **new array** containing only the items that pass (return `true`). The original array is not changed:
```js
const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
```

**`forEach()`** simply runs a function for each element but **returns nothing** (`undefined`). It is used when you only want side effects (like logging or updating the DOM), not a new array:
```js
['a', 'b', 'c'].forEach(letter => console.log(letter));
```

The key difference: `map()` and `filter()` are **pure** (they produce new arrays), while `forEach()` is for **side effects** only.

---

### 4️⃣ What is an arrow function?

An arrow function is a shorter, more concise syntax for writing functions in JavaScript, introduced in ES6.

Regular function:
```js
function add(a, b) {
  return a + b;
}
```

Arrow function:
```js
const add = (a, b) => a + b;
```

Arrow functions are different from regular functions in one important way: they do **not have their own `this`**. Instead, they inherit `this` from the surrounding context (called lexical `this`). This makes them very useful inside callbacks or event listeners where you want `this` to refer to the outer object rather than being redefined.

If the function body is a single expression, you can omit the curly braces and the `return` keyword — the value is implicitly returned. If there is only one parameter, the parentheses around it are also optional:
```js
const square = x => x * x;
```

Arrow functions are not suitable as object methods or constructors because of the `this` binding behavior.

---

### 5️⃣ What are template literals?

Template literals are a way to write strings in JavaScript using **backticks** (`` ` ``) instead of single or double quotes. They allow you to embed expressions directly inside a string using `${}` syntax, which is called **string interpolation**.

Before template literals:
```js
const name = 'Rahim';
const msg = 'Hello, ' + name + '! You have ' + count + ' messages.';
```

With template literals:
```js
const msg = `Hello, ${name}! You have ${count} messages.`;
```

They also support **multi-line strings** without needing `\n`:
```js
const html = `
  <div>
    <p>${name}</p>
  </div>
`;
```

You can put any JavaScript expression inside `${}` — variables, function calls, ternary operators, arithmetic, etc. Template literals make string construction much more readable and less error-prone compared to string concatenation.

---

## 📤 Submission

- **GitHub Repository Link:** _(add your repo URL here)_
- **Live Site Link:** https://kabir21hossain.github.io/demo-theme-project-api-fetching-/
