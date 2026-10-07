const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const statusBox = document.getElementById('status');

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  panels.forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(tab.dataset.tab).classList.add('active');
  statusBox.className = 'status';
}));

function showStatus(message, ok = true) {
  statusBox.textContent = message;
  statusBox.className = `status show ${ok ? 'ok' : 'error'}`;
}

async function postJSON(url, body) {
  const response = await fetch(url, {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.message || 'Une erreur est survenue.');
  return data;
}

document.getElementById('create-btn').addEventListener('click', async () => {
  try {
    const data = await postJSON('/api/create-folder', {
      parent: document.getElementById('create-parent').value,
      name: document.getElementById('create-name').value
    });
    showStatus(data.message); document.getElementById('create-name').value = '';
  } catch (e) { showStatus(e.message, false); }
});

document.getElementById('move-btn').addEventListener('click', async () => {
  try {
    const data = await postJSON('/api/move', {
      source: document.getElementById('move-source').value,
      destination: document.getElementById('move-destination').value
    });
    showStatus(data.message); document.getElementById('move-source').value = '';
  } catch (e) { showStatus(e.message, false); }
});

document.getElementById('search-btn').addEventListener('click', async () => {
  const directory = document.getElementById('search-directory').value;
  const keyword = document.getElementById('search-keyword').value;
  const results = document.getElementById('results');
  results.innerHTML = '<p class="empty">Recherche...</p>';
  try {
    const response = await fetch(`/api/search?directory=${encodeURIComponent(directory)}&keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || 'Erreur de recherche.');
    results.innerHTML = '';
    if (!data.matches.length) results.innerHTML = '<p class="empty">Aucun fichier trouvé.</p>';
    data.matches.forEach(path => {
      const row = document.createElement('div'); row.className = 'result'; row.textContent = path; results.appendChild(row);
    });
    showStatus(`${data.matches.length} résultat(s) trouvé(s).`);
  } catch (e) { results.innerHTML = '<p class="empty">Recherche impossible.</p>'; showStatus(e.message, false); }
});

document.getElementById('delete-btn').addEventListener('click', async () => {
  const target = document.getElementById('delete-target').value;
  if (!target) return showStatus('Indique le chemin à supprimer.', false);
  if (!confirm(`Supprimer définitivement :\n${target} ?`)) return;
  try {
    const data = await postJSON('/api/delete', {target});
    showStatus(data.message); document.getElementById('delete-target').value = '';
  } catch (e) { showStatus(e.message, false); }
});
