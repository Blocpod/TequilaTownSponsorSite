import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPartnershipEmail } from '../dist/partnership-email.mjs';

test('email draft preserves every answer and encodes punctuation as content', () => {
  const answers = {
    name: '  María & José  ',
    email: 'maria+partners@example.com',
    company: 'Agave & Co? #1',
    website: 'https://example.com/?a=1&b=2',
    interest: 'Destilería — Signature room',
    goal: 'Product discovery & tastings',
    budget: '$25,000–$50,000',
    timing: 'For Cinco de Mayo 2027',
    idea: 'A tasting + dinner.\nInvite our team? & guests #VIP',
  };
  const draft = buildPartnershipEmail(new Map(Object.entries(answers)));
  const url = new URL(draft.href);
  assert.equal(url.pathname, 'hi@tequila.town');
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.searchParams.get('subject'), 'Tequila Town Season Two partnership — Agave & Co? #1');
  assert.equal(url.searchParams.get('body'), draft.body);
  for (const answer of Object.values(answers)) assert.ok(draft.body.includes(answer.trim()));
  assert.equal(url.hash, '');
});

test('empty optional fields stay readable and subject stays on one line', () => {
  const draft = buildPartnershipEmail(new Map([['company', 'Brand\r\nBcc: other@example.com']]));
  assert.match(draft.body, /Website \/ social: Not provided/);
  assert.ok(draft.body.includes('Let’s explore the possibilities together.'));
  assert.doesNotMatch(new URL(draft.href).searchParams.get('subject'), /[\r\n]/);
});
