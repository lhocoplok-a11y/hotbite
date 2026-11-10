/* ==========================================
   HotBite Digital Menu - Application Logic (Script.js)
   ========================================== */

// --- DATA PRODUK & KATEGORI ---
const categories = [
    { id: 'all', name: 'Semua Menu', icon: 'grid' },
    { id: 'burger', name: 'Burger', icon: 'utensils' },
    { id: 'chicken', name: 'Ayam Goreng', icon: 'flame' },
    { id: 'pizza', name: 'Pizza & Pasta', icon: 'pizza' },
    { id: 'drinks', name: 'Minuman', icon: 'coffee' },
    { id: 'snacks', name: 'Snack', icon: 'cookie' }
];

const products = [
    {
        id: 1,
        name: 'HotBite Supreme Burger',
        category: 'burger',
        price: 45000,
        rating: 4.9,
        sold: '1.2rb+',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        description: 'Burger daging sapi juicy dengan keju leleh, selada segar, dan saus spesial HotBite.'
    },
    {
        id: 2,
        name: 'Crispy Fire Chicken (2 pcs)',
        category: 'chicken',
        price: 38000,
        rating: 4.8,
        sold: '950+',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80',
        description: 'Ayam goreng renyah dengan balutan bumbu pedas manis membara.'
    },
    {
        id: 3,
        name: 'Pepperoni Lava Pizza',
        category: 'pizza',
        price: 65000,
        rating: 4.7,
        sold: '620+',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
        description: 'Pizza dengan extra pepperoni, keju mozzarella lumer, dan saus tomat spesial.'
    },
    {
        id: 4,
        name: 'Iced Cocoa Signature',
        category: 'drinks',
        price: 22000,
        rating: 4.9,
        sold: '2.1rb+',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
        description: 'Minuman cokelat dingin yang kaya rasa, manis pas, dan menyegarkan.'
    },
    {
        id: 5,
        name: 'Loaded French Fries',
        category: 'snacks',
        price: 25000,
        rating: 4.6,
        sold: '810+',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        description: 'Kentang goreng garing disiram saus keju cair dan potongan daging asap.'
    },
    {
        id: 6,
        name: 'Double Cheese Burger',
        category: 'burger',
        price: 52000,
        rating: 4.8,
        sold: '740+',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        description: 'Dua lapis patty daging sapi dengan double keju cheddar premium.'
    }
];

// --- STATE APLIKASI ---
let cart = [];
let currentCategory = 'all';
let searchQuery = '';
let userPoints = 0;   // Saldo HotPoint untuk top-up & diskon belanja
let userCoins = 0;    // Saldo HotCoins dari bonus transaksi & alat pembayaran
let adminPhone = '6281234567890';
let orderHistory = [];

// --- INISIALISASI SAAT HALAMAN DIMUAT ---
window.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    updateCartUI();
    updatePointsUI();
    updateCoinsUI();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// --- RENDER KATEGORI ---
function renderCategories() {
    const container = document.getElementById('categoryContainer');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
        <button onclick="selectCategory('${cat.id}')" 
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                currentCategory === cat.id 
                    ? 'bg-brand-red text-white shadow-red-500/20 shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }">
            <span>${cat.name}</span>
        </button>
    `).join('');
}

// --- RENDER PRODUK ---
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');
    const countBadge = document.getElementById('menuCountBadge');
    const categoryTitle = document.getElementById('currentCategoryTitle');
    
    if (!grid) return;

    let filtered = products.filter(p => {
        const matchCategory = currentCategory === 'all' || p.category === currentCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    if (countBadge) countBadge.textContent = filtered.length;
    
    const activeCatObj = categories.find(c => c.id === currentCategory);
    if (categoryTitle) categoryTitle.textContent = activeCatObj ? activeCatObj.name : 'Menu';

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = filtered.map(product => `
        <div class="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
                <div class="relative overflow-hidden rounded-2xl mb-3 aspect-video bg-gray-100">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl text-[10px] font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                        ⭐ ${product.rating}
                    </div>
                </div>
                <h4 class="font-bold text-gray-900 text-sm mb-1 line-clamp-1">${product.name}</h4>
                <p class="text-xs text-gray-500 line-clamp-2 mb-3">${product.description}</p>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-50">
                <div>
                    <span class="text-[10px] text-gray-400 block uppercase">Harga</span>
                    <span class="text-sm font-extrabold text-brand-red">Rp ${product.price.toLocaleString('id-ID')}</span>
                </div>
                <button onclick="addToCart(${product.id})" class="bg-brand-dark hover:bg-brand-red text-white p-2.5 rounded-2xl transition shadow-md active:scale-95" title="Tambah ke Keranjang">
                    <i data-lucide="plus" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function selectCategory(catId) {
    currentCategory = catId;
    renderCategories();
    renderProducts();
}

function handleSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    searchQuery = input.value.trim();
    
    if (searchQuery.length > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }
    renderProducts();
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    input.value = '';
    searchQuery = '';
    clearBtn.classList.add('hidden');
    renderProducts();
}

function resetFilters() {
    currentCategory = 'all';
    clearSearch();
    renderCategories();
    renderProducts();
}

// --- KERANJANG (CART) & MANIPULASI ITEM ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    // Jika modal keranjang sedang terbuka, perbarui tampilannya secara instan agar tidak stuck
    const cartModal = document.getElementById('cartModal');
    if (cartModal && !cartModal.classList.contains('pointer-events-none')) {
        renderCartModalItems();
    }
    showToast(`Berhasil menambahkan ${product.name}`);
}

function decreaseCartItem(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCartUI();
    renderCartModalItems();
    if (cart.length === 0) {
        closeCartModal();
    }
}

function updateCartUI() {
    const floatingCart = document.getElementById('floatingCart');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    if (cartTotalPrice) cartTotalPrice.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;

    if (totalItems > 0) {
        floatingCart.classList.remove('translate-y-32');
    } else {
        floatingCart.classList.add('translate-y-32');
    }
}

// --- MODAL KERANJANG & CHECKOUT ---
function openCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.querySelector('div').classList.remove('translate-y-full');
    renderCartModalItems();
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('div').classList.add('translate-y-full');
}

function renderCartModalItems() {
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('modalSubtotal');
    const totalEl = document.getElementById('modalTotal');
    const pointDiscountEl = document.getElementById('modalPointDiscount');
    const coinDiscountEl = document.getElementById('modalCoinDiscount');
    const earnedCoinsEl = document.getElementById('modalEarnedCoins');
    const availablePointsEl = document.getElementById('modalAvailablePoints');
    const availableCoinsEl = document.getElementById('modalAvailableCoins');
    const usePointsCheckbox = document.getElementById('useHotPointsCheckbox');
    const useCoinsCheckbox = document.getElementById('useHotCoinsCheckbox');

    availablePointsEl.textContent = `Tersedia: ${userPoints.toLocaleString('id-ID')} Poin`;
    availableCoinsEl.textContent = `Tersedia: ${userCoins.toLocaleString('id-ID')} Koin`;

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Keranjang masih kosong</p>`;
        subtotalEl.textContent = 'Rp 0';
        totalEl.textContent = 'Rp 0';
        pointDiscountEl.textContent = '-Rp 0';
        coinDiscountEl.textContent = '-Rp 0';
        if (earnedCoinsEl) earnedCoinsEl.textContent = '+0 Koin';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between bg-gray-50 p-2.5 rounded-2xl">
            <div class="flex items-center gap-2">
                <img src="${item.image}" class="w-10 h-10 object-cover rounded-xl">
                <div>
                    <h5 class="text-xs font-bold text-gray-800 line-clamp-1">${item.name}</h5>
                    <span class="text-[10px] text-gray-500">Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</span>
                </div>
            </div>
            <div class="flex items-center gap-1.5">
                <button onclick="decreaseCartItem(${item.id})" class="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-gray-100 text-red-600">-</button>
                <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                <button onclick="addToCart(${item.id})" class="w-6 h-6 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-gray-100 text-emerald-600">+</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Diskon HotPoint
    let pointDiscount = 0;
    if (usePointsCheckbox && usePointsCheckbox.checked) {
        pointDiscount = Math.min(userPoints, subtotal);
    }

    // Sisa setelah diskon HotPoint
    let remainingAfterPoints = Math.max(0, subtotal - pointDiscount);

    // Diskon / Pembayaran HotCoins
    let coinDiscount = 0;
    if (useCoinsCheckbox && useCoinsCheckbox.checked) {
        coinDiscount = Math.min(userCoins, remainingAfterPoints);
    }

    const finalTotal = Math.max(0, remainingAfterPoints - coinDiscount);
    
    // Bonus HotCoins Berkelipatan (Contoh: Kelipatan setiap 100k mendapat 1000 koin)
    let earnedCoins = Math.floor(subtotal / 100000) * 1000;

    subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    pointDiscountEl.textContent = `-Rp ${pointDiscount.toLocaleString('id-ID')}`;
    coinDiscountEl.textContent = `-Rp ${coinDiscount.toLocaleString('id-ID')}`;
    if (earnedCoinsEl) earnedCoinsEl.textContent = `+${earnedCoins.toLocaleString('id-ID')} Koin`;
    totalEl.textContent = `Rp ${finalTotal.toLocaleString('id-ID')}`;
}

function toggleOrderOption() {
    const isDelivery = document.querySelector('input[name="orderOption"]:checked').value === 'Delivery';
    const addressContainer = document.getElementById('addressFieldContainer');
    const labelDelivery = document.getElementById('labelDelivery');
    const labelTakeaway = document.getElementById('labelTakeaway');
    const optCod = document.getElementById('optCod');
    const optKasir = document.getElementById('optKasir');

    if (isDelivery) {
        addressContainer.classList.remove('hidden');
        labelDelivery.className = "flex items-center justify-center gap-2 p-2.5 border rounded-xl cursor-pointer text-xs font-medium border-brand-red bg-red-50/50 text-brand-red";
        labelTakeaway.className = "flex items-center justify-center gap-2 p-2.5 border border-gray-200 rounded-xl cursor-pointer text-xs font-medium text-gray-600";
        optCod.classList.remove('hidden');
        optKasir.classList.add('hidden');
        document.getElementById('paymentMethod').value = "Transfer Bank / QRIS";
    } else {
        addressContainer.classList.add('hidden');
        labelTakeaway.className = "flex items-center justify-center gap-2 p-2.5 border rounded-xl cursor-pointer text-xs font-medium border-brand-red bg-red-50/50 text-brand-red";
        labelDelivery.className = "flex items-center justify-center gap-2 p-2.5 border border-gray-200 rounded-xl cursor-pointer text-xs font-medium text-gray-600";
        optCod.classList.add('hidden');
        optKasir.classList.remove('hidden');
        document.getElementById('paymentMethod').value = "Bayar Tunai di Kasir";
    }
}

// --- KIRIM KE WHATSAPP ---
function sendOrderToWhatsApp() {
    const name = document.getElementById('custName').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const orderOption = document.querySelector('input[name="orderOption"]:checked').value;
    const payment = document.getElementById('paymentMethod').value;
    const notes = document.getElementById('custNotes').value.trim();
    const usePoints = document.getElementById('useHotPointsCheckbox').checked;
    const useCoins = document.getElementById('useHotCoinsCheckbox').checked;

    if (!name) {
        alert('Mohon masukkan nama pemesan!');
        document.getElementById('custName').focus();
        return;
    }

    if (orderOption === 'Delivery' && !address) {
        alert('Mohon masukkan alamat lengkap pengiriman!');
        document.getElementById('custAddress').focus();
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let pointDiscount = usePoints ? Math.min(userPoints, subtotal) : 0;
    let remainingAfterPoints = Math.max(0, subtotal - pointDiscount);
    let coinDiscount = useCoins ? Math.min(userCoins, remainingAfterPoints) : 0;
    const finalTotal = Math.max(0, remainingAfterPoints - coinDiscount);
    
    let earnedCoins = Math.floor(subtotal / 100000) * 1000;

    // Kurangi saldo HotPoint jika dipakai
    if (usePoints && pointDiscount > 0) {
        userPoints -= pointDiscount;
    }
    // Kurangi saldo HotCoins jika dipakai untuk bayar
    if (useCoins && coinDiscount > 0) {
        userCoins -= coinDiscount;
    }
    // Tambah HotCoins dari bonus pembelian berkelipatan
    userCoins += earnedCoins;

    updatePointsUI();
    updateCoinsUI();

    const orderRecord = {
        date: new Date().toLocaleString('id-ID'),
        items: [...cart],
        total: finalTotal,
        option: orderOption,
        status: 'Berhasil Dipesan'
    };
    orderHistory.unshift(orderRecord);

    let message = `🔥 *PESANAN BARU - HOTBITE* 🔥\n\n`;
    message += `👤 *Nama:* ${name}\n`;
    message += `📦 *Opsi:* ${orderOption}\n`;
    if (orderOption === 'Delivery') {
        message += `📍 *Alamat:* ${address}\n`;
    }
    message += `💳 *Pembayaran:* ${payment}\n`;
    if (notes) {
        message += `📝 *Catatan:* ${notes}\n`;
    }
    message += `\n*Rincian Pesanan:*\n`;
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity}x) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });
    message += `\n-------------------\n`;
    message += `Subtotal: Rp ${subtotal.toLocaleString('id-ID')}\n`;
    if (usePoints && pointDiscount > 0) {
        message += `Diskon HotPoint: -Rp ${pointDiscount.toLocaleString('id-ID')}\n`;
    }
    if (useCoins && coinDiscount > 0) {
        message += `Pembayaran HotCoins: -Rp ${coinDiscount.toLocaleString('id-ID')}\n`;
    }
    message += `*Total Pembayaran: Rp ${finalTotal.toLocaleString('id-ID')}*\n\n`;
    message += `Terima kasih sudah memesan di HotBite!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    cart = [];
    updateCartUI();
    closeCartModal();

    window.open(waUrl, '_blank');
    showToast('Pesanan berhasil dikirim ke WhatsApp!');
}

// --- HOTPOINT & HOTCOINS ---
function updatePointsUI() {
    const badge = document.getElementById('headerPointsBadge');
    if (badge) badge.textContent = `${userPoints.toLocaleString('id-ID')} Poin`;
}

function updateCoinsUI() {
    const badge = document.getElementById('headerCoinsBadge');
    if (badge) badge.textContent = `${userCoins.toLocaleString('id-ID')} Koin`;
}

function openTopUpModal() {
    const modal = document.getElementById('topUpModal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeTopUpModal() {
    const modal = document.getElementById('topUpModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

function selectTopUpAmount(amount) {
    document.getElementById('topUpInput').value = amount;
    document.querySelectorAll('.topup-preset-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function processTopUp() {
    const input = document.getElementById('topUpInput');
    const amount = parseInt(input.value);

    if (isNaN(amount) || amount < 1000) {
        alert('Minimal top up HotPoint adalah Rp 1.000');
        return;
    }

    userPoints += amount;
    updatePointsUI();
    closeTopUpModal();
    input.value = '';
    showToast(`Berhasil top up ${amount.toLocaleString('id-ID')} HotPoint!`);
}

// --- RIWAYAT PEMBELIAN ---
function openHistoryModal() {
    const modal = document.getElementById('historyModal');
    const container = document.getElementById('historyItemsContainer');
    modal.classList.remove('opacity-0', 'pointer-events-none');

    if (orderHistory.length === 0) {
        container.innerHTML = `<p class="text-xs text-gray-400 text-center py-8">Belum ada riwayat pembelian</p>`;
        return;
    }

    container.innerHTML = orderHistory.map(ord => `
        <div class="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2">
            <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-gray-800">${ord.date}</span>
                <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold text-[10px]">${ord.option}</span>
            </div>
            <div class="text-[11px] text-gray-600 space-y-1">
                ${ord.items.map(i => `<div>• ${i.name} (${i.quantity}x)</div>`).join('')}
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-gray-200 text-xs font-bold">
                <span class="text-gray-500">Total</span>
                <span class="text-brand-red">Rp ${ord.total.toLocaleString('id-ID')}</span>
            </div>
        </div>
    `).join('');
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

// --- ADMIN SETTING ---
function openAdminSettings() {
    const modal = document.getElementById('adminModal');
    document.getElementById('adminPhoneInput').value = adminPhone;
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeAdminSettings() {
    const modal = document.getElementById('adminModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

function saveAdminPhone() {
    const input = document.getElementById('adminPhoneInput');
    let val = input.value.trim();
    if (!val) {
        alert('Nomor WA tidak boleh kosong!');
        return;
    }
    adminPhone = val;
    closeAdminSettings();
    showToast('Nomor WA Admin berhasil diperbarui!');
}

// --- TOAST NOTIFICATION ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMsg');
    msgEl.textContent = msg;

    toast.classList.remove('translate-x-full', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
}