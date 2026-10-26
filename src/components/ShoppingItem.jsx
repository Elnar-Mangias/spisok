export default function ShoppingItem({ item, onToggle, onDelete }) {
  return (
    <li className={`shopping-row${item.checked ? ' is-checked' : ''}`}>
      <label className="item-check">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
          aria-label={`Отметить ${item.title} как ${item.checked ? 'не купленный' : 'купленный'}`}
        />
        <span className="custom-check" aria-hidden="true">✓</span>
      </label>
      <span className="item-name">{item.title}</span>
      <span className="item-price">{item.price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} сом</span>
      <button className="delete-button" type="button" onClick={() => onDelete(item.id)} aria-label={`Удалить ${item.title}`} title="Удалить товар">×</button>
    </li>
  );
}
