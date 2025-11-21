const API_BASE = "http://localhost:8080";
const endpoint = `${API_BASE}/api/auth/signup`;

const form = document.getElementById("signupForm");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmar = document.getElementById("confirmar");
const terms = document.getElementById("terms");
const submitBtn = document.getElementById("submitBtn");
const confMsg = document.getElementById("confMsg");
const meterBar = document.getElementById("meterBar");
const senhaMsg = document.getElementById("senhaMsg");

// ------------------
// Função para mostrar/ocultar senha
// ------------------
function togglePwd(inputId, eyeId) {
  const input = document.getElementById(inputId);
  const eye = document.getElementById(eyeId);
  const isPwd = input.type === "password";
  input.type = isPwd ? "text" : "password";
  eye.style.opacity = isPwd ? "0.7" : "1";
}
window.togglePwd = togglePwd; // importante para onclick do HTML

// ------------------
// Validações de senha
// ------------------
function scorePassword(p) {
  let score = 0;
  if (!p) return 0;
  const variations = [/[a-z]/.test(p), /[A-Z]/.test(p), /\d/.test(p), /[^\w]/.test(p)];
  score += Math.min(6, Math.floor(p.length / 2));
  score += variations.filter(Boolean).length * 2;
  return Math.min(score, 10);
}

function updateStrength() {
  const s = scorePassword(senha.value);
  meterBar.style.width = (s * 10) + '%';
  if (s >= 8) {
    senhaMsg.textContent = 'Senha forte ✔';
    senhaMsg.className = 'feedback ok';
  } else if (s >= 5) {
    senhaMsg.textContent = 'Senha razoável — adicione maiúsculas, números e símbolos.';
    senhaMsg.className = 'feedback warn';
  } else {
    senhaMsg.textContent = 'Senha fraca — use no mínimo 8 caracteres, misture letras, números e símbolos.';
    senhaMsg.className = 'feedback err';
  }
  checkAll();
}

function updateConfirm() {
  const match = confirmar.value && confirmar.value === senha.value;
  confMsg.hidden = match || !confirmar.value;
  checkAll();
}

// Habilita botão de submit
function checkAll() {
  const valid = form.checkValidity();
  const strong = scorePassword(senha.value) >= 5;
  const match = confirmar.value === senha.value && confirmar.value.length > 0;
  submitBtn.disabled = !(valid && strong && match && terms.checked);
}

senha.addEventListener('input', () => { updateStrength(); validateForm(); });
confirmar.addEventListener('input', () => { updateConfirm(); validateForm(); });
terms.addEventListener('change', checkAll);

// ------------------
// Validação geral do formulário
// ------------------
function validateForm() {
  const ok = nome.value.trim().length >= 3 &&
    email.validity.valid &&
    senha.value.length >= 8 &&
    confirmar.value === senha.value &&
    terms.checked;
  submitBtn.disabled = !ok;
}

// ------------------
// Submissão do formulário
// ------------------
async function handleSubmit(e) {
  e.preventDefault();
  if (submitBtn.disabled) return;

  const payload = {
    nome: nome.value.trim(),
    email: email.value.trim(),
    senha: senha.value
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Criando conta...";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Erro ${res.status}`);
    }

    alert("Conta criada com sucesso!");
    window.location.href = "/Codigo/frontend/login_usuario/login.html";
  } catch (err) {
    alert("Erro ao criar conta: " + err.message);
    submitBtn.disabled = false;
    submitBtn.textContent = "Criar conta";
  }
}
window.handleSubmit = handleSubmit;
