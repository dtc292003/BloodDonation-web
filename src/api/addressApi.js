const ADDRESS_API = 'https://provinces.open-api.vn/api/v2';

async function readList(url, signal) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`API địa chỉ trả về HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Dữ liệu địa chỉ trả về không đúng định dạng.');
  }

  return data;
}

export async function getProvinces(signal) {
  const provinces = await readList(`${ADDRESS_API}/p/`, signal);
  return provinces.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

export async function getWards(provinceCode, signal) {
  if (!provinceCode) return [];
  const wards = await readList(
    `${ADDRESS_API}/w/?province=${encodeURIComponent(provinceCode)}`,
    signal,
  );
  return wards.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}