import { API_BASE_URL } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash, Loader2, ShoppingCart, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from './Toast';

export function ManageMenuModal({ restaurant, onClose }: { restaurant: any, onClose: () => void }) {
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  
  // New Category State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // New Item State
  const [addingItemToCategory, setAddingItemToCategory] = useState<string | null>(null);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants/${restaurant.id}/menus`, {
        headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': restaurant.organizationId }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setMenu(data[0]);
          setLoading(false);
        } else {
          await createDefaultMenu();
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Fetch Menu Error:', res.status, errData);
        throw new Error(errData.message || `Failed to fetch menu (${res.status})`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultMenu = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants/${restaurant.id}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': restaurant.organizationId },
        body: JSON.stringify({ name: 'Main Menu' })
      });
      if (res.ok) {
        setMenu(await res.json());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants/${restaurant.id}/menus/${menu.id}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': restaurant.organizationId },
        body: JSON.stringify({ name: newCategoryName })
      });
      if (!res.ok) throw new Error('Failed to add category');
      setNewCategoryName('');
      setShowAddCategory(false);
      await fetchMenu();
    } catch (err: any) { 
      console.error(err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>, categoryId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants/${restaurant.id}/categories/${categoryId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': restaurant.organizationId },
        body: JSON.stringify({
          name: formData.get('name'),
          price: Number(formData.get('price')),
          description: formData.get('description'),
        })
      });
      if (!res.ok) throw new Error('Failed to add item');
      setAddingItemToCategory(null);
      await fetchMenu();
    } catch (err: any) { 
      console.error(err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Manage Menu: {restaurant.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="var(--text-muted)" /></button>
        </div>
        <div style={{ padding: 'var(--space-6)', overflowY: 'auto', flex: 1, background: 'var(--bg-main)' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
              <Loader2 className="spin" size={32} color="var(--primary)" />
              <p style={{ color: 'var(--text-muted)' }}>Loading menu data...</p>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 'var(--space-4)' }}>
              <div style={{ background: '#fee2e2', padding: '16px', borderRadius: '50%' }}>
                <AlertTriangle size={32} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>Data Sync Error</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>{error}. This might happen if the record was deleted. Please refresh your page.</p>
              </div>
              <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ gap: '8px' }}>
                <RefreshCw size={16} /> Refresh Page
              </button>
            </div>
          ) : (
            <div>
              {menu?.categories?.map((cat: any) => (
                <div key={cat.id} className="card glass" style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>{cat.name}</h3>
                    <button onClick={() => setAddingItemToCategory(cat.id)} className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--primary)', color: 'white', border: 'none' }}>+ Add Item</button>
                  </div>
                  
                  {addingItemToCategory === cat.id && (
                    <form onSubmit={(e) => handleAddItem(e, cat.id)} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', background: 'rgba(0,0,0,0.02)', padding: 'var(--space-3)', borderRadius: '4px' }}>
                      <input name="name" className="input" placeholder="Item Name" required style={{ flex: 2 }} />
                      <input name="price" type="number" step="0.01" className="input" placeholder="Price" required style={{ flex: 1 }} />
                      <input name="description" className="input" placeholder="Description" style={{ flex: 3 }} />
                      <button type="submit" className="btn btn-primary">Save</button>
                      <button type="button" onClick={() => setAddingItemToCategory(null)} className="btn">Cancel</button>
                    </form>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {cat.items?.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2)', background: 'white', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        <div>
                          <strong>{item.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</div>
                        </div>
                        <div style={{ fontWeight: 600 }}>${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                    {!cat.items?.length && <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No items in this category.</div>}
                  </div>
                </div>
              ))}

              {showAddCategory ? (
                <div className="card glass" style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="input" placeholder="Category Name (e.g. Desserts)" autoFocus />
                  <button onClick={handleAddCategory} className="btn btn-primary">Add</button>
                  <button onClick={() => setShowAddCategory(false)} className="btn">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setShowAddCategory(true)} className="btn" style={{ width: '100%', border: '1px dashed var(--border)', background: 'transparent' }}>
                  + Add New Category
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function POSModal({ restaurant, onClose }: { restaurant: any, onClose: () => void }) {
  const [menu, setMenu] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tableId, setTableId] = useState<string>('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/api/v1/restaurants/${restaurant.id}/menus`, {
          headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': restaurant.organizationId }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setMenu(data[0]);
        }
      } finally { setLoading(false); }
    };
    fetchMenu();
  }, [restaurant.id]);

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.menuItemId === item.id);
    if (existing) {
      setCart(cart.map(c => c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.menuItemId !== itemId));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants/${restaurant.id}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': restaurant.organizationId },
        body: JSON.stringify({
          tableId: tableId || undefined,
          type: tableId ? 'DINE_IN' : 'TAKEAWAY',
          items: cart.map(c => ({ menuItemId: c.menuItemId, quantity: c.quantity }))
        })
      });
      if (res.ok) {
        showToast('Order submitted successfully!', 'success');
        setCart([]);
        onClose();
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to submit order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingCart size={24} /> POS: {restaurant.name}</h2>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}><X size={20} /></button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Menu Grid */}
        <div style={{ flex: 2, overflowY: 'auto', padding: 'var(--space-6)' }}>
          {loading ? <Loader2 className="spin" /> : !menu ? <p>No menu found. Please manage menu first.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {menu.categories?.map((cat: any) => (
                <div key={cat.id}>
                  <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-main)' }}>{cat.name}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                    {cat.items?.map((item: any) => (
                      <div key={item.id} onClick={() => addToCart(item)} className="card glass" style={{ cursor: 'pointer', padding: 'var(--space-4)', textAlign: 'center', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <div style={{ fontWeight: 600, marginBottom: '8px' }}>{item.name}</div>
                        <div style={{ color: '#ef4444', fontWeight: 700 }}>${item.price.toFixed(2)}</div>
                      </div>
                    ))}
                    {!cat.items?.length && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No items.</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div style={{ flex: 1, background: 'white', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
            <h3 style={{ margin: 0 }}>Current Order</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)' }}>
            {cart.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-10)' }}>Cart is empty</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {cart.map(c => (
                  <div key={c.menuItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: '#f8fafc', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.quantity} x ${c.price.toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontWeight: 700 }}>${(c.price * c.quantity).toFixed(2)}</div>
                      <button onClick={() => removeFromCart(c.menuItemId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: 'var(--space-6)', background: 'var(--bg-main)', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', fontSize: '1.25rem', fontWeight: 800 }}>
              <span>Total:</span>
              <span style={{ color: '#ef4444' }}>${total.toFixed(2)}</span>
            </div>
            <input value={tableId} onChange={e => setTableId(e.target.value)} className="input" placeholder="Table Number (Optional for Takeaway)" style={{ marginBottom: 'var(--space-4)' }} />
            <button onClick={handleSubmitOrder} disabled={cart.length === 0 || submitting} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
              {submitting ? 'Sending to Kitchen...' : 'Submit Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
