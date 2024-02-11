"use client";

import { useEffect, useState } from "react";
import { Todo } from "@prisma/client";
import Link from "next/link";

export default function Home() {
  const [error, setError] = useState<Error | null>(null);
  const [list, setList] = useState<Todo[]>([]); // list of todo list

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    // get title from form
    const title = formData.get("title")?.toString();
    if (!title) {
      setError(new Error("Title is required"));
      return;
    }

    // insert to db
    const response = fetch("/api/todo", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response instanceof Error) {
      setError(response);
      return;
    }
    loadList();
  };

  const loadList = async () => {
    const response = await (await fetch("/api/todo")).json();
    setList(response);
  };

  const deleteTodo = async (id: number) => {
    const response = await fetch("/api/todo", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    loadList();
  };

  const updateTodo = async (id: number, status: boolean) => {
    // update todo status
    const response = await fetch("/api/todo", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    loadList();
  };

  useEffect(() => {
    loadList();
  }, []);

  return (
    <>
      {/* list of all my todo list using tailwind css */}
      <div className="h-screen bg-gray-100">
        <div className="container mx-auto">
          <h1 className="text-6xl font-bold text-center">Todo List</h1>
          <div className="flex justify-center items-center mt-10">
            <form onSubmit={onSubmit} className="w-full text-center">
              <input
                type="text"
                className="w-1/3 p-2 border border-gray-400 rounded-l-lg"
                placeholder="Add todo"
                name="title"
                required
              />
              <button className="p-2 bg-blue-400 text-white rounded-r-lg">
                Add
              </button>
            </form>
          </div>
          <div className="mt-10">
            <ul className="w-full flex flex-col gap-4">
              {
                // list of todo list
                list.map((item) => {
                  return (
                    <li
                      key={item.id}
                      className="flex justify-between items-center w-full p-4 border-b border-gray-200 bg-white shadow-md rounded-lg"
                    >
                      <span>{item.title}</span>
                      <span className="flex gap-2">
                        {/* update btn */}
                        <button
                          onClick={() => updateTodo(item.id, !item.done)}
                          className={`p-2 bg-green-400 text-white rounded-lg ${
                            item.done ? "bg-red-400" : "bg-green-400"
                          }`}
                        >
                          {item.done ? "Undo" : "Done"}
                        </button>
                        <button
                          onClick={() => deleteTodo(item.id)}
                          className="p-2 bg-red-400 text-white rounded-lg"
                        >
                          Delete
                        </button>
                      </span>
                    </li>
                  );
                })
              }
            </ul>
            {/* using call api btn */}
            <button
              onClick={loadList}
              className="p-2 bg-blue-400 text-white rounded-lg mt-4"
            >
              Refresh
            </button>
            {error && <p>{error.message}</p>}
          </div>
          {/* switch to call api page */}
          <div className="text-center mt-10">
            <Link href="/">
              <p className="p-2 bg-blue-400 text-white rounded-lg">
                Server Action
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
