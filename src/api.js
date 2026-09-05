const API = "/api";


// =========================================================
// GET PRODUCTS
// =========================================================

export async function getProducts() {
  const res = await fetch(`${API}/products`);

  if (!res.ok) {
    let message = "Cannot load products";

    try {
      const data = await res.json();
      message = data.detail || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}


// =========================================================
// CREATE ORDER
// =========================================================

export async function createOrder(order) {
  const payload = {
    product_id: Number(order.product_id),
    product_name: order.product_name || "",
    size: String(order.size),
    customer_name: String(order.customer_name).trim(),
    phone: String(order.phone).trim(),
    amount:
      order.amount === undefined || order.amount === null
        ? null
        : Number(order.amount),
  };

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Cannot create order"
    );
  }

  return data;
}


// =========================================================
// MARK PAID
// =========================================================

export async function markPaid(orderCode) {
  const res = await fetch(
    `${API}/orders/${encodeURIComponent(orderCode)}/paid`,
    {
      method: "POST",
    }
  );

  let data = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Cannot update payment"
    );
  }

  return data;
}


// =========================================================
// HEALTH
// =========================================================

export async function healthCheck() {
  const res = await fetch(`${API}/health`);

  if (!res.ok) {
    throw new Error("Backend is not running");
  }

  return res.json();
}