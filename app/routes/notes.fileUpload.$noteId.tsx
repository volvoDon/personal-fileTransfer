import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, 
  redirect,
  unstable_parseMultipartFormData,
  unstable_createFileUploadHandler,
  unstable_composeUploadHandlers,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useNavigate,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {getFile, getFileByNote, getFilesByNote, getFilesByUser, s3UploadHandler, createS3uploadHandler} from "~/models/file.server"
import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import {createFile} from "~/models/file.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ id: params.noteId, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");
  const noteId = params.noteId;

  const newS3 = await createS3uploadHandler(userId,noteId,3000000);

  // get file info back after image upload
  const form = await unstable_parseMultipartFormData(request, newS3);
  if (form) {
    createFile
  }
  //convert it to an object to padd back as actionData
  const fileInfo = { fileName: form.get('my-file') };
  // this is response from upload handler
  console.log('the form', fileInfo);
  return redirect(`/notes/${params.noteId}`);
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-2xl font-bold">Upload File for {data.note.title}</h3>
      <p>Upload file must be smaller than 3mb</p>
      <button onClick={()=>{navigate(-1)}} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 mt-5">Go Back</button>
      <div className="mt-5"><Form method="post" encType="multipart/form-data">
          <input type="file" id="my-file" name="my-file" />
          <button type="submit">UPLOAD</button>
      </Form></div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.data}</div>;
}