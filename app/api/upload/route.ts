import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/auth";

// Caricamento diretto dal browser al Blob (i video sono troppo grandi per una
// normale richiesta al server). Solo per chi ha fatto login.
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("Non autorizzato");
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 300 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(json);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "errore" }, { status: 400 });
  }
}
