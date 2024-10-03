import { useState } from "react";
import { IToasterData } from "../../../../global/components/toaster/interface";
import { useMemberStoreN } from "../../../../global/indexedDB/store";
import { INote } from "../../../../global/indexedDB/interface";
import { openDB, saveNotes } from "../../../../global/indexedDB/db";
import { useNavigate } from "react-router-dom";

const NoteForm = ({
  setToasterData,
  id,
}: {
  setToasterData: React.Dispatch<React.SetStateAction<IToasterData>>;
  id: string;
}) => {
  const [data, setData] = useState({} as INote);
  const navigate = useNavigate();
  const { fetchNotes } = useMemberStoreN();

  // Mock subscription history, replace with API call to fetch member plans by ID

  const handleSubmit = async () => {
    try {
      if (!data.title || !data.description) {
        setToasterData({
          open: true,
          message: "Please fill all fields",
          severity: "error",
        });
        return;
      }

      const db = await openDB("notes");
      saveNotes(db, data);

      await fetchNotes(id);
      setToasterData({
        open: true,
        message: "Note added successfully",
        severity: "success",
      });
      setData({
        title: "",
        description: "",
        id: 0,
      } as INote);
    } catch (error) {
      setToasterData({
        open: true,
        message: "Failed to add note",
        severity: "error",
      });
    }
  };

  // Convert startDate and endDate to Date objects for comparison

  return (
    <div className="border-white border-2 p-4  rounded-lg m-2">
      <div
        className="flex justify-center font-extrabold text-xl mb-6 text-white p-2 rounded-lg
        hover:bg-blue-500 cursor-pointer
        "
        onClick={() => navigate(`/notes/${id}`)}
      >
        Notes
      </div>

      <div className="grid grid-cols-1 gap-4 items-center space-y-4 ">
        {/* Subscription Plan Selection */}
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-white">title:</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="text"
            value={data?.title}
            onChange={(e) =>
              setData({
                ...data,
                title: e.target.value,
                memberId: parseInt(id),
                id: Math.floor(Math.random() * 100000),
                addedAt: new Date().toISOString(),
              })
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold mb-2 text-white"> Description:</label>
          <input
            className="border border-gray-300 p-2 rounded-md"
            type="text"
            value={data?.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
      >
        Save
      </button>
    </div>
  );
};

export default NoteForm;
