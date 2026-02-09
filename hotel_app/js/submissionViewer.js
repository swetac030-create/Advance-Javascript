// submissionViewer.js
import { getItem, setItem } from './utils.js';

class SubmissionViewer {
  constructor() {
    this.tableBody = document.querySelector('#submissionsTable tbody');
    this.search = document.getElementById('search');
    this.noData = document.getElementById('no-data');
    this.exportBtn = document.getElementById('exportBtn');
    this.importBtn = document.getElementById('importBtn');
    this.fileInput = document.getElementById('fileInput');

    this.submissions = getItem();
    this.renderTable(this.submissions);

    this.search.addEventListener('input', () => this.handleSearch());
    this.tableBody.addEventListener('click', (e) => this.handleTableClick(e));
    this.exportBtn.addEventListener('click', () => this.exportJSON());
    this.importBtn.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.importJSON(e));
  }

  renderTable(data) {
    this.tableBody.innerHTML = '';
    if (!data || data.length === 0) {
      this.noData.style.display = 'block';
      return;
    }
    this.noData.style.display = 'none';

    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.dataset.id = item.id;
      tr.innerHTML = `
        <td>${item.fullName}</td>
        <td>${item.phone}</td>
        <td>${item.email}</td>
        <td>${item.checkIn}</td>
        <td>${item.checkOut}</td>
        <td>${item.adults}</td>
        <td>
          <button class="btn btn-sm btn-danger delete-btn">Delete</button>
          <button class="btn btn-sm btn-secondary view-btn">Details</button>
        </td>
      `;
      this.tableBody.appendChild(tr);
    });
  }

  handleSearch() {
    const q = this.search.value.trim().toLowerCase();
    const filtered = this.submissions.filter(item =>
      item.fullName.toLowerCase().includes(q) ||
      (item.checkIn || '').includes(q) ||
      (item.checkOut || '').includes(q)
    );
    this.renderTable(filtered);
  }

  handleTableClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const row = btn.closest('tr');
    const id = Number(row.dataset.id);

    if (btn.classList.contains('delete-btn')) this.deleteRecord(id);
    else if (btn.classList.contains('view-btn')) this.showDetails(id);
  }

  deleteRecord(id) {
    if (!confirm('Delete this submission?')) return;
    this.submissions = this.submissions.filter(s => Number(s.id) !== Number(id));
    setItem(this.submissions);
    this.renderTable(this.submissions);
  }

  showDetails(id) {
    const item = this.submissions.find(s => Number(s.id) === Number(id));
    if (!item) return alert('Record not found');
    alert(Object.entries(item).map(([k,v])=>`${k}: ${v}`).join('\n'));
  }

  exportJSON() {
    const dataStr = JSON.stringify(this.submissions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'submissions.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed)) {
          this.submissions = parsed;
          setItem(this.submissions);
          this.renderTable(this.submissions);
        } else alert('Invalid JSON: expected an array.');
      } catch (err) { alert('JSON parse error'); }
    };
    reader.readAsText(file);
  }
}

window.addEventListener('DOMContentLoaded', () => new SubmissionViewer());
export default SubmissionViewer;
