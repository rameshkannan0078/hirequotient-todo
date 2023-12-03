import { capitalizeFirstLetter, isValidEmail } from "@/services/helper";
import React, { useEffect, useMemo, useState } from "react";
import HrPagination from "../HrPagination/HrPagination";
import { HrIconButton } from "../HrIconButton/HrIconButton";
import { HrRadioInput } from "../HrRadioInput/HrRadioInput";

type UserDataT = {
  id: string;
  name: string;
  email: string;
  role: string;
};

interface TableT {
  userdata: UserDataT[];
}

const HrTable: React.FC<TableT> = ({ userdata }) => {

  const [userDataHashMap, setUserDataHashMap] = useState<Record<string, any>[]>(
    []
  );

  useEffect(() => {
    setUserDataHashMap(userdata);
  }, [userdata]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const  [emailError,setEmailError]=useState('');
  const [checkBoxValues, setCheckBoxValues] = useState<
    Record<number, Record<string, boolean>>
  >({});
  const [bulkCheckBoxValue, setBulkCheckBoxValue] = useState<
    Record<number, boolean>
  >({});
  const [editingRow, setEditingRow] = useState<string | null>(null); // Track the currently editing row ID

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setEditingRow(null); // Reset editing row when changing pages
  };

  const userDataMemo = useMemo(() => {
    if (searchText !== "") {
      return userDataHashMap.filter(
        (user) =>
          user.id.includes(searchText) ||
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.role.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return userDataHashMap;
  }, [searchText, userDataHashMap]);

  const handleCheckBox = (id: string, check: boolean) => {
    setCheckBoxValues((prevState) => ({
      ...prevState,
      [currentPage]: {
        ...prevState[currentPage],
        [id]: check,
      },
    }));
    if (bulkCheckBoxValue[currentPage]) {
      setBulkCheckBoxValue((prevState) => ({
        ...prevState,
        [currentPage]: check,
      }));
    }
  };

  const handleBulkCheckBox = (check: boolean, items: UserDataT[]) => {
    setBulkCheckBoxValue((prevState) => ({
      ...prevState,
      [currentPage]: check,
    }));

    setCheckBoxValues((prevState) => ({
      ...prevState,
      [currentPage]: Object.fromEntries(items.map((e) => [e.id, check])),
    }));
  };

  const handleRowClick = (id: string) => {
    setEditingRow(id === editingRow ? null : id);
  };

  const selectedValuesLength = Object.values(checkBoxValues).map((data) => {
    return data;
  });

  const countTrueValues = selectedValuesLength.reduce((count, dictionary) => {
    Object.values(dictionary).forEach((value) => {
      if (value === true) {
        count++;
      }
    });
    return count;
  }, 0);

  const handleInputChange = (id: string, field: 'email'|'role'|'name', value: string) => {

    // if(field==='email' && !isValidEmail(value)){
    //   setEmailError('Email is invalid');
    //   return;
    // }

    setUserDataHashMap((prevState) => {
      const updatedData = prevState.map((user) =>
        user.id === id ? { ...user, [field]: value } : user
      );
      return updatedData;
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userDataMemo?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userDataMemo.length / itemsPerPage);

  const handleDeleteRow = (id: string) => {
    setUserDataHashMap((prevState) => {
      const updatedData = prevState.filter((user) => user.id !== id);
      return updatedData;
    });
  };

  const handleBulkRowDelete = () => {
    setCheckBoxValues((prevCheckBoxValues) => {
      const selectedRows = Object.keys(prevCheckBoxValues)
        .flatMap((page:any) => Object.entries(prevCheckBoxValues[page])
          .filter(([_, checked]) => checked)
          .map(([id]) => id)
        );
  
      if (selectedRows.length === 0) {
        return prevCheckBoxValues;
      }
     
      setUserDataHashMap((prevState) => prevState.filter((user) => !selectedRows.includes(user.id)));
      return {};
    });
    setCurrentPage(1);
    setBulkCheckBoxValue({});
  };
  
  

  return (
    <div className="p-8 flex flex-col space-y-2">
      <div className="flex flex-row">
        <input
          placeholder="Search"
          className="p-2 w-1/2 h-14 border-4 text-md rounded-md border-gray-200 search-icon"
          id={'search-icon'}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
            setEditingRow(null);
          }}
        />
        <div className="ml-auto">
          <HrIconButton
            icon="Trash2"
            className="text-2xl  bg-red-600 hover:bg-red-400  text-white"
            onClick={() => {
              handleBulkRowDelete();
            }}
          />
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b px-6 py-4">
              <HrRadioInput
                value={bulkCheckBoxValue[currentPage]}
                onClick={() => {
                  handleBulkCheckBox(
                    !bulkCheckBoxValue[currentPage],
                    currentItems as any
                  );
                }}
              />
            </th>
            <th className="border-b px-6 py-4">Id</th>
            <th className="border-b px-6 py-4">Name</th>
            <th className="border-b px-6 py-4">Email</th>
            <th className="border-b px-6 py-4">Role</th>
            <th className="border-b px-6 py-4">Actions</th>
          </tr>
        </thead>
        {currentItems.map((user) => (
          <tbody
            className={`text-center ${
              editingRow === user.id ? "bg-gray-100" : ""
            }`}
            key={user.id}
          >
            <tr>
              <td className="border-b px-6 py-4">
                <HrRadioInput
                  value={checkBoxValues[currentPage]?.[user.id]}
                  onClick={() => {
                    handleCheckBox(
                      user.id,
                      !checkBoxValues[currentPage]?.[user.id]
                    );
                  }}
                />
              </td>
              <td className="border-b px-6 py-4">{user.id}</td>
              <td className="border-b px-6 py-4">
                {editingRow === user.id ? (
                  <input
                    type="text"
                    className=" p-2 h-10 border-2 w-full"
                    value={user.name}
                    onChange={(e) =>
                      handleInputChange(user.id, "name", e.target.value)
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="border-b px-6 py-4">
                {editingRow === user.id ? (
                  <div>
                    <input
                    type="text"
                    className=" p-2 h-10 border-2 w-full"
                    value={user.email}
                    onChange={(e) =>
                      handleInputChange(user.id, "email", e.target.value)
                    }
                  />
                  {
                    emailError && <div className="text-red-500 font-bold"> {emailError}</div>
                  }
                 
                  </div>
                ) : (
                  user.email
                )}
              </td>
              <td className="border-b px-6 py-4">
                {editingRow === user.id ? (
                  <select className="border-b px-6 py-2 "
                  value={user.role}
                  onChange={(e) => handleInputChange(user.id,"role",e.target.value)}

                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  capitalizeFirstLetter(user.role)
                )}
              </td>
              <td className="border-b px-6 py-4 flex flex-row justify-center space-x-6">
                {editingRow === user.id ? (
                  <HrIconButton
                    icon="Check"
                    id={'save'}
                    className="save text-gray-500 border-2 border-gray-500 hover:bg-gray-200 hover:text-black hover:border-gray-100 "
                    onClick={() => handleRowClick(user.id)}
                  />
                ) : (
                  <HrIconButton
                    icon="Edit"
                    id={'edit'}
                    className="text-gray-500 border-2 edit border-gray-500 hover:bg-gray-200 hover:text-black hover:border-gray-100 "
                    onClick={() => handleRowClick(user.id)}
                  />
                )}

                <HrIconButton
                  icon="Trash2"
                  id={'delete'}
                  className="delete text-red-500 border-2 border-gray-500 hover:bg-red-400 hover:text-white hover:border-gray-100 "
                  onClick={() => handleDeleteRow(user.id)}
                />
              </td>
            </tr>
          </tbody>
        ))}
      </table>

      <div className="flex flex-row">
        <div className="text-lg font-semibold mt-4">
          {countTrueValues === 0
            ? "No rows selected"
            : `${countTrueValues} rows selected out of ${userDataMemo.length}`}
        </div>

        <div className="ml-auto">
          <HrPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HrTable;
