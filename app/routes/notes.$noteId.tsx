import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, 
  redirect, } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useNavigate,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {getFile, getFileByNote, getFilesByNote, getFilesByUser} from "~/models/file.server"
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
  await deleteNote({ id: params.noteId, userId });
  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <div className="space-y-4">
      <button 
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
      onClick={()=>{navigate(`../fileUpload/${data.note.id}`)}}>Upload a file</button>
      <Form method="post">
      <button
      type='submit'
      value = "delete"
      name="intent"
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
