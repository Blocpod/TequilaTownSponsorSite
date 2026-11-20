export function buildPartnershipEmail(data) {
  const answer = (name) => String(data.get(name) ?? '').trim();
  const company = answer('company').replace(/[\r\n]+/g, ' ');
  const subject = `Tequila Town Season Two partnership — ${company}`;
  const body = [
    'Hi Tequila Town team,',
    '',
    'I’d like to explore a Season Two partnership. Here’s a little about us:',
    '',
    `Name: ${answer('name')}`,
    `Email: ${answer('email')}`,
    `Company / brand: ${answer('company')}`,
    `Website / social: ${answer('website') || 'Not provided'}`,
    '',
    `Partnership interest: ${answer('interest')}`,
    `Main goal: ${answer('goal')}`,
    `Estimated budget: ${answer('budget')}`,
    `Timing: ${answer('timing')}`,
    '',
    'Our idea / additional details:',
    answer('idea') || 'Let’s explore the possibilities together.',
    '',
    'Looking forward to connecting.',
  ].join('\r\n');

  return {
    body,
    href: `mailto:hi@tequila.town?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
