import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root, { loader as rootLoader, action as rootAction} from "./routes/root.jsx";
import ErrorPage from "./error-page.jsx";
import Contact, {loader as contactLoader, action as contactAction} from "./routes/contacts.jsx";
import EditContact, { action as editAction } from "./routes/edit.jsx";
import {action as destroyAction} from "./routes/destroy.jsx";
import Index from "./routes/index.jsx";

// create and render a browser router
const router = createBrowserRouter([
    // <Root/> is root route's element
    // ErrorPage is set as the errorElement
    // loader is hooked up to the routes
    {
        path: "/",
        element: <Root />,
        loader: rootLoader,
        action: rootAction,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true, element: <Index/>
                    },
                    {
                        // :contactId is a URL param and is dynamic
                        path: "contacts/:contactId",
                        element: <Contact/>,
                        loader: contactLoader,
                        action: contactAction,
                    },
                    {
                        path: "contacts/:contactId/edit",
                        element: <EditContact/>,
                        loader: contactLoader,
                        action: editAction,
                    },
                    {
                        path: "contacts/:contactId/destroy",
                        action: destroyAction,
                        errorElement: <div>Oops! There was an error.</div>,
                    }
                ]
            }
        ]
    },
    // contacts hooked up on a new route (as a nested route)
    // if the contact component should render inside the <Root> Layout
    // than make <Contact> a child of the root route
    // {
    //     path: "contacts/:contactsId",
    //     element: <Contact />
    // }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

