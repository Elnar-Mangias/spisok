import { useEffect, useMemo, useState } from 'react';
import ShoppingItem from './components/ShoppingItem.jsx';

const STORAGE_KEY = 'warenkorb-items-v1';

function readSavedItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [items, setItems] = useState(readSavedItems);
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The list still works for the current session if storage is unavailable.
    }
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
  const remaining = items.filter((item) => !item.checked).length;
  const checkedCount = items.length - remaining;

  function addProduct(event) {
    event.preventDefault();
    const title = product.trim();
    if (!title) return;

    const parsedPrice = Number(price);
    setItems((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
        checked: false,
      },
    ]);
    setProduct('');
    setPrice('');
  }

  function toggleProduct(id) {
    setItems((current) =>
      current.map((item) => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  }

  function removeProduct(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clearChecked() {
    setItems((current) => current.filter((item) => !item.checked));
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="./" aria-label="Мой список покупок">
          <span className="brand-mark">✓</span>
          <span>План покупок</span>
        </a>
        <span className="topbar-note">Маленький план — меньше забот</span>
      </header>

      <section className="intro">
        <p className="eyebrow">ВАШ СПИСОК НА СЕГОДНЯ</p>
        <h1>Не забудь<br /><span>купить важное.</span></h1>
        <p className="intro-copy">Добавляй товары, отмечай купленное и следи за общей суммой в одном месте.</p>
      </section>

      <section className="dashboard" aria-label="Список покупок">
        <div className="list-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">МОЙ ЧЕК-ЛИСТ</p>
              <h2>Что нужно купить</h2>
            </div>
            <span className="item-count">{items.length} {items.length === 1 ? 'товар' : 'товаров'}</span>
          </div>

          <form className="add-form" onSubmit={addProduct}>
            <label className="field product-field">
              <span>Название товара</span>
              <input
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                placeholder="Например, молоко"
                maxLength={100}
                required
              />
            </label>
            <label className="field price-field">
              <span>Цена, сом</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0"
              />
            </label>
            <button className="add-button" type="submit"><span aria-hidden="true">＋</span> Добавить</button>
          </form>

          <div className="list-divider" />

          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">＋</div>
              <h3>Список пока пуст</h3>
              <p>Добавь первый товар — и план покупок готов.</p>
            </div>
          ) : (
            <>
              <ul className="shopping-list">
                {items.map((item) => (
                  <ShoppingItem
                    key={item.id}
                    item={item}
                    onToggle={toggleProduct}
                    onDelete={removeProduct}
                  />
                ))}
              </ul>
              <div className="list-footer">
                <span>{checkedCount} из {items.length} отмечено</span>
                {checkedCount > 0 && <button className="text-button" onClick={clearChecked} type="button">Убрать купленное</button>}
              </div>
            </>
          )}
        </div>

        <aside className="summary-panel">
          <div className="summary-top">
            <span className="summary-icon" aria-hidden="true">с</span>
            <p className="eyebrow">ВАШ БЮДЖЕТ</p>
          </div>
          <p className="summary-label">Предварительная сумма</p>
          <p className="total-price">{total.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span> сом</span></p>
          <div className="summary-rule" />
          <div className="summary-stat"><span>Всего товаров</span><strong>{items.length}</strong></div>
          <div className="summary-stat"><span>Осталось купить</span><strong>{remaining}</strong></div>
          <div className="progress-track" role="progressbar" aria-label="Прогресс покупок" aria-valuemin="0" aria-valuemax={items.length || 1} aria-valuenow={checkedCount}>
            <span style={{ width: `${items.length ? (checkedCount / items.length) * 100 : 0}%` }} />
          </div>
          <p className="progress-caption">{items.length ? Math.round((checkedCount / items.length) * 100) : 0}% списка выполнено</p>
          <p className="summary-tip">Совет: отмечай товары по мере покупок, чтобы ничего не пропустить.</p>
        </aside>
      </section>

      <footer className="footer">
        <span>План покупок</span>
        <span>Список сохраняется на этом устройстве</span>
      </footer>
    </main>
  );
}
