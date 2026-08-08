function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Minimal **bold** markdown -> <strong>
function mdBold(str) {
  return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function skillBar(level, custom) {
  if (custom) {
    return `<span class="pct">${escapeHtml(custom)}</span>`;
  }
  return `<span class="pct">${level}%</span>`;
}

function render(data) {
  document.title = "Rasika — Software Developer in the making";

  // Hero
  document.getElementById('tagline').textContent = data.hero.tagline;
  document.getElementById('hero-heading').textContent = data.hero.heading;
  document.getElementById('hero-sub').textContent = data.hero.subtext;

  // Code block
  const cb = data.codeBlock;
  document.getElementById('codebox-filename').textContent = cb.filename;
  document.getElementById('codebox-body').innerHTML =
`<span class="tok-cm"># who am I, in code</span>

<span class="tok-kw">class</span> <span class="tok-var">Rasika</span>:
    degree = <span class="tok-str">"${escapeHtml(cb.degree)}"</span>
    college = <span class="tok-str">"${escapeHtml(cb.college)}"</span>
    languages = [${cb.languages.map(l => `<span class="tok-str">"${escapeHtml(l)}"</span>`).join(', ')}]
    goal = <span class="tok-str">"${escapeHtml(cb.goal)}"</span>
    status = <span class="tok-str">"${escapeHtml(cb.status)}"</span>`;

  // About
  const about = data.about;
  document.getElementById('about-text').innerHTML = `
    <p>${mdBold(about.paragraph1)}</p>
    <p>${mdBold(about.paragraph2)}</p>
    <p>${mdBold(about.paragraph3)}</p>
  `;
  document.getElementById('stat-grid').innerHTML = about.stats.map(s => `
    <div class="stat">
      <div class="label">${escapeHtml(s.label)}</div>
      <div class="value">${escapeHtml(s.value)}</div>
    </div>
  `).join('');

  // Skills
  document.getElementById('skills-list').innerHTML = data.skills.map(s => `
    <div class="skill-row">
      <div class="skill-head">
        <span class="name">${escapeHtml(s.name)}</span>
        ${skillBar(s.level, s.customLevel)}
      </div>
      <div class="skill-bar"><div class="skill-bar-fill" style="width:${s.customLevel ? 100 : s.level}%"></div></div>
      <div class="skill-note">${escapeHtml(s.note)}</div>
    </div>
  `).join('');

  // Tools
  document.getElementById('tools-list').innerHTML = data.tools.map(t => `
    <a class="tool-link" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">
      <div class="row"><span class="name">${escapeHtml(t.name)}</span><span class="pct">${t.level}%</span></div>
      <div class="handle">${escapeHtml(t.handle)} — tap to view profile →</div>
    </a>
  `).join('') + `
    <div class="skill-row" style="margin-top:20px;">
      <div class="skill-head"><span class="name">Problem Solving</span><span class="pct">${data.problemSolving.level}%</span></div>
      <div class="skill-bar"><div class="skill-bar-fill" style="width:${data.problemSolving.level}%"></div></div>
      <div class="skill-note">${escapeHtml(data.problemSolving.note)}</div>
    </div>
  `;

  // Education
  document.getElementById('education-list').innerHTML = data.education.map(e => `
    <div class="tl-item">
      <div class="tl-year">${escapeHtml(e.year)}</div>
      <h3 class="tl-school">${escapeHtml(e.school)}</h3>
      <p class="tl-detail">${escapeHtml(e.detail)}</p>
      ${e.points && e.points.length ? `<ul class="tl-points">${e.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  // Certifications
  document.getElementById('cert-grid').innerHTML = data.certifications.map(c => `
    <div class="cert-card">
      ${c.image ? `<img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.title)}">` : ''}
      <div class="cert-card-body">
        <h3>${escapeHtml(c.title)}</h3>
        <div class="issuer">${escapeHtml(c.issuer)}</div>
      </div>
    </div>
  `).join('');

  // Projects
  document.getElementById('projects-list').innerHTML = data.projects.map(p => `
    <div class="project-card">
      <span class="project-tag">${escapeHtml(p.tag)}</span>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.description)}</p>
      ${p.url ? `<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
    </div>
  `).join('') + `<div class="project-note">🔧 &nbsp;<strong>More on the way.</strong> ${escapeHtml(data.projectsNote)}</div>`;

  // Contact
  const c = data.contact;
  document.getElementById('contact-intro').textContent = c.intro;
  document.getElementById('contact-links').innerHTML = `
    <a href="mailto:${escapeHtml(c.email)}">✉ ${escapeHtml(c.email)}</a>
    <a href="tel:${escapeHtml(c.phone.replace(/\s/g, ''))}">📞 ${escapeHtml(c.phone)}</a>
    <a href="${escapeHtml(c.github)}" target="_blank" rel="noopener">GitHub →</a>
    <a href="${escapeHtml(c.linkedin)}" target="_blank" rel="noopener">LinkedIn →</a>
  `;

  document.getElementById('footer-text').textContent = data.footer;
  document.getElementById('page-root').classList.remove('loading');
}

fetch('content/site.json?v=' + Date.now())
  .then(res => res.json())
  .then(render)
  .catch(err => {
    console.error(err);
    document.getElementById('page-root').innerHTML = '<div class="skeleton">
</div>';
  });
