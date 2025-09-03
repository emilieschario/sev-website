(function() {
  const forms = Array.from(document.querySelectorAll('.join-form'));
  if (!forms.length) return;

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function openMailto(subject, body) {
    const to = 'emilie@shouldexistventures.com';
    const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  async function subscribeWithMailerLite(email, action) {
    // MailerLite API: create or update subscriber
    // Docs: https://developers.mailerlite.com/docs/subscribers.html
    const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYWNlNmNmNmM5YzRmMjBlYWU0NjRjYWUyMDQxNGE4ZjcxZTNlMGFiZWZmNGRhYjYxM2IwNDFlZTVkMWU4ZjIxODgzNWFkYzQyNjNjZjBiNDIiLCJpYXQiOjE3NTY5MTIyODIuNzE4MDA4LCJuYmYiOjE3NTY5MTIyODIuNzE4MDExLCJleHAiOjQ5MTI1ODU4ODIuNzEyNDUyLCJzdWIiOiIxNzkwMjc1Iiwic2NvcGVzIjpbXX0.uP9NMiYzU9Pddpd2Ti0nVBbOIEO15Cleg0EFMR0cmizpxPxg0iYSCYY61t6545eF4jVTODPUk8IBG1as-thV0Ono9ui9j_8AzS3cR_I7SxHak6bwduiMpykGxLdBmNYr8BSTjR4lvZilXTz8T6VmLkT5iIpLKLHochikLiVNq2TLH6tyizk9K9UG456l6dCSXzq5ScVETVZbMjk0yRZzXesysXSSikYTSDw7OTumHyoyvpFLFkI9IVE0nhtExioWBTfiNOu-2IPKuMvc93340c1T342lOn_eTQXNyOmsq05wIDVmeKMZaoqTl1c773iK2LdLsDJcxffAPPfJubxKNV0vmjKQ4DrhNuPgqZecfG1Xoep9cllZC8IrYuEqrck877oGOWvn6p1-cKCqTFDJxE-oMftAzaX64ksYB0KAix4rtksqFXxwSwKZJBIIEH4B-twRyX_Dic9rNaCRmUzoUr8Q5-yJj2gbAdx269Exflx64qdDhtZ6sE8RqYXRU6mS_grJXWv3ZaWpqfOMbpIGGaY-fSAxlJTV_KtPsIMGpIfH7j4ppLyqb00VdyHVAGPyqJi2D1g_0LwPm8H4p62kQgMRHUn0vKbaJTHcLU3STr8uaacWlH8kRapD_P74bMf4N6gwAiCxsyv9D4Uwn2sL0iUz50EPSjjs39jaQyQWjw0';
    const url = 'https://connect.mailerlite.com/api/subscribers';
    const payload = {
      email: email,
      fields: { source: 'floss-drop', cta: action },
      resubscribe: true,
      groups: ["164534389183612790"],
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || `HTTP ${resp.status}`);
    }
    return resp.json();
  }

  forms.forEach(function(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const statusEl = form.nextElementSibling && form.nextElementSibling.classList.contains('notice') ? form.nextElementSibling : null;
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitButton = form.querySelector('[data-action]');
      const action = submitButton ? submitButton.getAttribute('data-action') : 'waitlist';
      const email = emailInput.value.trim();
      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        emailInput.focus();
        return;
      }
      try {
        setStatus('Signing you up…', 'loading');
        await subscribeWithMailerLite(email, action);
        setStatus('You are on the list! Check your inbox for a confirmation.', 'success');
        emailInput.value = '';
      } catch (err) {
        console.error(err);
        setStatus('Could not reach signup service. Opening email…', 'error');
        const subject = 'Waitlist — The Floss Drop';
        const body = `Brand: The Floss Drop\nCTA: ${action}\nEmail: ${email}`;
        openMailto(subject, body);
      }
    });
    function setStatus(message, kind) {
      if (!statusEl) return;
      statusEl.textContent = message || '';
      statusEl.classList.remove('success', 'error', 'loading');
      if (kind) statusEl.classList.add(kind);
    }
  });
})();


