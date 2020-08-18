import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", event => {
  event.respondWith(handleEvent(event));
});

async function resignedAtApi() {
  const res = await fetch("https://www.gov.uk/api/content/government/people/gavin-williamson");
  if (!res.ok) throw new Error(`Result from gov.uk was ${res.status}`);
  const json = await res.json();
  const ended = json.links.role_appointments[2].details.ended_on;
  return new Response(JSON.stringify(ended), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event);
  } catch (e) {
    let pathname = new URL(event.request.url).pathname;
    if (pathname === "/api/v1/resigned") return await resignedAtApi();
    return new Response(`"${pathname}" not found`, {
      status: 404,
      statusText: "not found"
    });
  }
}
