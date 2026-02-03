let isLoginMode = true;
let cart = [];
let itemsVisible = 8; // Showing fewer items initially because they are bigger

const names = ["T-REX", "TRI-TOPS", "RAPTOR", "STEGO", "BRACHIO", "SPINO", "ANKYLO", "PTERO", "DIPLO", "ALLO"];
const products = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    name: `${names[i % names.length]} MEGA-UNIT`,
    price: (Math.random() * 100 + 20).toFixed(2),
    image: `https://loremflickr.com/500/500/pixel,dinosaur?lock=${i + 300}`
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
            <button class="pixel-btn block" onclick="addToCart(${p.id})">ADD TO CART</button>
        </div>
    `).join('');

    document.getElementById('load-more-btn').style.display = itemsVisible >= filtered.length ? 'none' : 'inline-block';
}

function loadMore() { itemsVisible += 8; render(); }
function resetAndFilter() { itemsVisible = 8; render(); }

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
    list.innerHTML = cart.map(i => `<div style="padding:15px; border-bottom:3px solid #333; margin-bottom:10px;">> ${i.name} - $${i.price}</div>`).join('');
}

function purchase() { if(cart.length) { alert("BIG WIN! ORDER PLACED."); cart=[]; updateCart(); toggleCart(); } }

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
        document.getElementById('auth-btn').innerText = "EXIT";
        document.getElementById('auth-btn').onclick = () => { localStorage.removeItem('currentUser'); location.reload(); };
    }
}
