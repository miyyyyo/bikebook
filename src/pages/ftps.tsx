import ProfileFtp from "@/components/ProfileFtp";
import dbConnect from "@/db/dbConnect";
import { UserModel } from "@/db/models/userModel";
import { GetServerSideProps } from "next";
import React, { FunctionComponent, useState } from "react";

interface FtpsProps {
  usernames: string[];
}

const Ftps: FunctionComponent<FtpsProps> = ({ usernames }) => {
  const [selectedUser, setSelectedUser] = useState(usernames[0]);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(event.target.value);
  };
  return (
    <div>
      <h2 className="font-semibold text-2xl p-2 mb-2">
        Acá puedes ver los FTPs de tus alumnos
      </h2>

      <select
        value={selectedUser}
        onChange={handleUserChange}
        className="p-2 mb-2 ml-2 border text-lg"
      >
        {usernames.map((username, index) => (
          <option
            key={index}
            value={username}
          >
            {username}
          </option>
        ))}
      </select>

      <div>
        <ProfileFtp username={selectedUser} />
      </div>
    </div>
  );
};

export default Ftps;

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const users = await UserModel.find({ role: "USER" }).select("email");

  const usernames = users.map((user) => user.email);

  return {
    props: {
      usernames,
    },
  };
};
