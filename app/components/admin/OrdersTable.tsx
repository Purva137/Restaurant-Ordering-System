"use client";

export default function OrdersTable({ orders }: { orders: any[] }) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <th className="p-4 text-left">Table</th>
            <th>Status</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-white/10">
              <td className="p-4">#{o.tableNumber}</td>
              <td>{o.status}</td>
              <td>
                {o.items
                  .map((i: any) => `${i.menuItemName ?? i.menuItem?.name} × ${i.quantity}`)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
