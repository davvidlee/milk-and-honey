/**
 * Check if is 5c email
 */
export function is5cEmail(email) {
  const po = "pomona.edu";
  const scr = "scrippscollege.edu";
  const hmc = "hmc.edu";
  const cmc1 = "students.claremontmckenna.edu";
  const cmc2 = "cmc.edu";
  const pitzer = "pitzer.edu";
  const e = email.toLowerCase();
  return (
    e.includes(po) ||
    e.includes(scr) ||
    e.includes(hmc) ||
    e.includes(cmc1) ||
    e.includes(cmc2) ||
    e.includes(pitzer)
  );
}
