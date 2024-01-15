import ProfileFtp from "@/components/ProfileFtp";
import dbConnect from "@/db/dbConnect";
import { UserModel } from "@/db/models/userModel";
import { GetServerSideProps } from "next";
import React, { FunctionComponent, useState } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
}

interface FtpsProps {
  users: User[];
}

const Ftps: FunctionComponent<FtpsProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "") setSelectedUser(null);
    setSelectedUser(users.find((e) => e.email === event.target.value) as User);
  };
  return (
    <div>
      <h2 className="font-semibold text-2xl p-2 mb-2">
        Acá puedes ver los FTP de tus alumnos
      </h2>

      <select
        value={selectedUser?.email || ""}
        onChange={handleUserChange}
        className="p-2 mb-2 ml-2 border text-lg"
      >
        <option value="">Elegir</option>
        {users.map((user, idx) => (
          <option
            key={`useroption_${idx}`}
            value={user.email}
          >
            {user.name}
          </option>
        ))}
      </select>

      <div>
        {selectedUser ? (
          <ProfileFtp username={selectedUser.email} />
        ) : (
          users.map((user) => {
            return (
              <ProfileFtp
                key={user._id}
                username={user.email}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Ftps;

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const users = await UserModel.find({ role: "USER" }).select("_id email name");

  const usernames = users.map((user) => {
    return {
      _id: user.id.toString(),
      email: user.email,
      name: user.name,
    };
  });

  return {
    props: {
      usernames,
    },
  };
};
