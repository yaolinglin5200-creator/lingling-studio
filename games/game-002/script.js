const stage = document.querySelector('#stage');
const gameShell = document.querySelector('#gameShell');
const comboDisplay = document.querySelector('#combo');
const remainingDisplay = document.querySelector('#remaining');
const progressBar = document.querySelector('#progressBar');
const rankLabel = document.querySelector('#rankLabel');
const statusMessage = document.querySelector('#statusMessage');
const tapHint = document.querySelector('#tapHint');
const hitBurst = document.querySelector('#hitBurst');
const floatingLayer = document.querySelector('#floatingLayer');
const ruohengSpeech = document.querySelector('#ruohengSpeech');
const demonSpeech = document.querySelector('#demonSpeech');
const clearScreen = document.querySelector('#clearScreen');
const restartButton = document.querySelector('#restartButton');
const soundButton = document.querySelector('#soundButton');

const milestones = {
  10: ['認真起來了！', '蛤？來真的？'],
  30: ['棒子有自己的想法！', '等一下啦！'],
  50: ['超高速追殺模式！', '我要申請加班費！'],
  100: ['追擊成功！', '我不逃了啦！']
};

const regularLines = [
  ['站住！', '才不要！'],
  ['企劃還沒驗收！', '明天再說！'],
  ['不准裝忙！', '我真的很忙！'],
  ['吃我一棒！', '這不在職務說明裡！']
];

let combo = 0;
let locked = false;
let soundOn = true;
let audioContext;
let speechTimer;

function tone(frequency, duration = .055, type = 'square', volume = .035) {
  if (!soundOn) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, frequency * .55), audioContext.currentTime + duration);
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function setSpeech(lines) {
  clearTimeout(speechTimer);
  ruohengSpeech.textContent = lines[0];
  demonSpeech.textContent = lines[1];
  ruohengSpeech.classList.add('show');
  demonSpeech.classList.add('show');
  speechTimer = setTimeout(() => {
    ruohengSpeech.classList.remove('show');
    demonSpeech.classList.remove('show');
  }, 850);
}

function makeParticles(count) {
  const symbols = combo >= 50 ? ['⭐', '💥', '🔥', '？', '！'] : ['⭐', '💥', '！'];
  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('i');
    particle.className = 'particle';
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.setProperty('--x', `${58 + Math.random() * 10}%`);
    particle.style.setProperty('--y', `${40 + Math.random() * 13}%`);
    particle.style.setProperty('--dx', `${(Math.random() - .5) * 180}px`);
    particle.style.setProperty('--dy', `${-30 - Math.random() * 140}px`);
    particle.style.setProperty('--r', `${(Math.random() - .5) * 220}deg`);
    particle.style.setProperty('--size', `${1 + Math.random() * 1.5}rem`);
    floatingLayer.append(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  }
}

function updateLevel() {
  gameShell.classList.toggle('level-10', combo >= 10);
  gameShell.classList.toggle('level-30', combo >= 30);
  gameShell.classList.toggle('level-50', combo >= 50);
  gameShell.classList.toggle('level-100', combo >= 100);

  if (combo >= 50) rankLabel.textContent = '超高速追擊模式';
  else if (combo >= 30) rankLabel.textContent = '事情開始失控';
  else if (combo >= 10) rankLabel.textContent = '若衡認真了';
  else rankLabel.textContent = '暖身中';
}

function animateHit() {
  stage.classList.remove('attacking', 'impact');
  hitBurst.classList.remove('pop');
  void stage.offsetWidth;
  stage.classList.add('attacking', 'impact');
  hitBurst.textContent = combo >= 50 ? '爆擊！' : combo >= 30 ? '磅！' : '啪！';
  hitBurst.classList.add('pop');
  setTimeout(() => stage.classList.remove('attacking', 'impact'), 220);
}

function showClear() {
  locked = true;
  setSpeech(milestones[100]);
  tone(523, .12, 'sine', .055);
  setTimeout(() => tone(659, .12, 'sine', .055), 110);
  setTimeout(() => tone(784, .22, 'sine', .06), 220);
  setTimeout(() => {
    clearScreen.hidden = false;
    restartButton.focus();
  }, 500);
}

function attack() {
  if (locked) return;
  combo += 1;
  tapHint.classList.add('hidden');
  comboDisplay.textContent = combo;
  remainingDisplay.textContent = Math.max(0, 100 - combo);
  progressBar.style.width = `${combo}%`;
  animateHit();
  makeParticles(combo >= 50 ? 8 : combo >= 30 ? 6 : 3);
  tone(210 + Math.min(combo, 50) * 4, .055, combo >= 50 ? 'sawtooth' : 'square');
  updateLevel();

  if (milestones[combo]) {
    setSpeech(milestones[combo]);
    statusMessage.textContent = combo === 100 ? '大魔王逃跑系統已經當機。' : `${combo} COMBO！演出升級！`;
  } else if (combo % 7 === 0) {
    setSpeech(regularLines[Math.floor(combo / 7) % regularLines.length]);
  }

  if (combo === 100) showClear();
}

function resetGame() {
  combo = 0;
  locked = false;
  comboDisplay.textContent = '0';
  remainingDisplay.textContent = '100';
  progressBar.style.width = '0%';
  statusMessage.textContent = '追上那個假裝很忙的大魔王！';
  tapHint.classList.remove('hidden');
  clearScreen.hidden = true;
  gameShell.className = 'game-shell';
  updateLevel();
  stage.focus();
}

stage.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  attack();
});

stage.addEventListener('keydown', event => {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    attack();
  }
});

soundButton.addEventListener('click', event => {
  event.stopPropagation();
  soundOn = !soundOn;
  soundButton.textContent = soundOn ? '音效 ON' : '音效 OFF';
  soundButton.setAttribute('aria-pressed', String(soundOn));
  soundButton.setAttribute('aria-label', soundOn ? '關閉音效' : '開啟音效');
  if (soundOn) tone(440, .08, 'sine');
});

restartButton.addEventListener('click', resetGame);
