// formHandler.js
import { getItem, setItem } from './utils.js';

class CustomerFormHandler {
  constructor(formSelector = '#guest-form', messageContainer = '#message-container') {
    this.form = document.querySelector(formSelector);
    this.msgContainer = document.querySelector(messageContainer);
    this.dataKey = null;

    this.form.addEventListener('input', this.handleInput.bind(this));
    this.form.addEventListener('blur', this.handleBlur.bind(this), true);
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.addEventListener('click', () => this.clearForm());
  }

  handleInput(e) { this.validateField(e.target); }
  handleBlur(e) { this.validateField(e.target); }

  validateField(field) {
    if (!field || !field.name) return true;
    const name = field.name;
    const val = field.value.trim();
    let valid = true;

    switch (name) {
      case 'fullName': valid = val.length >= 3; break;
      case 'phone': valid = /^\d{10}$/.test(val); break;
      case 'email': valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); break;
      case 'address': valid = val.length > 0; break;
      case 'aadhar': valid = /^\d{12}$/.test(val); break;
      case 'checkIn':
      case 'checkOut': valid = this.validateDates(); break;
      case 'adults': valid = Number(val) >= 1; break;
      case 'purpose': valid = val.length >= 10; break;
      default: valid = field.checkValidity();
    }

    field.classList.toggle('is-invalid', !valid);
    field.classList.toggle('is-valid', valid);
    return valid;
  }

  validateDates() {
    const inEl = this.form.querySelector('[name="checkIn"]');
    const outEl = this.form.querySelector('[name="checkOut"]');
    if (!inEl || !outEl) return false;

    const today = new Date(); today.setHours(0,0,0,0);
    const inVal = inEl.value ? new Date(inEl.value) : null;
    const outVal = outEl.value ? new Date(outEl.value) : null;
    if (!inVal || !outVal) return false;

    inVal.setHours(0,0,0,0);
    outVal.setHours(0,0,0,0);

    const valid = inVal >= today && outVal > inVal;
    inEl.classList.toggle('is-invalid', !valid);
    outEl.classList.toggle('is-invalid', !valid);
    inEl.classList.toggle('is-valid', valid);
    outEl.classList.toggle('is-valid', valid);

    return valid;
  }

  validateForm() {
    const elements = Array.from(this.form.elements).filter(el => el.name);
    return elements.every(el => this.validateField(el));
  }

  showMessage(message, type = 'success', timeout = 4000) {
    this.msgContainer.innerHTML = '';
    const div = document.createElement('div');
    div.className = `alert alert-${type} alert-dismissible`;
    div.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    this.msgContainer.appendChild(div);
    if (timeout > 0) setTimeout(() => div.remove(), timeout);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.validateForm()) {
      this.showMessage('Please fix validation errors before submitting.', 'danger', 5000);
      return;
    }
    const formData = new FormData(this.form);
    const payload = {};
    formData.forEach((v, k) => payload[k] = v.trim());
    payload.id = Date.now();

    const list = getItem();
    list.push(payload);
    const ok = setItem(list);

    if (ok) {
      this.showMessage('Submission saved successfully!', 'success');
      this.clearForm();
    } else {
      this.showMessage('Failed to save submission.', 'danger');
    }
  }

  clearForm() {
    this.form.reset();
    this.form.querySelectorAll('.is-valid, .is-invalid')
      .forEach(el => el.classList.remove('is-valid','is-invalid'));
  }
}

window.addEventListener('DOMContentLoaded', () => new CustomerFormHandler());
export default CustomerFormHandler;
