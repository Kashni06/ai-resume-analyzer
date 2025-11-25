import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [deleting, setDeleting] = useState(false);

  // Load existing files
  const loadFiles = async () => {
    const list = (await fs.readDir("./")) as FSItem[];
    setFiles(list || []);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, auth.isAuthenticated]);

  const handleDelete = async () => {
    setDeleting(true);

    // Delete ALL files
    for (const file of files) {
      await fs.delete(file.path);
    }

    // Delete ALL KV data
    await kv.flush();

    // short delay → smoother UX
    setTimeout(() => {
      navigate("/"); // redirect home
    }, 800);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen p-10">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        Wipe Application Data
      </h1>

      <p className="text-lg mb-6">
        Logged in as: <span className="font-semibold">{auth.user?.username}</span>
      </p>

      <h2 className="text-3xl font-semibold mb-4">Files in App:</h2>

      <div className="flex flex-col gap-3 mb-10">
        {files.length === 0 && (
          <p className="text-gray-500 text-lg">No files stored in the app.</p>
        )}

        {files.map((file) => (
          <div
            key={file.id}
            className="p-4 bg-white shadow rounded-xl text-gray-700 text-lg"
          >
            {file.name}
          </div>
        ))}
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`px-6 py-3 rounded-xl text-lg font-semibold text-white 
          ${deleting ? "bg-red-300 cursor-wait" : "bg-red-500 hover:bg-red-600"}
        `}
      >
        {deleting ? "Wiping..." : "Wipe All App Data"}
      </button>
    </main>
  );
};

export default WipeApp;
