'use strict';

let boxes = [];
let board;
let backtrack = [];
let empty = true;
let animating = false;

function createField() {
    for (let j = 0; j < 9; j++) {
        let row = document.createElement('div');
        row.classList.add('sudoku-row');
        for (let i = 0; i < 9; i++) {
            let el = document.createElement('div');
            el.addEventListener('click', (e) => onClick(e, el, i, j));
            el.classList.add('sudoku-box');
            if (j == 2 || j == 5) {
                el.classList.add('thick-bottom');
            }
            if (i == 2 || i == 5) {
                el.classList.add('thick-right');
            }
            row.appendChild(el);
            boxes.push(el);
        }
        game.appendChild(row);
    }
}

function displayBoard(board, initial=false) {
    for (let i = 0; i < 81; i++) {
        if (board[i] == 0) {
            boxes[i].innerText = '';
            if (initial) {
                boxes[i].classList.remove('initial');
            }
        } else {
            boxes[i].innerText = board[i].toString();
            if (initial) {
                boxes[i].classList.add('initial');
            }
        }
    }
}

function randomBoard() {
    let board = [];
    for (let i = 0; i < 81; i++) {
        board.push(Math.floor(Math.random()*10));
    }
    return board;
}

function emptyBoard() {
    return Array(81).fill(0);
}

function onClick(e, el, i, j) {
    for (let box of boxes) {
        box.classList.remove('sudoku-active');
    }
    el.classList.add('sudoku-active');
    e.stopPropagation();
}

function boardSet(i, j, val) {
    board[i + j * 9] = val;
}

function boardGet(i, j) {
    return board[i + j * 9];
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function possibleNums(i, j) {
    let nums = new Set([9, 8, 7, 6, 5, 4, 3, 2, 1]);
    for (let x = 0; x < 9; x++) {
        nums.delete(boardGet(x, j));
    }
    for (let y = 0; y < 9; y++) {
        nums.delete(boardGet(i, y));
    }
    let bx = Math.floor(i / 3) * 3;
    let by = Math.floor(j / 3) * 3;
    for (let x = bx; x < bx + 3; x++) {
        for (let y = by; y < by + 3; y++) {
            nums.delete(boardGet(x, y));
        }
    }
    let arr = Array.from(nums);
    shuffleArray(arr);
    return arr;
}

function seedBoard(board) {
    for (let num = 1; num <= 9; num++) {
        while (true) {
            let idx = Math.floor(Math.random() * 81)
            if (board[idx] == 0) {
                board[idx] = num;
                break;
            }
        }
    }
}

function step() {
    if (empty) {
        empty = false;
        seedBoard(board);
        displayBoard(board, true);
        return;
    }
    // find the next empty spot, skipping seeded values
    if (backtrack.length >= 81) {
        animating = false;
        return true;
    }
    while (board[backtrack.length] != 0) {
        backtrack.push([]);
        if (backtrack.length >= 81) {
            animating = false;
            return true;
        }
    }
    let x = backtrack.length % 9;
    let y = Math.floor(backtrack.length / 9);
    let nums = possibleNums(x, y);
    if (nums.length > 0) {
        board[backtrack.length] = nums[nums.length-1];
        backtrack.push(nums);
    } else {
        // backtrack
        while (true) {
            let nums = backtrack.pop();
            if (nums.length > 1) {
                let num = nums.pop();
                board[backtrack.length] = num;
                backtrack.push(nums);
                break;
            } else if (nums.length == 1) {
                board[backtrack.length] = 0;
            }
        }
    }
    displayBoard(board);
    if (animating) {
        requestAnimationFrame(step);
    }
    return false;
}

function start() {
    animating = true;
    step();
}

function stop() {
    animating = false;
}

function reset() {
    board = emptyBoard();
    backtrack = [];
    animating = false;
    empty = true;
    displayBoard(board, true);
}

function brrrr() {
    for (let i = 0; i < 100000; i++) {
        if (step()) {
            break;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    createField();
    reset();
});

document.addEventListener('click', function() {
    for (let box of boxes) {
        box.classList.remove('sudoku-active');
    }
});
