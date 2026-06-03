function rand4d() {
  var n = Math.floor(Math.random() * 10000);
  return String(n).padStart(4, '0');
}
function generate() {
  var all = new Set();
  while (all.size < 23) all.add(rand4d());
  var nums = Array.from(all);
  document.getElementById('p1').textContent = nums[0];
  document.getElementById('p2').textContent = nums[1];
  document.getElementById('p3').textContent = nums[2];
  var starters = nums.slice(3, 13);
  var consos = nums.slice(13, 23);
  var shtml = '';
  for (var i = 0; i < starters.length; i++) {
    shtml += '<div class="prize-row"><span class="label">Starter</span><span class="number">'+starters[i]+'</span></div>';
  }
  document.getElementById('starter-grid').innerHTML = shtml;
  var chtml = '';
  for (var i = 0; i < consos.length; i++) {
    chtml += '<div class="prize-row"><span class="label">Consolation</span><span class="number">'+consos[i]+'</span></div>';
  }
  document.getElementById('conso-grid').innerHTML = chtml;
  document.getElementById('results').style.display = 'block';
}
window.addEventListener('DOMContentLoaded', function() {
  generate();
  document.getElementById('genBtn').addEventListener('click', generate);
});
