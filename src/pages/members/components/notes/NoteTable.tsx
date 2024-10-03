import React, { useEffect, useState } from "react";

import { useMemberStoreN } from "../../../../global/indexedDB/store";
import { INote } from "../../../../global/indexedDB/interface";
import { useParams } from "react-router-dom";
const NoteTable = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchNotes, notes } = useMemberStoreN();
  const [filteredData, setFilteredData] = useState<INote[]>([]);
  useEffect(() => {
    const rev = notes?.sort((a, b) => {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
    setFilteredData(rev);
  }, [notes]);

  useEffect(() => {
    if (id) fetchNotes(id);
  }, [id]);
  return (
    <div className=" bg-[#fff] rounded @container px-4 py-5 sm:px-5 lg:px-6 h-[550px] ">
      <div className="flex items-center justify-between mt-3 relative">
        <p className="text-[1.15rem] capitalize font-bold text-[#585858]"></p>
        <div className="relative flex"></div>
        <div className="flex gap-4 text-[.7rem] sm:text-[.9rem] md:text-[1rem] font-sans font-semibold text-[#585858]">
          <div
            className="cursor-pointer btn bg-black text-white"
            onClick={() => window.history.back()}
          >
            Back
          </div>
        </div>
      </div>

      {/* Table starts here */}
      <div className=" text-[#585858] py-4 w-full max-h-[200px] md:max-h-[600px] md:overflow-y-scroll">
        <table className="  table w-full table-xs @[25em]:table-sm @[50em]:table-md border border-slate-200">
          <thead>
            {/* table heading starts here */}
            <tr className=" top-0 bg-slate-900 text-white ">
              <th>SN</th>
              <th>title</th>
              <th>description</th>
              <th>AddedAt</th>
            </tr>
            {/* table heading ends here */}
          </thead>
          {/* tables data */}
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((subscription, index) => (
                <React.Fragment key={subscription?.id}>
                  <tr>
                    <td className="text-black font-semibold">{index + 1}</td>
                    <td className="text-black font-semibold">
                      {subscription?.title}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.description}
                    </td>
                    <td className="text-black font-semibold">
                      {subscription?.addedAt?.split("T")[0]}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="font-semibold text-center text-black"
                >
                  Notes not available
                </td>
              </tr>
            )}
          </tbody>
          {/* ends of table data */}
        </table>
      </div>
    </div>
  );
};

export default NoteTable;
