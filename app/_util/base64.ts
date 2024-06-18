export async function imageURLToBase64(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  return `data:image/png;base64,${base64}`;
}
