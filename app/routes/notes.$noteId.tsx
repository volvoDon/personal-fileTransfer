import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, unstable_parseMultipartFormData } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {getFile, getFileByNote, getFilesByNote, getFilesByUser, cloudStorageUploaderHandler} from "~/models/file.server"
import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

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
  
  if (request.method == 'delete') {
    await deleteNote({ id: params.noteId, userId });
  };

  if (request.method == 'post') {
    const formData = await unstable_parseMultipartFormData(request, cloudStorageUploaderHandler);
    //you must handle the creation of the file
    const filename = formData.get('upload');
  };
  

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <div className="space-y-4">
  <Form method="post" encType="multipart/form-data" className="space-y-2">
    <div className="relative rounded-md shadow-sm">
      <input 
        className="absolute w-0 h-0 opacity-0 overflow-hidden z-0"
        type="file" 
        name="upload" 
        id="upload"
      />
      <label 
        htmlFor="upload"
        className="cursor-pointer px-4 py-2 rounded border border-blue-500 hover:border-blue-600 focus:border-blue-400 bg-blue-500 text-white block text-center hover:bg-blue-600 focus:bg-blue-400"
      >
        Choose a File
      </label>
    </div>
    <button 
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
      type="submit"
    >
      Upload File
    </button>
  </Form>

  <Form method="delete">
    <button
      type="submit"
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400"
    >
      Delete Bundle
    </button>
  </Form>
</div>
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

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
