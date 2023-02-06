// the first root, also called "root route" serves as the global layout

import {
    Form,
    Link,
    NavLink,
    Outlet,
    redirect,
    useLoaderData,
    useNavigation,
    useSubmit
} from "react-router-dom";
import {createContact, getContacts} from "../contacts.js";

// one API to load data here using the "loader"
export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
}

// the vite sever isn't configured to handle POST methods like "new contact"
// instead of sending that POST to the sever client side routing is used
// Reacts "Form" ist used

// loaders and actions can return a response
// redirect returns a response to tell the app to change locations
// now "new contact" redirects directly to the edit page
export async function action() {
    const contact = await createContact();
    // return { contacts };
    return redirect(`/contacts/${contact.id}/edit`);
}


// use client side routing to update the URL without requesting another document from the server
// instead the app can immediately render new UI
// works with Link

// useLoaderData hooks updates so the UI stays in sync with the data

// NavLink is used to give feedback about the current route the user is looking at

// useNavigation-Hook is used to add global pending UI
// loading class is added below

export default function Root() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();
    // useEffect(() => {
    //     document.getElementById("q").value = q;
    // }, [q]);
    // replace this by useSubmit to trigger the search after every letter typed
    const submit = useSubmit();


    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        <Link to={`contacts/${contact.id}`}>
                                            {contact.first || contact.last ? (
                                                <>
                                                    {contact.first} {contact.last}
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}{" "}
                                            {contact.favorite && <span>★</span>}
                                        </Link>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div
                id="detail"
                className={
                    navigation.state === "loading" ? "loading" : ""
                }
            >
                <Outlet />
            </div>
        </>
    );
}
