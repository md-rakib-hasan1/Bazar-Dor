import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";
import { db } from "@/lib/auth";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return new Response("Not found", { status: 404 });
  }

  const bucket = new GridFSBucket(db, { bucketName: "profile_avatars" });
  const imageId = new ObjectId(id);
  const [file] = await bucket.find({ _id: imageId }).limit(1).toArray();

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = file.metadata?.contentType;
  if (
    contentType !== "image/png" &&
    contentType !== "image/jpeg" &&
    contentType !== "image/gif" &&
    contentType !== "image/webp"
  ) {
    return new Response("Unsupported image", { status: 415 });
  }

  const stream = bucket.openDownloadStream(imageId);

  return new Response(Readable.toWeb(stream) as ReadableStream<Uint8Array>, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
};
