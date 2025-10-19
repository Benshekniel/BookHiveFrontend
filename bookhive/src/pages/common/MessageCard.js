// MessageCard.js
export function showMessageCard(title, message, type) {
  const backgroundColor =
    type === 'success' ? '#d4edda' :
    type === 'error' ? '#f8d7da' :
    '#cce5ff';

  const borderColor =
    type === 'success' ? '#28a745' :
    type === 'error' ? '#dc3545' :
    '#004085';

  const iconHTML =
    type === 'success' ? `
      <div class="icon success-icon">✔️</div>
    ` : type === 'error' ? `
      <div class="icon error-icon">😞</div>
    ` : `
      <div class="icon info-icon">ℹ️</div>
    `;

  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @keyframes popIn {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); }
    }

    .icon {
      font-size: 48px;
      margin-bottom: 10px;
      animation: popIn 0.6s ease;
    }

    .success-icon { color: #28a745; }
    .error-icon { color: #dc3545; }
    .info-icon { color: #004085; }
  `;
  document.head.appendChild(styleTag);

  const card = document.createElement('div');
  card.style.position = 'fixed';
  card.style.top = '20px';
  card.style.left = '50%';
  card.style.transform = 'translateX(-50%)';
  card.style.backgroundColor = backgroundColor;
  card.style.color = '#000';
  card.style.border = `2px solid ${borderColor}`;
  card.style.padding = '20px';
  card.style.borderRadius = '12px';
  card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
  card.style.zIndex = '9999';
  card.style.minWidth = '320px';
  card.style.textAlign = 'center';
  card.style.fontFamily = 'Arial, sans-serif';

  card.innerHTML = `
    ${iconHTML}
    <h3 style="margin: 0 0 8px; font-size: 20px;">${title}</h3>
    <p style="margin: 0; font-size: 16px;">${message}</p>
  `;

  document.body.appendChild(card);

  setTimeout(() => {
    card.remove();
    styleTag.remove();
  }, 5000);
}
