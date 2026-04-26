import { formatCurrency, formatLineAmount } from '../../utils/documentDataMapper';

const PricingTable = ({ items = [] }) => {
  return (
    <section className="doc-table-wrap doc-avoid-break">
      <table className="doc-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.description || '-'}</td>
              <td>{item.quantity || 0}</td>
              <td>{formatCurrency(item.amount)}</td>
              <td>{formatLineAmount(item.quantity, item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PricingTable;

