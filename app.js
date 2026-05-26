const RECIPIENT = 'w.wesslen@gmail.com';

const COUNTRY_CODES = {
  US: '+1',
  GB: '+44',
  SE: '+46',
  DE: '+49',
  FR: '+33',
  AU: '+61',
  JP: '+81',
  IN: '+91',
  BR: '+55',
  AE: '+971',
  SG: '+65',
  ZA: '+27',
  CA: '+1',
  NL: '+31'
};

function normalizePhone(country, phone) {
  const digits = (phone || '').replace(/\D/g, '');
  const countryCode = COUNTRY_CODES[country] || '+1';

  if (!digits) {
    return '';
  }

  return `${countryCode} ${digits}`;
}

document.getElementById('requestForm').addEventListener('submit', function(e){
  e.preventDefault();
  const f = e.target;
  const data = new FormData(f);
  const company = data.get('company') || '';
  const contact = data.get('contact') || '';
  const email = data.get('email') || '';
  const phone = normalizePhone(data.get('country') || 'US', data.get('phone') || '');
  const size = data.get('size') || '';
  const message = data.get('message') || '';

  const materials = [];
  f.querySelectorAll('input[name="materials"]:checked').forEach(cb => materials.push(cb.value));

  const subject = `ISO27001 Forms Request — ${company}`;
  const bodyLines = [
    `Company: ${company}`,
    `Contact: ${contact}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `Size: ${size}`,
    `Materials: ${materials.join(', ') || 'None selected'}`,
    '',
    'Notes:',
    message
  ];

  const mailto = `mailto:${encodeURIComponent(RECIPIENT)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

  window.location.href = mailto;
  const fb = document.getElementById('feedback');
  fb.textContent = 'Opening your mail client to send the request. If nothing happens, copy the details and email ' + RECIPIENT + '.';
});
