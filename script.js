const $ = (s) => document.querySelector(s);
const modal = $("#gameModal"), content = $("#gameContent"), starCount = $("#starCount");
let stars = Number(localStorage.getItem("kfw-stars") || 0);
let activeGame = "";
let currentAnswer = "";
starCount.textContent = stars;
$("#year").textContent = new Date().getFullYear();

function earnStar(){ stars++; localStorage.setItem("kfw-stars", stars); starCount.textContent = stars; }
function openGame(){ modal.classList.add("open"); }
function closeGame(){ modal.classList.remove("open"); }
$("#closeModal").addEventListener("click", closeGame);
modal.addEventListener("click", e => { if(e.target === modal) closeGame(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeGame(); });
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$("#mainNav").querySelectorAll("a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));
$("#parentBtn").addEventListener("click", () => {
  content.innerHTML = `<h2>👋 Hello, grown-ups!</h2><p>Kids Fun World is a simple demo experience. Star progress is saved on this device only. There are no logins, ads, payments or personal-data forms in this starter version.</p><button class="btn btn-primary" id="parentOkay">Got it!</button>`;
  openGame(); $("#parentOkay").onclick = closeGame;
});
document.querySelectorAll("[data-game]").forEach(btn => btn.addEventListener("click", () => startGame(btn.dataset.game)));

function startGame(game){
  activeGame = game;
  if(game === "math") mathGame();
  if(game === "letters") letterGame();
  if(game === "shapes") shapeGame();
  if(game === "color") colorGame();
  openGame();
}
function showResult(ok, message){
  const feedback = $(".feedback");
  if(!feedback) return;
  feedback.textContent = message;
  if(ok){ feedback.style.color = "#279a68"; earnStar(); setTimeout(closeGame, 950); }
  else feedback.style.color = "#dc6b78";
}
function mathGame(){
  const a = Math.floor(Math.random()*8)+1, b = Math.floor(Math.random()*8)+1;
  const answer = a+b; currentAnswer = String(answer);
  const options = [...new Set([answer, answer+1, Math.max(1,answer-1), Math.floor(Math.random()*15)+1])].slice(0,3);
  if(!options.includes(answer)) options[0]=answer;
  options.sort(()=>Math.random()-.5);
  content.innerHTML = `<span class="eyebrow">NUMBER FUN</span><h2>🧮 Solve the sum!</h2><div class="game-question">${a} + ${b} = ?</div><p>Tap the correct answer.</p><div class="answer-grid">${options.map(n=>`<button class="answer-option" data-answer="${n}">${n}</button>`).join("")}</div><div class="feedback" aria-live="polite"></div>`;
  content.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>showResult(b.dataset.answer===currentAnswer,b.dataset.answer===currentAnswer?"Amazing! You earned a star ⭐":"Try again! You can do it 💪"));
}
function letterGame(){
  const letters=["A","B","C","D","E","F","G","H","M","S"];
  const answer=letters[Math.floor(Math.random()*letters.length)];
  const options=[answer,...letters.filter(x=>x!==answer).sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
  content.innerHTML=`<span class="eyebrow">LETTER POP</span><h2>🔤 Find the letter!</h2><div class="game-question">${answer}</div><p>Which button shows this letter?</p><div class="answer-grid">${options.map(x=>`<button class="answer-option" data-letter="${x}">${x}</button>`).join("")}</div><div class="feedback" aria-live="polite"></div>`;
  content.querySelectorAll("[data-letter]").forEach(b=>b.onclick=()=>showResult(b.dataset.letter===answer,b.dataset.letter===answer?"Wonderful! You earned a star ⭐":"Not quite. Try once more!"));
}
function shapeGame(){
  const shapes=[{e:"🔺",n:"triangle"},{e:"🟦",n:"square"},{e:"⚪",n:"circle"}];
  const answer=shapes[Math.floor(Math.random()*shapes.length)];
  const options=[answer,...shapes.filter(x=>x!==answer)].sort(()=>Math.random()-.5);
  content.innerHTML=`<span class="eyebrow">SHAPE MATCH</span><h2>🧩 Find the ${answer.n}!</h2><div class="game-question">${answer.e}</div><p>Tap the matching shape.</p><div class="answer-grid">${options.map(x=>`<button class="answer-option" data-shape="${x.n}">${x.e}</button>`).join("")}</div><div class="feedback" aria-live="polite"></div>`;
  content.querySelectorAll("[data-shape]").forEach(b=>b.onclick=()=>showResult(b.dataset.shape===answer.n,b.dataset.shape===answer.n?"Great matching! You earned a star ⭐":"Look carefully and try again!"));
}
function colorGame(){
  const colors=[["#ff7777","red"],["#ffd65a","yellow"],["#72c9a1","green"],["#8b79e8","purple"],["#70b9e8","blue"]];
  content.innerHTML=`<span class="eyebrow">COLOR STUDIO</span><h2>🎨 Make it colorful!</h2><p>Choose a color to paint the star.</p><div class="color-canvas" id="paintCanvas">⭐</div><div class="color-palette">${colors.map(c=>`<button class="color-dot" aria-label="${c[1]}" title="${c[1]}" data-color="${c[0]}" style="background:${c[0]}"></button>`).join("")}</div><div class="feedback" aria-live="polite"></div><button class="btn btn-primary" id="finishColor">Finish artwork ⭐</button>`;
  content.querySelectorAll("[data-color]").forEach(b=>b.onclick=()=>$("#paintCanvas").style.color=b.dataset.color);
  $("#finishColor").onclick=()=>showResult(true,"Beautiful artwork! You earned a star ⭐");
}
