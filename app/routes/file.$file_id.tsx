import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, 
  redirect, } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useNavigate,
  Link,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {getFile, remove_file} from "~/models/file.server";
import {requireUserId} from "~/session.server";

export const action = async ({params, request}: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    invariant(params.file_id,"invalid param");
    const file = await getFile(params.file_id);
    invariant(file,'no file');
    const noteId = file.noteId;
    if (!file) {
        throw new Error("File Not Found")
    }
    remove_file(file);
    return redirect(`../notes/${noteId}`)
};


