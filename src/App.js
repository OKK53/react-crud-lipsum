import { useState, useEffect } from "react";
import Alert from "./Alert";
import TextareaAutosize from "react-textarea-autosize";

function App() {
  console.log("apprendered");
  const url = "http://localhost:8000/loremText";
  const [lorem, setLorem] = useState("");
  const [editID, setEditID] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const [data, setData] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();
    //simulating
    setTimeout(() => {
      fetch(url, { signal: abortCont.signal })
        .then((res) => {
          if (!res.ok) {
            throw Error("could not fetch the data for that resource");
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          setisLoading(false);
          setError(null);
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("fetch aborted");
          } else {
            // console.log(err.message);
            setisLoading(false);
            setError(err.message);
          }
        });
    }, 1000);

    return () => abortCont.abort();
  }, []);

  //ADD new loremipsum !
  const handleSubmit = (e) => {
    e.preventDefault();
    const loremipsum = { lorem };
    if (!isEditing) {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json; chatset=UTF-8" },
        body: JSON.stringify(loremipsum),
      }).then(() => {
        console.log("new lorem added.");
        setLorem("");
        showAlert(true, "bg-blue-200", "New lorem ipsum added to the list.");
        window.location.reload();
      });
    }
    //EDIT loremipsum !
    else {
      fetch("http://localhost:8000/loremText/" + editID, {
        method: "PUT",
        headers: { "Content-Type": "application/json; chatset=UTF-8" },
        body: JSON.stringify(loremipsum),
      })
        .then((res) => {
          console.log("Saved successfully.");
          setLorem("");
          setIsEditing(false);
          setEditID(null);
          showAlert(true, "bg-green-200", "Saved successfully.");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  //DELETE
  const handleDelete = (id) => {
    fetch("http://localhost:8000/loremText/" + id, {
      method: "DELETE",
    })
      .then(() => {
        console.log("Removed successfully.");
        showAlert(true, "bg-red-200", "Removed successfully.");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleEdit = (id, text) => {
    setIsEditing(true);
    setLorem(text);
    setEditID(id);
  };
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  return (
    <>
      <div className="conteiner block mx-auto w-[40rem] h-full text-center mt-20">
        <h3 className="text-3xl mb-3 antialiased">REACT- CRUD EXAMPLE</h3>

        <div className="container mx-auto flex flex-col items-center">
          {alert.show && (
            <Alert {...alert} removeAlert={showAlert} lorem={lorem} />
          )}
          <form
            onSubmit={handleSubmit}
            className=" p-1 rounded text-lg border-transparent flex "
          >
            <TextareaAutosize
              className="w-[30rem] pt-1 text-start bg-slate-300 rounded-sm px-2 "
              required
              placeholder="add some lorem ipsum.."
              value={lorem}
              onChange={(e) => setLorem(e.target.value)}
            />
            <button
              type="submit"
              className="rounded px-3 bg-blue-300 hover:bg-blue-500 hover:text-white pointer grid items-center text-center capitalize tracking-wide"
            >
              {isEditing ? "edit" : "submit"}
            </button>
          </form>
        </div>
        <article className="block">
          {error && <div className="text-3xl antialiased">{error}</div>}
          {isLoading && <div className="text-3xl antialiased">Loading...</div>}
          {data &&
            data.map((item) => (
              <div
                className="border p-3 mb-5 block my-4 text-lg text-center antialiased"
                key={item.id}
              >
                {item.lorem}
                <div className="grid grid-cols-2 justify-between mt-3 gap-x-2">
                  <button
                    onClick={() => handleEdit(item.id, item.lorem)}
                    className="uppercase border rounded-sm p-2 text-2xl antialiased font-medium hover:bg-green-400 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="uppercase border rounded-sm p-2 text-2xl antialiased font-medium hover:bg-red-400 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </article>
      </div>
    </>
  );
}

export default App;
