const API_BASE = process.env.REACT_APP_API_BASE || "";

export async function findLogo(file) {
  const formData = new FormData();
  formData.append("file", file);

  let res;
  try {
    res = await fetch(`${API_BASE}/api/find-logo`, {
      method: "POST",
      body: formData,
    });
  } catch (e) {
    throw new Error(
      "Connection problem. The server may still be processing — please wait a few seconds and try again."
    );
  }

  if (!res.ok) {
    // Server retornou erro HTTP. Pode ser proxy timeout (HTML 502/504)
    // ou JSON do FastAPI — tratamos ambos sem quebrar o JSON parse.
    const text = await res.text();
    if (res.status >= 502 && res.status <= 504) {
      throw new Error(
        "Server is busy processing another request. Please wait a few seconds and try again."
      );
    }
    throw new Error(`API error ${res.status}: ${text.slice(0, 200)}`);
  }

  // Content-Type sanity check — se proxy retornou HTML mas com 200, evita
  // o tradicional "Unexpected token < in JSON".
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const preview = (await res.text()).slice(0, 100);
    throw new Error(
      `Unexpected response (not JSON). Server may be restarting. Preview: ${preview}`
    );
  }

  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) throw new Error(`Stats API error ${res.status}`);
  return res.json();
}
