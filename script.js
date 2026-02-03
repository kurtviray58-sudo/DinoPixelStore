let isLoginMode = true;
let cart = [];
let itemsVisible = 12;

// 1. Generate 50 Unique Dinosaurs
const names = ["T-REX", "TRI-TOPS", "RAPTOR", "STEGO", "BRACHIO", "SPINO", "ANKYLO", "PTERO", "DIPLO", "ALLO", "CARNO", "MOSA", "PARA", "IGUANO"];
const products = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `${names[i % names.length]} MK-${i + 1}`,
    price: (Math.random() * 100 + 20).toFixed(2),
    image: `https://loremflickr.com/400/400/pixel,dinosaur?lock=${i + 200}`
}));

window.addEventListener('DOMContentLoaded', () => {
    render();
    checkLogin();
});

function render() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    const grid = document.getElementById('product-grid');
    const toShow = filtered.slice(0, itemsVisible);

    grid.innerHTML = toShow.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button class="pixel-btn block" onclick="addToCart(${p.id})">BUY</button>
        </div>
    `).join('');

    document.getElementById('load-more-btn').style.display = 
        itemsVisible >= filtered.length ? 'none' : 'inline-block';
}

function loadMore() { itemsVisible += 12; render(); }
function resetAndFilter() { itemsVisible = 12; render(); }

// Cart
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('active'); }
function addToCart(id) {
    if (!localStorage.getItem('currentUser')) return openModal();
    cart.push(products.find(p => p.id === id));
    updateCart();
}
function updateCart() {
    const list = document.getElementById('cart-items');
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('cart-total').innerText = cart.reduce((s, i) => s + parseFloat(i.price), 0).toFixed(2);
    list.innerHTML = cart.map(i => `<div style="padding:10px; border-bottom:2px solid #222;">${i.name} - $${i.price}</div>`).join('');
}
function purchase() { if(cart.length) { alert("BIG WIN! ITEMS BOUGHT."); cart=[]; updateCart(); toggleCart(); } }

// Auth
function openModal() { document.getElementById('auth-modal').style.display = 'block'; }
function closeModal() { document.getElementById('auth-modal').style.display = 'none'; }
function toggleForm() { 
    isLoginMode = !isLoginMode; 
    document.getElementById('form-title').innerText = isLoginMode ? "LOGIN" : "SIGN UP";
}
function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    if (isLoginMode) {
        const u = JSON.parse(localStorage.getItem(email));
        if (u && u.pass === pass) { localStorage.setItem('currentUser', JSON.stringify({email})); location.reload(); }
        else alert("FAIL!");
    } else {
        localStorage.setItem(email, JSON.stringify({email, pass}));
        alert("READY!"); toggleForm();
    }
}
function checkLogin() {
    const u = JSON.parse(localStorage.getItem('currentUser'));
    if (u) {
        document.getElementById('user-display').innerText = u.email.split('@')[0].toUpperCase();
        document.getElementById('auth-btn').innerText = "EXIT";
        document.getElementById('auth-btn').onclick = () => { localStorage.removeItem('currentUser'); location.reload(); };
    }
}