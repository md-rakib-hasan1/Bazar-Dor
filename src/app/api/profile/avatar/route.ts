import { GridFSBucket, ObjectId } from "mongodb";
import { headers } from "next/headers";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { auth, db } from "@/lib/auth";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const getImageType = (data: Buffer) => {
  if (data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { contentType: "image/png", extension: "png" };
  }

  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  if (
    data.subarray(0, 6).toString("ascii") === "GIF87a" ||
    data.subarray(0, 6).toString("ascii") === "GIF89a"
  ) {
    return { contentType: "image/gif", extension: "gif" };
  }

  if (
    data.subarray(0, 4).toString("ascii") === "RIFF" &&
    data.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }

  return null;
};

export const POST = async (request: Request) => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return Response.json({ error: "সাইন ইন করুন।" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "সঠিক image file দিন।" }, { status: 400 });
  }

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "একটি profile picture বেছে নিন।" }, { status: 400 });
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return Response.json(
      { error: "ছবির সাইজ ৫ MB-এর মধ্যে হতে হবে।" },
      { status: 413 },
    );
  }

  const data = Buffer.from(await file.arrayBuffer());
  const imageType = getImageType(data);
  if (!imageType) {
    return Response.json(
      { error: "শুধু JPG, PNG, GIF অথবা WebP ছবি ব্যবহার করুন।" },
      { status: 415 },
    );
  }

  const bucket = new GridFSBucket(db, { bucketName: "profile_avatars" });
  const imageId = new ObjectId();
  const upload = bucket.openUploadStreamWithId(
    imageId,
    `${session.user.id}.${imageType.extension}`,
    {
      metadata: {
        contentType: imageType.contentType,
        userId: session.user.id,
      },
    },
  );

  try {
    await pipeline(Readable.from([data]), upload);

    const name = formData.get("name");
    const updateBody: { image: string; name?: string } = {
      image: `/api/profile/avatar/${imageId.toHexString()}`,
    };
    if (typeof name === "string" && name.trim()) {
      updateBody.name = name.trim();
    }

    const result = await auth.api.updateUser({
      headers: requestHeaders,
      body: updateBody,
    });

    if (!result.status) {
      await bucket.delete(imageId);
      return Response.json(
        { error: "Profile picture আপডেট করা যায়নি।" },
        { status: 500 },
      );
    }

    return Response.json({
      image: `/api/profile/avatar/${imageId.toHexString()}`,
    });
  } catch (error) {
    try {
      await bucket.delete(imageId);
    } catch (cleanupError) {
      console.error("Could not clean up a failed profile image upload.", cleanupError);
    }
    console.error("Could not update the profile image.", error);
    return Response.json(
      { error: "ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।" },
      { status: 500 },
    );
  }
};
