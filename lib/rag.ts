import { getLLMClient } from "@/lib/llm";

const QDRANT_BASE = process.env.QDRANT_BASE_URL ?? "http://localhost:6333";
// Required when Qdrant is deployed with QDRANT__SERVICE__API_KEY set (e.g.
// production). Unset locally, where Qdrant runs without auth.
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
// Must match whatever embedding model/dimensions the ingestion script used
// to populate the `labour-laws` Qdrant collection.
const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001";
const COLLECTION = "labour-laws";
const TOP_K = 5;

interface QdrantPayload {
  text: string;
  metadata: {
    act?: string;
    year?: string;
    source_file?: string;
    chunk_index?: number;
  };
}

interface QdrantHit {
  id: number;
  score: number;
  payload: QdrantPayload;
}

async function embedQuery(query: string): Promise<number[]> {
  const client = getLLMClient();
  const res = await client.embeddings.create({
    model: EMBED_MODEL,
    input: query,
  });
  return res.data[0].embedding;
}

async function searchQdrant(vector: number[]): Promise<QdrantHit[]> {
  const res = await fetch(
    `${QDRANT_BASE}/collections/${COLLECTION}/points/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(QDRANT_API_KEY ? { "api-key": QDRANT_API_KEY } : {}),
      },
      body: JSON.stringify({ vector, limit: TOP_K, with_payload: true }),
    },
  );
  if (!res.ok) throw new Error(`Qdrant search failed (${res.status})`);
  const data = (await res.json()) as { result: QdrantHit[] };

  console.log(
    "[RAG] Qdrant hits:",
    data.result.map((h) => ({
      id: h.id,
      score: h.score,
      act: h.payload.metadata.act,
      year: h.payload.metadata.year,
      source_file: h.payload.metadata.source_file,
      chunk_index: h.payload.metadata.chunk_index,
      text_preview: h.payload.text.slice(0, 120).replace(/\s+/g, " "),
    })),
  );

  return data.result;
}

/**
 * Returns relevant law excerpts for the query, formatted for inclusion in
 * the LLM system prompt. Returns an empty string if RAG is unavailable so
 * the chat route can fall back to the plain system prompt gracefully.
 */
export async function retrieveContext(query: string): Promise<string> {
  try {
    const vector = await embedQuery(query);
    const hits = await searchQdrant(vector);
    if (hits.length === 0) return "";

    const sections = hits.map((hit, i) => {
      const { act, year, source_file } = hit.payload.metadata;
      const label = act
        ? `${act}${year ? ` (${year})` : ""}`
        : (source_file ?? "Unknown source");
      return `[Excerpt ${i + 1} — ${label}]\n${hit.payload.text.trim()}`;
    });

    return sections.join("\n\n---\n\n");
  } catch {
    // RAG is best-effort; a failed lookup should not break the chat.
    return "";
  }
}
