const money = n => 'Rs. ' + Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catOf = id => CATEGORIES.find(c => c.id === id);
const param = k => new URLSearchParams(location.search).get(k);
function getCount(){ try { return +localStorage.getItem('dp_cart') || 0; } catch(e){ return 0; } }
function setCount(n){ try { localStorage.setItem('dp_cart', n); } catch(e){} document.querySelectorAll('.cart-badge').forEach(b => b.textContent = n); }

function showToast(msg){
  let c = document.getElementById('toastContainer');
  if(!c){ c = document.createElement('div'); c.id='toastContainer'; c.className='toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div'); t.className='toast';
  t.innerHTML = '<span style="font-size:1.2rem;color:var(--accent);">&#10004;</span><span>'+msg+'</span>';
  c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='all .3s'; setTimeout(()=>t.remove(),300); }, 3000);
}
function addToCart(id, qty){
  const p = PRODUCTS.find(x => x.id === id); if(!p) return;
  setCount(getCount() + (qty || 1));
  showToast('Added <b>'+esc(p.name)+'</b> to your bag! (Demo only)');
}

function renderHeader(){
  const cats = CATEGORIES.map(c => '<a href="shop.html?category='+encodeURIComponent(c.slug)+'" class="dropdown-item">'+esc(c.name)+'</a>').join('');
  document.getElementById('site-header').innerHTML = `
  <div class="top-bar"><div class="container top-bar-inner">
    <div class="top-bar-left"><span><b>Dress Point</b> — Premium Sri Lankan Fashion | Demo Version</span></div>
    <div class="top-bar-right"><a href="contact.html">Need Help? Contact Us</a></div>
  </div></div>
  <header class="site-header"><div class="container header-inner">
    <a href="index.html" class="logo"><span class="logo-accent">&#9830;</span> DRESS<span class="logo-accent">POINT</span><span class="logo-tag">Fashion Store</span></a>
    <nav class="main-nav" id="mainNav"><ul class="nav-links">
      <li><a href="index.html" class="nav-link">Home</a></li>
      <li><a href="shop.html" class="nav-link">All Products</a></li>
      <li class="nav-dropdown"><a href="shop.html" class="nav-link">Categories &#9662;</a><div class="dropdown-menu">${cats}</div></li>
      <li><a href="contact.html" class="nav-link">Contact Us</a></li>
    </ul></nav>
    <div class="header-actions">
      <a href="#" class="cart-btn" onclick="showToast('Cart is not available in the demo');return false;"><span>&#128722;</span><span>Bag</span><span class="cart-badge">${getCount()}</span></a>
      <button class="mobile-toggle" id="mobileNavToggle" aria-label="Toggle navigation">&#9776;</button>
    </div>
  </div></header>`;
  const btn = document.getElementById('mobileNavToggle'), nav = document.getElementById('mainNav');
  btn.addEventListener('click', () => { nav.classList.toggle('open'); btn.innerHTML = nav.classList.contains('open') ? '&times;' : '&#9776;'; });
  document.addEventListener('click', e => { if(!nav.contains(e.target) && !btn.contains(e.target)){ nav.classList.remove('open'); btn.innerHTML='&#9776;'; } });
}
function renderFooter(){
  document.getElementById('site-footer').innerHTML = `
  <footer class="site-footer"><div class="container"><div class="footer-grid">
    <div class="footer-col"><h3>About Dress Point</h3>
      <p>Dress Point is an exclusive online fashion store offering modern and traditional apparel, shoes and accessories across Sri Lanka.</p>
      <p style="color:var(--accent);font-weight:600;">100% Quality Guaranteed &bull; Island-wide Delivery</p></div>
    <div class="footer-col"><h3>Quick Links</h3><ul class="footer-links">
      <li><a href="index.html">Home</a></li><li><a href="shop.html">All Products</a></li><li><a href="contact.html">Contact &amp; Support</a></li></ul></div>
    <div class="footer-col"><h3>Departments</h3><ul class="footer-links">
      ${CATEGORIES.map(c=>'<li><a href="shop.html?category='+c.slug+'">'+esc(c.name)+'</a></li>').join('')}</ul></div>
    <div class="footer-col"><h3>Store Information</h3><ul class="footer-contact">
      <li><span>&#128205;</span><span>45 Galle Road, Bambalapitiya, Colombo 04, Sri Lanka</span></li>
      <li><span>&#128222;</span><span>+94 (0) 11 234 5678</span></li>
      <li><span>&#9993;</span><span>support@dresspoint.lk</span></li>
      <li><span>&#128337;</span><span>Mon - Sat: 9:00 AM - 8:00 PM</span></li></ul></div>
  </div>
  <div class="footer-bottom"><p>&copy; ${new Date().getFullYear()} <strong>Dress Point</strong>. Static demo of a PHP/MySQL project.</p></div>
  </div></footer>`;
}

function productCard(p, showFeatured){
  const c = catOf(p.category_id), first = p.sizes.split(',')[0].trim();
  return `<div class="product-card">
    <div class="product-thumb-wrap"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
      ${showFeatured && p.is_featured ? '<div class="product-badge-wrap"><span class="badge badge-gold">Featured</span></div>' : ''}
      <div class="quick-view-overlay"><a href="product.html?id=${p.id}" class="quick-view-btn">View Details &rarr;</a></div></div>
    <div class="product-info">
      <span class="product-category-name">${esc(c.name)}</span>
      <h3 class="product-name"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <div class="product-sizes-preview">Sizes: <b>${esc(p.sizes)}</b></div>
      <div class="product-bottom-row"><div class="product-price">${money(p.price)}</div>
        <button type="button" class="card-add-btn" title="Add to Cart" onclick="addToCart(${p.id},1)">&#43;</button></div>
    </div></div>`;
}

function initHome(){
  document.getElementById('categoriesGrid').innerHTML = CATEGORIES.map(c =>
    `<a href="shop.html?category=${encodeURIComponent(c.slug)}" class="category-card"><div class="category-img-wrap"><img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy"></div><div class="category-title">${esc(c.name)}</div></a>`).join('');
  document.getElementById('featuredGrid').innerHTML = PRODUCTS.filter(p => p.is_featured).slice(0,10).map(p => productCard(p, true)).join('');
}
function initShop(){
  const slug = param('category') || '';
  const active = CATEGORIES.find(c => c.slug === slug);
  const list = PRODUCTS.filter(p => !slug || (active && p.category_id === active.id));
  const name = active ? active.name : 'All Products';
  document.getElementById('crumbs').innerHTML = '<a href="index.html">Home</a> &nbsp;/&nbsp; <a href="shop.html">Shop</a>' + (active ? ' &nbsp;/&nbsp; <b style="color:var(--primary);">'+esc(name)+'</b>' : '');
  document.getElementById('catList').innerHTML =
    '<li class="filter-category-item"><a href="shop.html" class="filter-category-link '+(slug===''?'active':'')+'"><span>All Products</span></a></li>' +
    CATEGORIES.map(c => '<li class="filter-category-item"><a href="shop.html?category='+encodeURIComponent(c.slug)+'" class="filter-category-link '+(slug===c.slug?'active':'')+'"><span>'+esc(c.name)+'</span><span class="filter-count">'+PRODUCTS.filter(p=>p.category_id===c.id).length+'</span></a></li>').join('');
  document.getElementById('resultCount').innerHTML = 'Showing <b>'+list.length+'</b> items in <b>'+esc(name)+'</b>';
  document.getElementById('shopGrid').innerHTML = list.length ? list.map(p => productCard(p, true)).join('')
    : '<div class="empty-catalog"><h3>No products found</h3><p>No products in this category.</p><a href="shop.html" class="btn btn-primary">Browse All Products</a></div>';
}
function initProduct(){
  const p = PRODUCTS.find(x => x.id === +param('id'));
  if(!p){ location.href = 'shop.html'; return; }
  const c = catOf(p.category_id);
  document.title = p.name + ' | Dress Point';
  const sizes = p.sizes.split(',').map(s => s.trim());
  const related = PRODUCTS.filter(x => x.category_id === p.category_id && x.id !== p.id).slice(0,4);
  document.getElementById('productRoot').innerHTML = `
  <div style="font-size:.88rem;color:var(--text-muted);margin-bottom:24px;">
    <a href="index.html">Home</a> &nbsp;/&nbsp; <a href="shop.html">Shop</a> &nbsp;/&nbsp; <a href="shop.html?category=${c.slug}">${esc(c.name)}</a> &nbsp;/&nbsp; <b style="color:var(--primary);">${esc(p.name)}</b></div>
  <div class="product-detail-grid">
    <div class="product-gallery">
      <div class="gallery-main"><img id="mainProductImg" src="${esc(p.image)}" alt="${esc(p.name)}"></div>
      <div class="gallery-thumbs"><div class="thumb-item active"><img src="${esc(p.image)}" alt=""></div><div class="thumb-item"><img src="${esc(p.image)}" alt=""></div></div>
    </div>
    <div class="product-details">
      <span class="detail-category">${esc(c.name)}</span>
      <h1 class="detail-title">${esc(p.name)}</h1>
      <div class="detail-price-box"><span class="detail-price">${money(p.price)}</span><span class="detail-stock">&#10004; In Stock (${p.stock} available)</span></div>
      <p class="detail-desc">${esc(p.description)}</p>
      <div class="detail-option-group"><label class="option-label">Select Available Size:</label><div class="size-selector">
        ${sizes.map((s,i)=>'<label class="size-radio-label"><input type="radio" name="size" value="'+esc(s)+'" '+(i===0?'checked':'')+'><span class="size-pill">'+esc(s)+'</span></label>').join('')}</div></div>
      <div class="detail-actions">
        <div class="qty-picker"><button type="button" class="qty-btn" id="qMinus">&minus;</button><input type="number" id="detailQty" class="qty-input" value="1" min="1" max="${p.stock}"><button type="button" class="qty-btn" id="qPlus">&plus;</button></div>
        <button type="button" class="btn btn-accent detail-add-btn" id="addBtn"><span>&#128722;</span> Add to Shopping Bag</button>
      </div>
      <div style="background:var(--bg-cream);border:1px solid var(--border-light);border-radius:var(--radius-md);padding:18px;font-size:.88rem;display:flex;flex-direction:column;gap:8px;">
        <div><b>&#128666; Island-wide Delivery:</b> 2-3 business days within Western Province.</div>
        <div><b>&#128181; Payment:</b> Cash on Delivery available island-wide.</div>
        <div><b>&#8644; Easy Returns:</b> 7-day size exchange guarantee.</div></div>
    </div>
  </div>
  ${related.length ? '<div style="margin-top:60px;"><div class="section-header" style="text-align:left;"><div class="section-subtitle">Recommended For You</div><h2 class="section-title" style="text-align:left;">Similar '+esc(c.name)+'</h2></div><div class="product-grid">'+related.map(r=>productCard(r,false)).join('')+'</div></div>' : ''}`;
  const q = document.getElementById('detailQty');
  document.getElementById('qMinus').onclick = () => { if(q.value > 1) q.value--; };
  document.getElementById('qPlus').onclick = () => { if(+q.value < p.stock) q.value++; };
  document.getElementById('addBtn').onclick = () => addToCart(p.id, +q.value || 1);
  const main = document.getElementById('mainProductImg'), th = document.querySelectorAll('.thumb-item');
  th.forEach(t => t.onclick = () => { th.forEach(x => x.classList.remove('active')); t.classList.add('active'); main.src = t.querySelector('img').getAttribute('src'); });
}
function initContact(){
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const n = document.getElementById('c_name').value;
    document.getElementById('contactMsg').innerHTML = '<div style="background:#F0FDF4;border:1px solid #BBF7D0;color:#166534;padding:16px 20px;border-radius:var(--radius);margin-bottom:24px;font-weight:500;">&#10003; Thank you, '+esc(n)+'! (Demo: message is not actually sent.)</div>';
    e.target.reset();
  });
}
document.addEventListener('DOMContentLoaded', () => {
  renderHeader(); renderFooter();
  const f = { home: initHome, shop: initShop, product: initProduct, contact: initContact }[document.body.dataset.page];
  if (f) f();
});
